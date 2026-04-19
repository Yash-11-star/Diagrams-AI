import type { DiagramModule } from "../types";

  id: "user_journey",
  isUml: false,
  components: [
    { type: "actor", label: "Touchpoint / Channel", description: "Touchpoint owner/channel for a stage." },
    { type: "decision", label: "Pain Point", description: "Friction or break in experience." },
  relationships: [
    { type: "influence", label: "Influence", direction: "directed", description: "Touchpoint/emotion/pain influence on journey step." },
  layoutRules: [
    "Align touchpoint/emotion/pain rows by stage.",
  ],
    "Allow moving cards between stages.",
    "Allow adding optional ownership/channel annotations.",
  aiGenerationRules: [
    "Keep journey progression explicit and ordered.",
  ],
    "Keep stage progression obvious within one glance.",
    "Limit crossing lines; prefer vertical alignment by stage.",
  validate: (diagram) => validateGraphAgainstRules(diagram, {
    allowedNodeTypes: ["process", "actor", "input_output", "decision"],
    allowedRelationshipTypes: ["progression", "influence"],
      progression: "progression",
      stage: "progression",
      emotion: "influence",
      touchpoint: "influence",
    minNodes: 4,
    maxEdgeToNodeRatio: 2.0,
};
