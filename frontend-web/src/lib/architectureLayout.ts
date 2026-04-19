import { Position, type Edge, type Node } from "@xyflow/react";
  ArchitectureDiagram,
  ArchitectureLayer,
  ArchitectureRelationshipType,

  canvasWidth: 1240,
  rightPadding: 56,
  bottomPadding: 48,
  layerHeaderHeight: 48,
  layerInnerBottom: 26,
  nodeVerticalOffset: 24,

  layer: ArchitectureLayer;
  height: number;
}
export interface ArchitectureNodeFrame {
  layer: ArchitectureLayer | null;
  y: number;
  height: number;
  centerY: number;

  width: number;
  layerFrames: ArchitectureLayerFrame[];
}
export function architectureNodeSize(type: string): { width: number; height: number } {
    case "actor":
    case "storage":
    case "queue":
    case "input_output":
    default:
  }

  source: ArchitectureNodeFrame,
): {
  targetSide: "top" | "bottom" | "left" | "right";
  const sourceLayerOrder = source.layer?.order ?? -1;

    return source.centerX <= target.centerX
      : { sourceSide: "left", targetSide: "right" };

    ? { sourceSide: "bottom", targetSide: "top" }
}
function slotCount(side: "top" | "bottom" | "left" | "right"): number {
}
function slotId(role: "source" | "target", side: "top" | "bottom" | "left" | "right", slot: number): string {
}
function sortLayerNodes(nodes: ArchitectureNode[]): ArchitectureNode[] {
    const aOrder = a.layout?.order ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
  });

  selectedLayerId?: string | null;
  selectedEdgeId?: string | null;
  onLayerDescriptionChange?: (layerId: string, description: string) => void;
  onNodeLabelChange?: (nodeId: string, label: string) => void;

  diagram: ArchitectureDiagram,
): { nodes: Node[]; edges: Edge[]; layout: ArchitectureFlowLayout } {
  const nodeFrames = new Map<string, ArchitectureNodeFrame>();
  const layerById = new Map(orderedLayers.map((layer) => [layer.id, layer]));
  let currentY = ARCHITECTURE_LAYOUT.topPadding;
    layerFrames.push({
      top: currentY,
      bottom: currentY + layer.height,
    currentY += layer.height + ARCHITECTURE_LAYOUT.layerGap;

  const unassignedTop = canvasHeight;
  orderedLayers.forEach((layer) => {
    const layerNodes = sortLayerNodes(diagram.nodes.filter((node) => node.layerId === layer.id));
      + Math.max(layerNodes.length - 1, 0) * ARCHITECTURE_LAYOUT.nodeGap;
      + Math.max(0, (ARCHITECTURE_LAYOUT.canvasWidth - ARCHITECTURE_LAYOUT.leftPadding - ARCHITECTURE_LAYOUT.rightPadding - totalWidth) / 2);
    layerNodes.forEach((node) => {
      const x = cursorX + (node.layout?.offsetX ?? 0);
      nodeFrames.set(node.id, {
        layer,
        y,
        height: size.height,
        centerY: y + size.height / 2,
      cursorX += size.width + ARCHITECTURE_LAYOUT.nodeGap;
  });
  const unassignedNodes = sortLayerNodes(diagram.nodes.filter((node) => !node.layerId));
    let cursorX = ARCHITECTURE_LAYOUT.leftPadding;
      const size = architectureNodeSize(node.type);
        node,
        x: cursorX,
        width: size.width,
        centerX: cursorX + size.width / 2,
      });
    });

    ...layerFrames.map((frame) => ({
      type: "architectureLayerNode",
      data: {
        label: frame.layer.name,
        style: frame.layer.style,
        onDescriptionChange: options.onLayerDescriptionChange,
      },
      draggable: false,

      style: {
        height: frame.layer.height,
    })),
      const frame = nodeFrames.get(node.id)!;
        id: node.id,
          ? "diamondNode"
          ? "actorNode"
          ? "storageNode"
          ? "queueNode"
          ? "ioNode"
        position: { x: frame.x, y: frame.y },
          label: node.label,
          diagramType: "system_arch",
        },
        sourcePosition: Position.Bottom,

      };
  ];
  const slotState = new Map<string, number>();
    const sourceFrame = nodeFrames.get(edge.sourceId);
    if (!sourceFrame || !targetFrame) {
        id: edge.id,
        target: edge.targetId,
        type: "architectureEdge",
    }
    const { sourceSide, targetSide } = handleSideForEdge(sourceFrame, targetFrame);
    const targetSlotKey = `${edge.targetId}:${targetSide}:target`;
    const targetSlot = (slotState.get(targetSlotKey) ?? 0) % slotCount(targetSide) + 1;
    slotState.set(targetSlotKey, (slotState.get(targetSlotKey) ?? 0) + 1);
    return {
      source: edge.sourceId,
      sourceHandle: edge.sourceHandle ?? slotId("source", sourceSide, sourceSlot),
      type: "architectureEdge",
      data: {
        label: edge.label,
        routingMode: edge.routing.mode,
        dashed: edge.style.dashed,
      },
  });
  return {
    edges,
      width: ARCHITECTURE_LAYOUT.canvasWidth,
      layerFrames,
    },
}
export function relationshipKindFromType(type: ArchitectureRelationshipType): string {
    case "event_flow":
      return "event";
      return "auth";
      return "external";
      return "secondary";
      return "primary";
}
