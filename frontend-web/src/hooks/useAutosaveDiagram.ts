"use client";
import { useEffect, useRef, useCallback } from "react";
import { flowToIr } from "@/lib/flowUtils";
import { previewRepository } from "@/lib/db/previewRepository";
import type { DiagramDocument } from "@/lib/diagramTypes";
const DEBOUNCE_MS = 1000;
interface AutosaveOptions {
  diagramType: string;
}

  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingEdges = useRef<Edge[] | null>(null);
  const variantIdRef = useRef(variantId);


  useEffect(() => { diagramTypeRef.current = diagramType; }, [diagramType]);

    const vid = variantIdRef.current;
    if (!vid) return;
    const document = pendingDiagram.current
        pendingNodes.current && pendingEdges.current
          : null
    if (!document) return;
    pendingNodes.current = null;
    pendingDiagram.current = null;
    try {
      const svg = generatePreviewSVG(document, dt);
      onSavedRef.current?.();

  }, []);
  const markDirty = useCallback((nodes: Node[], edges: Edge[]) => {
    pendingNodes.current = nodes;

    timerRef.current = setTimeout(flush, DEBOUNCE_MS);

    pendingNodes.current = null;
    pendingDiagram.current = diagram;
    if (timerRef.current !== null) clearTimeout(timerRef.current);
  }, [flush]);
  useEffect(() => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };

    const handler = () => { flush(); };
    return () => window.removeEventListener("beforeunload", handler);

}
