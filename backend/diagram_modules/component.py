from .types import DiagramPromptModule

MODULE = DiagramPromptModule(
    diagram_type="component",
    generation_hint=(
        "DIAGRAM TYPE: Component Diagram. Generate a UML-style component diagram with strict component semantics.\n"
        "ALLOWED node types (use ONLY these): process | actor | input_output | queue | storage\n"
        "  process = software component/module\n"
        "  actor = interface contract\n"
        "  input_output = provided interface port\n"
        "  queue = required interface port\n"
        "  storage = package/group boundary\n"
        "Edge labels MUST express: dependency | assembly | realization | usage.\n"
        "Do NOT generate as flowchart or runtime deployment graph."
    ),
    edit_instructions=(
        "You are a component diagram editing engine. Apply edits while preserving component semantics.\n"
        "Output only JSON with keys nodes and edges.\n"
        "Keep node types constrained to process/actor/input_output/queue/storage.\n"
        "Relationships must remain dependency/assembly/realization/usage and be editable via edge labels.\n"
        "Do not rewrite into use case, data flow, or deployment semantics."
    ),
)
