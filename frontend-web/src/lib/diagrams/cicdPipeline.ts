
import type { GraphDiagram } from "@/lib/diagramTypes";

const PAD_Y       = 56;
const NODE_W      = 160;
const DECISION_W  = 140;
const NODE_GAP    = 18;


  0: "Source",
  2: "Test",
  4: "Gate",
  6: "Environment",

  const t = irType.toLowerCase();

  if (t === "end")   return 5;
  if (
    labelIncludes(l, ["environment", "production", "staging", "registry",
  ) return 6;
  if (
    labelIncludes(l, ["approve", "approval", "gate", "review", "manual check", "policy check"])


    labelIncludes(l, ["package", "artifact", "docker", "image build", "container",
  ) return 3;
  if (
                       "acceptance", "regression"])

    labelIncludes(l, ["build", "compile", "install dependencies", "npm install",
  ) return 1;
  if (
                       "webhook", "schedule", "cron", "checkout"])


}
function nodeSize(irType: string): { w: number; h: number } {
  return { w: NODE_W, h: NODE_H };

  diagram: GraphDiagram

  diagram.nodes.forEach((n) => {
  });
  const stageGroups = new Map<PipelineStage, typeof diagram.nodes>();
  diagram.nodes.forEach((n) => {
    stageGroups.get(s)!.push(n);

    [0, 1, 2, 3, 4, 5, 6] as PipelineStage[]

  let curX = PAD_X;
    stageX.set(s, curX);
  });
  const outputNodes: Node[] = [];
    const group = stageGroups.get(s)!;
    let curY    = PAD_Y;
    group.forEach((n) => {
      const nodeX = colX + (STAGE_COL_W - w) / 2;
        id: n.id,
        position: { x: nodeX, y: curY },
          label: n.label,
          diagramType: "cicd",
        },
      curY += h + NODE_GAP;
  });
  const edges: Edge[] = diagram.edges.map((e, i) =>
  );
  return { nodes: outputNodes, edges };
