"use client";
import type { ReactNode } from "react";
import type {
  ArchitectureDirection,
  ArchitectureRoutingMode,

  | { type: "layer"; id: string }
  | { type: "edge"; id: string }

  return <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{children}</p>;

  return (
      <span>{label}</span>
    </label>
}
const INPUT_CLASS = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400";
export function ArchitectureInspector({
  selection,
  onMoveLayer,
  onNodeChange,
  onEdgeChange,
  aiInstruction,
  onApplyAi,
  aiError,
  diagram: ArchitectureDiagram;
  onLayerChange: (layerId: string, patch: Record<string, unknown>) => void;
  onDeleteLayer: (layerId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAiInstructionChange: (value: string) => void;
  aiLoading: boolean;
}) {
    ? diagram.layers.find((item) => item.id === selection.id)
  const node = selection?.type === "node"
    : null;
    ? diagram.edges.find((item) => item.id === selection.id)

    <aside className="w-[304px] shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Properties</p>

        {layer && (
            <SectionTitle>Layer</SectionTitle>
              <input
                value={layer.name}
              />
            <Field label="Description">
                className={`${INPUT_CLASS} min-h-[80px] resize-none`}
                onChange={(event) => onLayerChange(layer.id, { description: event.target.value })}
            </Field>
              <input
                type="number"
                step={8}
                onChange={(event) => onLayerChange(layer.id, { height: Number(event.target.value) || layer.height })}
            </Field>
              <button onClick={() => onMoveLayer(layer.id, -1)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] font-medium text-gray-700">
              </button>
                Move Down
            </div>
              Delete Layer
          </div>

          <div className="flex flex-col gap-3">
            <Field label="Name">
                className={INPUT_CLASS}
                onChange={(event) => onNodeChange(node.id, { label: event.target.value })}
            </Field>
              <input className={INPUT_CLASS} value={node.type} readOnly />
            <Field label="Layer">
                className={INPUT_CLASS}
                onChange={(event) => onNodeChange(node.id, { layerId: event.target.value || null })}
                <option value="">Unassigned</option>
              </select>
            <button onClick={() => onDeleteNode(node.id)} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-600">
            </button>
        )}
        {edge && (
            <SectionTitle>Relationship</SectionTitle>
              <select
                value={edge.relationshipType}
              >
              </select>
            <Field label="Source">
                className={INPUT_CLASS}
                onChange={(event) => onEdgeChange(edge.id, { sourceId: event.target.value })}
                {diagram.nodes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </Field>
              <select
                value={edge.targetId}
              >
              </select>
            <Field label="Label">
                className={INPUT_CLASS}
                onChange={(event) => onEdgeChange(edge.id, { label: event.target.value })}
            </Field>
              <select
                value={edge.direction}
              >
                <option value="two_way">Two way</option>
            </Field>
              <select
                value={edge.routing.mode}
              >
                <option value="straight">Straight</option>
            </Field>
              Delete Relationship
          </div>

          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5">
              Select a layer, component, or relationship to edit its properties.
          </div>

          <SectionTitle>AI Edit</SectionTitle>
          <textarea
            className={`${INPUT_CLASS} min-h-[96px] resize-none`}
            onChange={(event) => onAiInstructionChange(event.target.value)}
          />
            onClick={() => { void onApplyAi(); }}
            className="rounded-xl bg-blue-600 px-3 py-2.5 text-[12px] font-semibold text-white disabled:opacity-40"
            {aiLoading ? "Applying..." : "Apply AI Edit"}
        </div>
    </aside>
}
