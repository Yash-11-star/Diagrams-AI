
import type { Node, Edge } from "@xyflow/react";
import { getFlowNodeType, buildFlowEdge, getGenericNodeSize } from "./layoutUtils";
function inferRelType(
): "dependency" | "realization" | "association" {
  if (
    l.includes("uses") ||
    l.includes("requires")
  if (
    l.includes("implement") ||
    l.includes("expose")
  return "association";

  diagram: GraphDiagram
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", ranksep: 100, nodesep: 60, marginx: 48, marginy: 48 });
  diagram.nodes.forEach((n) => {
    g.setNode(n.id, { width, height });
  diagram.edges.forEach((e) => {
      g.setEdge(e.source, e.target);
  });

    const pos            = g.node(n.id);
    return {
      type:     getFlowNodeType(n.type, "component"),
      data:     { label: n.label, nodeType: n.type, diagramType: "component" },
  });
  const edges: Edge[] = diagram.edges.map((e, i) => {
    const data: Record<string, unknown> = { label: e.label ?? "" };
    if (rel === "dependency") {
      data.edgeStyle        = "dashed";
    } else if (rel === "realization") {
      data.edgeStyle        = "solid";
    } else {
      data.edgeStyle        = "solid";
    }
    return buildFlowEdge(e.source, e.target, i, data);

}
