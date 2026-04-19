import base64
import logging
import traceback

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diagram_service import DiagramService, RateLimitError
from openai import OpenAI
import os

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(title="Agentic Figure Drawing API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

service = DiagramService(
    gemini_api_key=os.environ.get("GEMINI_API_KEY", ""),
    openai_api_key=os.environ.get("GPT_API_KEY", ""),
)


class GenerateRequest(BaseModel):
    prompt: str
    num_variants: int = 2
    diagram_type: str = "flowchart"


class EditRequest(BaseModel):
    diagram: dict
    instruction: str
    diagram_type: str = "flowchart"


class NormalizeSequenceRequest(BaseModel):
    diagram: dict


class RefineRequest(BaseModel):
    prompt: str
    diagram_type: str = "flowchart"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate")
def generate(req: GenerateRequest):
    if not req.prompt.strip():
        raise HTTPException(400, "Prompt cannot be empty.")
    logger.info("POST /generate | ,req.prompt[:80])
    try:
        variants = service.generate_variants(req.prompt, req.num_variants, diagram_type=req.diagram_type)
        return {"variants": variants}
    except RateLimitError as e:
        logger.error("Rate limit: %s", e)
        raise HTTPException(429, str(e))
    except Exception as e:
        logger.error("Error in /generate:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))


@app.post("/refine-prompt")
def refine_prompt(req: RefineRequest):
    logger.info("POST /refine-prompt | diagram_type=%s", req.diagram_type)
    try:
        refined = service.refine_prompt(req.prompt, req.diagram_type)
        return {"refined": refined}
    except RateLimitError as e:
        raise HTTPException(429, str(e))
    except Exception as e:
        logger.error("Error in /refine-prompt:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))


@app.post("/edit")
def edit(req: EditRequest):
    try:
        updated = service.edit_diagram(req.diagram, req.instruction, req.diagram_type)
        return {"diagram": updated}
    except RateLimitError as e:
        logger.error("Rate limit: %s", e)
        raise HTTPException(429, str(e))
    except Exception as e:
        logger.error("Error in /edit:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))


@app.post("/sequence/normalize")
def normalize_sequence(req: NormalizeSequenceRequest):
    try:
        diagram = service.normalize_sequence_graph(req.diagram)
        return {"diagram": diagram}
    except Exception as e:
        logger.error("Error in /sequence/normalize:\n%s", traceback.format_exc())
        raise HTTPException(400, str(e))


@app.post("/export/mermaid")
def export_mermaid(diagram: dict):
    try:
        mermaid = service.to_mermaid(diagram)
        return {"mermaid": mermaid}
    except Exception as e:
        logger.error("Error in /export/mermaid:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))


@app.post("/export/drawio")
def export_drawio(diagram: dict):
    try:
        xml = service.to_drawio(diagram)
        return {"xml": xml}
    except Exception as e:
        logger.error("Error in /export/drawio:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))


@app.post("/image/extract")
async def image_extract(file: UploadFile = File(...), diagram_type: str = Form("flowchart")):
    """Use GPT-4o vision to extract a diagram IR from an uploaded image."""
    logger.info("POST /image/extract | diagram_type=%s | file=%s", diagram_type, file.filename)
    gpt_key = os.environ.get("GPT_API_KEY", "")
    if not gpt_key:
        raise HTTPException(400, "GPT_API_KEY is required for image extraction.")
    try:
        content = await file.read()
        mime = file.content_type or "image/jpeg"
        b64 = base64.b64encode(content).decode()

        client = OpenAI(api_key=gpt_key)

        # Build the extraction prompt — ERD uses a special table-style schema
        if diagram_type == "erd":
            extraction_prompt = (
                "Analyze this image which shows a database ER diagram or schema diagram. "
                "Extract every table/entity and relationship you can identify.\n\n"
                "Output ONLY a valid JSON object with exactly two keys: 'nodes' and 'edges'.\n\n"
                "For ERD, each node MUST follow this schema:\n"
                "  {\"id\": \"snake_case_table\", \"label\": \"TableName\", \"type\": \"entity\", "
                "\"fields\": [\"col_name DataType [PK] [FK] [UNIQUE]\", ...]}\n\n"
                "Field format examples:\n"
                "  'user_id INT PK'\n"
                "  'email VARCHAR(255) UNIQUE NOT NULL'\n"
                "  'order_id INT FK'\n"
                "  'created_at TIMESTAMP'\n\n"
                "Each edge: {\"source\": \"table_a\", \"target\": \"table_b\", \"label\": \"1:N\"}\n"
                "Edge labels must be cardinality: 1:1, 1:N, or N:M.\n\n"
                "Rules:\n"
                "- Every id must be unique snake_case.\n"
                "- Every edge source/target must reference an existing node id.\n"
                "- DO NOT generate oval attribute nodes or diamond relationship nodes.\n"
                "- If you cannot clearly read a column name, make a reasonable inference.\n"
                "- Output raw JSON only. No markdown, no code fences, no explanation."
            )
       
        else:
            extraction_prompt = (
                f"Analyze this image which contains a diagram, flowchart, whiteboard sketch, or workflow. "
                f"The user has indicated this is a '{diagram_type}' type diagram. "
                f"Extract every node and connection you can identify.\n\n"
                "Output ONLY a valid JSON object with exactly two keys: 'nodes' and 'edges'.\n"
                "Each node: {\"id\": \"<snake_case_unique>\", \"label\": \"<human label>\", \"type\": \"<type>\"}\n"
                "Node types to use: start | end | process | decision | input_output | queue | storage | actor\n"
                "Each edge: {\"source\": \"<node_id>\", \"target\": \"<node_id>\", \"label\": \"<optional>\"}\n"
                "Rules:\n"
                "- Every id must be unique snake_case.\n"
                "- Every edge source and target must reference an existing node id.\n"
                "- If you cannot clearly read a label, make a reasonable inference.\n"
                "- Output raw JSON only. No markdown, no code fences, no explanation."
            )

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type":  {"url": f"data:{mime};base64,{b64}"}},
                    {"type": "text", "text": extraction_prompt},
                ],
            }],
            max_tokens=2048,
        )

        import json, re
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"^```(?:json)?", "", raw, flags=re.IGNORECASE).strip()
        raw = re.sub(r"```$", "", raw).strip()
        data = json.loads(raw)
        from models import dump_diagram_document, parse_diagram_document
        ir = parse_diagram_document(data)
        return {"diagram": dump_diagram_document(ir)}

    except Exception as e:
        logger.error("Error in /image/extract:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))
