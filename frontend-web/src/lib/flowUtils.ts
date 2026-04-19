import dagre from "@dagrejs/dagre";
import type { GraphDiagram, GraphNode } from "./diagramTypes";
import {
  parseMethodString, serializeMethod,
} from "./classTypes";
  parseClassRelType, REL_TYPE_LABEL,
} from "@/components/dashboard/edges/CustomEdges";
import { buildUseCaseDiagramFlow }    from "./diagrams/useCaseDiagram";
import { buildCICDPipelineFlow }       from "./diagrams/cicdPipeline";
import { buildDeploymentDiagramFlow }  from "./diagrams/deploymentDiagram";
import { buildNetworkDiagramFlow }     from "./diagrams/networkDiagram";
import { buildUserFlowDiagramFlow }    from "./diagrams/userFlowDiagram";
const NODE_W = 160;

const TABLE_HEADER_H = 40;

  const count = fields?.length ?? 0;
}
const CLASS_W = 220;
const CLASS_SECTION_H = 22;
const CLASS_FOOTER_H = 26;
function classNodeHeight(attrCount: number, methodCount: number): number {
  const methodSection = CLASS_SECTION_H + Math.max(methodCount, 1) * CLASS_ROW_H + CLASS_FOOTER_H;
}
const CLASS_NODE_TYPES = new Set(["classNode", "interfaceNode", "abstractNode", "enumNode"]);



function splitCommaRespectingParens(s: string): string[] {
  let depth = 0;
  for (const ch of s) {
    else if (ch === ")") { depth--; current += ch; }
      if (current.trim()) result.push(current.trim());
    } else { current += ch; }
  if (current.trim()) result.push(current.trim());
}

  const t = raw.trim();
  if (!/[:|()\n,]/.test(t)) return t || "Class";
  const m = t.match(/^([A-Za-z_$][A-Za-z0-9_$<>]*)/);
}

  label: string,
  existingMethods: string[]

    return { name: cleanClassName(label), fields: existingFields, methods: existingMethods };

  if (!isMalformed) {
  }
  let name = label.trim();

  if (dashIdx !== -1) {
    memberStr = label.slice(dashIdx + 3);

    const m = label.match(/^([A-Za-z_$][A-Za-z0-9_$<>]*)\s*[,|:\n(]/);
      name = m[1];
      memberStr = label.slice(m[1].length).replace(/^\s*[,:]\s*/, "");

    }

  const members: string[] = [];
    members.push(...splitCommaRespectingParens(seg));

  const methods: string[] = [];
    const t = raw.trim();
    if (t.includes("(")) methods.push(t);
  }
  return { name: cleanClassName(name), fields, methods };

  const t = irType.toLowerCase();
  if (diagramType === "erd") return "tableNode";
  if (diagramType === "use_case") {
    if (t === "use_case" || t === "input_output") return "useCaseNode";
    return "useCaseNode";

    if (t === "class")     return "classNode";
    if (t === "abstract")  return "abstractNode";

    if (t === "actor")   return "interfaceNode";
    return "classNode";

    case "decision":     return "diamondNode";
    case "end":          return "endNode";
    case "storage":      return "storageNode";
    case "queue":        return "queueNode";
  }

  | "client"
  | "frontend"
  | "service"
  | "messaging"
  | "observability";
interface SystemArchPlacement {
  flowType: string;
  height: number;
  layerIndex: number;
  y: number;
  centerY: number;

  "client",
  "frontend",
  "service",
  "messaging",
  "observability",

  client: {
    subtitle: "Users, admins, and external clients",
  },
    label: "Edge Layer",
    accent: "#2563eb",
  frontend: {
    subtitle: "Web, mobile, and dashboard entry points",
  },
    label: "API Layer",
    accent: "#3b82f6",
  service: {
    subtitle: "Microservices and business capabilities",
  },
    label: "Data Layer",
    accent: "#f97316",
  messaging: {
    subtitle: "Streams, queues, and asynchronous delivery",
  },
    label: "External Services Layer",
    accent: "#8b5cf6",
  observability: {
    subtitle: "Metrics, logging, tracing, and alerting",
  },

const SYSTEM_CANVAS_PAD_Y = 36;
const SYSTEM_LAYER_HEIGHT = 170;
const SYSTEM_LAYER_PAD_X = 28;

  "http", "https", "rest", "grpc", "ws", "wss", "websocket",
  "ssl", "graphql", "rpc", "json", "internal",

  "client",
  "frontend",
  "service",
];
function normalizeSystemText(value: string): string {
}
function includesAny(text: string, tokens: string[]): boolean {
}
function architectureNodeSize(node: GraphNode): { width: number; height: number } {
  switch (flowType) {
      return { width: 132, height: 60 };
      return { width: 156, height: 82 };
      return { width: 170, height: 60 };
      return { width: 168, height: 56 };
      return { width: 182, height: 62 };
}
function classifySystemArchLayer(node: GraphNode): SystemArchLayerId {
  const type = node.type.toLowerCase();
  if (includesAny(label, ["monitor", "logging", "observability", "metric", "trace", "grafana", "datadog", "prometheus", "elk", "cloudwatch", "telemetry"])) {
  }
    return "external";
  if (type === "queue" || includesAny(label, ["kafka", "rabbitmq", "event bus", "message bus", "pub sub", "broker", "stream"])) {
  }
    return "data";
  if (includesAny(label, ["api gateway", "bff", "backend for frontend", "graphql gateway", "gateway"])) {
  }
    return "edge";
  if (includesAny(label, ["web app", "mobile app", "admin dashboard", "dashboard", "frontend", "client app", "portal", "spa", "ui"])) {
  }
    return "client";
  if (includesAny(label, ["service", "worker", "processor", "engine", "notification", "analytics", "catalog", "product", "order", "cart", "payment", "search"])) {
  }
  if (type === "actor") return "client";
  if (type === "storage") return "data";
  return "service";

  const label = normalizeSystemText(node.label);
    client: ["user", "customer", "browser", "admin", "external client"],
    frontend: ["web app", "mobile app", "admin dashboard", "dashboard", "frontend"],
    service: ["user service", "product service", "catalog service", "cart service", "order service", "payment service", "notification service", "analytics service", "search service"],
    messaging: ["kafka", "rabbitmq", "event bus", "queue"],
    observability: ["monitor", "logging", "tracing", "alert"],

  return exact === -1 ? 100 : exact;

  const label = normalizeSystemText(edge.label ?? "");
  const targetLabel = normalizeSystemText(target.node.label);

    return "observability";
  if (source.layer === "messaging" || target.layer === "messaging" || includesAny(label, ["event", "queue", "topic", "publish", "consume", "stream", "notify"])) {
  }
  if (source.layer === "external" || target.layer === "external") return "external";
  const sourceIndex = SYSTEM_PRIMARY_SEQUENCE.indexOf(source.layer);
  if (sourceIndex !== -1 && targetIndex === sourceIndex + 1) {
  }
}
function isProtocolOnlyLabel(label?: string): boolean {
  const tokens = normalizeSystemText(label).split(" ").filter(Boolean);
  return tokens.every((token) => SYSTEM_PROTOCOL_TOKENS.has(token));

  return label.replace(/\b(service|server|worker|processor|engine)\b/gi, "").replace(/\s+/g, " ").trim();

  edge: { label?: string },
  source: SystemArchPlacement,
): string {

    if (source.layer === "frontend" && target.layer === "external") return "Login Request";
    if ((source.layer === "api" || source.layer === "service") && target.layer === "external") return "Token Validation";
  }
  if (kind === "event") {
    if (source.layer === "messaging") return `${cleanedServiceName(target.node.label) || target.node.label} Trigger`;

    return "Metrics / Logs";

}
function systemArchitectureHandles(
  target: SystemArchPlacement,
  sourceSide: "top" | "bottom" | "left" | "right";
} {
    return source.centerX <= target.centerX
      : { sourceSide: "left", targetSide: "right" };

    ? { sourceSide: "bottom", targetSide: "top" }
}
function slotId(role: "source" | "target", side: "top" | "bottom" | "left" | "right", slot: number): string {
}
function buildSystemArchitectureFlow(diagram: GraphDiagram): { nodes: Node[]; edges: Edge[] } {
  SYSTEM_LAYER_ORDER.forEach((layer) => placementsByLayer.set(layer, []));
  const nodesById = new Map(diagram.nodes.map((node) => [node.id, node]));
  diagram.nodes.forEach((node) => adjacency.set(node.id, []));
    adjacency.get(edge.source)?.push(edge.target);
  });
  diagram.nodes.forEach((node) => {
    const flowType = getFlowNodeType(node.type, "system_arch");
    placementsByLayer.get(layer)?.push({
      flowType,
      height,
      layerIndex: SYSTEM_LAYER_ORDER.indexOf(layer),
      y: 0,
      centerY: 0,
  });
  const presentLayers = SYSTEM_LAYER_ORDER.filter((layer) => (placementsByLayer.get(layer)?.length ?? 0) > 0);

    const placements = placementsByLayer.get(layer) ?? [];
      + Math.max(placements.length - 1, 0) * SYSTEM_NODE_GAP
  });
  const containerX = SYSTEM_CANVAS_PAD_X;
  presentLayers.forEach((layer) => {
    placements.sort((a, b) => {
      const bNeighbors = adjacency.get(b.node.id) ?? [];
      const bKnown = bNeighbors.map((id) => orderedCenters.get(id)).filter((value): value is number => typeof value === "number");
      const bBary = bKnown.length ? bKnown.reduce((sum, value) => sum + value, 0) / bKnown.length : Number.POSITIVE_INFINITY;
      const bPriority = systemLayerPriority(b.node, layer);
      if (Number.isFinite(aBary) && Number.isFinite(bBary) && aBary !== bBary) return aBary - bBary;
      return a.node.label.localeCompare(b.node.label);

    const totalNodeWidth = placements.reduce((sum, placement) => sum + placement.width, 0) + Math.max(placements.length - 1, 0) * SYSTEM_NODE_GAP;

      const relativeX = cursor;
      placement.x = relativeX;
      placement.centerX = containerX + relativeX + placement.width / 2;
      orderedCenters.set(placement.node.id, placement.centerX);
    });

  presentLayers.forEach((layer) => {
  });
  const layerNodes: Node[] = presentLayers.map((layer, index) => ({
    type: "layerNode",
      x: containerX,
    },
    selectable: false,
    deletable: false,
    data: {
      subtitle: SYSTEM_LAYER_META[layer].subtitle,
      decorative: true,
    style: {
      height: SYSTEM_LAYER_HEIGHT,
    },

    (placementsByLayer.get(layer) ?? []).map((placement) => ({
      type: placement.flowType,
      extent: "parent",
      sourcePosition: Position.Bottom,
      data: {
        nodeType: placement.node.type,
        layer,
      style: { zIndex: 2 },
  );
  const slotState = new Map<string, number>();
    const source = placementById.get(edge.source);
    if (!source || !target) {
        id: `e-${index}-${edge.source}-${edge.target}`,
        target: edge.target,
        type: "smoothstep",
      };

    const displayLabel = systemArchitectureEdgeLabel(edge, kind, source, target);

    const targetSlotKey = `${edge.target}:target:${targetSide}`;
    const targetSlotCount = targetSide === "left" || targetSide === "right" ? 2 : 3;
    const targetSlot = (slotState.get(targetSlotKey) ?? 0) % targetSlotCount + 1;
    slotState.set(targetSlotKey, (slotState.get(targetSlotKey) ?? 0) + 1);
    return {
      source: edge.source,
      sourceHandle: slotId("source", sourceSide, sourceSlot),
      type: "architectureEdge",
        kind,
      } as ArchitectureEdgeData,
    };

}
export function irToFlow(
  diagramType?: string

  if (diagramType === "use_case")     return buildUseCaseDiagramFlow(diagram);
  if (diagramType === "cicd")         return buildCICDPipelineFlow(diagram);
  if (diagramType === "deployment")   return buildDeploymentDiagramFlow(diagram);
  if (diagramType === "network")      return buildNetworkDiagramFlow(diagram);
  if (diagramType === "user_flow")    return buildUserFlowDiagramFlow(diagram);
  const g = new dagre.graphlib.Graph();

  const isClass = diagramType === "class";

  if (isClass) {
      const dn = n as GraphNode;
        n.id,
      );
  }
  if (isErd) {
    diagram.nodes.forEach((n) => {
      g.setNode(n.id, { width: TABLE_W, height: h });
  } else if (isClass) {
    diagram.nodes.forEach((n) => {
      g.setNode(n.id, { width: CLASS_W, height: classNodeHeight(r.fields.length, r.methods.length) });
  } else {
    g.setGraph({ rankdir: "TB", ranksep: 80, nodesep: 50, marginx: 40, marginy: 40 });
      const isDecision = n.type.toLowerCase() === "decision";
    });

  dagre.layout(g);
  const nodes: Node[] = diagram.nodes.map((n) => {
    let w: number, h: number;
    if (isErd) {
      w = TABLE_W;
      const parsedFields: ERDField[] = rawFields.map((f, i) =>
      );
        id: n.id,
        position: { x: pos.x - w / 2, y: pos.y - h / 2 },
          label: n.label,
          fields: parsedFields,
        },
    } else if (isClass) {

      const kind: ClassKind = VALID_CLASS_KINDS.has(rawKind)
        : "class";
      const nodeType =
        kind === "abstract"  ? "abstractNode"  :
        "classNode";
      w = CLASS_W;
      const parsedAttrs: ClassAttribute[] = r.fields.map((a, i) => parseAttributeString(a, i));

        id: n.id,
        position: { x: pos.x - w / 2, y: pos.y - h / 2 },
          label: r.name,
          classKind: kind,
          methods: parsedMethods,
      };
      const isDecision = n.type.toLowerCase() === "decision";
      h = isDecision ? 80 : NODE_H;
        id: n.id,
        position: { x: pos.x - w / 2, y: pos.y - h / 2 },
      };
  });
  const edges: Edge[] = diagram.edges.map((e, i) => {

      const edgeData: UMLEdgeData = {
        sourceMultiplicity: "",
        label: "",
      return {
        source: e.source,
        type: "umlEdge",
      };

      ?? (
          ? /include/i.test(e.label ?? "")
            : /extend/i.test(e.label ?? "")
            : /generalization|inherit/i.test(e.label ?? "")
            : "association"
      );
    const edgeStyle = e.edgeStyle
    const arrowType = e.arrowType
        ? "none"
        ? "triangle"
        ? "open"

      id: `e-${i}-${e.source}-${e.target}`,
      target: e.target,
      data: {
        relationshipType,
        arrowType,
        routingMode: e.routingMode ?? (diagramType === "use_case" ? "straight" : "smooth"),
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
  });
  return { nodes, edges };

  const serializableNodes = nodes.filter((node) => node.type !== "layerNode" && !(node.data as { decorative?: boolean } | undefined)?.decorative);
  return {
    nodes: serializableNodes.map((n) => {
      if (CLASS_NODE_TYPES.has(n.type ?? "")) {
        return {
          label: d.label,
          fields: d.attributes?.map(serializeAttribute),
        };

      const fields = d.fields?.map((f) =>
      );
        id: n.id,
        type: d.nodeType ?? "process",
      };
    edges: edges.map((e) => {
      if (e.type === "umlEdge") {
        const relType: UMLRelType = d.relationshipType ?? "association";
        return { source: e.source, target: e.target, label };
      const d = (e.data ?? {}) as {
        relationshipType?: string;
        arrowType?: "filled" | "open" | "none" | "triangle";
        routingMode?: "smooth" | "straight";
      let label = (d.label || (e.label as string)) || undefined;
        if (d.relationshipType === "include") label = "<<include>>";
        else if (d.relationshipType === "generalization") label = "generalization";
      return {
        target: e.target,
        relationshipType: d.relationshipType || undefined,
        arrowType: d.arrowType,
        routingMode: d.routingMode,
    }),
}
