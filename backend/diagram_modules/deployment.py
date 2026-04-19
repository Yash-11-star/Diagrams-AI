from .types import DiagramPromptModule

MODULE = DiagramPromptModule(
    diagram_type="deployment",
    generation_hint=(
        "DIAGRAM TYPE: Deployment Diagram. Generate a UML-style runtime deployment view.\n"
        "ALLOWED node types (use ONLY these): process | actor | queue | input_output | storage\n"
        "  process = node/server/container host\n"
        "  actor = device/client hardware\n"
        "  queue = execution environment\n"
        "  input_output = deployable artifact\n"
        "  storage = database/persistent infra\n"
        "Edge labels MUST express: communication | deployment | hosting.\n"
        "Do NOT generate as component diagram or generic cloud service map."
    ),
    edit_instructions=(
        "You are a deployment diagram editing engine. Apply edits while preserving deployment semantics.\n"
        "Output only JSON with keys nodes and edges.\n"
        "Keep relationships constrained to communication/deployment/hosting.\n"
        "Artifacts must stay explicitly connected to host/runtime targets."
    ),
)
