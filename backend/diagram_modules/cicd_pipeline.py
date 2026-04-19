from .types import DiagramPromptModule

MODULE = DiagramPromptModule(
    diagram_type="cicd",
    generation_hint=(
        "DIAGRAM TYPE: CI/CD Pipeline. Generate strict pipeline semantics.\n"
        "ALLOWED node types (use ONLY these): start | end | process | decision | storage | input_output\n"
        "  start = source/trigger\n"
        "  process = build/test/scan/deploy stage\n"
        "  decision = approval gate or conditional branch\n"
        "  storage = artifact repository\n"
        "  input_output = environment target/notification channel\n"
        "  end = pipeline completion/feedback\n"
        "Use primarily left-to-right or top-to-bottom stage progression with clear branch labels.\n"
        "Do NOT generate as generic architecture graph."
    ),
    edit_instructions=(
        "You are a CI/CD pipeline editing engine.\n"
        "Output only JSON with keys nodes and edges.\n"
        "Preserve stage order, gate semantics, and artifact flow.\n"
        "When changing relationship types, keep pipeline direction clear and avoid dense cross-links."
    ),
)
