import {
  type StoredVariant, STORES,

  async save(variant: StoredVariant): Promise<void> {
    await idbPut<StoredVariant>(db, STORES.VARIANTS, { ...variant, updatedAt: Date.now() });

    const db = await openDB();
  },
  async getByDiagramMetaId(diagramMetaId: string): Promise<StoredVariant[]> {
    const all = await idbGetAllByIndex<StoredVariant>(
    );
  },
  async delete(id: string): Promise<void> {
    await idbDelete(db, STORES.VARIANTS, id);

  async updateIr(id: string, ir: import("@/lib/diagramTypes").DiagramDocument): Promise<void> {
    const existing = await idbGet<StoredVariant>(db, STORES.VARIANTS, id);
    await idbPut<StoredVariant>(db, STORES.VARIANTS, {
      ir,
    });
};
