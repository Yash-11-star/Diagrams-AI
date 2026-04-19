"use client";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
  getCategoryById, getDiagramsByCategory,
  type DiagramMeta,

  const c = DIAGRAM_COLOR_MAP[d.color] ?? DIAGRAM_COLOR_MAP["blue"];

    <motion.div
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      <Link href={`/dashboard/${d.categoryId}/${d.id}`}>
          {}
            <IconComp size={17} className={c.text} />

          <h3 className="text-[15px] font-semibold text-apple-dark mb-1 group-hover:text-apple-blue transition-colors leading-tight">
          </h3>
          {}

          <div className="mt-3 flex justify-end">
              size={14}
            />
        </div>
    </motion.div>
}
export default function CategoryPage({ params }: { params: { category: string } }) {
  if (!category) notFound();
  const diagrams = getDiagramsByCategory(params.category);
  const IconComp = (Icons as unknown as Record<string, Icons.LucideIcon>)[category.icon] ?? Icons.Layers;
  return (
      {}
        href="/dashboard"
      >
        All categories

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
        <div className={`w-12 h-12 ${colors.iconBg} rounded-2xl flex items-center justify-center`}>
        </div>
          <h1 className="text-[26px] font-bold tracking-tight text-apple-dark">{category.label}</h1>
        </div>

      <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-widest mb-4">
      </p>
        {diagrams.map((d, i) => (
        ))}
    </div>
}
