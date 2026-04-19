"use client";
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
  AlertTriangle,
  Cloud,
  Code2,
  Download,
  Maximize2,
  Undo2,
  ZoomOut,
import { ApiError, api } from "@/lib/api";
  DiagramDocument,
  SequenceActivation,
  SequenceFragment,
  SequenceMessageStep,
  SequenceParticipant,
  SequenceStep,
import { isLegacySequenceGraph, isSequenceDiagram } from "@/lib/diagramTypes";
import { normalizeLegacySequenceGraph } from "@/lib/sequenceNormalize";
  addActivation,
  addFragment,
  addNoteStep,
  clampStepRange,
  moveStep,
  removeFragment,
  removeStep,
  updateActivation,
  updateParticipant,
} from "@/lib/sequenceEditing";
import { useVariantManager, type StoredVariant } from "@/hooks/useVariantManager";
import { SequenceInspector, type SequenceSelection } from "./SequenceInspector";
import { diagramRepository } from "@/lib/db/diagramRepository";

  targetVariant: StoredVariant | null;
  onSaveCopy: () => void;
}
function SwitchModal({ targetVariant, onReplace, onSaveCopy, onCancel }: SwitchModalProps) {

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        initial={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[340px] p-6"
        <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
          <div>
            <p className="text-[11px] text-gray-400 mt-0.5">Save a working copy or switch and discard.</p>
        </div>
        <div className="flex flex-col gap-2">
            onClick={onSaveCopy}
          >
            Save as working copy, then switch
          <button
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[12px] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            <Trash2 size={13} className="text-red-400" />
          </button>
            Cancel
        </div>
    </div>
}
type DragState =
  | { kind: "step"; stepId: string; startIndex: number; currentIndex: number }
  | { kind: "activation"; participantId: string; startStepId: string; currentStepId: string }
  | { kind: "activation-resize"; activationId: string; edge: "start" | "end"; currentStepId: string }

  switch (messageType) {
      return "sequence-open-arrow";
      return "sequence-open-arrow";
      return "sequence-filled-arrow";
}
function messagePath(step: SequenceMessageStep, layout: SequenceLayout): { path: string; labelX: number; labelY: number } | null {
  const to = layout.participantIndex.get(step.to);
  if (!from || !to || !row) return null;
  if (step.messageType === "self") {
    const bottom = row.centerY + 26;
      path: `M ${from.centerX} ${row.centerY} H ${loopRight} V ${bottom} H ${from.centerX}`,
      labelY: row.centerY - 8,
  }
  return {
    labelX: (from.centerX + to.centerX) / 2,
  };

  if (!layout.participants.length) return null;
  const nearest = [...layout.participants].sort((a, b) => Math.abs(a.centerX - x) - Math.abs(b.centerX - x))[0];
}
function insertionIndexForY(clientY: number, rect: DOMRect, layout: SequenceLayout): number {
  if (layout.steps.length === 0) return 0;
  return Math.max(0, Math.min(layout.steps.length, index));

  if (!layout.steps.length) return null;
  const nearest = [...layout.steps].sort((a, b) => Math.abs(a.centerY - y) - Math.abs(b.centerY - y))[0];
}
function participantSpan(diagram: SequenceDiagram, firstId: string, secondId: string): string[] {
  const second = diagram.participants.findIndex((participant) => participant.id === secondId);
  const [start, end] = first <= second ? [first, second] : [second, first];
}
function participantLabel(role: SequenceParticipantRole): string {
}
function readMouseRect(ref: RefObject<HTMLDivElement | null>): DOMRect | null {
}
export function SequenceCanvas({
  diagramLabel,
  diagramId,
  activeVariantId,
}: {
  diagramLabel: string;
  diagramId: string;
  activeVariantId: string;
}) {
    diagramMetaId,
    activeVariantId,
  );
    variants,
    isDirty,
    switchVariant,
    createWorkingCopy,
  const { markDocumentDirty } = useAutosaveDiagram({
    diagramType: "sequence",
  });
  const [rawDocument, setRawDocument] = useState<DiagramDocument>(initialDocument);
  const [normalizing, setNormalizing] = useState(isLegacySequenceGraph("sequence", initialDocument));
  const [selection, setSelection] = useState<SequenceSelection>(null);
  const [history, setHistory] = useState<SequenceDiagram[]>(isSequenceDiagram(initialDocument) ? [cloneSequence(initialDocument)] : []);
  const [zoom, setZoom] = useState(1);
  const [switchTarget, setSwitchTarget] = useState<StoredVariant | null>(null);
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (meta?.firestoreId) setFirestoreId(meta.firestoreId);
  }, [diagramMetaId]);
    diagramMetaId,
    categoryId,
    firestoreId,
  });
  useEffect(() => {
      variants.map(async (variant) => {
        return [variant.id, preview?.svgPayload ?? ""] as [string, string];
    ).then((entries) => setPreviews(Object.fromEntries(entries.filter(([, value]) => value))));

    let cancelled = false;
    async function normalizeLegacy() {
        if (!cancelled && isSequenceDiagram(rawDocument)) {
          setHistory([cloneSequence(rawDocument)]);
          setNormalizeError(null);
        return;

      setNormalizeError(null);
        let normalized: SequenceDiagram;
          const response = await api.normalizeSequence(rawDocument as GraphDiagram);
        } catch (error) {
          normalized = normalizeLegacySequenceGraph(rawDocument as GraphDiagram);
            console.warn("Falling back to client-side sequence normalization.", error);
        }
        await replaceCurrentVariantIr(normalized);
        setDiagram(normalized);
        setSelection(null);
        if (cancelled) return;
        setDiagram(null);
        if (!cancelled) setNormalizing(false);
    }
    void normalizeLegacy();
  }, [rawDocument, replaceCurrentVariantIr]);
  const commit = useCallback((next: SequenceDiagram, pushHistory: boolean = true) => {
    setDirty(true);
    if (pushHistory) {
    }

    setHistory((current) => {
      const nextHistory = current.slice(0, -1);
      setDiagram(previous);
      markDocumentDirty(previous);
    });

    if (target.id === currentVariantId) return;
      setSwitchTarget(target);
    }
      await switchVariant(target.id, diagram ?? rawDocument);
      setSelection(null);
  }, [currentVariantId, diagram, isDirty, rawDocument, switchVariant]);
  const doSwitch = useCallback(async (target: StoredVariant) => {
    await switchVariant(target.id, diagram ?? rawDocument);
    setSelection(null);

    if (!switchTarget) return;
  }, [doSwitch, switchTarget]);
  const handleModalSaveCopy = useCallback(() => {
    void (async () => {
      await doSwitch(switchTarget);
  }, [createWorkingCopy, diagram, doSwitch, switchTarget]);
  const addParticipantFromTool = useCallback((role: SequenceParticipantRole) => {
    const next = addParticipant(diagram, role);
    setActiveTool("select");

    if (activeTool === "actor" || activeTool === "participant" || activeTool === "system") {
    }

    if (!selection) return;
      (selection.type === "participant" && current.participants.some((item) => item.id === selection.id)) ||
      (selection.type === "activation" && current.activations.some((item) => item.id === selection.id)) ||
    if (!exists) setSelection(null);

    if (!diagram) return;
    updateSelectionFromDocument(next);
  }, [commit, diagram, updateSelectionFromDocument]);
  const handleParticipantDelete = useCallback((participantId: string) => {
    const next = removeParticipant(diagram, participantId);
    commit(next);

    if (!diagram) return;
    updateSelectionFromDocument(next);
  }, [commit, diagram, updateSelectionFromDocument]);
  const handleStepDelete = useCallback((stepId: string) => {
    const next = removeStep(diagram, stepId);
    commit(next);

    if (!diagram) return;
    if (currentIndex === -1) return;
    commit(next);

    if (!diagram) return;
    updateSelectionFromDocument(next);
  }, [commit, diagram, updateSelectionFromDocument]);
  const handleActivationDelete = useCallback((activationId: string) => {
    const next = removeActivation(diagram, activationId);
    commit(next);

    if (!diagram) return;
    updateSelectionFromDocument(next);
  }, [commit, diagram, updateSelectionFromDocument]);
  const handleFragmentDelete = useCallback((fragmentId: string) => {
    const next = removeFragment(diagram, fragmentId);
    commit(next);

    if (!diagram || !aiInstruction.trim()) return;
    setAiError(null);
      const { diagram: updated } = await api.edit(diagram, aiInstruction.trim(), "sequence");
        throw new Error("Sequence edit returned an invalid document.");
      setAiInstruction("");
    } catch (error) {
    } finally {
    }

    if (!diagram) return;
    const blob = new Blob([mermaid], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.download = "sequence-diagram.mmd";
    URL.revokeObjectURL(url);

    if (!diagram) return;
    const blob = new Blob([xml], { type: "application/xml" });
    const anchor = document.createElement("a");
    anchor.download = "sequence-diagram.drawio";
    URL.revokeObjectURL(url);

    if (!diagram) return;
    const url = URL.createObjectURL(blob);
    anchor.href = url;
    anchor.click();
  }, [diagram]);
  useEffect(() => {
      if (!dragState || !diagram || !layout) return;
      if (!rect) return;
      if (dragState.kind === "participant") {
        if (!participantId) return;
        setDragState({ ...dragState, currentIndex: nextIndex });
      }
      if (dragState.kind === "step") {
        return;

        setDragState({
          currentX: event.clientX - rect.left,
          insertIndex: insertionIndexForY(event.clientY, rect, layout),
        return;

        const stepId = nearestStepId(event.clientY, rect, layout);
        return;

        const currentParticipantId = nearestParticipantId(event.clientX, rect, layout) ?? dragState.currentParticipantId;
        setDragState({ ...dragState, currentParticipantId, currentStepId });
      }
      if (dragState.kind === "activation-resize") {
        if (stepId) setDragState({ ...dragState, currentStepId: stepId });
    }
    function handleUp(event: MouseEvent) {
      const rect = readMouseRect(surfaceRef);
      if (!rect) return;
      if (dragState.kind === "participant") {
        commit(next);
      }
      if (dragState.kind === "step") {
        commit(next);
      }
      if (dragState.kind === "message") {
        if (!toId) return;
          from: dragState.fromId,
          messageType: dragState.messageType === "self" ? "self" : dragState.messageType,
        }, dragState.insertIndex);
        commit(next);
        setActiveTool("select");
      }
      if (dragState.kind === "activation") {
        const next = addActivation(diagram, dragState.participantId, startStepId, endStepId);
        commit(next);
        setActiveTool("select");
      }
      if (dragState.kind === "fragment") {
        const span = participantSpan(diagram, dragState.startParticipantId, dragState.currentParticipantId);
        const created = next.fragments[next.fragments.length - 1];
        setSelection({ type: "fragment", id: created.id });
        return;

        const activation = diagram.activations.find((item) => item.id === dragState.activationId);
        const patch = dragState.edge === "start"
          : clampStepRange(diagram, activation.startStepId, dragState.currentStepId);
        commit(next);
    }
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mouseup", handleUp);
  }, [commit, diagram, dragState, layout]);
  const handleHeaderMouseDown = useCallback((event: React.MouseEvent, participant: SequenceParticipant) => {
    event.preventDefault();
    setSelection({ type: "participant", id: participant.id });
  }, [activeTool, diagram, layout]);
  const handleStepMouseDown = useCallback((event: React.MouseEvent, stepId: string) => {
    event.preventDefault();
    setSelection({ type: "step", id: stepId });
  }, [activeTool, diagram, layout]);
  const handleSurfaceMouseDown = useCallback((event: React.MouseEvent) => {
    const rect = readMouseRect(surfaceRef);

      const next = addNoteStep(diagram, nearestParticipantId(event.clientX, rect, layout) ?? undefined, insertionIndexForY(event.clientY, rect, layout));
      commit(next);
      setActiveTool("select");
    }
    if (activeTool === "divider") {
      const created = next.steps.find((step) => !diagram.steps.some((current) => current.id === step.id));
      if (created) setSelection({ type: "step", id: created.id });
      return;

      const fromId = nearestParticipantId(event.clientX, rect, layout);
      setDragState({
        fromId,
        currentX: event.clientX - rect.left,
        insertIndex: insertionIndexForY(event.clientY, rect, layout),
      return;

      const participantId = nearestParticipantId(event.clientX, rect, layout);
      if (!participantId || !stepId) return;
      return;

      const participantId = nearestParticipantId(event.clientX, rect, layout);
      if (!participantId || !stepId) return;
        kind: "fragment",
        startParticipantId: participantId,
        startStepId: stepId,
      });
    }
    setSelection(null);

    setZoom(1);
  }, []);
  const startActivationResize = useCallback((event: React.MouseEvent, activationId: string, edge: "start" | "end") => {
    event.stopPropagation();
    if (!activation) return;
    setDragState({
      activationId,
      currentStepId: edge === "start" ? activation.startStepId : activation.endStepId,
  }, [diagram]);
  if (normalizing) {
      <div className="flex flex-col h-[calc(100vh-52px)] bg-slate-50">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 text-center shadow-sm">
            <p className="mt-2 text-[12px] text-gray-500">Migrating the saved graph document into a structured sequence model.</p>
        </div>
    );

    return (
        <div className="flex-1 flex items-center justify-center">
            <p className="text-[14px] font-semibold text-gray-800">Sequence diagram migration failed</p>
              {normalizeError ?? "The current saved diagram could not be converted into the sequence format."}
          </div>
      </div>
  }
  const scaledStyle = {
    height: layout.height,
    transformOrigin: "top left",

    <div className="relative flex flex-col h-[calc(100vh-52px)]">
        <SwitchModal
          onReplace={handleModalReplace}
          onCancel={() => setSwitchTarget(null)}
      )}</AnimatePresence>
      <AnimatePresence>
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm"
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-[min(520px,calc(100vw-32px))] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
              <div className="flex items-start justify-between gap-4">
                  <p className="text-[15px] font-semibold text-slate-800">AI Edit</p>
                    Edit this sequence diagram using the structured UML model.
                </div>
                  onClick={() => setShowAiEdit(false)}
                >
                </button>

                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
                </p>

                className="mt-4 min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                onChange={(event) => setAiInstruction(event.target.value)}
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                  The AI keeps participants, ordered steps, fragments, and activations editable.
                <div className="flex items-center gap-2">
                    onClick={() => setShowAiEdit(false)}
                  >
                  </button>
                    onClick={() => { void applyAiEdit(); }}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-40"
                    {aiLoading && <Loader2 size={14} className="animate-spin" />}
                  </button>
              </div>
          </motion.div>
      </AnimatePresence>
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
          href={`/dashboard/${categoryId}/${diagramId}`}
        >
          Back


        <span className="text-[11px] text-gray-400 hidden sm:inline">Sequence Canvas</span>


          <button title="Zoom in" onClick={() => setZoom((value) => Math.min(value + 0.1, 1.8))} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
          </button>
            <ZoomOut size={15} />
          <button title="Fit view" onClick={fitView} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
          </button>
          <button title="Undo" onClick={handleUndo} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-30" disabled={history.length <= 1}>
          </button>
            if (!selection) return;
            if (selection.type === "step") handleStepDelete(selection.id);
            if (selection.type === "fragment") handleFragmentDelete(selection.id);
            <Trash2 size={15} />
        </div>
        <div className="flex items-center gap-2">
            onClick={() => setShowAiEdit(true)}
          >
            AI Edit
          <button
              if (!diagram) return;
            }}
            title={cloudError === "unauthenticated" ? "Sign in to save to cloud" : lastSaved ? `Last saved ${new Date(lastSaved).toLocaleTimeString()}` : "Save to Cloud"}
          >
            {cloudSaving ? "Saving…" : cloudError ? "Retry" : lastSaved ? "Saved" : "Save"}
          <button onClick={exportMermaid} className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            Mermaid
          <button onClick={exportDrawio} className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            draw.io
          <button onClick={exportJson} className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            JSON
        </div>

        <SequencePalette
          onToolChange={setActiveTool}
          activeVariantId={currentVariantId}
          onSwitchVariant={requestSwitchVariant}
        />
        <div ref={scrollerRef} className="flex-1 overflow-auto bg-slate-50">
            <div
              className="relative rounded-[28px] border border-slate-200 bg-white shadow-sm select-none"
              onMouseDown={handleSurfaceMouseDown}
              <svg className="absolute inset-0 pointer-events-none" width={layout.width} height={layout.height}>
                  <marker id="sequence-filled-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                  </marker>
                    <path d="M0,0 L12,6 L0,12" fill="none" stroke="#334155" strokeWidth="1.5" />
                </defs>
                {layout.participants.map((participant) => (
                    key={participant.participant.id}
                    y1={SEQUENCE_LAYOUT.lifelineTop}
                    y2={layout.height - SEQUENCE_LAYOUT.bottomPadding / 2}
                    strokeWidth="1.25"
                  />

                  const step = stepLayout.step;
                  return (
                      <line
                        y1={stepLayout.centerY}
                        y2={stepLayout.centerY}
                        strokeWidth="1.25"
                    </g>
                })}
                {layout.steps.map((stepLayout) => {
                  if (step.kind !== "message") return null;
                  if (!geometry) return null;
                  return (
                      <path
                        fill="none"
                        strokeWidth={selected ? 2.2 : 1.6}
                        markerEnd={`url(#${arrowMarkerId(step.messageType)})`}
                    </g>
                })}
                {dragState?.kind === "message" && layout.participantIndex.get(dragState.fromId) && (
                    x1={layout.participantIndex.get(dragState.fromId)!.centerX}
                    x2={dragState.currentX}
                    stroke="#2563eb"
                    strokeDasharray={dragState.messageType === "return" ? "6 5" : undefined}
                  />
              </svg>
              {layout.fragments.map((fragmentLayout) => {
                return (
                    key={fragmentLayout.fragment.id}
                    className={`absolute text-left rounded-sm border bg-slate-50/60 hover:bg-slate-50 ${
                    }`}
                      left: fragmentLayout.left,
                      width: fragmentLayout.width,
                    }}
                    <span className="absolute top-1 left-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    </span>
                );

                const selected = selection?.type === "activation" && selection.id === activationLayout.activation.id;
                  <button
                    onClick={(event) => { event.stopPropagation(); setSelection({ type: "activation", id: activationLayout.activation.id }); }}
                    style={{
                      top: activationLayout.top,
                      height: Math.max(activationLayout.bottom - activationLayout.top, 24),
                  >
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-blue-400"
                    />
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-blue-400"
                    />
                );

                const active = selection?.type === "participant" && selection.id === participant.participant.id;
                return (
                    key={participant.participant.id}
                      active ? "border-blue-400 shadow-blue-100" : "border-slate-200 hover:border-slate-300"
                    style={{
                      top: participant.headerTop,
                      height: SEQUENCE_LAYOUT.headerHeight,
                    onMouseDown={(event) => handleHeaderMouseDown(event, participant.participant)}
                    onDoubleClick={(event) => { event.stopPropagation(); setEditingParticipantId(participant.participant.id); }}
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">{participantLabel(participant.participant.role)}</p>
                      <input
                        className="mt-1 w-full bg-transparent text-[13px] font-semibold text-slate-700 focus:outline-none"
                        onBlur={(event) => {
                          setEditingParticipantId(null);
                        onKeyDown={(event) => {
                            handleParticipantChange(participant.participant.id, { name: (event.target as HTMLInputElement).value });
                          }
                        }}
                    ) : (
                    )}
                );

                const step = stepLayout.step;
                const editing = editingStepId === step.id;
                if (step.kind === "note") {
                  const left = participant ? participant.left + 18 : SEQUENCE_LAYOUT.leftPadding;
                    <div
                      className={`absolute rounded-xl border px-3 py-2 shadow-sm ${
                      }`}
                      onMouseDown={(event) => handleStepMouseDown(event, step.id)}
                      onDoubleClick={(event) => { event.stopPropagation(); setEditingStepId(step.id); }}
                      {editing ? (
                          autoFocus
                          defaultValue={step.label}
                          onKeyDown={(event) => {
                              handleStepChange(step.id, { label: (event.target as HTMLInputElement).value });
                            }
                          }}
                      ) : (
                      )}
                  );

                  return (
                      key={step.id}
                      style={{ left: layout.width / 2 - 60, top: stepLayout.centerY - 12, width: 120 }}
                      onClick={(event) => { event.stopPropagation(); setSelection({ type: "step", id: step.id }); }}
                    >
                        <input
                          className="w-full bg-transparent text-center text-[10px] font-semibold uppercase tracking-widest text-slate-500 focus:outline-none"
                          onBlur={(event) => { handleStepChange(step.id, { label: event.target.value }); setEditingStepId(null); }}
                            if (event.key === "Enter") {
                              setEditingStepId(null);
                            if (event.key === "Escape") setEditingStepId(null);
                        />
                    </button>
                }
                const geometry = messagePath(step, layout);
                return (
                    key={step.id}
                    style={{
                      top: geometry.labelY - 8,
                        ? SEQUENCE_LAYOUT.selfCallWidth + 40
                    }}
                    onClick={(event) => { event.stopPropagation(); setSelection({ type: "step", id: step.id }); }}
                  >
                      selected ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-white text-slate-600 border border-slate-200"
                      {editing ? (
                          autoFocus
                          defaultValue={step.label}
                          onKeyDown={(event) => {
                              handleStepChange(step.id, { label: (event.target as HTMLInputElement).value });
                            }
                          }}
                      ) : (
                      )}
                  </div>
              })}
              {dragState?.kind === "fragment" && diagram.steps.length > 0 && (
                  className="absolute border border-dashed border-blue-400 bg-blue-50/40 rounded-sm pointer-events-none"
                    const stepRange = clampStepRange(diagram, dragState.startStepId, dragState.currentStepId);
                    const start = layout.stepIndex.get(stepRange.startStepId);
                    const leftParticipant = layout.participantIndex.get(span[0] ?? dragState.startParticipantId);
                    return {
                      top: (start?.top ?? SEQUENCE_LAYOUT.lifelineTop) - 12,
                      height: ((end?.top ?? SEQUENCE_LAYOUT.lifelineTop) - (start?.top ?? SEQUENCE_LAYOUT.lifelineTop)) + SEQUENCE_LAYOUT.rowHeight + 24,
                  })()}
              )}
          </div>

          diagram={diagram}
          onSelect={setSelection}
          onParticipantDelete={handleParticipantDelete}
          onStepDelete={handleStepDelete}
          onActivationChange={handleActivationChange}
          onFragmentChange={handleFragmentChange}
          aiInstruction={aiInstruction}
          onApplyAi={applyAiEdit}
          aiError={aiError}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          Strict UML mode: vertical lifelines only, horizontal messages only, ordered top-to-bottom.
      </div>
  );
