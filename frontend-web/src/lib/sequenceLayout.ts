import type {
  SequenceDiagram,
  SequenceParticipant,
} from "./diagramTypes";
export const SEQUENCE_LAYOUT = {
  headerHeight: 42,
  leftPadding: 92,
  topPadding: 28,
  rowHeight: 64,
  activationWidth: 14,
  fragmentHeaderHeight: 24,
  noteWidth: 150,
  selfCallWidth: 52,

  participant: SequenceParticipant;
  centerX: number;
  headerTop: number;

  step: SequenceStep;
  centerY: number;
}
export interface SequenceActivationLayout {
  participant: SequenceParticipant;
  bottom: number;
  depth: number;

  fragment: SequenceFragment;
  top: number;
  height: number;

  width: number;
  participants: SequenceParticipantLayout[];
  activations: SequenceActivationLayout[];
  participantIndex: Map<string, SequenceParticipantLayout>;
}
function participantCenterX(index: number): number {
}
function stepCenterY(index: number): number {
}
function findFragmentBounds(
  participants: SequenceParticipantLayout[],
  participantIndex: Map<string, SequenceParticipantLayout>,
): SequenceFragmentLayout | null {
  const end = stepIndex.get(fragment.endStepId);

    ? fragment.participantIds.map((id) => participantIndex.get(id)).filter(Boolean) as SequenceParticipantLayout[]
  if (!spanLayouts.length) return null;
  const leftLane = spanLayouts[0];
  const left = leftLane.left - SEQUENCE_LAYOUT.fragmentPadding;
  const top = start.top - SEQUENCE_LAYOUT.fragmentPadding;

    fragment,
    top,
    height: bottom - top,
}
function buildActivationLayouts(
  participantIndex: Map<string, SequenceParticipantLayout>,
): SequenceActivationLayout[] {
  activations.forEach((activation) => {
    list.push(activation);
  });
  const layouts: SequenceActivationLayout[] = [];
    const participant = participantIndex.get(participantId);

      const aStart = stepIndex.get(a.startStepId)?.index ?? 0;
      if (aStart !== bStart) return aStart - bStart;
      const bEnd = stepIndex.get(b.endStepId)?.index ?? bStart;
    });
    const openDepths: { depth: number; endIndex: number }[] = [];
      const start = stepIndex.get(activation.startStepId);
      if (!start || !end) return;
      const startIndex = start.index;
      for (let i = openDepths.length - 1; i >= 0; i -= 1) {
          openDepths.splice(i, 1);
      }
      let depth = 0;
      openDepths.push({ depth, endIndex });
      layouts.push({
        participant: participant.participant,
        bottom: end.top + SEQUENCE_LAYOUT.rowHeight - 10,
        depth,
    });

}
export function buildSequenceLayout(diagram: SequenceDiagram): SequenceLayout {
    participant,
    centerX: participantCenterX(index),
    headerTop: SEQUENCE_LAYOUT.topPadding,
  const steps = diagram.steps.map((step, index) => ({
    index,
    top: SEQUENCE_LAYOUT.lifelineTop + index * SEQUENCE_LAYOUT.rowHeight,

  const stepIndex = new Map(steps.map((layout) => [layout.step.id, layout]));
    ? participants[participants.length - 1].left + SEQUENCE_LAYOUT.headerWidth + SEQUENCE_LAYOUT.rightPadding
  const height = steps.length > 0
    : SEQUENCE_LAYOUT.lifelineTop + SEQUENCE_LAYOUT.bottomPadding;
  const activations = buildActivationLayouts(diagram.activations, participantIndex, stepIndex);
    .map((fragment) => findFragmentBounds(fragment, participants, steps, participantIndex, stepIndex))

    width,
    participants,
    activations,
    participantIndex,
  };
