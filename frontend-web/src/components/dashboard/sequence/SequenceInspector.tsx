"use client";
import type { ReactNode } from "react";

  | { type: "participant"; id: string }
  | { type: "activation"; id: string }
  | null;
const MESSAGE_TYPES: SequenceMessageType[] = ["sync", "async", "return", "self"];
const FRAGMENT_TYPES: SequenceFragmentType[] = ["loop", "alt", "opt", "par"];
function SectionTitle({ children }: { children: string }) {
}
function Field({
  children,
  label: string;
}) {
    <label className="flex flex-col gap-1 text-[11px] text-gray-500">
      {children}
  );


  if (step.kind === "message") return `${step.messageType}: ${step.label || "message()"}`;
  return `divider: ${step.label || "Divider"}`;

  diagram,
  onSelect,
  onParticipantDelete,
  onStepDelete,
  onActivationChange,
  onFragmentChange,
  aiInstruction,
  onApplyAi,
  aiError,
  diagram: SequenceDiagram;
  onSelect: (selection: SequenceSelection) => void;
  onParticipantDelete: (participantId: string) => void;
  onStepDelete: (stepId: string) => void;
  onActivationChange: (activationId: string, patch: Record<string, unknown>) => void;
  onFragmentChange: (fragmentId: string, patch: Record<string, unknown>) => void;
  aiInstruction: string;
  onApplyAi: () => Promise<void>;
  aiError: string | null;
  const participant = selection?.type === "participant"
    : null;
    ? diagram.steps.find((item) => item.id === selection.id)
  const activation = selection?.type === "activation"
    : null;
    ? diagram.fragments.find((item) => item.id === selection.id)

    <aside className="w-[300px] shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Properties</p>

        {participant && (
            <SectionTitle>Participant</SectionTitle>
              <input
                value={participant.name}
              />
            <Field label="Role">
                className={INPUT_CLASS}
                onChange={(event) => onParticipantChange(participant.id, { role: event.target.value as SequenceParticipantRole })}
                {PARTICIPANT_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
            </Field>
              Remove Participant
          </div>

          <div className="flex flex-col gap-3">
            <Field label="Text">
                className={INPUT_CLASS}
                onChange={(event) => onStepChange(step.id, { label: event.target.value })}
            </Field>
            {step.kind === "message" && (
                <Field label="Type">
                    className={INPUT_CLASS}
                    onChange={(event) => onStepChange(step.id, { messageType: event.target.value as SequenceMessageType })}
                    {MESSAGE_TYPES.map((messageType) => <option key={messageType} value={messageType}>{messageType}</option>)}
                </Field>
                  <select
                    value={step.from}
                  >
                  </select>
                <Field label="To">
                    className={INPUT_CLASS}
                    onChange={(event) => onStepChange(step.id, { to: event.target.value })}
                    {diagram.participants.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </Field>
            )}
            {step.kind === "note" && (
                <select
                  value={step.participantId ?? ""}
                >
                  {diagram.participants.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </Field>

              <button onClick={() => onStepMove(step.id, -1)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] font-medium text-gray-700">
              </button>
                Move Down
            </div>
              Remove Step
          </div>

          <div className="flex flex-col gap-3">
            <Field label="Participant">
                className={INPUT_CLASS}
                onChange={(event) => onActivationChange(activation.id, { participantId: event.target.value })}
                {diagram.participants.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </Field>
              <select
                value={activation.startStepId}
              >
              </select>
            <Field label="End Step">
                className={INPUT_CLASS}
                onChange={(event) => onActivationChange(activation.id, { endStepId: event.target.value })}
                {diagram.steps.map((item) => <option key={item.id} value={item.id}>{stepSummary(item)}</option>)}
            </Field>
              Remove Activation
          </div>

          <div className="flex flex-col gap-3">
            <Field label="Type">
                className={INPUT_CLASS}
                onChange={(event) => onFragmentChange(fragment.id, { fragmentType: event.target.value as SequenceFragmentType })}
                {FRAGMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </Field>
              <input
                value={fragment.label}
              />
            <Field label="Branch Label">
                className={INPUT_CLASS}
                onChange={(event) => onFragmentChange(fragment.id, { branchLabel: event.target.value || undefined })}
            </Field>
              <select
                value={fragment.startStepId}
              >
              </select>
            <Field label="End Step">
                className={INPUT_CLASS}
                onChange={(event) => onFragmentChange(fragment.id, { endStepId: event.target.value })}
                {diagram.steps.map((item) => <option key={item.id} value={item.id}>{stepSummary(item)}</option>)}
            </Field>
              <span className="text-[11px] text-gray-500">Span Participants</span>
                {diagram.participants.map((item) => {
                  return (
                      <input
                        checked={included}
                          const current = fragment.participantIds ? [...fragment.participantIds] : diagram.participants.map((participantItem) => participantItem.id);
                            ? Array.from(new Set([...current, item.id]))
                          onFragmentChange(fragment.id, { participantIds: next.length === diagram.participants.length ? undefined : next });
                      />
                    </label>
                })}
            </div>
              Remove Fragment
          </div>

          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5">
              Select a participant, message, activation, or fragment to edit its properties.
          </div>

          <SectionTitle>AI Edit</SectionTitle>
          <textarea
            value={aiInstruction}
            placeholder='Add an alt block for failed login and a return message with 401.'
          <button
            disabled={aiLoading || !aiInstruction.trim()}
          >
          </button>
      </div>
      <div className="border-t border-gray-100 p-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto">
            const active = selection?.type === "step" && selection.id === item.id;
              <button
                onClick={() => onSelect({ type: "step", id: item.id })}
                  active
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              >
              </button>
          })}
      </div>
  );
