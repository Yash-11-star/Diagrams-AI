import type { DiagramModule } from "../types";

  id: "user_flow",
  isUml: false,
  components: [
    { type: "process", label: "Screen", description: "UI screen or major interaction state." },
    { type: "decision", label: "Decision", description: "Branching condition." },
  ],
    { type: "navigation", label: "Navigation", direction: "directed", description: "Primary transition between states." },
  ],
    "Keep a single dominant direction for progression.",
    "Merge branches cleanly before completion when appropriate.",
  editingRules: [
    "Allow conversion between screen and action nodes.",
  ],
    "Model the flow as user-visible states and transitions.",
    "Limit technical backend nodes unless explicitly requested.",
  readabilityRules: [
    "Use short labels for screens and actions.",
  ],
    diagramLabel: "User Flow",
    requiredNodeTypes: ["start", "end", "process"],
    relationshipAliases: {
      next: "navigation",
      branch: "branch",
      no: "branch",
    },
    maxNodes: 32,
  }),
