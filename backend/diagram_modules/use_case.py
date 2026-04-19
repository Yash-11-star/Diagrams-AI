from .types import DiagramPromptModule

MODULE = DiagramPromptModule(
    diagram_type="use_case",
    generation_hint=(
        "DIAGRAM TYPE: Use Case Diagram. Generate strict UML use-case semantics.\n"
        "ALLOWED node types (use ONLY these): actor | use_case | system_boundary\n"
        "  actor = external actor (person, role, external system)\n"
        "  use_case = oval use case inside the system boundary\n"
        "  system_boundary = named rectangle for the system/module scope\n"
        "Edge labels MUST be one of: association | <<include>> | <<extend>> | generalization.\n"
        "Hard placement rules:\n"
        "  - actors belong outside system boundary\n"
        "  - use_case nodes belong inside system boundary\n"
        "  - include/extend edges are only between use_case nodes\n"
        "Do NOT generate as user flow, architecture graph, or process flowchart."
    ),
    edit_instructions=(
        "You are a UML use case diagram editing engine.\n"
        "Output only JSON with keys nodes and edges.\n"
        "Keep actors as actor nodes, use cases as use_case nodes, and boundary as system_boundary.\n"
        "Preserve relationship semantics association/include/extend/generalization and update edge labels accordingly."
    ),
)
