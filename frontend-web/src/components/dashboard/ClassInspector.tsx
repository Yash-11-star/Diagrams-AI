"use client";
import { useState, useCallback, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
  type ClassAttribute, type ClassMethod, type ClassKind, type ClassNodeData,
} from "@/lib/classTypes";
interface ClassInspectorProps {
}
const CLASS_NODE_TYPES = new Set(["classNode", "interfaceNode", "abstractNode", "enumNode"]);
const KIND_OPTIONS: { value: ClassKind; label: string; nodeType: string }[] = [
  { value: "interface", label: "Interface", nodeType: "interfaceNode" },
  { value: "enum",      label: "Enum",      nodeType: "enumNode" },

  attr,
  onDelete,
  attr: ClassAttribute;
  onDelete: () => void;
  const [localName, setLocalName] = useState(attr.name);

  if (attr.id !== prevId) {
    setLocalType(attr.type);
  }
  const commit = () => {
  };
  return (
      {}
        onMouseDown={(e) => e.preventDefault()}
        className="shrink-0 w-5 h-5 flex items-center justify-center text-[11px] font-mono font-bold text-gray-500 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
      >
      </button>
      <input
        onChange={(e) => setLocalName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
        placeholder="name"
      <span className="text-[10px] text-gray-400 shrink-0">:</span>
      <input
        onChange={(e) => setLocalType(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
        placeholder="String"
      {}
        onMouseDown={(e) => e.preventDefault()}
        title="Static"
          attr.isStatic ? "bg-gray-700 text-white border-gray-700" : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
      >S</button>
      <button
        onClick={() => onUpdate({ isAbstract: !attr.isAbstract })}
        className={`shrink-0 text-[8px] font-bold w-5 h-5 flex items-center justify-center rounded border transition-colors ${
        }`}
      {}
        onMouseDown={(e) => e.preventDefault()}
        className="shrink-0 hidden group-hover:flex w-5 h-5 items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
      >
      </button>
  );

  method,
  onDelete,
  method: ClassMethod;
  onDelete: () => void;
  const sigStr = `${method.name}(${method.parameters}): ${method.returnType}`;

  if (method.id !== prevId) {
    setPrevId(method.id);

    const parsed = parseMethodString(`${method.visibility} ${localSig.trim() || sigStr}`, 0);
  };
  const textStyle = [method.isStatic ? "underline" : "", method.isAbstract ? "italic" : ""].filter(Boolean).join(" ");
  return (
      {}
        onMouseDown={(e) => e.preventDefault()}
        className="shrink-0 w-5 h-5 flex items-center justify-center text-[11px] font-mono font-bold text-gray-500 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
      >
      </button>
      <input
        onChange={(e) => setLocalSig(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
        placeholder="name(params): void"
      {}
        onMouseDown={(e) => e.preventDefault()}
        title="Static"
          method.isStatic ? "bg-gray-700 text-white border-gray-700" : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
      >S</button>
      <button
        onClick={() => onUpdate({ isAbstract: !method.isAbstract })}
        className={`shrink-0 text-[8px] font-bold w-5 h-5 flex items-center justify-center rounded border transition-colors ${
        }`}
      {}
        onMouseDown={(e) => e.preventDefault()}
        className="shrink-0 hidden group-hover:flex w-5 h-5 items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
      >
      </button>
  );

  const nodes = useNodes();
  const [editingName, setEditingName] = useState(false);
  const node = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

  const attrs: ClassAttribute[] = Array.isArray(d.attributes) ? d.attributes : [];
  const kind: ClassKind = d.classKind ?? "class";
  useEffect(() => { setEditingName(false); }, [selectedNodeId]);
  const updateData = useCallback((patch: Partial<ClassNodeData>) => {
    setNodes((ns) => ns.map((n) => n.id === selectedNodeId ? { ...n, data: { ...n.data, ...patch } } : n));

    updateData({ attributes: attrs.map((a, i) => i === idx ? { ...a, ...u } : a) });

    updateData({ attributes: attrs.filter((_, i) => i !== idx) });

    updateData({ attributes: [...attrs, blankAttribute(attrs.length)] });

    updateData({ methods: methods.map((m, i) => i === idx ? { ...m, ...u } : m) });

    updateData({ methods: methods.filter((_, i) => i !== idx) });

    updateData({ methods: [...methods, blankMethod(methods.length)] });

    const t = val.trim();
    setEditingName(false);

    if (!selectedNodeId) return;
      n.id === selectedNodeId
        : n
  }, [selectedNodeId, setNodes]);
  if (!isClassNode) {
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5 text-center">
          <span className="text-[18px] text-gray-400 font-mono font-bold">C</span>
        <p className="text-[13px] font-medium text-gray-500">No class selected</p>
          Click a class node on the canvas to edit its properties here.
      </div>
  }
  const showAttrs = kind !== "interface";

    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-100">
        {editingName ? (
            autoFocus
            onBlur={(e) => commitName(e.target.value)}
              if (e.key === "Enter") commitName((e.target as HTMLInputElement).value);
            }}
          />
          <button
            className="w-full text-left px-2.5 py-1.5 text-[13px] font-semibold text-gray-800 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
          </button>
      </div>
      {}
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Kind</p>
          {KIND_OPTIONS.map((opt) => (
              key={opt.value}
              className={`py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                  ? "bg-blue-50 text-blue-700 border-blue-300"
              }`}
              {opt.label}
          ))}
      </div>
      {}
        <div className="border-b border-gray-100">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{attrLabel}</p>
              onClick={addAttr}
              title={`Add ${attrLabel.slice(0, -1).toLowerCase()}`}
              <Plus size={10} /> Add
          </div>
            <p className="text-[11px] text-gray-400 italic px-4 py-2">No {attrLabel.toLowerCase()} yet</p>
          {attrs.map((a, i) => (
              key={a.id}
              onUpdate={(u) => updateAttr(i, u)}
            />
        </div>

      {kind !== "enum" && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
            <button
              className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-semibold"
            >
            </button>
          {methods.length === 0 && (
          )}
            <InspectorMethodRow
              method={m}
              onDelete={() => deleteMethod(i)}
          ))}
      )}
      {}
        <p className="text-[10px] text-gray-400">
          {kind !== "enum" ? ` · ${methods.length} method${methods.length !== 1 ? "s" : ""}` : ""}
      </div>
  );
