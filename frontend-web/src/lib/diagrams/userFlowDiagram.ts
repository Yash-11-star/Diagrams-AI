
import type { Node, Edge } from "@xyflow/react";
import { getFlowNodeType, buildFlowEdge, getGenericNodeSize } from "./layoutUtils";
export function buildUserFlowDiagramFlow(
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

    buildFlowEdge(e.source, e.target, i, { label: e.label ?? "" })

}
