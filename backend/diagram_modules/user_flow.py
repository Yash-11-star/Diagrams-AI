from .types import DiagramPromptModule

MODULE = DiagramPromptModule(
    diagram_type="user_flow",
    generation_hint=(
        "DIAGRAM TYPE: User Flow. Generate UX navigation semantics.\n"
        "ALLOWED node types (use ONLY these): start | end | process | decision | input_output\n"
        "  start = entry screen/event\n"
        "  process = screen/state/action\n"
        "  decision = branch point\n"
        "  input_output = user input or surfaced output\n"
        "  end = completion/exit\n"
        "Edge labels should describe navigation outcomes (for example Yes/No, Success/Error).\n"
        "Do NOT generate as UML use case or infrastructure architecture."
    ),
    edit_instructions=(
        "You are a UX user-flow editing engine.\n"
        "Output only JSON with keys nodes and edges.\n"
        "Keep directional navigation flow and decision branch clarity.\n"
        "When editing, preserve readable top-to-bottom or left-to-right sequence and explicit branch labels."
    ),
)
