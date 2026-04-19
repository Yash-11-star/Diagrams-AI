import type {
  ArchitectureEdge,
  ArchitectureNode,
} from "./diagramTypes";
import { newArchitectureId } from "./architectureNormalize";
export function cloneArchitecture(diagram: ArchitectureDiagram): ArchitectureDiagram {
}
function reorder<T extends { id: string; order: number }>(items: T[], id: string, direction: -1 | 1): T[] {
  const index = sorted.findIndex((item) => item.id === id);
  const targetIndex = Math.max(0, Math.min(sorted.length - 1, index + direction));
  const [item] = sorted.splice(index, 1);
  return sorted.map((entry, order) => ({ ...entry, order }));

  const nextOrder = diagram.layers.length;
  layer.id = newArchitectureId("layer");
  return {
    layers: [...diagram.layers, layer],
}
export function updateArchitectureLayer(diagram: ArchitectureDiagram, layerId: string, patch: Partial<ArchitectureLayer>): ArchitectureDiagram {
    ...diagram,
  };

  return {
    layers: reorder(diagram.layers, layerId, direction),
}
export function deleteArchitectureLayer(diagram: ArchitectureDiagram, layerId: string): ArchitectureDiagram {
  const index = sortedLayers.findIndex((layer) => layer.id === layerId);

    node.layerId === layerId ? { ...node, layerId: fallbackLayerId } : node
  const nodesByLayer = new Map<string | null, ArchitectureNode[]>();
    nodesByLayer.set(node.layerId ?? null, [...(nodesByLayer.get(node.layerId ?? null) ?? []), node]);
  const nodes = preliminaryNodes.map((node) => {
    return {
      layout: { ...node.layout, order: siblings.findIndex((candidate) => candidate.id === node.id) },
  });
  const layers = sortedLayers
    .map((layer, order) => ({ ...layer, order }));
  return syncLayerChildren({
    layers,
  });

  return syncLayerChildren({
    nodes: diagram.nodes.map((node) => (node.id === nodeId ? { ...node, ...patch } : node)),
}
export function moveArchitectureNodeToLayer(
  nodeId: string,
  order?: number,
  const next = {
    nodes: diagram.nodes.map((node) =>
        ? {
            layerId,
          }
    ),
  return syncLayerChildren(next);

  diagram: ArchitectureDiagram,
  targetId: string,
  overrides: Partial<ArchitectureEdge> = {},
  const defaults = relationshipDefaults(relationshipType);
    id: overrides.id ?? newArchitectureId("edge"),
    targetId,
    sourceHandle: overrides.sourceHandle,
    label: overrides.label ?? defaults.label,
    routing: overrides.routing ?? defaults.routing,
    protocol: overrides.protocol,
    notes: overrides.notes,

    ...diagram,
  };

  return {
    edges: diagram.edges.map((edge) => {
      const nextType = patch.relationshipType ?? edge.relationshipType;
        ? relationshipDefaults(nextType)
      const shouldReplaceLabel = !!typeDefaults && (!edge.label || edge.label === relationshipDefaults(edge.relationshipType).label);
        ...edge,
        ...patch,
    }),
}
export function reconnectArchitectureEdge(
  edgeId: string,
  targetId: string,
  targetHandle?: string,
  return {
    edges: diagram.edges.map((edge) =>
        ? { ...edge, sourceId, targetId, sourceHandle, targetHandle }
    ),
}
export function deleteArchitectureEdge(diagram: ArchitectureDiagram, edgeId: string): ArchitectureDiagram {
    ...diagram,
  };

  const childNodeIdsByLayer = new Map<string, string[]>();
    if (!node.layerId) return;
  });
  return {
    layers: diagram.layers.map((layer) => ({
      childNodeIds: childNodeIdsByLayer.get(layer.id) ?? [],
  };
