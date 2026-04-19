import {
  type SessionRecord, STORES,


  async save(record: Omit<SessionRecord, "id" | "updatedAt">): Promise<void> {
    await idbPut<SessionRecord>(db, STORES.SESSIONS, {
      id: SESSION_KEY,
    });

    const db = await openDB();
  },
  async clear(): Promise<void> {
    await idbPut<SessionRecord>(db, STORES.SESSIONS, {
      diagramMetaId: "",
      diagramType: "",
      categoryId: "",
      updatedAt: Date.now(),
  },
