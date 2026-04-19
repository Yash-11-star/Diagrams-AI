"use client";
import { memo, useState, useCallback } from "react";
  getSmoothStepPath, getStraightPath,
  BaseEdge,
  type EdgeProps,

  | "association"
  | "aggregation"
  | "inheritance"
  | "dependency";
export interface UMLEdgeData extends Record<string, unknown> {
  sourceMultiplicity?: string;
  label?: string;

  | "primary"
  | "auth"
  | "external"

  relationshipType?: string;
  direction?: "one_way" | "two_way";
  styleToken?: ArchitectureEdgeKind;
  arrowhead?: "filled" | "open" | "none";

  { value: "association",         label: "Association",       hint: "Basic undirected link" },
  { value: "inheritance",         label: "Inheritance",       hint: "Extends / Generalization (hollow ▷)" },
  { value: "aggregation",         label: "Aggregation",       hint: "Has-a / shared (◇——)" },
  { value: "dependency",          label: "Dependency",        hint: "Uses / depends on (- - →)" },

  const first = (label ?? "").toLowerCase().trim().split(/[\s,]/)[0];
  if (first === "implements" || first === "realizes" || first === "realization")  return "realization";
  if (first === "aggregates" || first === "aggregation" || first === "has")       return "aggregation";
    first === "composes" || first === "composition" ||
  ) return "composition";
    return "directedAssociation";
  return "association";

  inheritance:         "extends",
  dependency:          "depends on",
  composition:         "composes",
  association:         "",


  id,
  sourcePosition, targetPosition,
}: EdgeProps) {
  const relType: UMLRelType = d.relationshipType ?? "association";
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    targetX, targetY, targetPosition,
  });
  const isDashed  = relType === "realization" || relType === "dependency";
    relType === "inheritance"  ? "#4f46e5"
    : relType === "aggregation"  ? "#374151"
    : "#64748b";
  let markerEnd   = "";
  switch (relType) {
    case "realization":         markerEnd   = "url(#uml-realize)"; break;
    case "dependency":          markerEnd   = "url(#uml-dep)";     break;
    case "composition":         markerStart = "url(#uml-comp)";    break;

  const dy   = targetY - sourceY;
  const srcLX = sourceX + (dx / len) * 30;
  const tgtLX = targetX - (dx / len) * 30;


    <>
      <defs>
        <marker
          refX="12" refY="6"
          orient="auto"
          <polygon points="0,0 13,6 0,12"
        </marker>
        {}
          id="uml-realize" viewBox="0 0 13 12"
          markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="12"
        >
            fill="white" stroke="#6b7280" strokeWidth="1.5" strokeLinejoin="round" />

        <marker
          refX="0" refY="5"
          orient="auto"
          <polygon points="0,5 12,0 24,5 12,10"
        </marker>
        {}
          id="uml-comp" viewBox="0 0 24 10"
          markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="10"
        >
            fill="#0f172a" stroke="#0f172a" strokeWidth="1" strokeLinejoin="round" />

        <marker
          refX="10" refY="5"
          orient="auto"
          <path d="M0,1 L10,5 L0,9"
            strokeLinecap="round" strokeLinejoin="round" />

        <marker
          refX="10" refY="5"
          orient="auto"
          <path d="M0,1 L10,5 L0,9"
            strokeLinecap="round" strokeLinejoin="round" />
      </defs>
      <BaseEdge
        style={{
          strokeWidth:      selected ? 2.5 : 1.5,
          filter:           selected ? "drop-shadow(0 0 3px rgba(59,130,246,0.4))" : undefined,
        markerEnd={markerEnd || undefined}
        interactionWidth={14}

        <EdgeLabelRenderer>
            <div
              style={{
                transform:  `translate(-50%,-50%) translate(${srcLX}px,${srcLY}px)`,
                fontFamily: "ui-monospace, monospace",
                background: "rgba(248,250,252,0.92)",
                borderRadius: 2,
                userSelect: "none",
              }}
              {d.sourceMultiplicity}
          )}
            <div
              style={{
                transform:  `translate(-50%,-50%) translate(${tgtLX}px,${tgtLY}px)`,
                fontFamily: "ui-monospace, monospace",
                background: "rgba(248,250,252,0.92)",
                borderRadius: 2,
                userSelect: "none",
              }}
              {d.targetMultiplicity}
          )}
            <div
              style={{
                transform:  `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
                fontFamily: "Inter, sans-serif",
                background: "rgba(248,250,252,0.92)",
                borderRadius: 3,
                pointerEvents: "none",
                whiteSpace: "nowrap",
            >
            </div>
        </EdgeLabelRenderer>
    </>
});
const ARCH_STYLE: Record<ArchitectureEdgeKind, {
  width: number;
  labelFill: string;
  marker: string;
  primary: {
    width: 2.8,
    labelBg: "#dbeafe",
  },
    stroke: "#d97706",
    dash: "7 5",
    labelBg: "#ffedd5",
  },
    stroke: "#7c3aed",
    labelFill: "#6d28d9",
    marker: "url(#arch-arrow-violet)",
  observability: {
    width: 1.7,
    labelFill: "#334155",
    marker: "url(#arch-arrow-slate)",
  external: {
    width: 1.9,
    labelBg: "#ccfbf1",
  },
    stroke: "#94a3b8",
    labelFill: "#475569",
    marker: "url(#arch-arrow-muted)",
};
export const ArchitectureEdge = memo(function ArchitectureEdge({
  sourcePosition, targetPosition,
}: EdgeProps) {
  const kind = edgeData.styleToken ?? "secondary";

    ? getStraightPath({
        sourceY,
        targetY,
    : getSmoothStepPath({
        sourceY,
        targetX,
        targetPosition,
        offset: 18,

  const openMarkerId = filledMarkerId.replace("arch-arrow-", "arch-open-arrow-");
    ? undefined
    ? `url(#${openMarkerId})`
  const isDashed = edgeData.dashed ?? !!style.dash;

    <>
        {[
          ["arch-arrow-amber", "#d97706"],
          ["arch-arrow-slate", "#475569"],
          ["arch-arrow-muted", "#94a3b8"],
          <g key={id}>
              id={id}
              refX="10"
              markerUnits="userSpaceOnUse"
              markerHeight="12"
            >
            </marker>
              id={id.replace("arch-arrow-", "arch-open-arrow-")}
              refX="10"
              markerUnits="userSpaceOnUse"
              markerHeight="12"
            >
            </marker>
        ))}

        path={edgePath}
          stroke: selected ? "#1d4ed8" : style.stroke,
          strokeDasharray: isDashed ? style.dash ?? "6 4" : undefined,
        }}
        markerStart={isTwoWay ? markerRef : undefined}
      />
      {edgeData.label && (
          <div
            style={{
              transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
              fontWeight: 600,
              background: style.labelBg,
              borderRadius: 999,
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
            {edgeData.label}
        </EdgeLabelRenderer>
    </>
});




  label?: string;
  edgeStyle?: "solid" | "dashed";
  direction?: "one_way" | "two_way";
  labelOffsetX?: number;
}
const FLOW_REL_PREFIX: Record<string, string> = {
  extend:       "<<extend>>",
  communicate:  "«comm»",
};
export const FlowEdge = memo(function FlowEdge({
  sourceX, sourceY, targetX, targetY,
  data, selected,
  const [editing, setEditing] = useState(false);
  const { setEdges } = useReactFlow();

  const isDashed    = d.edgeStyle === "dashed";
  const isTwoWay    = d.direction === "two_way";

    ? getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 8 })

  const strokeSel = "#3b82f6";
  const markerFilled  = selected ? "url(#flow-arrow-sel)"       : "url(#flow-arrow)";
  const markerTriangle = selected ? "url(#flow-hollow-triangle-sel)" : "url(#flow-hollow-triangle)";
                      : arrowType === "open"     ? markerOpen
                      : markerFilled;

  const userLabel = (d.label ?? "").trim();
    prefix && !userLabel
      : prefix && userLabel.toLowerCase() === prefix.toLowerCase()
      : prefix && userLabel
      : userLabel;
  const labelOffsetY = typeof d.labelOffsetY === "number" ? d.labelOffsetY : 0;
  const commitLabel = useCallback((val: string) => {
      e.id === id ? { ...e, data: { ...(e.data ?? {}), label: val.trim() } } : e
    setEditing(false);

    <>
        {}
          markerUnits="strokeWidth" markerWidth="6" markerHeight="6" orient="auto">
        </marker>
        <marker id="flow-arrow-sel" viewBox="0 0 10 10" refX="9" refY="5"
          <path d="M0,0 L10,5 L0,10 z" fill={strokeSel} />
        {}
          markerUnits="strokeWidth" markerWidth="7" markerHeight="7" orient="auto">
            strokeLinecap="round" strokeLinejoin="round" />
        {}
          markerUnits="strokeWidth" markerWidth="7" markerHeight="7" orient="auto">
            strokeLinecap="round" strokeLinejoin="round" />
        {}
          markerUnits="strokeWidth" markerWidth="8" markerHeight="8" orient="auto">
        </marker>
        <marker id="flow-hollow-triangle-sel" viewBox="0 0 12 12" refX="11" refY="6"
          <path d="M1,1 L11,6 L1,11 Z" fill="#ffffff" stroke={strokeSel} strokeWidth="1.5" />
      </defs>
      <BaseEdge
        path={edgePath}
          stroke,
          strokeDasharray: isDashed ? "6,4" : undefined,
        }}
        markerStart={markerStart}
      />
      <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%,-50%) translate(${labelX + labelOffsetX}px,${labelY + labelOffsetY}px)`,
              zIndex:    10,
          >
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setEditing(false);
              className="text-[11px] bg-white border border-blue-400 rounded-lg px-2.5 py-1 shadow-sm focus:outline-none w-32 text-center font-medium text-gray-700"
          </div>
          <div
              e.stopPropagation();
              setEditing(true);
            className="nodrag nopan"
              position:  "absolute",
              pointerEvents: "all",
            }}
            {displayLabel ? (
                {displayLabel}
            ) : selected ? (
                double-click to label
            ) : null}
        )}
    </>
});



  relType,
  size = 30,
  relType: UMLRelType;
  size?: number;
  const c  = active ? "#3b82f6" : "#9ca3af";

    case "inheritance":
        <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
          <polygon points={`${size-12},2 ${size-1},7 ${size-12},12`}
        </svg>
    case "realization":
        <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
          <polygon points={`${size-12},2 ${size-1},7 ${size-12},12`}
        </svg>
    case "aggregation":
        <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
          <polygon points={`0,7 7,2 14,7 7,12`} fill="white" stroke={c} strokeWidth="1.5" />
      );
      return (
          <line x1="14" y1="7" x2={size} y2="7" stroke={c} strokeWidth="1.5" />
        </svg>
    case "directedAssociation":
        <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
          <path d={`M${size-9},3 L${size-1},7 L${size-9},11`}
            strokeLinecap="round" strokeLinejoin="round" />
      );
      return (
          <line x1="0" y1="7" x2={size - 9} y2="7" stroke={c} strokeWidth="1.5" strokeDasharray="4,3" />
            fill="none" stroke={c} strokeWidth="1.5"
        </svg>
    default:
        <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
        </svg>
  }
