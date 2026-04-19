from dataclasses import dataclass


@dataclass(frozen=True)
class DiagramPromptModule:
    diagram_type: str
    generation_hint: str
    edit_instructions: str
