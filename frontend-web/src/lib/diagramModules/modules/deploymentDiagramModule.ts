import type { DiagramModule } from "../types";

  id: "deployment",
  isUml: true,
  components: [
    { type: "actor", label: "Device", description: "Physical device or client hardware." },
    { type: "input_output", label: "Artifact", description: "Deployable artifact (binary/image/package)." },
  ],
    { type: "communication", label: "Communication Path", direction: "undirected", description: "Network communication path between nodes." },
    { type: "hosting", label: "Hosting", direction: "directed", description: "Node hosts execution environment/service." },
  layoutRules: [
    "Keep hosted artifacts near their parent runtime node.",
  ],
    "Allow artifact-to-node deployment relation editing.",
    "Support node grouping and regrouping for runtime zones.",
  aiGenerationRules: [
    "Map each artifact to a concrete host/runtime target.",
  ],
    "Prefer compact hierarchical clusters over sprawling graphs.",
    "Limit crossing between communication and deployment edges.",
  validate: (diagram) => validateGraphAgainstRules(diagram, {
    allowedNodeTypes: ["process", "actor", "queue", "input_output", "storage"],
    allowedRelationshipTypes: ["communication", "deployment", "hosting"],
      communication: "communication",
      path: "communication",
      deploys: "deployment",
      hosting: "hosting",
    },
    maxNodes: 32,
  }),
