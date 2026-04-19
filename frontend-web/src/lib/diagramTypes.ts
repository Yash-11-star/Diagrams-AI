export interface GraphNode {
  label: string;
  fields?: string[];
}
export interface GraphEdge {
  target: string;
  relationshipType?: string;
  arrowType?: "filled" | "open" | "none" | "triangle";
  routingMode?: "smooth" | "straight";

  kind?: "graph";
  edges: GraphEdge[];

  | "request_flow"
  | "event_flow"
  | "dependency"
  | "sync_call"
  | "external_api_call";
export type ArchitectureRoutingMode = "orthogonal" | "straight";
export type ArchitectureStyleToken =
  | "secondary"
  | "auth"
  | "observability";
export interface ArchitectureLayerStyle {
  border: string;
}
export interface ArchitectureLayer {
  name: string;
  order: number;
  style: ArchitectureLayerStyle;
  childNodeIds: string[];

  order: number;
  offsetX?: number;

  id: string;
  type: string;
  layout?: ArchitectureNodeLayout;

  x: number;
}
export interface ArchitectureEdgeStyle {
  dashed: boolean;
}
export interface ArchitectureEdgeRouting {
  bendPoints: ArchitectureBendPoint[];

  id: string;
  targetId: string;
  targetHandle?: string;
  label: string;
  routing: ArchitectureEdgeRouting;
  protocol?: string;
  notes?: string;

  kind: "architecture";
  layers: ArchitectureLayer[];
  edges: ArchitectureEdge[];


  id: string;
  role: SequenceParticipantRole;


  id: string;
  from: string;
  messageType: SequenceMessageType;
}
export interface SequenceNoteStep {
  kind: "note";
  participantId?: string;
}
export interface SequenceDividerStep {
  kind: "divider";
}
export type SequenceStep = SequenceMessageStep | SequenceNoteStep | SequenceDividerStep;
export interface SequenceActivation {
  participantId: string;
  endStepId: string;


  id: string;
  fragmentType: SequenceFragmentType;
  startStepId: string;
  participantIds?: string[];
}
export interface SequenceDiagram {
  schemaVersion: 2;
  steps: SequenceStep[];
  fragments: SequenceFragment[];

export type Diagram = DiagramDocument;
export type DiagramEdge = GraphEdge;
export function isSequenceDiagram(diagram: DiagramDocument): diagram is SequenceDiagram {
}
export function isArchitectureDiagram(diagram: DiagramDocument): diagram is ArchitectureDiagram {
}
export function isGraphDiagram(diagram: DiagramDocument): diagram is GraphDiagram {
}
export function isLegacySequenceGraph(diagramType: string, diagram: DiagramDocument): diagram is GraphDiagram {
}
export function isLegacyArchitectureGraph(diagramType: string, diagram: DiagramDocument): diagram is GraphDiagram {
}
export function getDiagramCounts(diagram: DiagramDocument): { primary: number; secondary: number; primaryLabel: string; secondaryLabel: string } {
    return {
      secondary: diagram.steps.length,
      secondaryLabel: "steps",
  }
  if (isArchitectureDiagram(diagram)) {
      primary: diagram.nodes.length,
      primaryLabel: "components",
    };

    primary: diagram.nodes.length,
    primaryLabel: "nodes",
  };

  return { kind: "graph", nodes, edges };

  return {
    schemaVersion: 2,
    steps,
    fragments: [],
}
export function makeArchitectureDiagram(
  nodes: ArchitectureNode[] = [],
): ArchitectureDiagram {
    kind: "architecture",
    layers,
    edges,
}
