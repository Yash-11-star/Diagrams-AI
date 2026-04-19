
import type { GraphDiagram, GraphEdge, GraphNode } from "@/lib/diagramTypes";
import {
  defaultRelationshipLabel,
  normalizeNodeType,
  type UseCaseNodeKind,
import { buildUseCaseLayout } from "./useCaseDiagramLayout";
function sanitizeNode(node: GraphNode): GraphNode {
  return {
    type: normalizeNodeType(kind),
}
type EdgeSide = "top" | "right" | "bottom" | "left";

  source: Node,
): { sourceSide: EdgeSide; targetSide: EdgeSide } {
  const sourceCenterY = source.position.y + ((source.height as number | undefined) ?? 64) / 2;
  const targetCenterY = target.position.y + ((target.height as number | undefined) ?? 64) / 2;
  const dy = targetCenterY - sourceCenterY;
  if (Math.abs(dx) >= Math.abs(dy)) {
      ? { sourceSide: "right", targetSide: "left" }
  }
    ? { sourceSide: "bottom", targetSide: "top" }
}
function slotCount(side: EdgeSide): number {
}
function handleId(role: "source" | "target", side: EdgeSide, slot: number): string {
}
function nextHandle(
  role: "source" | "target",
  side: EdgeSide,
  const key = `${role}:${nodeId}:${side}`;
  const slot = (used % slotCount(side)) + 1;
  return handleId(role, side, slot);

  const width = ((node.width as number | undefined) ?? 160);
  return {
    y: node.position.y,
    height,
}
function centerOfRect(rect: Rect): { x: number; y: number } {
}
function expandRect(rect: Rect, amount: number): Rect {
    x: rect.x - amount,
    width: rect.width + amount * 2,
  };

  return (
    && a.x + a.width > b.x
    && a.y + a.height > b.y
}
function labelRect(centerX: number, centerY: number, label: string): Rect {
  const width = Math.max(56, Math.min(180, text.length * 6 + 16));
  return {
    y: centerY - height / 2,
    height,
}
function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dy = a.y - b.y;
}
function labelOffsetForRelationship(
  pairIndex: number,
  targetNode: Node,
  nodeObstacles: Rect[],
): { x: number; y: number } {

  const sourceCenterY = sourceNode.position.y + ((sourceNode.height as number | undefined) ?? 64) / 2;
  const targetCenterY = targetNode.position.y + ((targetNode.height as number | undefined) ?? 64) / 2;
  const dy = targetCenterY - sourceCenterY;
  const tangent = { x: dx / length, y: dy / length };
  const midpoint = { x: sourceCenterX + dx / 2, y: sourceCenterY + dy / 2 };
  const baseNormal =
      ? -16
      ? 16
      ? -10
  const baseAlong = ((pairIndex % 3) - 1) * 14;
  const alongCandidates = [baseAlong, baseAlong - 14, baseAlong + 14, baseAlong - 26, baseAlong + 26];
  const initialCenter = {
    y: midpoint.y + tangent.y * baseAlong + normal.y * baseNormal,

  let chosenRect = labelRect(initialCenter.x, initialCenter.y, label);

    for (const a of alongCandidates) {
        x: midpoint.x + tangent.x * a + normal.x * n,
      };

        rectsOverlap(expandRect(candidateRect, 3), expandRect(obstacle, 8))
      const overlapsLabel = occupiedLabelRects.some((placed) =>
      );
      const obstacleCenters = nodeObstacles.map(centerOfRect);
      const nearestObstacleDistance = obstacleCenters.length
        : 1000;
        ? Math.min(...labelCenters.map((point) => distance(point, candidateCenter)))
      const score = (overlapsNode ? -1000 : 0) + (overlapsLabel ? -600 : 0) + nearestObstacleDistance * 0.45 + nearestLabelDistance * 0.25;
      if (!overlapsNode && !overlapsLabel) {
        return { x: candidateCenter.x - midpoint.x, y: candidateCenter.y - midpoint.y };

        bestScore = score;
        chosenRect = candidateRect;
    }

  return { x: chosenCenter.x - midpoint.x, y: chosenCenter.y - midpoint.y };

  return {
    type: "useCaseNode",
    data: { label: node.label, nodeType: "use_case", diagramType: "use_case" },
  };

  return {
    type: "actorNode",
    data: { label: node.label, nodeType: "actor", diagramType: "use_case" },
  };

  return {
    type: "useCaseBoundaryNode",
    draggable: true,
    selectable: !decorative,
    data: {
      nodeType: "system_boundary",
      subtitle: "System Boundary",
    },
    zIndex: 0,
}
function toEdge(
  index: number,
  targetKind: UseCaseNodeKind,
  targetNode: Node,
  pairState: Map<string, number>,
  occupiedLabelRects: Rect[],
  const relationshipType = inferUseCaseRelationship(edge, sourceKind, targetKind);
  const label = defaultRelationshipLabel(relationshipType, edge.label);
  const sourceHandle = nextHandle(slotState, "source", sourceNode.id, sourceSide);
  const pairKey = `${edge.source}->${edge.target}:${relationshipType}`;
  pairState.set(pairKey, pairIndex + 1);
    relationshipType,
    sourceNode,
    label,
    occupiedLabelRects,

    ...buildFlowEdge(edge.source, edge.target, index, {
      relationshipType,
      arrowType: style.arrowType,
      routingMode: "straight",
      labelOffsetY: labelOffset.y,
    sourceHandle,
  };

  const normalizedNodes = diagram.nodes.map(sanitizeNode);
  const layout = buildUseCaseLayout(normalizedNodes, diagram.edges);
  const nodes: Node[] = [];
  nodes.push(
      layout.primaryBoundaryId,
      layout.boundary.x,
      layout.boundary.width,
      false,
  );
  layout.useCases.forEach((item) => {
    if (!node) return;
  });
  layout.actors.forEach((item) => {
    if (!node) return;
  });
  layout.extraBoundaries.forEach((item) => {
    if (!node) return;
  });
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    .filter((node) => node.type === "useCaseNode" || node.type === "actorNode")
  const slotState = new Map<string, number>();
  const occupiedLabelRects: Rect[] = [];
    .filter((edge) => nodeMap.has(edge.source) && nodeMap.has(edge.target))
      const source = normalizedNodeById.get(edge.source);
      if (!source || !target) {
      }
        edge,
        classifyUseCaseNode(source),
        nodeMap.get(edge.source)!,
        slotState,
        nodeObstacles,
      );

}
