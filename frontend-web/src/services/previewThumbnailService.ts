
import type { Edge, Node } from "@xyflow/react";
import { isArchitectureDiagram, isSequenceDiagram } from "@/lib/diagramTypes";
import { irToFlow } from "@/lib/flowUtils";
import { normalizeLegacyArchitectureGraph } from "@/lib/architectureNormalize";
const NODE_W   = 80;
const THUMB_W  = 200;
const PAD      = 12;
const NODE_COLORS: Record<string, string> = {
  interface: "#dbeafe",
  enum:      "#fef3c7",
  weak:      "#f1f5f9",
  process:   "#f1f5f9",
  start:     "#dbeafe",
  default:   "#f1f5f9",
const NODE_STROKE: Record<string, string> = {
  interface: "#93c5fd",
  enum:      "#fcd34d",
  decision:  "#fde047",
  end:       "#4ade80",
};
function nodeColor(type: string): { fill: string; stroke: string } {
  return {
    stroke: NODE_STROKE[t] ?? NODE_STROKE.default,
}
function previewNodeSize(node: Node): { width: number; height: number } {
    const style = (node.style ?? {}) as { width?: number | string; height?: number | string };
      width: typeof style.width === "number" ? style.width : Number(style.width ?? 0),
    };

    case "useCaseBoundaryNode":
        width: typeof (node.style as { width?: number | string } | undefined)?.width === "number"
          : Number((node.style as { width?: number | string } | undefined)?.width ?? 720),
          ? ((node.style as { height?: number }).height ?? 420)
      };
      return { width: 196, height: 72 };
      if ((node.data as { diagramType?: string } | undefined)?.diagramType === "use_case") {
      }
    case "storageNode":
    case "queueNode":
    case "ioNode":
    default:
  }

  if (!node.parentId) return node.position;
  if (!parent) return node.position;
    x: parent.position.x + node.position.x,
  };

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const size = previewNodeSize(node);
    return {
      width: size.width,
      x: pos.x,
    };

  const minY = Math.min(...decoratedNodes.map((item) => item.y)) - PAD;
  const maxY = Math.max(...decoratedNodes.map((item) => item.y + item.height)) + PAD;
  const graphH = maxY - minY || 1;

  function ty(y: number) { return PAD + (y - minY) * scale; }
  const layerRects = decoratedNodes
    .map((item) => {
      const y = ty(item.y);
      const h = item.height * scale;
    })

    const source = decoratedNodes.find((item) => item.node.id === edge.source);
    if (!source || !target) return "";
    const y1 = ty(source.y + source.height / 2);
    const y2 = ty(target.y + target.height / 2);
  }).join("");
  const nodeRects = decoratedNodes
    .map((item) => {
      const y = ty(item.y);
      const h = item.height * scale;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="0.9"/>`;
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${THUMB_W}" height="${THUMB_H}" viewBox="0 0 ${THUMB_W} ${THUMB_H}">
  ${layerRects}
  ${nodeRects}
}
function generateUseCasePreviewFromFlow(nodes: Node[], edges: Edge[]): string {
  const decoratedNodes = nodes.map((node) => {
    const pos = absolutePreviewPosition(node, nodeMap);
      node,
      height: size.height,
      y: pos.y,
  });
  const minY = Math.min(...decoratedNodes.map((item) => item.y)) - PAD;
  const maxY = Math.max(...decoratedNodes.map((item) => item.y + item.height)) + PAD;
  const graphH = maxY - minY || 1;

  function ty(y: number) { return PAD + (y - minY) * scale; }
  const boundaries = decoratedNodes
    .map((item) => {
      const y = ty(item.y);
      const h = item.height * scale;
    })

    const source = decoratedNodes.find((item) => item.node.id === edge.source);
    if (!source || !target) return "";
    const x1 = tx(source.x + source.width / 2);
    const x2 = tx(target.x + target.width / 2);
    const dashed = edgeData.edgeStyle === "dashed" || edgeData.relationshipType === "include" || edgeData.relationshipType === "extend";
  }).join("");
  const actorNodes = decoratedNodes
    .map((item) => {
      const top = ty(item.y);
      const legY = top + item.height * scale * 0.9;
      return `
        <line x1="${cx.toFixed(1)}" y1="${(top + 11.5).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${mid.toFixed(1)}" stroke="#0f172a" stroke-width="1"/>
        <line x1="${cx.toFixed(1)}" y1="${mid.toFixed(1)}" x2="${(cx - 6).toFixed(1)}" y2="${legY.toFixed(1)}" stroke="#0f172a" stroke-width="1"/>
      `;
    .join("");
  const useCaseNodes = decoratedNodes
    .map((item) => {
      const cy = ty(item.y + item.height / 2);
      const ry = (item.height * scale) / 2;
    })

  <rect width="${THUMB_W}" height="${THUMB_H}" fill="#f8fafc" rx="6"/>
  ${edgeLines}
  ${actorNodes}
}
function generateSystemArchitecturePreviewSVG(graph: GraphDiagram): string {
  const { nodes, edges } = buildArchitectureFlow(architecture);
}
function generateArchitectureThumbnailSVG(diagram: Extract<DiagramDocument, { kind: "architecture" }>): string {
  const { nodes, edges } = buildArchitectureFlow(diagram);
}
export function generatePreviewSVG(ir: DiagramDocument, diagramType: string): string {
    return generateSequenceThumbnailSVG(ir);

    return generateArchitectureThumbnailSVG(ir);



    return generateSystemArchitecturePreviewSVG(graph);

    const { nodes, edges } = irToFlow(graph, diagramType);
  }
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    ranksep: 30,
    marginx: PAD,
  });
  graph.nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  dagre.layout(g);
  const xs = graph.nodes.map((n) => g.node(n.id)?.x ?? 0);
  const minX = Math.min(...xs) - NODE_W / 2 - PAD;
  const maxX = Math.max(...xs) + NODE_W / 2 + PAD;
  const graphW = maxX - minX || 1;


  function ty(y: number) { return PAD + (y - minY) * scale; }
  const nw = NODE_W * scale;

    const src = g.node(e.source);
    if (!src || !tgt) return "";
    const x2 = tx(tgt.x); const y2 = ty(tgt.y);
  }).join("");
  const nodeRects = graph.nodes.map((n) => {
    if (!pos) return "";
    const y = ty(pos.y) - nh / 2;
    const isDecision = n.type.toLowerCase() === "decision";
    const fontSize = Math.max(5, Math.min(7, nh * 0.45));
    const cy = (y + nh / 2).toFixed(1);
    if (isDecision) {
      const mx = parseFloat(cx); const my = parseFloat(cy);
        <polygon points="${mx},${my - hh} ${mx + hw},${my} ${mx},${my + hh} ${mx - hw},${my}"
        <text x="${cx}" y="${(parseFloat(cy) + fontSize * 0.35).toFixed(1)}"
    }
    return `
        rx="2" fill="${fill}" stroke="${stroke}" stroke-width="0.8"/>
        text-anchor="middle" font-size="${fontSize}" fill="#374151" font-family="sans-serif">${_esc(label)}</text>`;

  <rect width="${THUMB_W}" height="${THUMB_H}" fill="#f8fafc" rx="6"/>
  ${nodeRects}
}
function _emptySVG(): string {
  <rect width="${THUMB_W}" height="${THUMB_H}" fill="#f8fafc" rx="6"/>
</svg>`;

  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
