import type {
  GraphNode,
  SequenceMessageType,
} from "./diagramTypes";

  "service",
  "api",
  "database",
  "frontend",
  "socket",
  "cache",

const ASYNC_TOKENS = ["emit", "publish", "notify", "event", "async", "enqueue"];
function roleForNode(node: GraphNode): SequenceParticipantRole {
  const lowered = node.label.toLowerCase();
  return "participant";

  const lowered = label.toLowerCase();
  if (RETURN_TOKENS.some((token) => lowered.includes(token))) return "return";
  return "sync";

  const participantNodes = diagram.nodes.filter((node) => node.type.toLowerCase() !== "process");
  const participantIds = new Set(lifelineNodes.map((node) => node.id));
  const steps: SequenceDiagram["steps"] = [];

    if (node.type.toLowerCase() !== "process") continue;
    const incoming = diagram.edges.filter((edge) => edge.target === node.id && participantIds.has(edge.source));
    if (incoming.length === 0 || outgoing.length === 0) continue;
    const source = incoming[0].source;
    const label = node.label || outgoing[0].label || incoming[0].label || "message()";
      id: node.id || newSequenceId("step"),
      from: source,
      messageType: inferMessageType(label, source, target),
    });
    consumedEdges.add(`${incoming[0].source}|${incoming[0].target}|${incoming[0].label ?? ""}`);
  }
  diagram.edges.forEach((edge, index) => {

    if (consumedEdges.has(key)) return;
    const label = edge.label || "message()";
      id: `step_${index}`,
      from: edge.source,
      messageType: inferMessageType(label, edge.source, edge.target),
    });

    kind: "sequence",
    participants: lifelineNodes.map((node) => ({
      name: node.label,
    })),
    activations: [],
  };
