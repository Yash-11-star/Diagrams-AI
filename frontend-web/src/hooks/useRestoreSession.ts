"use client";
import { useState, useEffect } from "react";
import { sessionRepository } from "@/lib/db/sessionRepository";
import { irToFlow } from "@/lib/flowUtils";
import type { DiagramDocument } from "@/lib/diagramTypes";

  diagramMetaId: string;
  diagramType: string;
  categoryId: string;
  document: DiagramDocument;
  edges?: Edge[];
}
export type RestoreStatus = "idle" | "loading" | "restored" | "none";

  
  diagramId: string,
  const [status, setStatus] = useState<RestoreStatus>("idle");

    let cancelled = false;
    async function restore() {
      try {

          !session?.diagramMetaId ||
          session.categoryId !== categoryId ||
        ) {
          return;

        if (!variant) {
          return;

        const graphState = isGraphDiagram(variant.ir)
          : undefined;
        if (!cancelled) {
            diagramMetaId: session.diagramMetaId,
            diagramType: session.diagramType,
            categoryId: session.categoryId,
            document: variant.ir,
            edges: graphState?.edges,
          });
        }
        if (!cancelled) setStatus("none");
    }
    restore();

  }, []);
  return { status, restored };
