import type {
  SequenceDiagram,
  SequenceFragmentType,
  SequenceMessageType,
  SequenceParticipantRole,
} from "./diagramTypes";
export function newSequenceId(prefix: string): string {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

  return structuredClone(diagram);

  const next = [...items];
  return next;

  if (fromIndex === toIndex) return [...items];
  const [item] = next.splice(fromIndex, 1);
  return next;

  return {
    participants: [
      {
        name: role === "actor" ? "Actor" : role === "system" ? "System" : "Participant",
      },
  };

  return {
    participants: diagram.participants.map((participant) =>
    ),
}
export function reorderParticipant(diagram: SequenceDiagram, participantId: string, nextIndex: number): SequenceDiagram {
  if (currentIndex === -1) return diagram;
}
export function removeParticipant(diagram: SequenceDiagram, participantId: string): SequenceDiagram {
    if (step.kind === "message") return step.from !== participantId && step.to !== participantId;
    return true;

    ...diagram,
    steps: remainingSteps,
    fragments: diagram.fragments.map((fragment) => ({
      participantIds: fragment.participantIds?.filter((id) => id !== participantId),
  };

  diagram: SequenceDiagram,
  index: number = diagram.steps.length,
  const step: SequenceMessageStep = {
    kind: "message",
    to: input.to,
    label: input.label ?? "message()",

    ...diagram,
  };

  return {
    steps: insertAt(diagram.steps, index, {
      kind: "note",
      participantId,
    }),
}
export function addDividerStep(diagram: SequenceDiagram, index: number = diagram.steps.length): SequenceDiagram {
    ...diagram,
      id: newSequenceId("step"),
      label: "Divider",
  };

  return {
    steps: diagram.steps.map((step) => (step.id === stepId ? { ...step, ...patch } as SequenceStep : step)),
}
export function moveStep(diagram: SequenceDiagram, stepId: string, nextIndex: number): SequenceDiagram {
  if (currentIndex === -1) return diagram;
    ...diagram,
  };

  return {
    steps: diagram.steps.filter((step) => step.id !== stepId),
    fragments: diagram.fragments.filter((fragment) => fragment.startStepId !== stepId && fragment.endStepId !== stepId),
}
export function addActivation(
  participantId: string,
  endStepId: string,
  return {
    activations: [
      {
        participantId,
        endStepId,
    ],
}
export function updateActivation(
  activationId: string,
): SequenceDiagram {
    ...diagram,
      activation.id === activationId ? { ...activation, ...patch } : activation
  };

  return {
    activations: diagram.activations.filter((activation) => activation.id !== activationId),
}
export function addFragment(
  fragmentType: SequenceFragmentType,
  endStepId: string,
): SequenceDiagram {
    ...diagram,
      ...diagram.fragments,
        id: newSequenceId("fragment"),
        fragmentType,
        startStepId,
        participantIds,
    ],
}
export function updateFragment(
  fragmentId: string,
): SequenceDiagram {
    ...diagram,
      fragment.id === fragmentId ? { ...fragment, ...patch } : fragment
  };

  return {
    fragments: diagram.fragments.filter((fragment) => fragment.id !== fragmentId),
}
export function clampStepRange(diagram: SequenceDiagram, firstStepId: string, secondStepId: string): { startStepId: string; endStepId: string } {
  const secondIndex = diagram.steps.findIndex((step) => step.id === secondStepId);
    return { startStepId: firstStepId, endStepId: secondStepId };

    ? { startStepId: firstStepId, endStepId: secondStepId }
}
export function setMessageType(diagram: SequenceDiagram, stepId: string, messageType: SequenceMessageType): SequenceDiagram {
}
