import type { DiagramDocument, GraphDiagram } from "@/lib/diagramTypes";
import { validateGraphAgainstRules } from "../shared";
import {
  inferUseCaseRelationship,
} from "@/lib/diagrams/useCaseDiagramRelationships";
function semanticUseCaseValidation(diagram: DiagramDocument): DiagramValidationResult {
  const warnings: string[] = [];
  if (!isGraphDiagram(diagram)) {
      valid: false,
      warnings,
    };

  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));

  const useCases = graph.nodes.filter((node) => nodeKindById.get(node.id) === "use_case" || nodeKindById.get(node.id) === "unknown");

  if (!useCases.length) errors.push("Use Case Diagram must include at least one use case.");
  if (boundaries.length > 1) warnings.push("Multiple system boundaries detected; prefer a single primary boundary for readability.");
  const useCaseIds = new Set(useCases.map((node) => node.id));

    const source = nodeById.get(edge.source);
    if (!source || !target) return;
    const targetKind = nodeKindById.get(edge.target) as UseCaseNodeKind;

      const actorToUseCase = (actorIds.has(edge.source) && useCaseIds.has(edge.target))
      if (!actorToUseCase) {
      }

      if (!(useCaseIds.has(edge.source) && useCaseIds.has(edge.target))) {
      }

      const sameDomain = (actorIds.has(edge.source) && actorIds.has(edge.target))
      if (!sameDomain) {
      }
  });
  if (graph.nodes.length > 20) warnings.push("Use Case Diagram has many elements; consider splitting by subsystem for readability.");

    (warnings.length * 3)
    + (graph.edges.length > graph.nodes.length * 2 ? 12 : 0);

    valid: errors.length === 0,
    warnings,
  };

  id: "use_case",
  isUml: true,
  components: [
    { type: "use_case", label: "Use Case", description: "Goal/capability offered by the system." },
  ],
    { type: "association", label: "Association", direction: "undirected", description: "Communication link between actor and use case." },
    { type: "extend", label: "<<extend>>", direction: "directed", description: "Optional behavior extending a base use case." },
  ],
    "Center one system boundary on the canvas.",
    "Place use cases in grouped lanes inside the boundary with consistent spacing.",
  editingRules: [
    "Allow include/extend/association/generalization conversion in inspector.",
  ],
    "Extract actors first, then actor goals as use cases.",
    "Use include/extend only when semantics are clearly implied.",
  readabilityRules: [
    "Prevent use case overlap with fixed lane spacing.",
  ],
    const base = validateGraphAgainstRules(diagram, {
      allowedNodeTypes: [
        "use_case",

        "process",
      ],
      allowedRelationshipTypes: ["association", "include", "extend", "generalization"],
        association: "association",
        "<<include>>": "include",
        "<<extend>>": "extend",
        inherits: "generalization",
      minNodes: 3,
      maxEdgeToNodeRatio: 1.9,
    const semantic = semanticUseCaseValidation(diagram);
      valid: base.valid && semantic.valid,
      warnings: [...base.warnings, ...semantic.warnings],
    };
};
