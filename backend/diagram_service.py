import json
import re
import xml.etree.ElementTree as ET
from typing import List
import time
import logging

import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
from openai import OpenAI, RateLimitError as OpenAIRateLimitError
from models import DiagramIR, Node, Edge

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTIONS = """You are a diagram generation engine.
Output ONLY a valid JSON object — no markdown, no code fences, no explanation.
The JSON must have exactly two keys: "nodes" and "edges".

Each node: {"id": "<snake_case_unique>", "label": "<human label>", "type": "<type>"}
Node types: start | end | process | decision | input_output | queue | storage | actor | step | action | status

Each edge: {"source": "<node_id>", "target": "<node_id>", "label": "<optional transition label>"}

Rules:
- Every id must be unique snake_case.
- Every edge source and target must reference an existing node id.
- Produce a complete, connected diagram that accurately represents the described workflow.
- Output raw JSON only. Do not wrap in ```json or any other formatting.
"""

EDIT_INSTRUCTIONS = """You are a diagram editing engine.
You will receive a JSON diagram IR and a modification instruction.
Apply the modification to the diagram and output the updated diagram as raw JSON only.
Preserve all existing nodes and edges unless explicitly told to remove them.
The JSON must follow the same schema: {"nodes": [...], "edges": [...]}.
Output raw JSON only — no markdown, no explanation.
"""

_INTER_VARIANT_SLEEP = 4
_MAX_RETRIES = 3
_RETRY_BASE_SLEEP = 15


class RateLimitError(Exception):
    """Raised when the LLM API is still rate-limiting after all retries."""


def _clean_json(raw: str) -> str:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?", "", raw, flags=re.IGNORECASE).strip()
    raw = re.sub(r"```$", "", raw).strip()
    return raw


def _is_gemini_rate_limit(exc: Exception) -> bool:
    if isinstance(exc, ResourceExhausted):
        return True
    msg = str(exc).lower()
    return "429" in msg or "resource_exhausted" in msg or "quota" in msg


# ------------------------------------------------------------------ #
# Backend implementations
# ------------------------------------------------------------------ #

class _GeminiBackend:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction=SYSTEM_INSTRUCTIONS,
            generation_config={"temperature": 0.3, "max_output_tokens": 4096},
        )
        self.edit_model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction=EDIT_INSTRUCTIONS,
            generation_config={"temperature": 0.2, "max_output_tokens": 4096},
        )

    def call(self, system: str, prompt: str, temperature: float) -> str:
        # system is baked into the model at init time; use the right model
        model = self.edit_model if system == EDIT_INSTRUCTIONS else self.model
        sleep = _RETRY_BASE_SLEEP
        for attempt in range(1, _MAX_RETRIES + 1):
            try:
                response = model.generate_content(prompt)
                return response.text
            except Exception as exc:
                if _is_gemini_rate_limit(exc):
                    if attempt == _MAX_RETRIES:
                        raise RateLimitError(
                            f"Gemini API rate limit exceeded after {_MAX_RETRIES} retries. "
                            "Please wait a moment and try again."
                        ) from exc
                    logger.warning("Gemini rate limit (attempt %d/%d). Sleeping %ds.", attempt, _MAX_RETRIES, sleep)
                    time.sleep(sleep)
                    sleep *= 2
                else:
                    raise


class _OpenAIBackend:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def call(self, system: str, prompt: str, temperature: float) -> str:
        sleep = _RETRY_BASE_SLEEP
        for attempt in range(1, _MAX_RETRIES + 1):
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4.1-2025-04-14",
                    messages=[
                        {"role": "system", "content": system},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=temperature,
                    max_tokens=4096,
                )
                return response.choices[0].message.content
            except OpenAIRateLimitError as exc:
                if attempt == _MAX_RETRIES:
                    raise RateLimitError(
                        f"OpenAI rate limit exceeded after {_MAX_RETRIES} retries. "
                        "Please wait a moment and try again."
                    ) from exc
                logger.warning("OpenAI rate limit (attempt %d/%d). Sleeping %ds.", attempt, _MAX_RETRIES, sleep)
                time.sleep(sleep)
                sleep *= 2
            except Exception:
                raise


# ------------------------------------------------------------------ #
# DiagramService — auto-selects backend based on which key is provided
# ------------------------------------------------------------------ #

class DiagramService:
    def __init__(self, gemini_api_key: str = "", openai_api_key: str = ""):
        if openai_api_key:
            self._backend = _OpenAIBackend(openai_api_key)
            logger.info("Using OpenAI backend (gpt-4o-mini)")
        elif gemini_api_key:
            self._backend = _GeminiBackend(gemini_api_key)
            logger.info("Using Gemini backend (gemini-2.0-flash)")
        else:
            raise ValueError("Provide either GEMINI_API_KEY or GPT_API_KEY in environment.")

    def _call(self, system: str, prompt: str, temperature: float = 0.3) -> str:
        return self._backend.call(system, prompt, temperature)

    def _generate_one(self, prompt: str) -> dict:
        raw_text = self._call(SYSTEM_INSTRUCTIONS, prompt, temperature=0.3)
        raw = _clean_json(raw_text)
        data = json.loads(raw)
        ir = DiagramIR(**data)
        return ir.model_dump()

    def generate_variants(self, prompt: str, n: int = 1) -> List[dict]:
        variants = []
        for i in range(n):
            variation_hint = (
                "" if i == 0
                else f" Generate an alternative structural variant #{i+1} with a different layout or grouping."
            )
            diagram = self._generate_one(prompt + variation_hint)
            variants.append(diagram)
            if i < n - 1:
                time.sleep(_INTER_VARIANT_SLEEP)
        return variants

    def edit_diagram(self, diagram: dict, instruction: str) -> dict:
        payload = (
            f"Current diagram:\n{json.dumps(diagram, indent=2)}\n\n"
            f"Modification instruction: {instruction}"
        )
        raw_text = self._call(EDIT_INSTRUCTIONS, payload, temperature=0.2)
        raw = _clean_json(raw_text)
        data = json.loads(raw)
        ir = DiagramIR(**data)
        return ir.model_dump()

    # ------------------------------------------------------------------ #
    # Mermaid export
    # ------------------------------------------------------------------ #
    def to_mermaid(self, diagram: dict) -> str:
        ir = DiagramIR(**diagram)

        def safe_label(text: str) -> str:
            """Strip characters that break Mermaid syntax."""
            return (text.replace('"', "'")
                        .replace("#", "")
                        .replace("|", "/")
                        .replace("{", "(")
                        .replace("}", ")")
                        .strip())

        _MERMAID_RESERVED = {
            "end", "start", "subgraph", "style", "default", "class",
            "classDef", "click", "linkStyle", "direction", "graph",
            "flowchart", "sequenceDiagram", "stateDiagram",
        }

        def safe_id(node_id: str) -> str:
            """Ensure node ID is a valid Mermaid identifier."""
            sanitized = re.sub(r"[^a-zA-Z0-9_]", "_", node_id)
            if sanitized.lower() in _MERMAID_RESERVED:
                sanitized = sanitized + "_node"
            return sanitized

        shape_map = {
            "start":        "([LABEL])",
            "end":          "([LABEL])",
            "process":      "[LABEL]",
            "decision":     "{LABEL}",
            "input_output": "[/LABEL/]",
            "queue":        "[[LABEL]]",
            "storage":      "[(LABEL)]",
            "actor":        "(LABEL)",
        }
        default_shape = "[LABEL]"

        def node_shape(node: Node) -> str:
            template = shape_map.get(node.type.lower(), default_shape)
            return template.replace("LABEL", f'"{safe_label(node.label)}"')

        # Build an ID remap in case any IDs needed sanitising
        id_map = {n.id: safe_id(n.id) for n in ir.nodes}

        lines = [
            "%%{init: {'flowchart': {'curve': 'basis', 'htmlLabels': false}}}%%",
            "flowchart TD",
        ]

        for node in ir.nodes:
            lines.append(f"    {id_map[node.id]}{node_shape(node)}")

        starts    = [id_map[n.id] for n in ir.nodes if n.type.lower() == "start"]
        ends      = [id_map[n.id] for n in ir.nodes if n.type.lower() == "end"]
        decisions = [id_map[n.id] for n in ir.nodes if n.type.lower() == "decision"]
        if starts:
            lines.append(f"    style {starts[0]} fill:#2E74B5,color:#fff,stroke:#1F3864")
        for e in ends:
            lines.append(f"    style {e} fill:#375623,color:#fff,stroke:#1F3864")
        for d in decisions:
            lines.append(f"    style {d} fill:#FFC000,color:#000,stroke:#C47A00")

        node_ids = set(id_map.values())
        for edge in ir.edges:
            src, tgt = id_map.get(edge.source, edge.source), id_map.get(edge.target, edge.target)
            # Skip self-loops — they cause the "suitable point" layout error
            if src == tgt or src not in node_ids or tgt not in node_ids:
                continue
            if edge.label:
                lines.append(f'    {src} -- "{safe_label(edge.label)}" --> {tgt}')
            else:
                lines.append(f"    {src} --> {tgt}")

        return "\n".join(lines)

    # ------------------------------------------------------------------ #
    # draw.io XML export
    # ------------------------------------------------------------------ #
    def to_drawio(self, diagram: dict) -> str:
        ir = DiagramIR(**diagram)

        root = ET.Element("mxGraphModel")
        root_cell = ET.SubElement(ET.SubElement(root, "root"), "mxCell")
        root_cell.set("id", "0")
        parent_cell = ET.SubElement(root.find("root"), "mxCell")
        parent_cell.set("id", "1")
        parent_cell.set("parent", "0")

        style_map = {
            "start":        "ellipse;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;",
            "end":          "ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;",
            "process":      "rounded=1;whiteSpace=wrap;html=1;",
            "decision":     "rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;",
            "input_output": "shape=parallelogram;whiteSpace=wrap;html=1;",
            "queue":        "shape=mxgraph.flowchart.queue;whiteSpace=wrap;html=1;",
            "storage":      "shape=cylinder3;whiteSpace=wrap;html=1;",
            "actor":        "shape=mxgraph.basic.person;whiteSpace=wrap;html=1;",
        }
        default_style = "rounded=1;whiteSpace=wrap;html=1;"

        col_width, row_height, x_start, y_start, padding = 160, 60, 40, 40, 20
        nodes_per_col = max(4, len(ir.nodes) // 3 + 1)
        rxml = root.find("root")

        for idx, node in enumerate(ir.nodes):
            col = idx // nodes_per_col
            row = idx % nodes_per_col
            x = x_start + col * (col_width + padding * 4)
            y = y_start + row * (row_height + padding)

            cell = ET.SubElement(rxml, "mxCell")
            cell.set("id", node.id)
            cell.set("value", node.label)
            cell.set("style", style_map.get(node.type.lower(), default_style))
            cell.set("vertex", "1")
            cell.set("parent", "1")
            geo = ET.SubElement(cell, "mxGeometry")
            geo.set("x", str(x))
            geo.set("y", str(y))
            geo.set("width", str(col_width))
            geo.set("height", str(row_height))
            geo.set("as", "geometry")

        for i, edge in enumerate(ir.edges):
            cell = ET.SubElement(rxml, "mxCell")
            cell.set("id", f"edge_{i}")
            cell.set("value", edge.label or "")
            cell.set("style", "edgeStyle=orthogonalEdgeStyle;html=1;")
            cell.set("edge", "1")
            cell.set("source", edge.source)
            cell.set("target", edge.target)
            cell.set("parent", "1")
            geo = ET.SubElement(cell, "mxGeometry")
            geo.set("relative", "1")
            geo.set("as", "geometry")

        return ET.tostring(root, encoding="unicode", xml_declaration=False)