"use client";
import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  blankAttribute, blankMethod, nextVisibility, parseMethodString,

  id,
  textClass = "text-apple-dark",
}: {
  label: string;
  onCommitLabel?: (nodeId: string, label: string) => void;
  const { setNodes } = useReactFlow();

    (val: string) => {
        onCommitLabel(id, val);
        return;
      setNodes((ns) =>
      );
    },
  );
  if (editing) {
      <input
        defaultValue={label}
        onKeyDown={(e) => {
          if (e.key === "Escape") setEditing(false);
        className={`bg-transparent text-center text-[12px] font-medium w-full focus:outline-none min-w-0 ${textClass}`}
    );

    <span
      className={`text-[12px] font-medium leading-tight text-center cursor-text select-none px-1 ${textClass}`}
    >
    </span>
}
const HANDLE_STYLE = { width: 9, height: 9, border: "2px solid #d1d5db" };
const USE_CASE_HANDLE_STYLE = { width: 5, height: 5, border: "1.25px solid #cbd5e1", background: "#ffffff" };
function DefaultHandles() {

    <>
      <Handle id="src-top"    type="source" position={Position.Top}    style={{ ...HANDLE_STYLE, background: "#34d399", top:    -5 }} />
      <Handle id="src-right"  type="source" position={Position.Right}  style={{ ...HANDLE_STYLE, background: "#34d399", right:  -5 }} />
      <Handle id="src-bottom" type="source" position={Position.Bottom} style={{ ...HANDLE_STYLE, background: "#34d399", bottom: -5 }} />
      <Handle id="src-left"   type="source" position={Position.Left}   style={{ ...HANDLE_STYLE, background: "#34d399", left:   -5 }} />
  );

  const topSlots = ["18%", "50%", "82%"];

    <>
        <div key={`top-${left}`}>
          <Handle id={`s-top-${index + 1}`} type="source" position={Position.Top} style={{ ...ARCH_HANDLE_STYLE, top: -9, left, background: "#bfdbfe" }} />
      ))}
        <div key={`bottom-${left}`}>
          <Handle id={`s-bottom-${index + 1}`} type="source" position={Position.Bottom} style={{ ...ARCH_HANDLE_STYLE, bottom: -9, left, background: "#bbf7d0" }} />
      ))}
        <div key={`left-${top}`}>
          <Handle id={`s-left-${index + 1}`} type="source" position={Position.Left} style={{ ...ARCH_HANDLE_STYLE, left: -9, top, background: "#bae6fd" }} />
      ))}
        <div key={`right-${top}`}>
          <Handle id={`s-right-${index + 1}`} type="source" position={Position.Right} style={{ ...ARCH_HANDLE_STYLE, right: -9, top, background: "#d9f99d" }} />
      ))}
  );

  const topSlots = ["20%", "50%", "80%"];

    <>
        <div key={`uc-top-${left}`}>
          <Handle id={`s-top-${index + 1}`} type="source" position={Position.Top} style={{ ...USE_CASE_HANDLE_STYLE, top: -9, left, background: "#bfdbfe" }} />
      ))}
        <div key={`uc-bottom-${left}`}>
          <Handle id={`s-bottom-${index + 1}`} type="source" position={Position.Bottom} style={{ ...USE_CASE_HANDLE_STYLE, bottom: -9, left, background: "#bbf7d0" }} />
      ))}
        <div key={`uc-left-${top}`}>
          <Handle id={`s-left-${index + 1}`} type="source" position={Position.Left} style={{ ...USE_CASE_HANDLE_STYLE, left: -9, top, background: "#bae6fd" }} />
      ))}
        <div key={`uc-right-${top}`}>
          <Handle id={`s-right-${index + 1}`} type="source" position={Position.Right} style={{ ...USE_CASE_HANDLE_STYLE, right: -9, top, background: "#d9f99d" }} />
      ))}
  );

  if (architecture) return <ArchitectureHandles />;
  return <DefaultHandles />;

  <div
      selected ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-gray-300 hover:border-gray-400"
  >
    <Handles architecture={(data as { diagramType?: string }).diagramType === "system_arch"} />
      id={id}
      textClass="text-gray-800"
    />
));

  <div className="relative" style={{ width: 160, height: 80 }}>
    <svg width="100%" height="100%" viewBox="0 0 160 80" className="absolute inset-0">
        points="80,4 156,40 80,76 4,40"
        stroke={selected ? "#f59e0b" : "#d97706"}
      />
    <div className="absolute inset-0 flex items-center justify-center px-8">
        id={id}
        textClass="text-amber-800"
      />
    {(data as { diagramType?: string }).diagramType === "system_arch" ? (
    ) : (
        <Handle id="tgt-top"    type="target" position={Position.Top}    style={{ ...HANDLE_STYLE, background: "#60a5fa", top:    -5, left: "50%" }} />
        <Handle id="tgt-bottom" type="target" position={Position.Bottom} style={{ ...HANDLE_STYLE, background: "#60a5fa", bottom: -5, left: "50%" }} />
        <Handle id="tgt-right"  type="target" position={Position.Right}  style={{ ...HANDLE_STYLE, background: "#60a5fa", right:  -5, top:  "50%" }} />
        <Handle id="tgt-left"   type="target" position={Position.Left}   style={{ ...HANDLE_STYLE, background: "#60a5fa", left:   -5, top:  "50%" }} />
      </>
  </div>
DecisionNode.displayName = "DecisionNode";
export const StartNode = memo(({ id, data, selected }: NodeProps) => (
    className={`relative flex items-center justify-center min-w-[100px] min-h-[40px] px-5 py-2 rounded-full border-2 bg-blue-50 transition-colors ${
    }`}
    <NodeResizer isVisible={selected} minWidth={80} minHeight={32} color="#3b82f6" />
    <NodeLabel
      label={(data as { label: string }).label}
      onCommitLabel={(data as { onLabelChange?: (nodeId: string, label: string) => void }).onLabelChange}
  </div>
StartNode.displayName = "StartNode";
export const EndNode = memo(({ id, data, selected }: NodeProps) => (
    className={`relative flex items-center justify-center min-w-[100px] min-h-[40px] px-5 py-2 rounded-full border-2 bg-emerald-50 transition-colors ${
    }`}
    <NodeResizer isVisible={selected} minWidth={80} minHeight={32} color="#10b981" />
    <NodeLabel
      label={(data as { label: string }).label}
      onCommitLabel={(data as { onLabelChange?: (nodeId: string, label: string) => void }).onLabelChange}
  </div>
EndNode.displayName = "EndNode";
export const IoNode = memo(({ id, data, selected }: NodeProps) => (
    <NodeResizer isVisible={selected} minWidth={100} minHeight={40} color="#a78bfa" />
      <polygon
        fill="#f5f3ff"
        strokeWidth="2"
    </svg>
      <NodeLabel
        label={(data as { label: string }).label}
        onCommitLabel={(data as { onLabelChange?: (nodeId: string, label: string) => void }).onLabelChange}
    </div>
  </div>
IoNode.displayName = "IoNode";
export const StorageNode = memo(({ id, data, selected }: NodeProps) => (
    <NodeResizer isVisible={selected} minWidth={100} minHeight={56} color="#fb923c" />
      <rect x="2" y="18" width="136" height="50" rx="4" fill="#fff7ed" stroke={selected ? "#ea580c" : "#fdba74"} strokeWidth="2" />
    </svg>
      <NodeLabel
        label={(data as { label: string }).label}
        onCommitLabel={(data as { onLabelChange?: (nodeId: string, label: string) => void }).onLabelChange}
    </div>
  </div>
StorageNode.displayName = "StorageNode";
export const ActorNode = memo(({ id, data, selected }: NodeProps) => (
    <div className="relative flex flex-col items-center justify-start min-w-[96px] min-h-[98px] px-2 pt-1 pb-2 rounded-xl border-2 border-transparent bg-transparent">
      <Handles useCase />
        <circle cx="35" cy="10" r="7" fill="none" stroke={selected ? "#0891b2" : "#0f172a"} strokeWidth="2" />
        <line x1="20" y1="26" x2="50" y2="26" stroke={selected ? "#0891b2" : "#0f172a"} strokeWidth="2" />
        <line x1="35" y1="40" x2="46" y2="58" stroke={selected ? "#0891b2" : "#0f172a"} strokeWidth="2" />
      <NodeLabel
        label={(data as { label: string }).label}
        onCommitLabel={(data as { onLabelChange?: (nodeId: string, label: string) => void }).onLabelChange}
    </div>
    <div
        selected ? "border-cyan-500 shadow-lg shadow-cyan-500/20" : "border-cyan-200 hover:border-cyan-300"
    >
      <Handles architecture={(data as { diagramType?: string }).diagramType === "system_arch"} />
        id={id}
        textClass="text-cyan-700"
      />
  )
ActorNode.displayName = "ActorNode";
export const QueueNode = memo(({ id, data, selected }: NodeProps) => (
    className={`relative flex items-center justify-center min-w-[140px] min-h-[44px] px-5 py-2.5 rounded-lg border-2 border-dashed bg-slate-50 transition-colors ${
    }`}
    <NodeResizer isVisible={selected} minWidth={100} minHeight={36} color="#64748b" />
    <NodeLabel
      label={(data as { label: string }).label}
      onCommitLabel={(data as { onLabelChange?: (nodeId: string, label: string) => void }).onLabelChange}
  </div>
QueueNode.displayName = "QueueNode";
export const UseCaseNode = memo(({ id, data, selected }: NodeProps) => (
    <NodeResizer isVisible={selected} minWidth={156} minHeight={62} color="#2563eb" />
      <ellipse
        cy="36"
        ry="32"
        stroke={selected ? "#2563eb" : "#94a3b8"}
      />
    <div className="absolute inset-0 flex items-center justify-center px-6">
        id={id}
        textClass="text-slate-700"
      />
    <Handles useCase />
));

  <div
      selected ? "border-blue-400 shadow-md shadow-blue-100/50" : "border-slate-300"
  >
    <div className="absolute top-2 left-4 right-4">
      <NodeLabel
        label={(data as { label: string }).label}
        onCommitLabel={(data as { onLabelChange?: (nodeId: string, label: string) => void }).onLabelChange}
    </div>
));

  const layerData = data as {
    label: string;
    subtitle?: string;
    style?: { background?: string; border?: string; accent?: string };
    onDescriptionChange?: (layerId: string, description: string) => void;
  };
  const [editingName, setEditingName] = useState(false);
  const [localName, setLocalName] = useState(layerData.label);
  const resizeState = useRef<{ startY: number; startHeight: number } | null>(null);
  useEffect(() => {
  }, [layerData.label]);
  useEffect(() => {
  }, [layerData.description, layerData.subtitle]);
  const commitName = useCallback(() => {
      layerData.onRename(layerData.layerId, localName.trim() || layerData.label);
    setEditingName(false);

    if (layerData.layerId && layerData.onDescriptionChange) {
    }
  }, [layerData, localDescription]);
  useEffect(() => {
      if (!resizeState.current || !layerData.layerId || !layerData.onHeightChange) return;
      layerData.onHeightChange(layerData.layerId, nextHeight);

      resizeState.current = null;

    window.addEventListener("mouseup", handleUp);
      window.removeEventListener("mousemove", handleMove);
    };

    <div
      style={{
        borderColor: layerData.style?.border ?? "#e2e8f0",
    >
        <div className="min-w-0">
          {editingName ? (
              autoFocus
              onChange={(event) => setLocalName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setEditingName(false);
              }}
            />
            <p onDoubleClick={() => setEditingName(true)} className="mt-1 text-[13px] font-semibold text-slate-700 truncate cursor-text">
            </p>
        </div>
          className="w-2.5 h-2.5 rounded-full shrink-0"
        />
      {editingDescription ? (
          autoFocus
          onChange={(event) => setLocalDescription(event.target.value)}
          className="m-4 w-[calc(100%-2rem)] resize-none rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-500 focus:outline-none"
        />
        <p onDoubleClick={() => setEditingDescription(true)} className="px-4 py-2 text-[11px] text-slate-400 cursor-text">
        </p>
      <div
        onMouseDown={(event) => {
          const wrapper = event.currentTarget.closest(".react-flow__node") as HTMLElement | null;
          resizeState.current = { startY: event.clientY, startHeight: height || 176 };
      />
  );
LayerNode.displayName = "LayerNode";
export const EntityNode = memo(({ id, data, selected }: NodeProps) => (
    className={`relative flex items-center justify-center min-w-[130px] min-h-[46px] px-4 py-2.5 rounded-lg border-2 bg-white transition-colors ${
    }`}
    <NodeResizer isVisible={selected} minWidth={100} minHeight={36} color="#1d4ed8" />
    <NodeLabel id={id} label={(data as { label: string }).label} textClass="text-gray-900 font-semibold" />
));

  <div className="relative" style={{ minWidth: 130, minHeight: 46 }}>
    <div
    />
      className={`absolute inset-[4px] rounded flex items-center justify-center border ${selected ? "border-blue-400" : "border-gray-500"} bg-white`}
      <NodeLabel id={id} label={(data as { label: string }).label} textClass="text-gray-800" />
    <Handles />
));

  <div className="relative" style={{ width: 130, height: 50 }}>
    <svg width="100%" height="100%" viewBox="0 0 130 50" className="absolute inset-0">
        cx="65" cy="25" rx="63" ry="23"
        stroke={selected ? "#4f46e5" : "#a5b4fc"}
      />
    <div className="absolute inset-0 flex items-center justify-center">
    </div>
  </div>
AttributeNode.displayName = "AttributeNode";
export const PkAttrNode = memo(({ id, data, selected }: NodeProps) => {
  const [editing, setEditing] = useState(false);

    (val: string) => {
        ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: val } } : n))
      setEditing(false);
    [id, setNodes]

    <div className="relative" style={{ width: 130, height: 50 }}>
      <svg width="100%" height="100%" viewBox="0 0 130 50" className="absolute inset-0">
          cx="65" cy="25" rx="63" ry="23"
          stroke={selected ? "#4f46e5" : "#818cf8"}
        />
      <div className="absolute inset-0 flex items-center justify-center">
          <input
            defaultValue={label}
            onKeyDown={(e) => { if (e.key === "Enter") commit((e.target as HTMLInputElement).value); }}
          />
          <span
            className="text-[12px] font-semibold text-indigo-800 underline cursor-text select-none"
            {label}
        )}
      <Handles />
  );
PkAttrNode.displayName = "PkAttrNode";



  return (
      {}
      <Handle id="t2" type="source" position={Position.Top}    style={{ ...CH, top: -4, left: "50%"  }} />
      {}
      <Handle id="b2" type="source" position={Position.Bottom} style={{ ...CH, bottom: -4, left: "50%" }} />
      {}
      <Handle id="l2" type="source" position={Position.Left}   style={{ ...CH, left: -4, top: "66%" }} />
      <Handle id="r1" type="source" position={Position.Right}  style={{ ...CH, right: -4, top: "33%" }} />
    </>
}
const ClassAttrRow = memo(function ClassAttrRow({
  onUpdate,
}: {
  onUpdate: (u: Partial<ClassAttribute>) => void;
}) {
  const [localName, setLocalName] = useState(attr.name);

  if (attr.id !== prevId) {
    setLocalType(attr.type);
  }
  const commit = useCallback(() => {
    setEditing(false);


    return (
        <button
          onClick={() => onUpdate({ visibility: nextVisibility(attr.visibility) })}
          title="Cycle visibility"
        <input
          value={localName}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
          }}
          placeholder="name"
        <span className="text-[9px] text-gray-400 shrink-0">:</span>
          value={localType}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
          }}
          className="nodrag w-[56px] shrink-0 bg-gray-50 border border-blue-300 rounded px-1 py-0.5 text-[10px] font-mono text-gray-500 focus:outline-none"
        />
    );

    <div
      onDoubleClick={() => { setLocalName(attr.name); setLocalType(attr.type); setEditing(true); }}
    >
        onMouseDown={(e) => e.preventDefault()}
        className="nodrag shrink-0 w-4 text-center text-[10px] font-mono font-bold text-gray-400 hover:text-gray-700"
      >{attr.visibility}</button>
        {attr.name}: {attr.type}{attr.defaultValue ? ` = ${attr.defaultValue}` : ""}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Delete"
    </div>
});
const ClassMethodRow = memo(function ClassMethodRow({
  onUpdate,
}: {
  onUpdate: (u: Partial<ClassMethod>) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (method.id !== prevId) {
    setPrevId(method.id);

    const parsed = parseMethodString(`${method.visibility} ${localSig.trim() || sigStr}`, 0);
    setEditing(false);


    return (
        <button
          onClick={() => onUpdate({ visibility: nextVisibility(method.visibility) })}
          title="Cycle visibility"
        <input
          value={localSig}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
          }}
          className="nodrag flex-1 min-w-0 bg-gray-50 border border-blue-300 rounded px-1 py-0.5 text-[10px] font-mono text-gray-800 focus:outline-none"
        />
    );

    <div
      onDoubleClick={() => { setLocalSig(sigStr); setEditing(true); }}
    >
        onMouseDown={(e) => e.preventDefault()}
        className="nodrag shrink-0 w-4 text-center text-[10px] font-mono font-bold text-gray-400 hover:text-gray-700"
      >{method.visibility}</button>
        {method.name}({method.parameters}): {method.returnType}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Delete"
    </div>
});
function UMLMemberSections({
  onUpdateAttr, onDeleteAttr, onAddAttr,
}: {
  methods: ClassMethod[];
  onUpdateAttr: (i: number, u: Partial<ClassAttribute>) => void;
  onAddAttr: () => void;
  onDeleteMethod: (i: number) => void;
}) {
    <>
        <div className="border-b border-gray-200">
            <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest text-center">Attributes</p>
          {attrs.length === 0 && (
          )}
            <ClassAttrRow
              attr={a}
              onDelete={() => onDeleteAttr(i)}
          ))}
            className="nodrag w-full flex items-center gap-1 px-2 py-1 text-[9px] text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
          </button>
      )}
        <div className="px-2 py-[2px] bg-gray-50 border-b border-gray-100">
        </div>
          <p className="text-[10px] text-gray-300 italic px-2 py-1 text-center">—</p>
        {methods.map((m, i) => (
            key={m.id}
            onUpdate={(u) => onUpdateMethod(i, u)}
          />
        <button
          onClick={onAddMethod}
          <Plus size={8} /> Add Method
      </div>
  );

  const { setNodes } = useReactFlow();
  const [editingName, setEditingName] = useState(false);
  const methods: ClassMethod[] = Array.isArray(d.methods) ? d.methods : [];
  const setAttrs = useCallback((next: ClassAttribute[]) => {
  }, [id, setNodes]);
  const setMethods = useCallback((next: ClassMethod[]) => {
  }, [id, setNodes]);
  const commitName = useCallback((val: string) => {
    if (t) setNodes((ns) => ns.map((n) => n.id === id ? { ...n, data: { ...n.data, label: t } } : n));
  }, [id, setNodes]);
  return (
      className={`relative bg-white rounded border-2 overflow-visible ${
      }`}
    >
      <ClassHandles />
      <div className="bg-violet-50 border-b border-gray-300 px-3 py-2 text-center">
          <input
            defaultValue={d.label}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitName((e.target as HTMLInputElement).value);
            }}
          />
          <p
            className="text-[13px] font-bold text-violet-900 select-none cursor-text"
          >{d.label}</p>
      </div>
        attrs={attrs} methods={methods} showAttrs
        onDeleteAttr={(i) => setAttrs(attrs.filter((_, j) => j !== i))}
        onUpdateMethod={(i, u) => setMethods(methods.map((m, j) => j === i ? { ...m, ...u } : m))}
        onAddMethod={() => setMethods([...methods, blankMethod(methods.length)])}
    </div>
});

  const { setNodes } = useReactFlow();
  const [editingName, setEditingName] = useState(false);

    setNodes((ns) => ns.map((n) => n.id === id ? { ...n, data: { ...n.data, methods: next } } : n));

    const t = val.trim();
    setEditingName(false);

    <div
        selected ? "border-indigo-600 shadow-lg shadow-indigo-500/20" : "border-gray-700 hover:border-gray-900"
      style={{ minWidth: 200 }}
      <NodeResizer isVisible={selected} minWidth={180} minHeight={100} color="#4f46e5" />
      {}
        <p className="text-[9px] italic text-indigo-400 mb-0.5">«interface»</p>
          <input
            defaultValue={d.label}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitName((e.target as HTMLInputElement).value);
            }}
          />
          <p
            className="text-[13px] font-bold text-indigo-900 select-none cursor-text"
          >{d.label}</p>
      </div>
        attrs={[]} methods={methods} showAttrs={false}
        onUpdateMethod={(i, u) => setMethods(methods.map((m, j) => j === i ? { ...m, ...u } : m))}
        onAddMethod={() => setMethods([...methods, blankMethod(methods.length)])}
    </div>
});

  const { setNodes } = useReactFlow();
  const [editingName, setEditingName] = useState(false);
  const methods: ClassMethod[] = Array.isArray(d.methods) ? d.methods : [];
  const setAttrs = useCallback((next: ClassAttribute[]) => {
  }, [id, setNodes]);
  const setMethods = useCallback((next: ClassMethod[]) => {
  }, [id, setNodes]);
  const commitName = useCallback((val: string) => {
    if (t) setNodes((ns) => ns.map((n) => n.id === id ? { ...n, data: { ...n.data, label: t } } : n));
  }, [id, setNodes]);
  return (
      className={`relative bg-white rounded border-2 border-dashed overflow-visible ${
      }`}
    >
      <ClassHandles />
      <div className="bg-slate-50 border-b border-gray-300 px-3 py-2 text-center">
        {editingName ? (
            autoFocus
            onBlur={(e) => commitName(e.target.value)}
              e.stopPropagation();
              if (e.key === "Escape") setEditingName(false);
            className="nodrag w-full bg-transparent text-[13px] font-bold italic text-slate-700 text-center focus:outline-none"
        ) : (
            onDoubleClick={() => setEditingName(true)}
            title="Double-click to rename"
        )}
      <UMLMemberSections
        onUpdateAttr={(i, u) => setAttrs(attrs.map((a, j) => j === i ? { ...a, ...u } : a))}
        onAddAttr={() => setAttrs([...attrs, blankAttribute(attrs.length)])}
        onDeleteMethod={(i) => setMethods(methods.filter((_, j) => j !== i))}
      />
  );
AbstractNode.displayName = "AbstractNode";
export const EnumNode = memo(({ id, data, selected }: NodeProps) => {
  const d = data as unknown as ClassNodeData;
  const attrs: ClassAttribute[] = Array.isArray(d.attributes) ? d.attributes : [];
  const setAttrs = useCallback((next: ClassAttribute[]) => {
  }, [id, setNodes]);
  const commitName = useCallback((val: string) => {
    if (t) setNodes((ns) => ns.map((n) => n.id === id ? { ...n, data: { ...n.data, label: t } } : n));
  }, [id, setNodes]);
  return (
      className={`relative bg-white rounded border-2 overflow-visible ${
      }`}
    >
      <ClassHandles />
      <div className="bg-amber-50 border-b border-gray-300 px-3 py-2 text-center">
        {editingName ? (
            autoFocus
            onBlur={(e) => commitName(e.target.value)}
              e.stopPropagation();
              if (e.key === "Escape") setEditingName(false);
            className="nodrag w-full bg-transparent text-[13px] font-bold text-amber-900 text-center focus:outline-none"
        ) : (
            onDoubleClick={() => setEditingName(true)}
            title="Double-click to rename"
        )}
      {}
        <div className="px-2 py-[2px] bg-gray-50 border-b border-gray-100">
        </div>
          <p className="text-[10px] text-gray-300 italic px-2 py-1 text-center">—</p>
        {attrs.map((a, i) => (
            key={a.id}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setAttrs(attrs.filter((_, j) => j !== i)); }}
              title="Delete"
          </div>
        <button
          onClick={() => setAttrs([...attrs, blankAttribute(attrs.length)])}
          <Plus size={8} /> Add Value
      </div>
  );
EnumNode.displayName = "EnumNode";

const FieldRow = memo(function FieldRow({
  onUpdate,
  onMoveUp,
  isFirst,
}: {
  onUpdate: (u: Partial<ERDField>) => void;
  onMoveUp: () => void;
  isFirst: boolean;
}) {
  const [localName, setLocalName] = useState(field.name);
  const nameRef = useRef<HTMLInputElement>(null);
  const [prevId, setPrevId] = useState(field.id);
    setLocalName(field.name);
    setPrevId(field.id);

    onUpdate({ name: localName.trim() || field.name, dataType: localType.trim() || field.dataType });
  }, [localName, localType, field.name, field.dataType, onUpdate]);
  const rowBg = field.isPK ? "bg-amber-50 hover:bg-amber-100/60" :
                "bg-white hover:bg-gray-50";
  if (editing) {
      <div className={`flex items-center gap-1 px-2 py-1 border-b border-gray-100 ${rowBg}`}>
        <input
          autoFocus
          onChange={(e) => setLocalName(e.target.value)}
            e.stopPropagation();
            if (e.key === "Escape") { setLocalName(field.name); setLocalType(field.dataType); setEditing(false); }
          }}
          placeholder="column_name"
        {}
          value={localType}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commit(); }
          }}
          className="nodrag w-[72px] shrink-0 bg-white border border-blue-300 rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={() => onUpdate({ isPK: !field.isPK, isUnique: !field.isPK })}
            field.isPK ? "bg-amber-400 text-white border-amber-400" : "bg-white text-amber-500 border-amber-300 hover:bg-amber-50"
        >PK</button>
          onMouseDown={(e) => e.preventDefault()}
          className={`nodrag shrink-0 text-[8px] font-black px-1 py-0.5 rounded border transition-colors ${
          }`}
        {}
          onMouseDown={(e) => e.preventDefault()}
          className="nodrag shrink-0 text-[10px] text-green-600 hover:text-green-700 font-bold px-1"
        >✓</button>
    );

    <div
      onDoubleClick={() => { setLocalName(field.name); setLocalType(field.dataType); setEditing(true); }}
    >
      <span className="w-4 shrink-0 text-center">
        {field.isFK && !field.isPK && <span className="text-[8px] font-black text-sky-500">FK</span>}

      <span className={`font-mono text-[11px] font-medium flex-1 min-w-0 truncate leading-tight ${
      }`}>
      </span>
      {}
        {field.dataType}

      {field.isUnique && !field.isPK && (
      )}
      {}
        <button
          disabled={isFirst}
          title="Move up"
          <ChevronUp size={10} />
        <button
          disabled={isLast}
          title="Move down"
          <ChevronDown size={10} />
        <div className="w-px h-3 bg-gray-200 mx-0.5" />
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete field"
          <Trash2 size={9} />
      </div>
  );

  const { setNodes } = useReactFlow();
  const [editingHeader, setEditingHeader] = useState(false);

    d.tableStyle ??

    setNodes((ns) => ns.map((n) => n.id === id ? { ...n, data: { ...n.data, fields: newFields } } : n));

    const trimmed = val.trim();
    setEditingHeader(false);

    setFields([...fields, blankField(kind, fields.length)]);

    setFields(fields.map((f, i) => i === idx ? { ...f, ...update } : f));

    setFields(fields.filter((_, i) => i !== idx));

    const target = idx + dir;
    const next = [...fields];
    setFields(next);

    tableStyle === "weak" ? "bg-slate-600" :
    "bg-slate-800";
    tableStyle === "weak" ? "border-slate-500" :
    "border-slate-700";
  return (
      className={`relative bg-white rounded-lg border-2 shadow-sm overflow-visible ${
          ? "border-blue-500 shadow-lg shadow-blue-500/20"
      }`}
    >

      <Handle type="target" position={Position.Top}
      <Handle type="source" position={Position.Bottom}
      <Handle type="target" position={Position.Left}
      <Handle type="source" position={Position.Right}

      <div className={`${headerBg} px-3 py-2 rounded-t-[5px]`}>
          <p className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest text-center mb-0.5">
          </p>
        {editingHeader ? (
            autoFocus
            onBlur={(e) => commitLabel(e.target.value)}
              e.stopPropagation();
              if (e.key === "Escape") setEditingHeader(false);
            className="nodrag w-full bg-transparent text-white text-[13px] font-bold text-center focus:outline-none"
        ) : (
            onDoubleClick={() => setEditingHeader(true)}
            title="Double-click to rename table"
            {d.label}
        )}

      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border-b border-gray-200">
        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider flex-1">Column</span>
        <span className="w-4 shrink-0" />

      <div className="overflow-hidden rounded-b-[5px]">
          <div className="px-3 py-3 text-[11px] text-gray-400 italic text-center">
          </div>
        {fields.map((field, i) => (
            key={field.id}
            onUpdate={(u) => updateField(i, u)}
            onMoveUp={() => moveField(i, -1)}
            isFirst={i === 0}
          />

        <div className="nodrag flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-t border-gray-100">
            onClick={() => addField("regular")}
            title="Add field"
            <Plus size={10} />
          </button>
            onClick={() => addField("pk")}
            title="Add primary key field"
            <Plus size={10} />
          </button>
            onClick={() => addField("fk")}
            title="Add foreign key field"
            <Plus size={10} />
          </button>
      </div>
  );
TableNode.displayName = "TableNode";
export const nodeTypes = {
  architectureLayerNode: LayerNode,
  decisionNode:   DecisionNode,
  startNode:      StartNode,
  ioNode:         IoNode,
  useCaseBoundaryNode: UseCaseBoundaryNode,
  actorNode:      ActorNode,


  weakEntityNode: WeakEntityNode,
  pkAttrNode:     PkAttrNode,
  classNode:      ClassNode,
  abstractNode:   AbstractNode,
};
