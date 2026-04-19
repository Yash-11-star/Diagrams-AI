"use client";
import { Check, Layers, Plus } from "lucide-react";
import { RELATIONSHIP_TYPE_OPTIONS } from "@/lib/architecturePresets";
import type { StoredVariant } from "@/lib/db/indexedDb";
function VariantPanel({
  activeVariantId,
  onSwitch,
}: {
  activeVariantId: string | null;
  onSwitch: (variant: StoredVariant) => void;
}) {

    <>
        <Layers size={11} className="text-gray-400" />
      </div>
        {variants.map((variant) => {
          const svg = previews[variant.id];
            <button
              onClick={() => onSwitch(variant)}
                active
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            >
                {svg ? <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="text-[9px] text-gray-300">No preview</div>}
              <div className="px-2.5 py-1.5 flex items-center justify-between gap-1.5">
                  {variant.label}
                <div className="flex items-center gap-1 shrink-0">
                  {active && <Check size={10} className="text-blue-500" />}
              </div>
          );
      </div>
  );

  activeRelationshipType,
  onAddLayer,
  variants,
  isDirty,
  previews,
  activeRelationshipType: ArchitectureRelationshipType;
  onAddLayer: () => void;
  variants: StoredVariant[];
  isDirty: boolean;
  previews: Record<string, string>;
  const library = getCanvasLibrary("system_arch");
  return (
      <VariantPanel
        activeVariantId={activeVariantId}
        onSwitch={onSwitchVariant}
      />
      <div className="px-4 py-3 border-b border-gray-100">
      </div>
      <div className="p-3 flex flex-col gap-4">
          <p className="px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Layers</p>
            onClick={onAddLayer}
          >
            Add Layer
        </div>
        <div className="flex flex-col gap-1.5">
          {library.shapes.map((shape) => (
              key={shape.id}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left text-[12px] font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
              {shape.label}
          ))}

          <p className="px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Add Relationship</p>
            const active = activeRelationshipType === option.value;
              <button
                onClick={() => onRelationshipTypeChange(option.value)}
                className={`rounded-xl border px-3 py-2.5 text-left text-[12px] font-medium transition-all ${
                    ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                }`}
                <span className="block">{option.label}</span>
              </button>
          })}
      </div>
      <div className="mt-auto px-4 py-3 border-t border-gray-100">
          Add layers explicitly, then drag components between them. Choose a relationship type before dragging from one handle to another.
      </div>
  );
