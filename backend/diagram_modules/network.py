from .types import DiagramPromptModule

MODULE = DiagramPromptModule(
    diagram_type="network",
    generation_hint=(
        "DIAGRAM TYPE: Network Diagram. Generate topology/connectivity semantics.\n"
        "ALLOWED node types (use ONLY these): process | actor | input_output | queue | storage\n"
        "  process = routers/switches/firewalls/servers\n"
        "  actor = clients/end-user devices\n"
        "  input_output = internet/cloud boundary or WAN edge\n"
        "  queue = transit segment/backbone link group\n"
        "  storage = subnet/zone/VLAN grouping endpoint\n"
        "Edges must represent explicit network links/uplinks/downlinks with concise labels.\n"
        "Do NOT generate as cloud service architecture by default."
    ),
    edit_instructions=(
        "You are a network diagram editing engine.\n"
        "Output only JSON with keys nodes and edges.\n"
        "Preserve topology readability and link direction/labels.\n"
        "Keep segmentation and boundary semantics explicit while avoiding clutter."
    ),
)
