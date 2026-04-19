import type { GraphEdge, GraphNode } from "@/lib/diagramTypes";
  classifyUseCaseNode,
  type UseCaseNodeKind,

const BOUNDARY_HEADER_H = 44;
const BOUNDARY_INSET_Y = 52;
const UC_H = 72;
const UC_ROW_GAP = 40;
const ACTOR_H = 102;
const ACTOR_SIDE_GAP = 100;
const MIN_BOUNDARY_H = 480;
export interface UseCaseLayoutNode {
  kind: UseCaseNodeKind;
  y: number;
  height: number;

  primaryBoundaryId: string;
  boundary: UseCaseLayoutNode;
  useCases: UseCaseLayoutNode[];
  nodeById: Map<string, UseCaseLayoutNode>;

  return Math.max(min, Math.min(max, value));

  const associations = new Map<string, string[]>();
    const sourceActor = actorIds.has(edge.source);
    const sourceUseCase = useCaseIds.has(edge.source);
    if (sourceActor && targetUseCase) {
    } else if (targetActor && sourceUseCase) {
    }
  return associations;

  const useCaseToActors = new Map<string, string[]>();
    const sourceActor = actorIds.has(edge.source);
    const sourceUseCase = useCaseIds.has(edge.source);

      useCaseToActors.set(edge.target, [...(useCaseToActors.get(edge.target) ?? []), edge.source]);
      useCaseToActors.set(edge.source, [...(useCaseToActors.get(edge.source) ?? []), edge.target]);
  });
}
function actorPlacementCost(
  side: "left" | "right",
  useCaseCenters: Map<string, { x: number; y: number }>,
  rightAnchorX: number,
): number {
  const anchorX = side === "left" ? leftAnchorX : rightAnchorX;
    const preferredSide = preferredRight ? "right" : "left";
  }
  const yBarycenter = connectedUseCases.reduce((sum, useCaseId) => sum + (useCaseCenters.get(useCaseId)?.y ?? 0), 0) / connectedUseCases.length;
    const center = useCaseCenters.get(useCaseId);
    const dx = Math.abs(center.x - anchorX);
    return sum + dx + dy * 0.22;
  const preferredSidePenalty = preferredRight === (side === "right") ? 0 : 18;
}
function rebalanceActorSides(
  sideByActor: Map<string, "left" | "right">,
  useCaseCenters: Map<string, { x: number; y: number }>,
  leftAnchorX: number,
) {
    return actorIds.filter((actorId) => sideByActor.get(actorId) === side).length;

    const candidates = actorIds
      .map((actorId) => {
        const preferredRight = actor ? shouldPlaceActorOnRight(actor) : false;
        const toCost = actorPlacementCost(actorId, to, associations, useCaseCenters, leftAnchorX, rightAnchorX, preferredRight);
      })

      sideByActor.set(candidates[0].actorId, to);
  }
  if (actorIds.length > 1 && sideCount("left") === 0) moveCheapest("right", "left");

    if (sideCount("left") > sideCount("right")) moveCheapest("left", "right");
  }

  actors: GraphNode[],
  associations: Map<string, string[]>,
  boundaryTop: number,
): UseCaseLayoutNode[] {

    .map((actor) => {
      const desiredCenterY = connected.length
        : (boundaryTop + boundaryBottom) / 2;
    })

  const maxY = boundaryBottom - ACTOR_H - 12;
  const yPositions = sorted.map((entry) => clamp(entry.desiredCenterY - ACTOR_H / 2, minY, maxY));
  for (let i = 1; i < yPositions.length; i += 1) {
    if (yPositions[i] < required) yPositions[i] = required;
  for (let i = yPositions.length - 2; i >= 0; i -= 1) {
    if (yPositions[i] > allowed) yPositions[i] = allowed;
  for (let i = 0; i < yPositions.length; i += 1) {
  }
  return sorted.map((entry, index) => ({
    kind: "actor",
    y: yPositions[index],
    height: ACTOR_H,
}
export function buildUseCaseLayout(diagramNodes: GraphNode[], edges: GraphEdge[]): UseCaseLayoutResult {
  const actors = classified.filter((entry) => entry.kind === "actor").map((entry) => entry.node);
  const useCases = classified.filter((entry) => entry.kind === "use_case" || entry.kind === "unknown").map((entry) => entry.node);
  const primaryBoundary = boundaries[0];
  const boundaryLabel = primaryBoundary?.label ?? "System";
  const actorIds = new Set(actors.map((actor) => actor.id));
  const associations = resolveAssociationMap(edges, actorIds, useCaseIds);
  const rightHintActors = new Set(actors.filter((actor) => shouldPlaceActorOnRight(actor)).map((actor) => actor.id));
  const orderedUseCases = [...useCases]
      const relatedActors = useCaseActorMap.get(useCase.id) ?? [];
        ? relatedActors.filter((actorId) => rightHintActors.has(actorId)).length / relatedActors.length
      return {
        rightAffinity,
      };
    .sort((a, b) => {
      if (a.degree !== b.degree) return b.degree - a.degree;
    })

  const n = Math.max(orderedUseCases.length, 1);
  const rows = Math.ceil(n / cols);
  const useCaseHeight = BOUNDARY_HEADER_H + BOUNDARY_INSET_Y * 2 + rows * UC_H + Math.max(rows - 1, 0) * UC_ROW_GAP;
    + Math.max(Math.ceil(actors.length / 2) - 1, 0) * ACTOR_GAP
  const boundaryHeight = Math.max(MIN_BOUNDARY_H, useCaseHeight, actorHeight);
  const boundaryX = OUTER_PAD + ACTOR_W + ACTOR_SIDE_GAP;
  const boundaryTop = boundaryY;

    const col = index % cols;
    return {
      kind: "use_case",
      y: boundaryY + BOUNDARY_HEADER_H + BOUNDARY_INSET_Y + row * (UC_H + UC_ROW_GAP),
      height: UC_H,
  });
  const useCaseCenterY = new Map(useCaseLayouts.map((layout) => [layout.id, layout.y + layout.height / 2]));
  const leftAnchorX = boundaryX - ACTOR_SIDE_GAP / 2;

  const sideByActor = new Map<string, "left" | "right">();
    const preferredRight = shouldPlaceActorOnRight(actor);
    const rightCost = actorPlacementCost(actor.id, "right", associations, useCaseCenters, leftAnchorX, rightAnchorX, preferredRight);
    if (rightCost < leftCost) {
    } else if (leftCost < rightCost) {
    } else {

      side = idx % 2 === 0 ? "left" : "right";
    sideByActor.set(actor.id, side);
  rebalanceActorSides(
    sideByActor,
    useCaseCenters,
    leftAnchorX,
  );
  const leftActors = actors.filter((actor) => sideByActor.get(actor.id) === "left");

    leftActors,
    associations,
    boundaryTop,
  );
    rightActors,
    associations,
    boundaryTop,
  );
  const boundaryLayout: UseCaseLayoutNode = {
    kind: "system_boundary",
    y: boundaryY,
    height: boundaryHeight,

    id: boundary.id,
    x: boundaryX + (index % 2) * 42,
    width: 420,
  }));
  const allLayouts = [boundaryLayout, ...useCaseLayouts, ...leftActorLayouts, ...rightActorLayouts, ...extraBoundaries];
    primaryBoundaryId,
    boundary: boundaryLayout,
    actors: [...leftActorLayouts, ...rightActorLayouts],
    nodeById: new Map(allLayouts.map((layout) => [layout.id, layout])),
}
