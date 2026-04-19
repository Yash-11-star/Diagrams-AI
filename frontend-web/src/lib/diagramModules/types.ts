import type { DiagramDocument } from "@/lib/diagramTypes";
export type DedicatedDiagramType =
  | "deployment"
  | "use_case"
  | "user_journey"
  | "network"

  type: string;
  description: string;

  type: string;
  direction: "directed" | "undirected";
}
export interface DiagramValidationResult {
  errors: string[];
  qualityScore: number;

  id: DedicatedDiagramType;
  isUml: boolean;
  components: DiagramComponentRule[];
  layoutRules: string[];
  aiGenerationRules: string[];
  validate: (diagram: DiagramDocument) => DiagramValidationResult;

  variants: DiagramDocument[];
}
