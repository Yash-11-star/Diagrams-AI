import type { DiagramModule } from "../types";

  id: "cicd",
  isUml: false,
  components: [
    { type: "process", label: "Stage", description: "Build/test/deploy stage." },
    { type: "decision", label: "Approval Gate", description: "Manual/automated gate condition." },
    { type: "end", label: "Release End", description: "Pipeline completion state." },
  relationships: [
    { type: "artifact_flow", label: "Artifact Flow", direction: "directed", description: "Artifact handoff or publication." },
  ],
    "Strict left-to-right stage progression.",
    "Approval gates must sit on the main delivery path.",
  editingRules: [
    "Allow converting stage transitions to artifact_flow or feedback edges.",
  ],
    "Generate deterministic stage sequence from source to environment.",
    "Represent parallelism explicitly with branch+merge pattern.",
  readabilityRules: [
    "Minimize feedback-loop clutter by routing around stage row.",
  ],
    diagramLabel: "CI/CD Pipeline",
    requiredNodeTypes: ["start", "process", "end"],
    relationshipAliases: {
      stage: "pipeline",
      artifact: "artifact_flow",
      package: "artifact_flow",
      monitor: "feedback",
    },
    maxNodes: 34,
  }),
