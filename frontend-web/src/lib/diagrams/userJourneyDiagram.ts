
import type { GraphDiagram, GraphNode } from "@/lib/diagramTypes";

const PAD_Y        = 48;
const STAGE_H      = 56;
const ROW_LABEL_W  = 0;
const CARD_H       = 56;
const ROW_GAP      = 28;
const ROW_TYPE_ORDER: Record<string, number> = {
  input_output: 1,
  start:        3,
};
function topoSort(
  edges: Array<{ source: string; target: string }>
  return topologicalOrder(ids, edges);

  diagram: GraphDiagram
  const stageNodes = diagram.nodes.filter(
  );
    (n) => n.type.toLowerCase() !== "process"

    return buildFlatFlow(diagram);

    stageNodes.map((n) => n.id),
      const sIsStage = stageNodes.some((n) => n.id === e.source);
      return sIsStage && tIsStage;
  );
  const stageIdSet = new Set(stageIds);
  cardNodes.forEach((n) => {
    diagram.edges.forEach((e) => {
      if (e.target === n.id && stageIdSet.has(e.source)) connected.push(e.source);
    cardToStage.set(n.id, connected[0] ?? null);

  const stageColumns = new Map<string, CardGroup>(
  );

    const stageId = cardToStage.get(n.id);
      unassigned.push(n);
    }
    const t = n.type.toLowerCase();
    col.get(t)!.push(n);

    new Set(cardNodes.map((n) => n.type.toLowerCase()))
    (a, b) => (ROW_TYPE_ORDER[a] ?? 99) - (ROW_TYPE_ORDER[b] ?? 99)

  allTypes.forEach((t) => {
    stageIds.forEach((sid) => {
      maxStack = Math.max(maxStack, count);
    rowBandH.set(t, Math.max(CARD_H, maxStack * (CARD_H + CARD_INNER_GAP) - CARD_INNER_GAP));

  let curX = PAD_X + ROW_LABEL_W;
    stageColX.set(id, curX);
  });
  const rowBandY = new Map<string, number>();
  allTypes.forEach((t) => {
    curY += (rowBandH.get(t) ?? CARD_H) + ROW_GAP;

    const stageNode = stageNodes.find((n) => n.id === sid)!;
      id: stageNode.id,
      position: { x: stageColX.get(sid) ?? 0, y: PAD_Y },
        label: stageNode.label,
        diagramType: "user_journey",
      style: { width: STAGE_W, minWidth: STAGE_W },
  });
  const cardOutputNodes: Node[] = [];
    const col = stageColumns.get(sid)!;

      const bandY = rowBandY.get(t) ?? 0;
        cardOutputNodes.push({
          type: getFlowNodeType(card.type, "user_journey"),
            x: colX + (STAGE_W - CARD_W) / 2,
          },
            label: card.label,
            diagramType: "user_journey",
          style: { width: CARD_W },
      });
  });
  const unassignedNodes: Node[] = unassigned.map((n, idx) => ({
    type: getFlowNodeType(n.type, "user_journey"),
      x: PAD_X + ROW_LABEL_W + idx * (CARD_W + STAGE_GAP),
    },
      label: n.label,
      diagramType: "user_journey",
    style: { width: CARD_W },

    buildFlowEdge(e.source, e.target, i, { label: e.label ?? "" })

    nodes: [...stageOutputNodes, ...cardOutputNodes, ...unassignedNodes],
  };

  const nodes: Node[] = diagram.nodes.map((n, idx) => ({
    type: getFlowNodeType(n.type, "user_journey"),
      x: PAD_X + idx * (STAGE_W + STAGE_GAP),
    },
  }));
    buildFlowEdge(e.source, e.target, i, { label: e.label ?? "" })
  return { nodes, edges };
