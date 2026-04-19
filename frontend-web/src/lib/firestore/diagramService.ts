
import {
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import type { DiagramDocument } from "@/lib/diagramTypes";
const COLLECTION = "diagrams";

  id: string;
  title: string;
  categoryId: string;
  diagramIR: DiagramDocument;
  createdAt: Timestamp | null;
  version: number;

  const d = snap.data ? snap.data() : snap;
    id: snap.id,
    title: d.title ?? "Untitled",
    categoryId: d.categoryId ?? "",
    diagramIR: d.diagramIR ?? { nodes: [], edges: [] },
    createdAt: d.createdAt ?? null,
    version: d.version ?? 1,
}

  userId: string,
    title: string;
    categoryId: string;
    diagramIR: DiagramDocument;
  },
  if (!userId) throw new Error("User must be authenticated to save diagrams.");
  const docRef = await addDoc(collection(db, COLLECTION), {
    title: payload.title,
    categoryId: payload.categoryId,
    diagramIR: payload.diagramIR,
    createdAt: serverTimestamp(),
    version: 1,

}

  userId: string,
): Promise<FirestoreDiagram[]> {

    collection(db, COLLECTION),
    orderBy("updatedAt", "desc"),
  );
  const snap: QuerySnapshot = await getDocs(q);
}

  const snap = await getDoc(doc(db, COLLECTION, firestoreId));
  return fromDoc(snap as unknown as DocumentData & { id: string });

export async function updateDiagram(
  payload: {
    title?: string;
  },
  const ref = doc(db, COLLECTION, firestoreId);
  const existingVersion = existingSnap.data()?.version;

    diagramIR: payload.diagramIR,
    version: nextVersion,
  if (payload.title !== undefined) changes.title = payload.title;

}

  await deleteDoc(doc(db, COLLECTION, firestoreId));
