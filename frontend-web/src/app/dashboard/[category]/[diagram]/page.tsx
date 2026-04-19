"use client";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Upload, ArrowRight } from "lucide-react";
import { getCategoryById, getDiagramMeta, DIAGRAM_COLOR_MAP } from "@/lib/categories";
const METHODS = [
    id: "prompt",
    title: "Generate from Prompt",
      "Describe your diagram in plain English. AI refines your prompt and generates a structured, editable diagram.",
  },
    id: "image",
    title: "Generate from Image",
      "Upload a whiteboard photo, sketch, or existing diagram. AI extracts and converts it into an editable canvas.",
  },

  params,
  params: { category: string; diagram: string };
  const category = getCategoryById(params.category);
  if (!category || !diagram) notFound();
  const c = DIAGRAM_COLOR_MAP[diagram.color] ?? DIAGRAM_COLOR_MAP["blue"];
    (Icons as unknown as Record<string, Icons.LucideIcon>)[diagram.icon] ?? Icons.GitBranch;
  return (
      {}
        href={`/dashboard/${params.category}`}
      >
        {category.label}

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
        <div
        >
        </div>
          {diagram.label}
        <p className="text-[15px] text-apple-gray mt-2 leading-relaxed">
        </p>

      <div className="flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            <Link
            >
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    size={19}
                  />

                  <h2 className="text-[16px] font-semibold text-apple-dark group-hover:text-apple-blue transition-colors mb-1">
                  </h2>
                    {method.description}
                </div>
                <ArrowRight
                  className="text-gray-300 group-hover:text-apple-blue group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0"
              </div>
          </motion.div>
      </div>
  );
