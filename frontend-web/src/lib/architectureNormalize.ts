import type {
  ArchitectureEdge,
  ArchitectureNode,
  GraphNode,
import { makeArchitectureDiagram } from "./diagramTypes";

  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
  }
}
function normalizeText(value: string): string {
}
function includesAny(text: string, tokens: string[]): boolean {
}
export type ArchitectureLayerBaseId =
  | "edge"
  | "api"
  | "data"
  | "external"

  const label = normalizeText(node.label);

    return "observability";
  if (includesAny(label, ["auth0", "okta", "cognito", "clerk", "stripe", "sendgrid", "twilio", "external api", "third party", "payment provider", "identity provider"])) {
  }
    return "messaging";
  if (type === "storage" || includesAny(label, ["postgres", "mysql", "database", "redis", "cache", "s3", "bucket", "blob", "bigquery", "redshift", "warehouse"])) {
  }
    return "api";
  if (includesAny(label, ["cdn", "cloudflare", "load balancer", "reverse proxy", "ingress", "edge"])) {
  }
    return "frontend";
  if (includesAny(label, ["user", "customer", "browser", "admin", "external client", "client"])) {
  }
    return "service";

  if (type === "input_output") return "external";
  if (type === "storage") return "data";
}
function inferRelationshipType(label: string | undefined, source: GraphNode, target: GraphNode): ArchitectureEdge["relationshipType"] {
  if (includesAny(combined, ["auth0", "okta", "cognito", "token", "jwt", "login", "oauth", "oidc"])) {
  }
    return "event_flow";
  if (source.type.toLowerCase() === "storage" || target.type.toLowerCase() === "storage" || includesAny(combined, ["query", "read", "write", "cache", "persist", "sync"])) {
  }
    return "external_api_call";
  if (includesAny(combined, ["dependency", "depends", "uses"])) {
  }
}
export function normalizeLegacyArchitectureGraph(diagram: GraphDiagram): ArchitectureDiagram {
  diagram.nodes.forEach((node) => {
    grouped.set(layer, [...(grouped.get(layer) ?? []), node]);

    .map((preset) => preset.baseId)

    const preset = ARCHITECTURE_LAYER_PRESETS.find((item) => item.baseId === baseId)!;
      id: `${baseId}_layer`,
      description: preset.description,
      height: DEFAULT_LAYER_HEIGHT,
      childNodeIds: [],
  });
  const nodes: ArchitectureNode[] = diagram.nodes.map((node) => {
    const layerId = layers.find((layer) => layer.id === `${baseId}_layer`)?.id ?? null;
      id: node.id,
      type: node.type,
      layout: { order: (grouped.get(baseId) ?? []).findIndex((item) => item.id === node.id) },
  });
  const nodeById = new Map(diagram.nodes.map((node) => [node.id, node]));
    .filter((edge) => nodeById.has(edge.source) && nodeById.has(edge.target))
      const source = nodeById.get(edge.source)!;
      const relationshipType = inferRelationshipType(edge.label, source, target);
        id: newArchitectureId("edge"),
        targetId: edge.target,
        ...relationshipDefaults(relationshipType),
      };

  nodes.forEach((node) => {
    childNodeIdsByLayer.set(node.layerId, [...(childNodeIdsByLayer.get(node.layerId) ?? []), node.id]);

    layer.childNodeIds = childNodeIdsByLayer.get(layer.id) ?? [];

}
