import {
  type StoredPreview, STORES,

  async save(variantId: string, svgPayload: string): Promise<void> {
    await idbPut<StoredPreview>(db, STORES.PREVIEWS, {
      svgPayload,
    });

    const db = await openDB();
  },
