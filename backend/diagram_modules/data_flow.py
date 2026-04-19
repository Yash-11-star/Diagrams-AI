from .types import DiagramPromptModule

MODULE = DiagramPromptModule(
    diagram_type="data_flow",
    generation_hint=(
        "DIAGRAM TYPE: Data Flow Diagram (DFD). Generate strict data-flow semantics.\n"
        "ALLOWED node types (use ONLY these): process | storage | actor | input_output\n"
        "  process = transformation step\n"
        "  storage = data store\n"
        "  actor = external entity\n"
        "  input_output = explicit data object/flow annotation\n"
        "Every edge label must name the data flow payload.\n"
        "Do NOT generate as UML use-case/component/deployment diagram."
    ),
    edit_instructions=(
        "You are a DFD editing engine. Apply edits while preserving external entity/process/data-store semantics.\n"
        "Output only JSON with keys nodes and edges.\n"
        "Edges must remain labeled directional data flows and not generic dependencies."
    ),
)
