"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import * as Icons from "lucide-react";

  const colors = CATEGORY_COLORS[category.color];

    <motion.div
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      <Link href={`/dashboard/${category.id}`}>
          group relative bg-white rounded-2xl border border-gray-200 p-6
        `}>
          <div className={`w-10 h-10 ${colors.iconBg} rounded-xl flex items-center justify-center mb-4`}>
          </div>
          {}
            {category.label}
          <p className="text-[13px] text-apple-gray leading-relaxed mb-4">
          </p>
          {}
            <span className={`text-[11px] font-semibold ${colors.badge} px-2 py-0.5 rounded-full`}>
            </span>
              size={15}
            />
        </div>
    </motion.div>
}

  label: string;
  href: string;
}
function RecentItems() {

    try {
      if (raw) setRecents(JSON.parse(raw).slice(0, 4));
  }, []);
  if (recents.length === 0) return null;
  return (
      <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-widest mb-3">
      </h2>
        {recents.map((r) => (
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <span className="text-[13px] text-apple-dark">{r.diagramLabel}</span>
              <span className="text-[11px] text-apple-gray">
              </span>
          </Link>
      </div>
  );

  const diff = Date.now() - ts;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;

function greeting() {
  if (h < 12) return "Good morning";
  return "Good evening";

  const { user } = useAuth();

    <div className="max-w-[960px] mx-auto px-6 py-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
        <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-[32px] font-bold tracking-tight text-apple-dark">
            </h1>
              What would you like to create today?
          </div>
            href="/dashboard/saved"
          >
            Saved Diagrams
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CategoryCard key={category.id} category={category} index={i} />
      </div>
      {}
    </div>
}
