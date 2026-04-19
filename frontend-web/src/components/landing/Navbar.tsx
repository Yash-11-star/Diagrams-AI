"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

  { label: "Features", href: "#features" },
];
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", handler);
  }, []);
  return (
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          ? "bg-white/80 backdrop-blur-xl border-b border-apple-border/50 shadow-sm"
      }`}
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            </svg>
          <span className="text-apple-dark font-semibold text-[15px] tracking-tight">Diagrams AI</span>

        <div className="hidden md:flex items-center gap-8">
            <a
              href={l.href}
            >
            </a>
        </div>
        {}
          <Link
            className="text-[14px] text-apple-gray hover:text-apple-dark transition-colors px-3 py-1.5"
            Sign in
          <Link
            className="text-[14px] font-medium bg-apple-blue hover:bg-apple-blue-hover text-white px-4 py-2 rounded-full transition-colors"
            Get started
        </div>
        {}
          className="md:hidden text-apple-dark"
          aria-label="Toggle menu"
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </nav>
      {}
        {mobileOpen && (
            initial={{ opacity: 0, y: -8 }}
            exit={{ opacity: 0, y: -8 }}
          >
              <a
                href={l.href}
                className="block py-3 text-[15px] text-apple-dark border-b border-apple-border/50 last:border-none"
                {l.label}
            ))}
              <Link href="/login" className="text-center py-2.5 text-[15px] text-apple-gray border border-apple-border rounded-xl">
              </Link>
                Get started
            </div>
        )}
    </header>
}
