"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

  selectedType: DiagramType | null;
  onExtract:  (file: File) => Promise<void>;
}
const EXAMPLES: Record<string, string[]> = {
    "A user login flow with email verification and retry logic",
    "CI/CD pipeline from code commit to production deployment",
  ],


  const [tab, setTab] = useState<Tab>("prompt");
  const [file, setFile] = useState<File | null>(null);

    const f = accepted[0];
    setFile(f);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image}
        {(["prompt", "image"] as Tab[]).map((t) => (
            key={t}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium capitalize transition-all ${
                ? "bg-white text-apple-dark shadow-sm border border-gray-200"
            }`}
            {t === "prompt" ? "✦ Prompt" : "⬆ Upload Image"}
        ))}

        {tab === "prompt" && (
            {}
              {examples.map((ex) => (
                  key={ex}
                  className="text-[11px] text-apple-gray bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-1.5 rounded-full transition-colors"
                  {ex.length > 50 ? ex.slice(0, 50) + "…" : ex}
              ))}

              value={prompt}
              placeholder={placeholder}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
            />
            <div className="flex items-center justify-between">
              <button
                disabled={loading || !prompt.trim()}
              >
                {loading ? "Generating…" : "Generate"}
            </div>
        )}
        {tab === "image" && (
            {!preview ? (
                {...getRootProps()}
                  isDragActive
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                <Upload size={28} className="text-gray-400 mb-3" />
                  {isDragActive ? "Drop it here" : "Upload a diagram image"}
                <p className="text-[12px] text-apple-gray mt-1">Whiteboard photo, sketch, screenshot · PNG JPG WEBP · max 10 MB</p>
            ) : (
                <Image src={preview} alt="Upload" width={800} height={400} className="w-full object-contain max-h-56 bg-gray-50" />
                  className="absolute top-2 right-2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  <X size={13} />
              </div>

              <button
                disabled={loading || !file}
              >
                {loading ? "Extracting…" : "Generate from Image"}
            </div>
        )}
    </div>
}
