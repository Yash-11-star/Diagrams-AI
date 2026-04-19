import dagre from "@dagrejs/dagre";
import type { GraphNode } from "@/lib/diagramTypes";
export const DEFAULT_NODE_W = 160;
export const DECISION_W = 140;
export const TERMINAL_W = 140;

export function getFlowNodeType(irType: string, diagramType?: string): string {


    if (t === "actor") return "actorNode";
    if (t === "system_boundary" || t === "boundary" || t === "storage" || t === "process") return "useCaseBoundaryNode";
  }
  if (diagramType === "class") {
    if (t === "interface") return "interfaceNode";
    if (t === "enum")      return "enumNode";
    if (t === "actor")     return "interfaceNode";
  }
  switch (t) {
    case "start":        return "startNode";
    case "input_output": return "ioNode";
    case "actor":        return "actorNode";
    default:             return "processNode";
}
export interface NodeSize {
  height: number;

  const t = irType.toLowerCase();
  if (t === "start" || t === "end") return { width: TERMINAL_W, height: TERMINAL_H };
}
export interface DagreLayoutOptions {
  ranksep?: number;
  marginx?: number;
}

  nodes: Array<{ id: string; irType: string }>,
  options: DagreLayoutOptions = {}
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    ranksep: options.ranksep ?? 80,
    marginx: options.marginx ?? 40,
  });
  nodes.forEach((n) => {
    g.setNode(n.id, { width, height });

    if (g.hasNode(e.source) && g.hasNode(e.target)) {
    }


  nodes.forEach((n) => {
    const { width, height } = getGenericNodeSize(n.irType);
  });
  return positions;

export function buildFlowNode(
  position: { x: number; y: number },
  extra: Record<string, unknown> = {}
  const flowType = getFlowNodeType(node.type, diagramType);
    id: node.id,
    position,
      label: node.label,
      diagramType,
    },
}
export function buildFlowEdge(
  target: string,
  data: Record<string, unknown> = {}
  return {
    source,
    type: "flowEdge",
    style: { stroke: "#94a3b8", strokeWidth: 1.5 },
}

  nodeIds: string[],
): string[] {
  const inDegree = new Map<string, number>(nodeIds.map((id) => [id, 0]));

    if (!idSet.has(e.source) || !idSet.has(e.target)) return;
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);

  const result: string[] = [];
  while (queue.length > 0) {
    result.push(id);
      const deg = (inDegree.get(neighbor) ?? 0) - 1;
      if (deg === 0) queue.push(neighbor);
  }
  const inResult = new Set(result);

}
export function normalizeLabel(v: string): string {
}
export function labelIncludes(label: string, tokens: string[]): boolean {
  return tokens.some((t) => n.includes(t));
