from .types import DiagramPromptModule

MODULE = DiagramPromptModule(
    diagram_type="user_journey",
    generation_hint=(
        "DIAGRAM TYPE: User Journey Map. Generate staged journey semantics (not architecture graph semantics).\n"
        "ALLOWED node types (use ONLY these): process | input_output | decision | actor | storage\n"
        "  process = journey stage or user action\n"
        "  input_output = touchpoint/channel\n"
        "  decision = pain point or friction gate\n"
        "  actor = owner/persona/support role\n"
        "  storage = opportunity/outcome summary\n"
        "Model progression clearly by stage order with concise labels and minimal crossing edges.\n"
        "Do NOT generate as cloud architecture, UML use case, or random graph."
    ),
    edit_instructions=(
        "You are a user journey map editing engine.\n"
        "Output only JSON with keys nodes and edges.\n"
        "Keep ordered stage progression, touchpoints, pain points, and opportunities explicit.\n"
        "Preserve journey readability over dense connectivity."
    ),
)
