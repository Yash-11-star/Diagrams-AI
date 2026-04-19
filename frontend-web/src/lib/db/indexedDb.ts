

const DB_NAME    = "afd_local";


  id: string;
  diagramType: string;
  diagramId: string;
  firestoreId?: string;
  updatedAt: number;

  id: string;
  ir: DiagramDocument;
  isBaseGenerated: boolean;
  createdAt: number;
}
export interface StoredPreview {
  svgPayload: string;
}
export interface SessionRecord {
  diagramMetaId: string;
  diagramType: string;
  categoryId: string;
  updatedAt: number;

  DIAGRAMS: "diagrams",
  PREVIEWS: "previews",
} as const;
let _db: IDBDatabase | null = null;

  if (_db) return Promise.resolve(_db);

    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {

        db.createObjectStore(STORES.DIAGRAMS, { keyPath: "id" });

        const vs = db.createObjectStore(STORES.VARIANTS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.PREVIEWS)) {
      }
      if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
      }

      _db = (e.target as IDBOpenDBRequest).result;
      resolve(_db);

      _opening = null;
    };

}
export function idbGet<T>(
  store: string,
): Promise<T | undefined> {
    const req = db.transaction(store, "readonly").objectStore(store).get(key);
    req.onerror  = () => reject(req.error);
}
export function idbPut<T>(
  store: string,
): Promise<void> {
    const req = db.transaction(store, "readwrite").objectStore(store).put(value);
    req.onerror  = () => reject(req.error);
}
export function idbDelete(
  store: string,
): Promise<void> {
    const req = db.transaction(store, "readwrite").objectStore(store).delete(key);
    req.onerror  = () => reject(req.error);
}
export function idbGetAll<T>(
  store: string
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as T[]);
  });

  db: IDBDatabase,
  indexName: string,
): Promise<T[]> {
    const tx  = db.transaction(store, "readonly");
    const req = idx.getAll(query);
    req.onerror  = () => reject(req.error);
}
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < bytes.length; i++) id += CHARS[bytes[i] % CHARS.length];
}
