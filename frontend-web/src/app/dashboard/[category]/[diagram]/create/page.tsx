"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import {
  X, CheckCircle2, ChevronRight,
import * as LucideIcons from "lucide-react";
import { api, type Diagram } from "@/lib/api";
import { diagramRepository } from "@/lib/db/diagramRepository";
import { previewRepository } from "@/lib/db/previewRepository";
import { generatePreviewSVG } from "@/services/previewThumbnailService";
import { generateDiagramVariantsByType, validateDiagramByType } from "@/lib/diagramModules";
const EXAMPLES: Record<string, string[]> = {
  flowchart:    ["User registration with email verification and retry logic", "Order processing from cart to shipment", "Login with MFA and account lockout on failures"],
  erd:          ["University database with students, courses, and departments", "E-commerce with products, orders, users, and payments", "Hospital management with patients, doctors, and appointments"],
  component:    ["Microservices for an e-commerce backend", "Frontend React app with API and state management layers", "Authentication system with JWT and refresh tokens"],
  data_flow:    ["Order management system DFD", "User authentication data flow", "Payment processing system data flow"],
  user_flow:    ["Onboarding flow for a SaaS app", "Checkout flow for e-commerce", "Password reset flow with email verification"],
  cloud_arch:   ["Scalable web app on AWS with auto-scaling and CDN", "Multi-region disaster recovery setup on GCP", "Serverless event-driven architecture on Azure"],
  cicd:         ["GitHub Actions pipeline for a Node.js app to AWS", "Multi-environment pipeline with staging and prod gates", "Docker-based CI/CD with SonarQube and Slack notifications"],

  const steps = [
    { n: 2, label: "Generating variants" },
  ];
    <div className="flex flex-col gap-2 mt-6">
        <div key={s.n} className="flex items-center gap-3">
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
          >
          </div>
            className={`text-[13px] transition-colors ${step >= s.n ? "text-apple-dark font-medium" : "text-apple-gray"}`}
            {s.label}
          </span>
      ))}
  );

  variant,
  diagramType,
  onSelect,
  variant: Diagram;
  diagramType: string;
  onSelect: () => void;
  const counts = getDiagramCounts(variant);
  return (
      onClick={onSelect}
        ${selected ? "border-apple-blue shadow-md shadow-blue-100" : "border-gray-200 hover:border-gray-300"}`}
      <div className="flex items-center justify-between mb-3">
          Variant {index + 1}
        {selected && <CheckCircle2 size={16} className="text-apple-blue" />}

        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: previewSvg }} />

        {counts.primary} {counts.primaryLabel} · {counts.secondary} {counts.secondaryLabel}
    </button>
}
export default function CreatePage({
}: {
}) {
  const router = useRouter();
  const category = getCategoryById(params.category);
  const method = searchParams.get("method") === "image" ? "image" : "prompt";
  const [step, setStep] = useState(0);
  const [variants, setVariants] = useState<Diagram[]>([]);

  const [refinedPrompt, setRefinedPrompt] = useState("");

  const [preview, setPreview] = useState<string | null>(null);

    const f = accepted[0];
    setFile(f);
    setExtractedDiagram(null);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image}
        href={`/dashboard/${params.category}/${params.diagram}`}
      >
        {diagram.label}

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
        <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
        </div>
          <h1 className="text-[22px] font-bold tracking-tight text-apple-dark">{diagram.label}</h1>
            {method === "prompt" ? "Generate from a text description" : "Extract from an uploaded image"}
        </div>

      {error && (
          {error}
      )}
      {}
        <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setPrompt(ex)}
                  >
                  </button>
              </div>
              {}
                value={prompt}
                placeholder={`Describe the ${diagram.label} you want to create…`}
                onKeyDown={(e) => {
                }}
              />
              <div className="flex items-center justify-between">
                <button
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? "Working…" : "Generate Diagram"}
              </div>
              {}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-[15px] font-semibold text-apple-dark">
                </h2>
                  onClick={() => { setVariants([]); setRefinedPrompt(""); }}
                >
                </button>

                <VariantCard
                  variant={v}
                  diagramType={diagram.backendType}
                  onSelect={() => setSelectedIdx(i)}
              ))}
              <button
                className="w-full flex items-center justify-center gap-2 bg-apple-blue hover:bg-blue-600 text-white text-[15px] font-semibold py-3.5 rounded-2xl transition-colors shadow-sm mt-2"
                Open in Canvas
              </button>
          )}
      )}
      {}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all py-14 ${
                  ? "border-apple-blue bg-blue-50"
              }`}
              <input {...getInputProps()} />
              <p className="text-[15px] font-medium text-apple-dark mb-1">
              </p>
                Whiteboard photo, sketch, or screenshot
                PNG · JPG · WEBP · max 10 MB
            </div>
            <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                src={preview}
                width={640}
                className="w-full object-contain max-h-64 bg-gray-50"
              <button
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                <X size={13} />
            </div>

          {extractedDiagram && (
              {(() => {
                return `✓ Extracted ${counts.primary} ${counts.primaryLabel} and ${counts.secondary} ${counts.secondaryLabel}`;
            </div>

          {!extractedDiagram ? (
              onClick={handleImageExtract}
              className="w-full flex items-center justify-center gap-2 bg-apple-blue hover:bg-blue-600 disabled:opacity-40 text-white text-[14px] font-medium py-3 rounded-xl transition-colors shadow-sm"
              {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                </>
                <>
                  Analyze & Convert
              )}
          ) : (
              onClick={() => goToCanvas(extractedDiagram, [extractedDiagram])}
            >
              <ChevronRight size={17} />
          )}
          {}
            <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-widest mb-2">Works best with</p>
              {["Whiteboard photos", "Hand-drawn sketches", "Screenshots", "Existing diagram images"].map((tip) => (
                  <div className="w-1 h-1 rounded-full bg-green-400 shrink-0" />
                </div>
            </div>
        </div>
    </div>
}
