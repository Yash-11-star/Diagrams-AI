import {
  type DiagramMeta, STORES,

  async save(meta: DiagramMeta): Promise<void> {
    await idbPut<DiagramMeta>(db, STORES.DIAGRAMS, { ...meta, updatedAt: Date.now() });

    const db = await openDB();
  },
  async list(): Promise<DiagramMeta[]> {
    const all = await idbGetAll<DiagramMeta>(db, STORES.DIAGRAMS);
  },
  async delete(id: string): Promise<void> {
    await idbDelete(db, STORES.DIAGRAMS, id);

  async setActiveVariant(diagramMetaId: string, variantId: string): Promise<void> {
    const existing = await idbGet<DiagramMeta>(db, STORES.DIAGRAMS, diagramMetaId);
    await idbPut<DiagramMeta>(db, STORES.DIAGRAMS, {
      activeVariantId: variantId,
    });

  async setFirestoreId(diagramMetaId: string, firestoreId: string): Promise<void> {
    const existing = await idbGet<DiagramMeta>(db, STORES.DIAGRAMS, diagramMetaId);
    await idbPut<DiagramMeta>(db, STORES.DIAGRAMS, {
      firestoreId,
    });
};
