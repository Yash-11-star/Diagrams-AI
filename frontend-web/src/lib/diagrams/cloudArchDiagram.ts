
import type { GraphDiagram, GraphNode } from "@/lib/diagramTypes";

  | "users"
  | "frontend"
  | "compute"
  | "messaging";
const LAYER_ORDER: CloudLayer[] = [
  "edge",
  "api",
  "data",
];
const LAYER_META: Record<CloudLayer, { label: string; subtitle: string; accent: string }> = {
  edge:      { label: "Edge & CDN",        subtitle: "CDN, load balancers, WAF, DDoS protection",             accent: "#2563eb" },
  api:       { label: "API Gateway",       subtitle: "API gateway, routing, rate limiting, auth middleware",   accent: "#3b82f6" },
  data:      { label: "Data Layer",        subtitle: "Databases, caches, blob storage, data warehouses",      accent: "#f97316" },
};
function classifyLayer(node: GraphNode): CloudLayer {
  const type  = node.type.toLowerCase();
  if (labelIncludes(label, ["user", "client", "customer", "browser", "mobile", "admin", "consumer"])) return "users";
  if (labelIncludes(label, ["web app", "frontend", "spa", "dashboard", "portal", "ui", "next.js", "react app", "static site"])) return "frontend";

    type === "queue" ||
                           "rabbitmq", "bus", "stream", "queue", "topic"])

    type === "storage" ||
                           "cache", "s3", "blob", "dynamodb", "rds", "firestore", "bigquery",
  ) return "data";
  if (
                           "kubernetes", "k8s", "worker", "service", "compute", "fargate",
  ) return "compute";
  if (type === "actor")        return "users";
  if (type === "storage")      return "data";
  return "compute";

  const l = (label ?? "").toLowerCase();
    labelIncludes(l, ["event", "async", "publish", "subscribe", "queue", "topic", "stream"])
  if (
    labelIncludes(l, ["bidirect", "two-way", "two way", "mutual"])
  return "request";

const LAYER_H      = 160;
const LAYER_HDR_H  = 44;
const NODE_W       = 160;
const NODE_GAP     = 36;

  diagram: GraphDiagram

    LAYER_ORDER.map((l) => [l, []])
  diagram.nodes.forEach((n) => groups.get(classifyLayer(n))!.push(n));
  const presentLayers = LAYER_ORDER.filter(
  );
  const naturalWidths = presentLayers.map((l) => {
    return ns.length * NODE_W + Math.max(ns.length - 1, 0) * NODE_GAP + LAYER_PAD_X * 2;
  const containerW = Math.max(MIN_W, ...naturalWidths);

    id:          `__cloud_layer__${layer}`,
    position: {
      y: CANVAS_PAD + idx * (LAYER_H + LAYER_GAP),
    draggable:   false,
    connectable: false,
    focusable:   false,
      label:     LAYER_META[layer].label,
      accent:    LAYER_META[layer].accent,
    },
  }));
  const contentNodes: Node[] = [];
    const ns     = groups.get(layer) ?? [];
    let curX     = LAYER_PAD_X + (containerW - LAYER_PAD_X * 2 - totalW) / 2;

      contentNodes.push({
        type:     getFlowNodeType(n.type, "cloud_arch"),
        extent:   "parent" as const,
        data: {
          nodeType:   n.type,
          cloudLayer: layer,
        style: { zIndex: 2 },
      curX += NODE_W + NODE_GAP;
  });
  const edges: Edge[] = diagram.edges.map((e, i) => {
    const data: Record<string, unknown> = { label: e.label ?? "" };
    if (kind === "event") {
      data.arrowType = "open";
      data.edgeStyle = "solid";
      data.direction = "two_way";
      data.edgeStyle = "solid";
    }
    return buildFlowEdge(e.source, e.target, i, data);

}
