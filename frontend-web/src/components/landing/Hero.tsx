"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
const fadeUp = (delay = 0) => ({
  animate: { opacity: 1, y: 0 },
});
export default function Hero() {
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-apple-blue/8 border border-apple-blue/20 text-apple-blue text-[13px] font-medium px-4 py-1.5 rounded-full mb-8">
          Powered by GPT-4o &amp; Gemini 2.0 Flash

        <motion.h1 {...fadeUp(0.1)} className="text-[56px] md:text-[76px] font-bold text-apple-dark leading-[1.05] tracking-tight mb-6">
          <br />
            Generate it.
          <br />
        </motion.h1>
        {}
          Create professional flowcharts, diagrams, and workflows from plain English in seconds.
        </motion.p>
        {}
          <Link
            className="group inline-flex items-center gap-2 bg-apple-blue hover:bg-apple-blue-hover text-white text-[16px] font-medium px-7 py-3.5 rounded-full transition-all shadow-lg shadow-blue-200/60 hover:shadow-blue-300/70 hover:scale-[1.02] active:scale-[0.98]"
            Start for free
          </Link>
            href="#how-it-works"
          >
          </a>

        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-16 relative"
          <div className="bg-white rounded-2xl border border-apple-border shadow-2xl shadow-black/8 overflow-hidden">
            <div className="bg-apple-light-gray border-b border-apple-border px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="flex-1 mx-4 bg-white/80 rounded-md text-[12px] text-apple-gray px-3 py-1 text-center">
              </div>
            {}
              {}
                <div className="space-y-1">
                    <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] ${i === 0 ? "bg-apple-blue text-white" : "text-apple-gray"}`}>
                      {item}
                  ))}
              </div>
              <div className="flex-1 p-6 flex flex-col gap-4">
                  <div className="flex-1 h-9 bg-apple-light-gray rounded-lg" />
                </div>
                <div className="flex-1 bg-apple-light-gray/60 rounded-xl flex items-center justify-center">
                    <rect x="100" y="10" width="80" height="36" rx="18" fill="#0071e3" opacity="0.15" stroke="#0071e3" strokeWidth="1.5"/>
                    <line x1="140" y1="46" x2="140" y2="70" stroke="#d2d2d7" strokeWidth="1.5" markerEnd="url(#arrow)"/>
                    <text x="140" y="93" textAnchor="middle" fontSize="11" fill="#1d1d1f">Authenticate User</text>
                    <polygon points="140,120 116,148 164,148" fill="white" stroke="#d2d2d7" strokeWidth="1.5"/>
                    <line x1="164" y1="134" x2="220" y2="134" stroke="#d2d2d7" strokeWidth="1.5"/>
                    <text x="225" y="139" textAnchor="middle" fontSize="10" fill="#1d1d1f">Dashboard</text>
                    <rect x="20" y="130" width="70" height="36" rx="8" fill="#fff0f0" stroke="#ffb3b3" strokeWidth="1.5"/>
                    <defs>
                        <path d="M0,0 L6,3 L0,6 Z" fill="#d2d2d7"/>
                    </defs>
                </div>
            </div>
          {}
        </motion.div>
    </section>
}
