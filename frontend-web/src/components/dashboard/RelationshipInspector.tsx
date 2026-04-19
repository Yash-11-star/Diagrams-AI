"use client";
import { useCallback } from "react";
import { Trash2 } from "lucide-react";
  type UMLRelType, type UMLEdgeData,
} from "@/components/dashboard/edges/CustomEdges";
interface RelationshipInspectorProps {
}
const MULT_PRESETS = ["1", "0..1", "*", "0..*", "1..*", "n"];
export function RelationshipInspector({ selectedEdgeId }: RelationshipInspectorProps) {
  const { setEdges } = useReactFlow();
  const edge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;

  const relType: UMLRelType = d.relationshipType ?? "association";
  const updateData = useCallback(
      if (!selectedEdgeId) return;
        es.map((e) =>
            ? { ...e, data: { ...(e.data ?? {}), ...patch } }
        )
    },
  );
  const deleteEdge = useCallback(() => {
    setEdges((es) => es.filter((e) => e.id !== selectedEdgeId));

    return (
        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
            <line x1="3" y1="10" x2="17" y2="10" stroke="#9ca3af" strokeWidth="2" />
          </svg>
        <p className="text-[13px] font-medium text-gray-500">No relationship selected</p>
          Click a relationship line on the canvas to edit its type, multiplicity, and labels here.
      </div>
  }
  return (

      <div className="px-4 py-3 border-b border-gray-100">
          Relationship Type
        <div className="flex flex-col gap-1">
            <button
              onClick={() => updateData({ relationshipType: opt.value })}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-colors ${
                  ? "bg-blue-50 text-blue-700 border-blue-300"
              }`}
              <RelTypeIcon relType={opt.value} active={relType === opt.value} />
            </button>
        </div>

      <div className="px-4 py-3 border-b border-gray-100">
          Multiplicity
        <div className="grid grid-cols-2 gap-2 mb-2">
            <p className="text-[9px] text-gray-400 mb-1 uppercase tracking-widest">Source</p>
              value={d.sourceMultiplicity ?? ""}
              placeholder="e.g. 1"
            />
          <div>
            <input
              onChange={(e) => updateData({ targetMultiplicity: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-[11px] font-mono text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30 focus:border-blue-400/50"
          </div>
        {}
          {MULT_PRESETS.map((m) => (
              key={m}
              className="text-[9px] font-mono text-gray-500 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded px-1.5 py-0.5 transition-colors"
            >
            </button>
        </div>

      <div className="px-4 py-3 border-b border-gray-100">
          Label
        <input
          onChange={(e) => updateData({ label: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/50"
        <p className="text-[9px] text-gray-400 mt-1 leading-relaxed">
        </p>

      <div className="px-4 py-3">
          onClick={deleteEdge}
        >
          Delete Relationship
      </div>
      {}
        <p className="text-[10px] text-gray-400 leading-relaxed">
        </p>
    </div>
}
