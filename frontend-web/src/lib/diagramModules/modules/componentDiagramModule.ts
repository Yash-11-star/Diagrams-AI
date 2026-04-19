import type { DiagramModule } from "../types";

  id: "component",
  isUml: true,
  components: [
    { type: "actor", label: "Interface", description: "Interface contract exposed or consumed by components." },
    { type: "queue", label: "Required Interface", description: "Explicit required interface port." },
  ],
    { type: "dependency", label: "Dependency", direction: "directed", description: "Component depends on another component/interface." },
    { type: "realization", label: "Realization", direction: "directed", description: "Component realizes interface contract." },
  ],
    "Cluster components by package/module boundary.",
    "Avoid crossing dependency lines through component clusters.",
  editingRules: [
    "Allow relationship type changes between dependency/assembly/realization/usage.",
  ],
    "Extract core modules before generating dependencies.",
    "Prefer package grouping over flat component clouds.",
  readabilityRules: [
    "Minimize long dependency edges.",
  ],
    diagramLabel: "Component Diagram",
    requiredNodeTypes: ["process"],
    relationshipAliases: {
      depends: "dependency",
      usage: "usage",
      connects: "assembly",
      implements: "realization",
    minNodes: 3,
    maxEdgeToNodeRatio: 2.1,
};
