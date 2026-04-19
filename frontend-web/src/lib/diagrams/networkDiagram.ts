
import type { Node, Edge } from "@xyflow/react";
import { getFlowNodeType, buildFlowEdge, getGenericNodeSize } from "./layoutUtils";
function inferRelType(label?: string): "link" | "directed" | "encrypted" {
  if (
    l.includes("ssl")       ||
    l.includes("vpn")       ||
    l.includes("encrypt")   ||
  ) return "encrypted";
  if (
    l.includes("forward")   ||
    l.includes("traffic")

}
export function buildNetworkDiagramFlow(
): { nodes: Node[]; edges: Edge[] } {
  g.setDefaultEdgeLabel(() => ({}));

    const { width, height } = getGenericNodeSize(n.type);
  });
    if (g.hasNode(e.source) && g.hasNode(e.target)) {
    }
  dagre.layout(g);
  const nodes: Node[] = diagram.nodes.map((n) => {
    const { width, height } = getGenericNodeSize(n.type);
      id:       n.id,
      position: { x: pos.x - width / 2, y: pos.y - height / 2 },
    };

    const rel  = inferRelType(e.label);

      data.relationshipType = "encrypted";
      data.arrowType        = "none";
      data.relationshipType = "directed";
      data.arrowType        = "filled";
      data.relationshipType = "link";
      data.arrowType        = "none";

  });
  return { nodes, edges };
