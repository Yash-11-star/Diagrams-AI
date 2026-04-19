"use client";
import { useState, useCallback, useEffect } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Database } from "lucide-react";

  field,
  onDelete,
  onMoveDown,
  isLast,
  field: ERDField;
  onDelete: () => void;
  onMoveDown: () => void;
  isLast: boolean;
  const [localName, setLocalName] = useState(field.name);

    setLocalName(field.name);
  }, [field.name, field.dataType]);
  const commit = useCallback(() => {
      name: localName.trim() || field.name,
    });

    field.isPK ? "bg-amber-50/70" :
    "bg-white";
  return (
      {}
        {}
          {field.isPK && <span className="text-amber-500">PK</span>}
        </span>
        {}
          value={localName}
          onBlur={commit}
            if (e.key === "Enter") { e.preventDefault(); commit(); }
          className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[11px] font-mono text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
        />
        {}
          value={localType}
          onBlur={commit}
            if (e.key === "Enter") { e.preventDefault(); commit(); }
          className="w-[76px] shrink-0 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[10px] font-mono text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
        />

      <div className="flex items-center gap-1 pl-5">
          onClick={() => onUpdate({ isPK: !field.isPK, isUnique: !field.isPK })}
            field.isPK
              : "bg-white text-amber-500 border-amber-300 hover:bg-amber-50"
          title="Toggle Primary Key"

          onClick={() => onUpdate({ isFK: !field.isFK })}
            field.isFK
              : "bg-white text-sky-500 border-sky-300 hover:bg-sky-50"
          title="Toggle Foreign Key"

          onClick={() => onUpdate({ isNullable: !field.isNullable })}
            !field.isNullable && !field.isPK
              : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
          title={field.isNullable ? "Nullable — click to set NOT NULL" : "NOT NULL — click to allow NULL"}

          onClick={() => onUpdate({ isUnique: !field.isUnique })}
            field.isUnique && !field.isPK
              : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
          title="Toggle Unique constraint"


        <button
          disabled={isFirst}
          title="Move up"
          <ChevronUp size={11} />
        <button
          disabled={isLast}
          title="Move down"
          <ChevronDown size={11} />

        <button
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
        >
        </button>
    </div>
}
interface ERDInspectorProps {
}
export function ERDInspector({ selectedNodeId }: ERDInspectorProps) {
  const { setNodes } = useReactFlow();

  const isTableNode = !!(node && node.type === "tableNode");

  const fields: ERDField[] = Array.isArray(d?.fields) ? d.fields : [];
    d?.tableStyle ??

    setEditingName(false);

    (patch: Partial<ERDTableData & { nodeType: string }>) => {
        ns.map((n) =>
        )
    },
  );
  const setFieldsFn = useCallback(
    [updateData]

    (style: TableStyle) => {
        style === "weak" ? "weak" : style === "associative" ? "associative" : "entity";
    },
  );
  const addField = useCallback(
      setFieldsFn([...fields, blankField(kind, fields.length)]);
    [fields, setFieldsFn]

    (idx: number, update: Partial<ERDField>) => {
    },
  );
  const deleteField = useCallback(
      setFieldsFn(fields.filter((_, i) => i !== idx));
    [fields, setFieldsFn]

    (idx: number, dir: -1 | 1) => {
      if (target < 0 || target >= fields.length) return;
      [next[idx], next[target]] = [next[target], next[idx]];
    },
  );
  if (!isTableNode) {
      <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 text-center">
        <p className="text-[12px] text-gray-400 leading-relaxed">
            ? "Select a table node to inspect it."
        </p>
    );

    tableStyle === "weak" ? "bg-slate-600" :
    "bg-slate-800";
  const pkCount = fields.filter((f) => f.isPK).length;

    <div className="flex flex-col h-full overflow-hidden">
      <div className={`${headerBg} px-4 py-3 shrink-0`}>
          {tableStyle === "weak" ? "Weak Entity" :
           "Table"}
        {editingName ? (
            autoFocus
            onBlur={(e) => {
              setEditingName(false);
            onKeyDown={(e) => {
                updateData({ label: (e.target as HTMLInputElement).value.trim() || d.label });
              }
            }}
          />
          <button
            className="text-white text-[14px] font-bold tracking-wide hover:opacity-80 transition-opacity text-left w-full truncate"
          >
          </button>
      </div>
      {}
        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
        </p>
          {(["regular", "weak", "associative"] as TableStyle[]).map((style) => (
              key={style}
              className={`flex-1 text-[9px] font-semibold py-1 rounded-lg border transition-colors ${
                  ? style === "weak"
                    : style === "associative"
                    : "bg-slate-800 text-white border-slate-800"
              }`}
              {style === "associative" ? "Junction" : style === "weak" ? "Weak" : "Regular"}
          ))}
      </div>
      {}
        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
          <span className="text-gray-300 font-normal ml-1.5">{fields.length}</span>
        <div className="flex gap-1">
            onClick={() => addField("pk")}
            title="Add primary key column"
            <Plus size={8} />PK
          <button
            className="flex items-center gap-0.5 text-[9px] text-sky-600 hover:text-sky-700 hover:bg-sky-50 border border-sky-200 rounded px-1.5 py-0.5 transition-colors"
          >
          </button>
            onClick={() => addField("regular")}
            title="Add column"
            <Plus size={8} />Col
        </div>

      <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <button
              className="text-[11px] text-blue-500 hover:text-blue-600 hover:underline transition-colors"
              + Add a primary key
          </div>
          fields.map((field, i) => (
              key={field.id}
              onUpdate={(u) => updateField(i, u)}
              onMoveUp={() => moveField(i, -1)}
              isFirst={i === 0}
            />
        )}

      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 shrink-0">
          {pkCount} PK · {fkCount} FK · {fields.length} column{fields.length !== 1 ? "s" : ""}
      </div>
  );
