from pydantic import BaseModel, model_validator
from typing import Optional, List


class Node(BaseModel):
    id: str
    label: str
    type: str  # start | end | process | decision | input_output | queue | etc.


class Edge(BaseModel):
    source: str
    target: str
    label: Optional[str] = None


class DiagramIR(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

    @model_validator(mode="after")
    def validate_references(self):
        node_ids = {n.id for n in self.nodes}
        for edge in self.edges:
            if edge.source not in node_ids:
                raise ValueError(f"Edge source '{edge.source}' not in nodes.")
            if edge.target not in node_ids:
                raise ValueError(f"Edge target '{edge.target}' not in nodes.")
        return self
