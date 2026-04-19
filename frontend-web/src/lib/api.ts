import type {
  Diagram,
  GraphEdge,
  ArchitectureDiagram,
} from "./diagramTypes";
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  status: number;
  constructor(message: string, status: number) {
    this.name = "ApiError";
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
  if (!res.ok) {
    throw new ApiError(err.detail ?? "Request failed", res.status);
  return res.json();

  DiagramDocument,
  GraphDiagram,
  GraphEdge as DiagramEdge,
  ArchitectureDiagram,


    return request<{ variants: DiagramDocument[] }>("/generate", {
      body: JSON.stringify({ prompt, num_variants: numVariants, diagram_type: diagramType }),
  },
  refinePrompt(prompt: string, diagramType: string = "flowchart") {
      method: "POST",
    });

    return request<{ diagram: DiagramDocument }>("/edit", {
      body: JSON.stringify({ diagram, instruction, diagram_type: diagramType }),
  },
  exportMermaid(diagram: DiagramDocument) {
      method: "POST",
    });

    return request<{ xml: string }>("/export/drawio", {
      body: JSON.stringify(diagram),
  },
  async imageExtract(file: File, diagramType: string = "flowchart"): Promise<{ diagram: DiagramDocument }> {
    form.append("file", file);
    const res = await fetch(`${BASE}/image/extract`, { method: "POST", body: form });
      const err = await res.json().catch(() => ({ detail: res.statusText }));
    }
  },
  normalizeSequence(diagram: GraphDiagram) {
      return Promise.reject(new ApiError("Sequence normalize endpoint is unavailable.", 404));

      method: "POST",
    }).then((result) => {
      return result;
      if (error instanceof ApiError && error.status === 404) {
      }
    });
};
