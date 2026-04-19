"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, type Diagram } from "@/lib/api";
import clsx from "clsx";
const MermaidRenderer = dynamic(() => import("./MermaidRenderer"), { ssr: false });
const EXAMPLES = [
  "Design a CI/CD pipeline from code commit to production",
  "Create a supply chain: procurement → manufacturing → QA → retail",

  "Add an error handling node after the main process",
  "Split the process node into two sequential steps",
];
export default function DiagramGenerator() {
  const [numVariants, setNumVariants] = useState(2);
  const [selected, setSelected] = useState<Diagram | null>(null);
  const [history, setHistory] = useState<Diagram[]>([]);
  const [drawioXml, setDrawioXml] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"generate" | "edit" | "export">("generate");

    if (!prompt.trim()) return;
    setError(null);
    setSelected(null);
    setDrawioXml("");
      const { variants: v } = await api.generate(prompt, numVariants);
    } catch (e) {
    } finally {
    }

    setSelectedIdx(idx);
    setHistory([diagram]);
    setDrawioXml("");
      const { mermaid: m } = await api.exportMermaid(diagram);
    } catch {}

    if (!selected || !editInstruction.trim()) return;
    setError(null);
      const { diagram } = await api.edit(selected, editInstruction);
      setHistory((h) => [...h, diagram]);
      const { mermaid: m } = await api.exportMermaid(diagram);
      setDrawioXml("");
      setError((e as Error).message);
      setEditLoading(false);
  };
  const undo = () => {
    const prev = history[history.length - 2];
    setSelected(prev);
    api.exportMermaid(prev).then(({ mermaid: m }) => setMermaidCode(m)).catch(() => {});

    if (!selected) return;
    setDrawioXml(xml);

    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.download = filename;
    URL.revokeObjectURL(url);

    <div className="h-full flex flex-col gap-6">
      <div className="flex gap-1 bg-apple-light-gray rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab(tab)}
              "px-5 py-2 rounded-lg text-[13px] font-medium capitalize transition-all",
                ? "bg-white text-apple-dark shadow-sm"
            )}
            {tab}
        ))}

        <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl">
        </div>

      <AnimatePresence mode="wait">
          <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
            <div>
              <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPrompt(ex)}
                  >
                  </button>
              </div>

            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
            <div className="flex items-center gap-4">
                Variants:
                  value={numVariants}
                  className="ml-2 border border-apple-border rounded-lg px-2 py-1 text-[13px] text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/30"
                  {[1, 2, 3].map((n) => <option key={n}>{n}</option>)}
              </label>
                onClick={generate}
                className="flex items-center gap-2 bg-apple-blue hover:bg-apple-blue-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-medium px-6 py-2.5 rounded-xl transition-colors"
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              </button>

            {variants.length > 0 && (
                <p className="text-[12px] text-apple-gray uppercase tracking-wider font-semibold mb-3">Choose a variant</p>
                  {variants.map((v, i) => (
                      key={i}
                      className={clsx(
                        selectedIdx === i
                          : "border-apple-border hover:border-apple-blue/40 hover:bg-apple-light-gray/50"
                    >
                        <span className={clsx("text-[11px] font-bold uppercase tracking-wider", selectedIdx === i ? "text-apple-blue" : "text-apple-gray")}>
                        </span>
                      </div>
                        {(() => {
                          return `${counts.primary} ${counts.primaryLabel} · ${counts.secondary} ${counts.secondaryLabel}`;
                      </p>
                  ))}
              </div>

            {mermaidCode && (
                <MermaidRenderer code={mermaidCode} />
            )}
        )}
        {}
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <p className="text-apple-gray text-[14px] text-center py-12">Generate and select a variant first.</p>
              <>
                  <p className="text-[12px] text-apple-gray uppercase tracking-wider font-semibold mb-2">Quick edits</p>
                    {EDIT_EXAMPLES.map((ex) => (
                        {ex.slice(0, 38)}…
                    ))}
                </div>
                  value={editInstruction}
                  placeholder="Describe the change…"
                  className="w-full border border-apple-border rounded-xl px-4 py-3 text-[14px] text-apple-dark placeholder:text-apple-gray/60 resize-none focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue/50 transition-all"
                <div className="flex gap-3">
                    onClick={applyEdit}
                    className="flex items-center gap-2 bg-apple-blue hover:bg-apple-blue-hover disabled:opacity-50 text-white text-[14px] font-medium px-6 py-2.5 rounded-xl transition-colors"
                    {editLoading ? <Loader2 size={15} className="animate-spin" /> : null}
                  </button>
                    <button onClick={undo} className="flex items-center gap-2 border border-apple-border text-apple-gray text-[14px] px-4 py-2.5 rounded-xl hover:text-apple-dark hover:border-apple-gray/50 transition-colors">
                      Undo
                  )}
                <div className="text-[12px] text-apple-gray">
                </div>
                  <div className="bg-apple-light-gray/50 border border-apple-border rounded-2xl overflow-hidden" style={{ height: 320 }}>
                  </div>
              </>
          </motion.div>

        {activeTab === "export" && (
            {!selected ? (
            ) : (
                {}
                  <Code2 size={20} className="text-apple-blue mb-3" />
                  <p className="text-[12px] text-apple-gray mb-4">Paste into GitHub, Notion, GitLab…</p>
                    disabled={!mermaidCode}
                    className="w-full flex items-center justify-center gap-2 bg-apple-light-gray hover:bg-apple-border/50 text-apple-dark text-[13px] font-medium py-2 rounded-xl transition-colors disabled:opacity-40"
                    <Download size={14} />
                  </button>
                {}
                  <div className="w-5 h-5 bg-orange-500 rounded mb-3 text-white flex items-center justify-center text-[10px] font-bold">D</div>
                  <p className="text-[12px] text-apple-gray mb-4">Open in diagrams.net for visual editing</p>
                    onClick={async () => { await fetchDrawio(); if (drawioXml) download(drawioXml, "diagram.drawio", "application/xml"); }}
                  >
                    Download .drawio
                </div>
                <div className="border border-apple-border rounded-2xl p-5">
                  <h3 className="text-[15px] font-semibold text-apple-dark mb-1">JSON IR</h3>
                  <button
                    className="w-full flex items-center justify-center gap-2 bg-apple-light-gray hover:bg-apple-border/50 text-apple-dark text-[13px] font-medium py-2 rounded-xl transition-colors"
                    <Download size={14} />
                  </button>
              </div>
          </motion.div>
      </AnimatePresence>
  );
