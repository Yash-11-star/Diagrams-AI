from typing import Annotated, Literal, Optional, Union, List

from pydantic import BaseModel, Field, field_validator, model_validator


class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    fields: Optional[List[str]] = None
    methods: Optional[List[str]] = None


class GraphEdge(BaseModel):
    source: str
    target: str
    label: Optional[str] = None
    relationshipType: Optional[str] = None
    edgeStyle: Optional[str] = None
    arrowType: Optional[str] = None
    direction: Optional[str] = None
    routingMode: Optional[str] = None


class GraphDiagramIR(BaseModel):
    kind: Optional[Literal["graph"]] = None
    nodes: List[GraphNode]
    edges: List[GraphEdge]

    @model_validator(mode="after")
    def validate_references(self):
        node_ids = {node.id for node in self.nodes}
        valid_edges = []
        for edge in self.edges:
            if edge.source not in node_ids or edge.target not in node_ids:
                # Drop edges referencing phantom nodes rather than failing the
                # entire diagram — LLMs occasionally hallucinate node IDs in edges.
                import logging
                logging.getLogger(__name__).warning(
                    "Dropping edge (%s → %s): one or both endpoints not in nodes.",
                    edge.source, edge.target,
                )
                continue
            valid_edges.append(edge)
        self.edges = valid_edges
        return self


class SequenceParticipant(BaseModel):
    id: str
    name: str
    role: Literal["actor", "participant", "system"]


class SequenceMessageStep(BaseModel):
    id: str
    kind: Literal["message"]
    from_: str = Field(alias="from")
    to: str
    messageType: Literal["sync", "async", "return", "self"]
    label: str


class SequenceNoteStep(BaseModel):
    id: str
    kind: Literal["note"]
    label: str
    participantId: Optional[str] = None
    align: Optional[Literal["left", "right", "over"]] = "right"


class SequenceDividerStep(BaseModel):
    id: str
    kind: Literal["divider"]
    label: str


SequenceStep = Annotated[
    Union[SequenceMessageStep, SequenceNoteStep, SequenceDividerStep],
    Field(discriminator="kind"),
]


class SequenceActivation(BaseModel):
    id: str
    participantId: str
    startStepId: str
    endStepId: str


class SequenceFragment(BaseModel):
    id: str
    kind: Literal["fragment"]
    fragmentType: Literal["loop", "alt", "opt", "par"]
    label: str
    startStepId: str
    endStepId: str
    participantIds: Optional[List[str]] = None
    branchLabel: Optional[str] = None


class SequenceDiagramIR(BaseModel):
    kind: Literal["sequence"]
    schemaVersion: Literal[2] = 2
    participants: List[SequenceParticipant]
    steps: List[SequenceStep]
    activations: List[SequenceActivation] = Field(default_factory=list)
    fragments: List[SequenceFragment] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_references(self):
        participant_ids = {participant.id for participant in self.participants}
        step_ids = [step.id for step in self.steps]
        if len(step_ids) != len(set(step_ids)):
            raise ValueError("Sequence step ids must be unique.")

        for participant in self.participants:
            if participant.role not in {"actor", "participant", "system"}:
                raise ValueError(f"Invalid participant role '{participant.role}'.")

        for step in self.steps:
            if isinstance(step, SequenceMessageStep):
                if step.from_ not in participant_ids:
                    raise ValueError(f"Message source '{step.from_}' is not a participant.")
                if step.to not in participant_ids:
                    raise ValueError(f"Message target '{step.to}' is not a participant.")
            elif isinstance(step, SequenceNoteStep) and step.participantId and step.participantId not in participant_ids:
                raise ValueError(f"Note participant '{step.participantId}' is not a participant.")

        step_id_set = set(step_ids)
        for activation in self.activations:
            if activation.participantId not in participant_ids:
                raise ValueError(f"Activation participant '{activation.participantId}' is not a participant.")
            if activation.startStepId not in step_id_set or activation.endStepId not in step_id_set:
                raise ValueError("Activation step ids must exist in steps.")

        for fragment in self.fragments:
            if fragment.startStepId not in step_id_set or fragment.endStepId not in step_id_set:
                raise ValueError("Fragment step ids must exist in steps.")
            if fragment.participantIds:
                unknown = [participant_id for participant_id in fragment.participantIds if participant_id not in participant_ids]
                if unknown:
                    raise ValueError(f"Fragment references unknown participants: {', '.join(unknown)}")
        return self


class ArchitectureLayerStyle(BaseModel):
    background: str
    border: str
    accent: str


class ArchitectureLayer(BaseModel):
    id: str
    name: str
    description: str
    order: int
    height: int
    style: ArchitectureLayerStyle
    allowedComponentTypes: Optional[List[str]] = None
    childNodeIds: List[str] = Field(default_factory=list)


class ArchitectureNodeLayout(BaseModel):
    order: int
    pinned: Optional[bool] = None
    offsetX: Optional[float] = None


class ArchitectureNode(BaseModel):
    id: str
    label: str
    type: str
    layerId: Optional[str] = None
    layout: Optional[ArchitectureNodeLayout] = None


class ArchitectureBendPoint(BaseModel):
    x: float
    y: float


_VALID_STYLE_TOKENS = {"primary", "secondary", "event", "auth", "external", "observability"}

_STYLE_TOKEN_MAP: dict[str, str] = {
    "default": "primary",
    "main": "primary",
    "normal": "secondary",
    "internal": "secondary",
    "component": "secondary",
    "dependency": "secondary",
    "service": "secondary",
    "message": "event",
    "async": "event",
    "queue": "event",
    "authentication": "auth",
    "authorization": "auth",
    "api": "external",
    "third_party": "external",
    "monitoring": "observability",
    "logging": "observability",
    "metrics": "observability",
}


class ArchitectureEdgeStyle(BaseModel):
    token: Literal["primary", "secondary", "event", "auth", "external", "observability"]
    dashed: bool
    arrowhead: Literal["filled", "open", "none"]

    @field_validator("token", mode="before")
    @classmethod
    def normalize_token(cls, v: str) -> str:
        if v in _VALID_STYLE_TOKENS:
            return v
        return _STYLE_TOKEN_MAP.get(str(v).lower(), "primary")

    @field_validator("arrowhead", mode="before")
    @classmethod
    def normalize_arrowhead(cls, v: str) -> str:
        if v in {"filled", "open", "none"}:
            return v
        lowered = str(v).lower()
        if "open" in lowered or "hollow" in lowered:
            return "open"
        if "none" in lowered or "no" in lowered:
            return "none"
        return "filled"


_ROUTING_MODE_MAP: dict[str, str] = {
    "vertical": "orthogonal",
    "horizontal": "orthogonal",
    "curved": "straight",
    "direct": "straight",
    "auto": "orthogonal",
}

_VALID_ROUTING_MODES = {"orthogonal", "straight"}


class ArchitectureEdgeRouting(BaseModel):
    mode: Literal["orthogonal", "straight"]
    bendPoints: List[ArchitectureBendPoint] = Field(default_factory=list)

    @field_validator("mode", mode="before")
    @classmethod
    def normalize_routing_mode(cls, v: str) -> str:
        if v in _VALID_ROUTING_MODES:
            return v
        return _ROUTING_MODE_MAP.get(str(v).lower(), "orthogonal")


_VALID_RELATIONSHIP_TYPES = {
    "request_flow",
    "data_flow",
    "event_flow",
    "auth_flow",
    "dependency",
    "async_message",
    "sync_call",
    "internal_service_call",
    "external_api_call",
}

_RELATIONSHIP_TYPE_MAP: dict[str, str] = {
    # routing/call variants
    "api_call": "external_api_call",
    "external_call": "external_api_call",
    "http_call": "request_flow",
    "http_request": "request_flow",
    "rest_call": "request_flow",
    "grpc_call": "sync_call",
    "internal_call": "internal_service_call",
    "service_call": "internal_service_call",
    "component_call": "internal_service_call",
    "component_flow": "dependency",
    "module_dependency": "dependency",
    "uses": "dependency",
    "depends_on": "dependency",
    # auth
    "auth_request": "auth_flow",
    "authentication": "auth_flow",
    "authorization": "auth_flow",
    # data
    "database_call": "data_flow",
    "db_query": "data_flow",
    "read_write": "data_flow",
    "storage_access": "data_flow",
    # async / events
    "message": "async_message",
    "queue_message": "async_message",
    "publish": "event_flow",
    "subscribe": "event_flow",
    "event": "event_flow",
    "trigger": "event_flow",
}


class ArchitectureEdge(BaseModel):
    id: str
    sourceId: str
    targetId: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None
    relationshipType: Literal[
        "request_flow",
        "data_flow",
        "event_flow",
        "auth_flow",
        "dependency",
        "async_message",
        "sync_call",
        "internal_service_call",
        "external_api_call",
    ]
    label: str
    direction: Literal["one_way", "two_way"]
    routing: ArchitectureEdgeRouting
    style: ArchitectureEdgeStyle
    protocol: Optional[str] = None
    eventName: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("relationshipType", mode="before")
    @classmethod
    def normalize_relationship_type(cls, v: str) -> str:
        if v in _VALID_RELATIONSHIP_TYPES:
            return v
        return _RELATIONSHIP_TYPE_MAP.get(str(v).lower(), "dependency")

    @field_validator("direction", mode="before")
    @classmethod
    def normalize_direction(cls, v: str) -> str:
        if v in {"one_way", "two_way"}:
            return v
        lowered = str(v).lower()
        if "two" in lowered or "bi" in lowered or "both" in lowered:
            return "two_way"
        return "one_way"


class ArchitectureDiagramIR(BaseModel):
    kind: Literal["architecture"]
    schemaVersion: Literal[1] = 1
    layers: List[ArchitectureLayer]
    nodes: List[ArchitectureNode]
    edges: List[ArchitectureEdge]

    @model_validator(mode="after")
    def validate_references(self):
        import logging
        _log = logging.getLogger(__name__)

        layer_ids = {layer.id for layer in self.layers}
        node_ids = {node.id for node in self.nodes}

        # Drop nodes that reference a non-existent layer
        valid_nodes = []
        for node in self.nodes:
            if node.layerId is not None and node.layerId not in layer_ids:
                _log.warning("Dropping node '%s': layerId '%s' does not exist.", node.id, node.layerId)
                node_ids.discard(node.id)
                continue
            valid_nodes.append(node)
        self.nodes = valid_nodes

        # Drop child references in layers that point to unknown nodes
        for layer in self.layers:
            before = layer.childNodeIds
            layer.childNodeIds = [c for c in before if c in node_ids]
            for c in before:
                if c not in node_ids:
                    _log.warning("Dropping childNodeId '%s' from layer '%s': node not found.", c, layer.id)

        # Drop edges whose endpoints don't exist
        valid_edges = []
        for edge in self.edges:
            if edge.sourceId not in node_ids or edge.targetId not in node_ids:
                _log.warning(
                    "Dropping architecture edge (%s → %s): one or both endpoints not in nodes.",
                    edge.sourceId, edge.targetId,
                )
                continue
            valid_edges.append(edge)
        self.edges = valid_edges

        return self


DiagramDocument = Union[GraphDiagramIR, SequenceDiagramIR, ArchitectureDiagramIR]


def parse_diagram_document(data: dict) -> DiagramDocument:
    if data.get("kind") == "sequence":
        return SequenceDiagramIR(**data)
    if data.get("kind") == "architecture":
        return ArchitectureDiagramIR(**data)
    return GraphDiagramIR(**data)


def dump_diagram_document(diagram: DiagramDocument) -> dict:
    return diagram.model_dump(by_alias=True, exclude_none=True)
