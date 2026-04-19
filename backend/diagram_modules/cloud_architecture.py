from .types import DiagramPromptModule

MODULE = DiagramPromptModule(
    diagram_type="cloud_arch",
    generation_hint=(
        "DIAGRAM TYPE: Cloud Architecture. Generate layered cloud-system semantics.\n"
        "ALLOWED node types (use ONLY these): actor | process | storage | queue | input_output\n"
        "  actor = client/user/external actor\n"
        "  process = app/service/API gateway/compute component\n"
        "  storage = database/cache/object store\n"
        "  queue = event/messaging backbone\n"
        "  input_output = external API, CDN, ingress, or egress boundary\n"
        "Use clear request/data/event/auth relationship labels and keep layered grouping readable.\n"
        "Do NOT generate as DFD or UML use-case diagram."
    ),
    edit_instructions=(
        "You are a cloud architecture editing engine.\n"
        "Output only JSON with keys nodes and edges.\n"
        "Preserve layered readability, service/data boundaries, and directional request/data/event/auth flows.\n"
        "Avoid unnecessary protocol label noise."
    ),
)
