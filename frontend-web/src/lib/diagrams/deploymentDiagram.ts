
import type { Node, Edge } from "@xyflow/react";
import { getFlowNodeType, buildFlowEdge, getGenericNodeSize } from "./layoutUtils";
function inferRelType(label?: string): "deployment" | "communicate" {
  if (
    l.includes("connect")    ||
    l.includes("http")       ||
    l.includes("rpc")        ||
  ) return "communicate";
}
export function buildDeploymentDiagramFlow(
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

    const rel   = inferRelType(e.label);

      data.relationshipType = "communicate";
      data.arrowType        = "open";
      data.relationshipType = "deployment";
      data.arrowType        = "filled";

  });
  return { nodes, edges };
