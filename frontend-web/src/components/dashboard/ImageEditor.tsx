"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
  Upload, Loader2, Download, Code2, Undo2, X, ScanLine,
import dynamic from "next/dynamic";
import { api, type Diagram } from "@/lib/api";
import clsx from "clsx";
const MermaidRenderer = dynamic(() => import("./MermaidRenderer"), { ssr: false });
type Tab = "extract" | "edit" | "export";
export default function ImageEditor() {
  const [preview, setPreview] = useState<string | null>(null);
  const [history, setHistory] = useState<Diagram[]>([]);
  const [drawioXml, setDrawioXml] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const f = accepted[0];
    setFile(f);
    setDiagram(null);
    setDrawioXml("");
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image}
        {(["extract", "edit", "export"] as Tab[]).map((tab) => (
            key={tab}
            className={clsx(
              activeTab === tab
                : "text-apple-gray hover:text-apple-dark"
          >
          </button>
      </div>
      {error && (
          {error}
      )}
      <AnimatePresence mode="wait">
        {activeTab === "extract" && (
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            {}
              {!preview ? (
                  {...getRootProps()}
                    "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all p-14",
                      ? "border-apple-blue bg-blue-50/50"
                  )}
                  <input {...getInputProps()} />
                    <Upload size={24} className="text-apple-gray" />
                  <p className="text-[15px] font-medium text-apple-dark mb-1">
                  </p>
                    Whiteboard photo, hand-drawn flowchart, screenshot…
                  </p>
              ) : (
                  <Image src={preview} alt="Uploaded diagram" width={600} height={400}
                  <button onClick={clearImage}
                  >
                  </button>
                    <p className="text-white text-[12px] font-medium truncate">{file?.name}</p>
                </div>

                onClick={extract}
                className="flex items-center justify-center gap-2 bg-apple-blue hover:bg-apple-blue-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-[15px] font-medium py-3 rounded-xl transition-colors"
                {extracting ? (
                ) : (
                )}

                GPT-4o will read the image and convert it to an editable diagram
            </div>
            {}
              <p className="text-[14px] font-semibold text-apple-dark">Preview</p>
                <div className="flex-1 min-h-64 border-2 border-dashed border-apple-blue/30 rounded-2xl flex flex-col items-center justify-center gap-4 bg-blue-50/20">
                  <div className="text-center">
                    <p className="text-[12px] text-apple-gray mt-1">GPT-4o is reading your diagram</p>
                </div>
                <div className="border border-apple-border rounded-2xl overflow-hidden bg-apple-light-gray/30" style={{ height: 320 }}>
                </div>
                <div className="flex-1 min-h-64 border-2 border-dashed border-apple-border rounded-2xl flex items-center justify-center">
                </div>
              {diagram && (
                  {(() => {
                    return `${counts.primary} ${counts.primaryLabel} · ${counts.secondary} ${counts.secondaryLabel} extracted`;
                </p>
            </div>
        )}
        {}
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
              <p className="text-apple-gray text-[14px] text-center py-12">
              </p>
              <>
                  <p className="text-[12px] text-apple-gray uppercase tracking-wider font-semibold mb-2">Quick edits</p>
                    {EDIT_EXAMPLES.map((ex) => (
                        className="text-[12px] text-apple-gray bg-apple-light-gray hover:bg-apple-border/50 border border-apple-border/50 px-3 py-1.5 rounded-full transition-colors"
                        {ex}
                    ))}
                </div>
                <textarea
                  onChange={(e) => setEditInstruction(e.target.value)}
                  rows={2}
                />
                <div className="flex gap-3">
                    className="flex items-center gap-2 bg-apple-blue hover:bg-apple-blue-hover disabled:opacity-50 text-white text-[14px] font-medium px-6 py-2.5 rounded-xl transition-colors"
                    {editLoading && <Loader2 size={15} className="animate-spin" />}
                  </button>
                    <button onClick={undo}
                    >
                    </button>
                </div>
                <p className="text-[12px] text-apple-gray">{history.length - 1} edit{history.length !== 2 ? "s" : ""} applied</p>
                {mermaidCode && (
                    <MermaidRenderer code={mermaidCode} />
                )}
            )}
        )}
        {}
          <motion.div key="export" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-apple-gray text-[14px] text-center py-12">
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Code2 size={20} className="text-apple-blue mb-3" />
                  <p className="text-[12px] text-apple-gray mb-4">Paste into GitHub, Notion, GitLab…</p>
                    disabled={!mermaidCode}
                    className="w-full flex items-center justify-center gap-2 bg-apple-light-gray hover:bg-apple-border/50 text-apple-dark text-[13px] font-medium py-2 rounded-xl transition-colors disabled:opacity-40"
                    <Download size={14} /> Download .mmd
                </div>
                <div className="border border-apple-border rounded-2xl p-5">
                  <h3 className="text-[15px] font-semibold text-apple-dark mb-1">draw.io</h3>
                  <button
                      const xml = drawioXml || await fetchDrawio();
                    }}
                  >
                  </button>

                  <div className="w-5 h-5 bg-slate-600 rounded mb-3 text-white flex items-center justify-center text-[10px] font-bold">{"{}"}</div>
                  <p className="text-[12px] text-apple-gray mb-4">Canonical intermediate representation</p>
                    onClick={() => download(JSON.stringify(diagram, null, 2), "diagram.json", "application/json")}
                  >
                  </button>
              </div>
          </motion.div>
      </AnimatePresence>
  );
