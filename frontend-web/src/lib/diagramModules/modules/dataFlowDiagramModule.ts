import type { DiagramModule } from "../types";

  id: "data_flow",
  isUml: false,
  components: [
    { type: "storage", label: "Data Store", description: "Persistent data repository." },
    { type: "input_output", label: "Data Flow Label", description: "Optional explicit data object annotation." },
  relationships: [
  ],
    "Place external entities on edges of diagram.",
    "Place stores near processes that read/write them.",
  editingRules: [
    "Allow reconnection while keeping entity/process/store roles intact.",
  ],
    "Identify data producers, transformers, and consumers explicitly.",
    "Avoid infrastructure detail unless prompt explicitly asks for it.",
  readabilityRules: [
    "Avoid cyclic spaghetti flows unless explicitly required.",
  ],
    diagramLabel: "Data Flow Diagram",
    requiredNodeTypes: ["process", "storage", "actor"],
    relationshipAliases: {
      flow: "data_flow",
      transfer: "data_flow",
      output: "data_flow",
    minNodes: 4,
    maxEdgeToNodeRatio: 2.0,
};
