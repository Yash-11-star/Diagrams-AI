"use client";
import { memo } from "react";
import { buildSequenceLayout, SEQUENCE_LAYOUT } from "@/lib/sequenceLayout";
const THUMB_WIDTH = 220;
const PAD = 10;
function esc(value: string): string {
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
}
function buildMessagePath(fromX: number, toX: number, y: number, messageType: string): string {
    const loopX = fromX + 28;
    return `M ${fromX} ${y} H ${loopX} V ${bottom} H ${fromX}`;
  return `M ${fromX} ${y} H ${toX}`;

  const layout = buildSequenceLayout(diagram);
    (THUMB_WIDTH - PAD * 2) / Math.max(layout.width, 1),
    1,
  const tx = (value: number) => PAD + value * scale;

    `<g>
      <line x1="${tx(participant.centerX).toFixed(1)}" y1="${ty(SEQUENCE_LAYOUT.lifelineTop).toFixed(1)}" x2="${tx(participant.centerX).toFixed(1)}" y2="${ty(layout.height - 24).toFixed(1)}" stroke="#94a3b8" stroke-width="0.9" stroke-dasharray="4 3"/>
  )).join("");
  const fragments = layout.fragments.map((fragment) => (
      <rect x="${tx(fragment.left).toFixed(1)}" y="${ty(fragment.top).toFixed(1)}" width="${(fragment.width * scale).toFixed(1)}" height="${(fragment.height * scale).toFixed(1)}" fill="rgba(241,245,249,0.28)" stroke="#cbd5e1" stroke-width="0.8"/>
    </g>`

    `<rect x="${tx(activation.left).toFixed(1)}" y="${ty(activation.top).toFixed(1)}" width="${(SEQUENCE_LAYOUT.activationWidth * scale).toFixed(1)}" height="${Math.max((activation.bottom - activation.top) * scale, 4).toFixed(1)}" fill="#dbeafe" stroke="#60a5fa" stroke-width="0.8"/>`

    const step = stepLayout.step;
      return `<g>
      </g>`;

      const participant = step.participantId ? layout.participantIndex.get(step.participantId) : layout.participants[0];
      return `<g>
      </g>`;

    const to = layout.participantIndex.get(step.to);
    const path = buildMessagePath(from.centerX, to.centerX, stepLayout.centerY, step.messageType);
    return `<path d="${path}" fill="none" stroke="#334155" stroke-width="1"${dash}/>`;

    <rect width="${THUMB_WIDTH}" height="${THUMB_HEIGHT}" rx="10" fill="#f8fafc"/>
    ${lifelines}
    ${steps}
}
export const SequenceThumbnail = memo(function SequenceThumbnail({ diagram }: { diagram: SequenceDiagram }) {
});
