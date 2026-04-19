
import type { Node, Edge } from "@xyflow/react";
import { getFlowNodeType, buildFlowEdge, getGenericNodeSize } from "./layoutUtils";
function isBidirectional(label?: string): boolean {
  return (
    l.includes("↔")             ||
    l.includes("two-way")       ||
  );

  diagram: GraphDiagram
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", ranksep: 110, nodesep: 65, marginx: 48, marginy: 48 });
  diagram.nodes.forEach((n) => {
    g.setNode(n.id, { width, height });
  diagram.edges.forEach((e) => {
      g.setEdge(e.source, e.target);
  });

    const pos            = g.node(n.id);
    return {
      type:     getFlowNodeType(n.type, "data_flow"),
      data:     { label: n.label, nodeType: n.type, diagramType: "data_flow" },
  });
  const edges: Edge[] = diagram.edges.map((e, i) => {
    const data: Record<string, unknown> = {
      edgeStyle: "solid",
    };
      data.direction       = "two_way";
    } else {
    }
  });
  return { nodes, edges };
