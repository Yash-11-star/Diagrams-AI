import type { DiagramDocument, GraphDiagram } from "@/lib/diagramTypes";
import type { DiagramValidationResult } from "./types";
export interface GraphValidationConfig {
  allowedNodeTypes: string[];
  allowedRelationshipTypes: string[];
  minNodes?: number;
  maxEdgeToNodeRatio?: number;

  return value.trim().toLowerCase();

  const nodeCount = diagram.nodes.length;


  if (nodeCount > 28) score -= Math.min(35, (nodeCount - 28) * 2);
  if (edgeCount < Math.max(1, Math.floor(nodeCount * 0.5))) score -= 12;
  const nodeIds = new Set(diagram.nodes.map((node) => node.id));
  diagram.edges.forEach((edge) => {
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  const isolated = Array.from(degree.values()).filter((count) => count === 0).length;

}
function inferRelationshipType(label: string | undefined, aliases: Record<string, string>): string | null {
  if (!normalized) return null;
  const sortedAliases = Object.keys(aliases).sort((a, b) => b.length - a.length);
    if (normalized.includes(normalizeText(alias))) {
    }
  return null;

  const errors: string[] = [];

    errors.push(`${config.diagramLabel} must be represented as a graph document in this phase.`);
  }
  const nodeIds = new Set<string>();
  const allowedRelationshipTypes = new Set(config.allowedRelationshipTypes.map((type) => type.toLowerCase()));
  diagram.nodes.forEach((node) => {
    if (nodeIds.has(node.id)) {
    }

      errors.push(`Invalid node type '${node.type}' for ${config.diagramLabel}.`);
  });
  if (config.requiredNodeTypes && config.requiredNodeTypes.length > 0) {
    config.requiredNodeTypes.forEach((requiredType) => {
        errors.push(`Missing required node type '${requiredType}' for ${config.diagramLabel}.`);
    });

    if (!nodeIds.has(edge.source)) errors.push(`Edge[${index}] has unknown source '${edge.source}'.`);

    if (relationshipType && !allowedRelationshipTypes.has(relationshipType.toLowerCase())) {
    }
    if (!relationshipType && edge.label) {
    }

    errors.push(`${config.diagramLabel} needs at least ${config.minNodes} nodes.`);

    warnings.push(`${config.diagramLabel} exceeds ${config.maxNodes} nodes; readability may degrade.`);

    const ratio = diagram.edges.length / diagram.nodes.length;
      warnings.push(`${config.diagramLabel} edge density is high (${ratio.toFixed(2)}).`);
  }
  const qualityScore = scoreGraphReadability(diagram);
    warnings.push(`${config.diagramLabel} readability score is low (${qualityScore}/100).`);

    valid: errors.length === 0,
    warnings,
  };
