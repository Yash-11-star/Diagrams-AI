"use client";
import { Layers, Check } from "lucide-react";

  | "select"
  | "participant"
  | "sync"
  | "return"
  | "loop"
  | "opt"
  | "activation"
  | "divider";
const GROUPS: { label: string; tools: { id: SequenceTool; label: string; hint: string }[] }[] = [
    label: "Participants",
      { id: "actor", label: "Actor", hint: "Add an external actor lane" },
      { id: "system", label: "System", hint: "Add a system/service lane" },
  },
    label: "Messages",
      { id: "sync", label: "Synchronous Message", hint: "Drag from one lifeline to another" },
      { id: "return", label: "Return Message", hint: "Create a dashed return arrow" },
    ],
  {
    tools: [
      { id: "alt", label: "Alt", hint: "Drag over a step range" },
      { id: "par", label: "Par", hint: "Drag over a step range" },
  },
    label: "Others",
      { id: "activation", label: "Activation Bar", hint: "Drag down a lifeline" },
      { id: "divider", label: "Divider", hint: "Click a row" },
  },

  variants,
  isDirty,
  previews,
  variants: StoredVariant[];
  isDirty: boolean;
  previews: Record<string, string>;
  if (variants.length <= 1) return null;
  return (
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center gap-1.5">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Variants</p>
      <div className="p-2.5 border-b border-gray-100 flex flex-col gap-1.5">
          const active = variant.id === activeVariantId;
          return (
              key={variant.id}
              className={`group relative flex flex-col rounded-xl border overflow-hidden text-left transition-all ${
                  ? "border-blue-400 bg-blue-50 shadow-sm"
              }`}
              <div className="w-full h-[72px] bg-gray-50 flex items-center justify-center overflow-hidden">
              </div>
                <span className={`text-[11px] font-medium truncate ${active ? "text-blue-700" : "text-gray-600"}`}>
                </span>
                  {active && isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </div>
            </button>
        })}
    </>
}
export function SequencePalette({
  onToolChange,
  activeVariantId,
  onSwitchVariant,
}: {
  onToolChange: (tool: SequenceTool) => void;
  activeVariantId: string | null;
  onSwitchVariant: (variant: StoredVariant) => void;
}) {
    <aside className="w-[232px] shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        variants={variants}
        isDirty={isDirty}
        previews={previews}

        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Sequence Tools</p>

        <button
          className={`w-full rounded-xl border px-3 py-2.5 text-left text-[12px] font-medium transition-all ${
              ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
          }`}
          Select / Move

          <div key={group.label}>
            <div className="flex flex-col gap-1.5">
                const active = activeTool === tool.id;
                  <button
                    onClick={() => onToolChange(tool.id)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-[12px] font-medium transition-all ${
                        ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                    }`}
                    {tool.label}
                );
            </div>
        ))}

        <p className="text-[10px] text-gray-400 leading-relaxed">
        </p>
    </aside>
}
