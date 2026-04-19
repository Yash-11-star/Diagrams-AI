import type {
  ArchitectureEdge,
  ArchitectureRelationshipType,
} from "./diagramTypes";
export const ARCHITECTURE_LAYER_PRESETS = [
    baseId: "client",
    description: "Users, admins, and external clients",
  },
    baseId: "edge",
    description: "CDN, WAF, and traffic entry points",
  },
    baseId: "frontend",
    description: "Web, mobile, and dashboard interfaces",
  },
    baseId: "api",
    description: "API Gateway, BFF, and edge APIs",
  },
    baseId: "service",
    description: "Business services and internal workers",
  },
    baseId: "data",
    description: "Transactional, cache, and analytical storage",
  },
    baseId: "messaging",
    description: "Streams, queues, and event buses",
  },
    baseId: "external",
    description: "Identity, payments, comms, and third-party APIs",
  },
    baseId: "observability",
    description: "Monitoring, logging, tracing, and alerting",
  },


  value: ArchitectureRelationshipType;
  hint: string;
  { value: "request_flow", label: "Request Flow", hint: "Primary synchronous request/response path" },
  { value: "event_flow", label: "Event Flow", hint: "Asynchronous event or stream" },
  { value: "dependency", label: "Dependency", hint: "Static or runtime dependency" },
  { value: "sync_call", label: "Sync Call", hint: "Synchronous service call" },
  { value: "external_api_call", label: "External API Call", hint: "Outbound call to third-party service" },

  token: ArchitectureStyleToken;
  arrowhead: "filled" | "open" | "none";
  label: string;
};
export const RELATIONSHIP_PRESETS: Record<ArchitectureRelationshipType, RelationshipPreset> = {
    token: "primary",
    arrowhead: "filled",
    label: "Request",
  },
    token: "secondary",
    arrowhead: "filled",
    label: "Data Flow",
  },
    token: "event",
    arrowhead: "filled",
    label: "Event",
  },
    token: "auth",
    arrowhead: "open",
    label: "Auth",
  },
    token: "secondary",
    arrowhead: "open",
    label: "Dependency",
  },
    token: "event",
    arrowhead: "filled",
    label: "Async Message",
  },
    token: "primary",
    arrowhead: "filled",
    label: "Sync Call",
  },
    token: "primary",
    arrowhead: "filled",
    label: "Internal Call",
  },
    token: "external",
    arrowhead: "filled",
    label: "External API Call",
  },

  const preset = ARCHITECTURE_LAYER_PRESETS.find((item) => item.baseId === baseId) ?? ARCHITECTURE_LAYER_PRESETS[order] ?? ARCHITECTURE_LAYER_PRESETS[0];
    id: `${preset.baseId}_layer`,
    description: preset.description,
    height: DEFAULT_LAYER_HEIGHT,
    childNodeIds: [],
}
export function relationshipDefaults(type: ArchitectureRelationshipType): Pick<ArchitectureEdge, "direction" | "label" | "routing" | "style"> {
  return {
    label: preset.label,
    style: {
      dashed: preset.dashed,
    },
}
