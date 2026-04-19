import type { DiagramModule } from "../types";

  id: "cloud_arch",
  isUml: false,
  components: [
    { type: "input_output", label: "Edge/API/External", description: "CDN, gateway, external API, or ingress edge." },
    { type: "storage", label: "Database / Cache / Object Store", description: "Persistent or cache data service." },
  ],
    { type: "request_flow", label: "Request Flow", direction: "directed", description: "Primary synchronous request path." },
    { type: "event_flow", label: "Event Flow", direction: "directed", description: "Asynchronous event publication/consumption." },
    { type: "dependency", label: "Dependency", direction: "directed", description: "Service dependency relation." },
  layoutRules: [
    "Keep main request path visually prominent.",
  ],
    "Allow layer/container grouping edits.",
    "Support orthogonal routing and endpoint reconnect.",
  aiGenerationRules: [
    "Differentiate sync request vs async event flows.",
  ],
    "Minimize crossing among main request edges.",
    "Use concise edge labels and avoid protocol noise everywhere.",
  validate: (diagram) => validateGraphAgainstRules(diagram, {
    allowedNodeTypes: ["actor", "input_output", "process", "storage", "queue"],
    allowedRelationshipTypes: ["request_flow", "data_flow", "event_flow", "auth_flow", "dependency"],
      request: "request_flow",
      api: "request_flow",
      query: "data_flow",
      write: "data_flow",
      async: "event_flow",
      auth: "auth_flow",
      jwt: "auth_flow",
      dependency: "dependency",
    minNodes: 5,
    maxEdgeToNodeRatio: 2.3,
};
