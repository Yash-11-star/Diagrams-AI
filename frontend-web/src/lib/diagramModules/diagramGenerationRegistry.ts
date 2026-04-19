import { api } from "@/lib/api";
import type { DedicatedDiagramType, DiagramModule, DiagramValidationResult, GenerationDispatchResult } from "./types";
import { cloudArchitectureDiagramModule } from "./modules/cloudArchitectureDiagramModule";
import { dataFlowDiagramModule } from "./modules/dataFlowDiagramModule";
import { networkDiagramModule } from "./modules/networkDiagramModule";
import { userFlowDiagramModule } from "./modules/userFlowDiagramModule";

  component: componentDiagramModule,
  data_flow: dataFlowDiagramModule,
  user_flow: userFlowDiagramModule,
  cloud_arch: cloudArchitectureDiagramModule,
  cicd: cicdPipelineDiagramModule,


  return (MANAGED_DIAGRAM_TYPES as readonly string[]).includes(diagramType)
    : null;

  return toDedicatedDiagramType(diagramType) !== null;

  const key = toDedicatedDiagramType(diagramType);
}
export function validateDiagramByType(diagramType: string, diagram: DiagramDocument): DiagramValidationResult | null {
  if (!diagramModule) return null;
}
export async function generateDiagramVariantsByType(
  numVariants: number,
): Promise<GenerationDispatchResult> {
  const { variants } = await api.generate(prompt, numVariants, diagramType);
  if (!diagramModule) {
      variants,
        index,
      })),
  }
  const diagnostics = variants.map((variant, index) => ({
    validation: diagramModule.validate(variant),

    .map((item) => ({ ...item, diagram: variants[item.index] }))
      if (a.validation.valid !== b.validation.valid) return a.validation.valid ? -1 : 1;
    });
  const selected = sorted.slice(0, numVariants).map((item) => item.diagram);
  return {
    diagnostics,
}
