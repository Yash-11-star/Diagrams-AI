"use client";
import { useState, useCallback } from "react";
import { variantRepository } from "@/lib/db/variantRepository";
import { previewRepository } from "@/lib/db/previewRepository";
import { generatePreviewSVG } from "@/services/previewThumbnailService";
import type { StoredVariant } from "@/lib/db/indexedDb";
export type { StoredVariant };
export interface VariantManagerState {
  activeVariantId: string | null;
}
export interface VariantManagerActions {
  setDirty: (dirty: boolean) => void;
  switchVariant: (variantId: string, currentIr: DiagramDocument) => Promise<void>;
  replaceCurrentVariantIr: (ir: DiagramDocument) => Promise<void>;
  createWorkingCopy: (ir: DiagramDocument, diagramType: string) => Promise<StoredVariant>;
  reloadVariants: () => Promise<void>;
}
export function useVariantManager(
  initialVariants: StoredVariant[],
  diagramType: string,
  const [variants, setVariants] = useState<StoredVariant[]>(initialVariants);
  const [isDirty, setIsDirty] = useState(false);
  const setDirty = useCallback((dirty: boolean) => setIsDirty(dirty), []);
  const reloadVariants = useCallback(async () => {
    const fresh = await variantRepository.getByDiagramMetaId(diagramMetaId);
  }, [diagramMetaId]);
  const switchVariant = useCallback(async (variantId: string, _currentIr: DiagramDocument) => {

    if (!target) return;
    await diagramRepository.setActiveVariant(diagramMetaId, variantId);
    if (session?.diagramMetaId === diagramMetaId) {
        ...session,
      });

    setIsDirty(false);

    if (!activeVariantId) return;

    await previewRepository.save(activeVariantId, svg);
    await reloadVariants();

    const now = Date.now();
    const variant: StoredVariant = {
      diagramMetaId,
      label: workingCopyCount === 0 ? "Working copy" : `Working copy ${workingCopyCount + 1}`,
      isWorkingCopy: true,
      updatedAt: now,
    await variantRepository.save(variant);
    const svg = generatePreviewSVG(ir, dt);

    const session = await sessionRepository.get();
      await sessionRepository.save({ ...session, activeVariantId: variant.id });

    setIsDirty(false);
    return variant;

    variants,
    isDirty,
    switchVariant,
    createWorkingCopy,
    setVariants,
}
