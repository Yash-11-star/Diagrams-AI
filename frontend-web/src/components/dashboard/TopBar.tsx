"use client";
import Link from "next/link";
import { ChevronRight, Cpu, LogOut, ChevronDown, FolderOpen } from "lucide-react";
import { deleteCookie } from "@/lib/cookies";
import { useState, useRef, useEffect } from "react";
function useBreadcrumbs() {
  const segments = pathname.split("/").filter(Boolean);

    { label: "Home", href: "/dashboard" },

    const categoryId = segments[1];
      crumbs.push({ label: "Saved", href: "/dashboard/saved" });
    }
    if (category) {
    }

    const diagramId = segments[2];
    if (diagram) {
        label: diagram.label,
      });
  }
  if (segments.length >= 4) {
    if (page === "create") crumbs.push({ label: "Generate", href: "#" });
  }
  return crumbs;

  const router = useRouter();
  const crumbs = useBreadcrumbs();
  const menuRef = useRef<HTMLDivElement>(null);
  const handleLogout = async () => {
    deleteCookie("afd_session");
  };
  useEffect(() => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      }
    document.addEventListener("mousedown", handleClick);
  }, []);
  const initial = user?.email?.[0]?.toUpperCase() ?? "U";
  return (
      {}
        <div className="w-7 h-7 bg-apple-blue rounded-lg flex items-center justify-center">
        </div>
      </Link>
      {}
        <div className="w-px h-4 bg-gray-200 mr-5" />

      <nav className="flex items-center gap-1 flex-1 min-w-0">
          <span key={crumb.href + i} className="flex items-center gap-1 min-w-0">
            {i < crumbs.length - 1 ? (
                href={crumb.href}
              >
              </Link>
              <span className="text-[13px] font-medium text-apple-dark truncate">
              </span>
          </span>
      </nav>
      {}
        href="/dashboard/saved"
      >
        Saved

        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          <div className="w-7 h-7 bg-gradient-to-br from-apple-blue to-indigo-500 rounded-full flex items-center justify-center text-white text-[11px] font-bold">
          </div>
            {user?.email}
          <ChevronDown size={13} className="text-apple-gray" />

          <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
              <p className="text-[12px] text-apple-gray truncate">{user?.email}</p>
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-apple-gray hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg mx-0.5"
              <LogOut size={14} />
            </button>
        )}
    </header>
}
