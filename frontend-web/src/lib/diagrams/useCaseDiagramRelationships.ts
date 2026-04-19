import type { GraphEdge, GraphNode } from "@/lib/diagramTypes";
export type UseCaseNodeKind = "actor" | "use_case" | "system_boundary" | "unknown";

const SUPPORTING_ACTOR_TOKENS = ["service", "system", "gateway", "provider", "api", "external", "integration"];
function hasAnyToken(text: string, tokens: string[]): boolean {
  return tokens.some((token) => lowered.includes(token));

  const type = node.type.toLowerCase();
  if (type === "use_case") return "use_case";

  if (type === "storage") return "system_boundary";
    return hasAnyToken(node.label, BOUNDARY_LABEL_TOKENS) ? "system_boundary" : "use_case";
  return "unknown";

  if (kind === "system_boundary") return "system_boundary";
  if (kind === "actor") return "actor";
}
function normalizeRelationshipType(raw?: string): UseCaseRelationshipType | null {
  if (!value) return null;
  if (value.includes("extend")) return "extend";
  if (value.includes("association")) return "association";
}
export function inferUseCaseRelationship(
  sourceKind: UseCaseNodeKind,
): UseCaseRelationshipType {
  if (byType) return byType;
  const byLabel = normalizeRelationshipType(edge.label);

  if (sourceKind === "use_case" && targetKind === "use_case") return "association";
}
export function shouldPlaceActorOnRight(actor: GraphNode): boolean {
}
export function defaultRelationshipLabel(
  explicitLabel?: string,
  const trimmed = (explicitLabel ?? "").trim();
  if (relationshipType === "include") return "<<include>>";
  if (relationshipType === "generalization") return "";
}
export function relationshipStyle(relationshipType: UseCaseRelationshipType): {
  arrowType: "filled" | "open" | "none" | "triangle";
  if (relationshipType === "include" || relationshipType === "extend") {
  }
    return { edgeStyle: "solid", arrowType: "triangle" };
  return { edgeStyle: "solid", arrowType: "none" };
