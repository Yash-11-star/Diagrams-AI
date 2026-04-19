"use client";
import { motion } from "framer-motion";

  {
    icon: PenLine,
    description: "Type a plain-English description of any workflow, process, or system. No special syntax required.",
  },
    number: "02",
    title: "Choose a variant",
    example: "Variant A · Variant B · Variant C",
  {
    icon: Download,
    description: "Refine with natural language instructions, then export as Mermaid, draw.io XML, or JSON.",
  },

  return (
      <div className="max-w-6xl mx-auto px-6">
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          <p className="text-apple-blue text-[13px] font-semibold uppercase tracking-widest mb-3">How it works</p>
            Three steps to clarity.
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[calc(33%+24px)] right-[calc(33%+24px)] h-px bg-gradient-to-r from-transparent via-apple-border to-transparent" />
          {steps.map((step, i) => (
              key={step.number}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="w-24 h-24 bg-white border border-apple-border rounded-2xl flex items-center justify-center shadow-sm">
                </div>
                  {i + 1}
              </div>
              <p className="text-[14px] text-apple-gray leading-relaxed mb-4">{step.description}</p>
                {step.example}
            </motion.div>
        </div>
    </section>
}
