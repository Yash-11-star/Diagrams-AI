# DIAGRAMS AI — COMPLETE TECHNICAL DOCUMENTATION

**System Design, Architecture, and Engineering Reference**

**Project:** Agentic Figure Drawing (AFD)
**Version:** 2.0 (Spring 2026)
**Classification:** Internal Engineering Reference

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Tech Stack](#3-tech-stack)
4. [Docker & Deployment](#4-docker--deployment)
5. [System Architecture](#5-system-architecture)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Backend / Middleware](#7-backend--middleware)
8. [Diagram Generation Pipeline](#8-diagram-generation-pipeline)
9. [Diagram Editing Flow](#9-diagram-editing-flow)
10. [Data Model](#10-data-model)
11. [Storage System](#11-storage-system)
12. [Cloud Persistence — Firestore](#12-cloud-persistence--firestore)
13. [Authentication System](#13-authentication-system)
14. [File-by-File Breakdown](#14-file-by-file-breakdown)
15. [Diagram Types Reference](#15-diagram-types-reference)
16. [Performance Considerations](#16-performance-considerations)
17. [Challenges & Solutions](#17-challenges--solutions)
18. [Appendix](#appendix)

---

## 1. Introduction

**Agentic Figure Drawing (AFD)** — marketed as **Diagrams AI** — is a full-stack, AI-powered diagramming platform. Users describe what they want in plain English and the system generates production-quality diagrams across 30+ diagram types.

The system is composed of three services:

| Service | Technology | Port |
|---|---|---|
| **backend** | Python / FastAPI | 8000 |
| **frontend-web** | Next.js 14 / React | 3000 |
| **frontend** | Streamlit (legacy prototype) | 8501 |

All three are containerized and orchestrated via Docker Compose.

---

## 2. System Overview

```
User Browser
     │
     ├─── Next.js Frontend (port 3000)
     │         │
     │         ├─── Firebase Auth  (login, signup, Google OAuth)
     │         ├─── Firebase Firestore  (cloud diagram persistence)
     │         ├─── IndexedDB (local autosave, variants, sessions)
     │         └─── FastAPI Backend (port 8000)
     │                   │
     │                   ├─── Google Gemini 2.0 Flash  (primary LLM)
     │                   └─── OpenAI GPT-4.1 / GPT-4o  (fallback + image extraction)
     │
     └─── Streamlit Frontend (port 8501) — legacy prototype
```

**User journey:**
1. User lands on the marketing page → signs up / logs in via Firebase Auth
2. Chooses a diagram category and type
3. Types a natural-language prompt → optionally uses AI Refine to expand it
4. Backend calls Gemini (or OpenAI) → returns 2 structured JSON variants
5. Frontend renders the diagram on a React Flow canvas
6. User edits nodes/edges manually or via AI Edit (free-text instruction)
7. User clicks **Save** → diagram written to Firestore; local copy autosaved to IndexedDB
8. User can revisit cloud saves from the **Saved Diagrams** page and reopen them

---

## 3. Tech Stack

### Frontend (Next.js)

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server + client components |
| Language | TypeScript | Strict mode |
| Canvas | React Flow (`@xyflow/react`) | Nodes, edges, zoom, pan |
| Styling | Tailwind CSS | Utility-first |
| Animation | Framer Motion | Panel slide-ins, modals |
| Icons | Lucide React | Consistent icon set |
| Auth | Firebase Auth | Email/password + Google OAuth |
| Cloud DB | Firebase Firestore | Cloud diagram storage |
| Local DB | IndexedDB (raw API) | Autosave, variants, sessions |
| LLM-rendered diagrams | Mermaid.js | Sequence fallback rendering |
| State | React hooks only | No Redux / Zustand |

### Backend

| Layer | Technology | Notes |
|---|---|---|
| Framework | FastAPI | Async-capable |
| Language | Python 3.11 | |
| Validation | Pydantic v2 | Strict IR schema enforcement |
| LLM — primary | Google Gemini 2.0 Flash | `google-generativeai` SDK |
| LLM — fallback | OpenAI GPT-4.1 + GPT-4o | `openai` SDK |
| Server | Uvicorn | ASGI server |

### Infrastructure

| Component | Technology |
|---|---|
| Containerization | Docker (3 Dockerfiles) |
| Orchestration | Docker Compose v3.9 |
| Cloud Auth + DB | Firebase (Firestore + Auth) |

---

## 4. Docker & Deployment

### 4.1 Dockerfile — Backend (`backend/Dockerfile`)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- Base: `python:3.11-slim` (minimal image)
- Installs Python dependencies from `requirements.txt`
- Runs FastAPI via Uvicorn on port 8000
- Requires `GPT_API_KEY` and/or `GEMINI_API_KEY` env vars at runtime

### 4.2 Dockerfile — Frontend Web (`frontend-web/Dockerfile`)

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

ARG NEXT_PUBLIC_API_URL=http://backend:8000
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# ... (Firebase env vars set from ARGs)

RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

- Base: `node:20-alpine`
- All 6 Firebase env vars are baked into the build as `NEXT_PUBLIC_*` variables (required because Next.js embeds them at build time)
- Runs the production Next.js server on port 3000
- `NEXT_PUBLIC_API_URL` defaults to `http://backend:8000` for Docker networking

### 4.3 Docker Compose (`docker-compose.yml`)

```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    container_name: afd_backend
    ports: ["8000:8000"]
    environment:
      - GPT_API_KEY=${GPT_API_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"]
      interval: 10s
      timeout: 5s
      retries: 3

  frontend:
    build: ./frontend
    container_name: afd_frontend
    ports: ["8501:8501"]
    environment:
      - BACKEND_URL=http://backend:8000
    depends_on:
      backend:
        condition: service_healthy

  web:
    build: ./frontend-web
    container_name: afd_web
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
      - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
      - NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
    depends_on:
      backend:
        condition: service_healthy
```

**Key points:**
- `web` and `frontend` both depend on `backend` with `condition: service_healthy` — they will not start until the backend's `/health` endpoint responds
- The backend health check polls `http://localhost:8000/health` every 10 seconds
- All services restart automatically unless explicitly stopped
- Firebase env vars are passed from the host `.env` file via `${VAR}` substitution

### 4.4 Running with Docker

```bash
# 1. Create a .env file at project root with:
#    GPT_API_KEY=sk-...
#    NEXT_PUBLIC_FIREBASE_API_KEY=...
#    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
#    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
#    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
#    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
#    NEXT_PUBLIC_FIREBASE_APP_ID=...

# 2. Build and start all services
docker-compose up --build

# 3. Start in background
docker-compose up -d

# 4. View logs
docker-compose logs -f

# 5. Stop all services
docker-compose down
```

### 4.5 Running in Development (without Docker)

```bash
# Backend
cd backend
pip install -r requirements.txt
GPT_API_KEY=sk-... uvicorn main:app --reload --port 8000

# Frontend
cd frontend-web
npm install
cp .env.example .env.local   # fill in Firebase + API URL
npm run dev                  # starts on http://localhost:3000
```

---

## 5. System Architecture

### 5.1 Request Flow — Diagram Generation

```
User types prompt
       ↓
[/dashboard/:category/:diagram/create]
       ↓
DiagramInput component → refinePrompt() (optional)
       ↓
POST /generate { prompt, num_variants: 2, diagram_type }
       ↓
FastAPI → DiagramService.generate_variants()
       ↓
build_system_prompt(diagram_type) → diagram-specific instructions
       ↓
LLM (Gemini 2.0 Flash or GPT-4.1) → raw JSON string
       ↓
parse_diagram_document() → Pydantic validation + normalization
       ↓
dump_diagram_document() → serialized dict
       ↓
HTTP 200 { variants: [diagram1, diagram2] }
       ↓
Frontend irToFlow() → React Flow nodes + edges
       ↓
ReactFlow canvas renders
       ↓
IndexedDB autosave (debounced 1s) runs in background
```

### 5.2 Request Flow — Cloud Save

```
User clicks "Save" button in canvas toolbar
       ↓
useSaveDiagram hook
       ↓
Check: user authenticated? → if no, show "unauthenticated" error
       ↓
stripUndefinedDeep(ir) → clean IR (removes undefined fields Firestore rejects)
       ↓
firestoreId === null?
  YES → createDiagram(userId, { title, diagramType, categoryId, localMetaId, diagramIR })
        → Firestore addDoc() → returns new document ID
        → diagramRepository.setFirestoreId(localMetaId, newId) → stores in IndexedDB
        → onFirstSave(newId) → parent state updated
  NO  → updateDiagram(firestoreId, { diagramIR, title })
        → Firestore getDoc() + updateDoc() → increments version
       ↓
setLastSaved(ISO timestamp) → button turns green "Saved"
```

---

## 6. Frontend Architecture

### 6.1 Route Structure

```
app/
├── page.tsx                         # Landing / marketing page
├── layout.tsx                       # Root layout (AuthProvider)
├── (auth)/
│   ├── login/page.tsx               # Login form (email + Google)
│   └── signup/page.tsx              # Signup form
└── dashboard/
    ├── layout.tsx                   # Dashboard shell (TopBar + Sidebar)
    ├── page.tsx                     # Dashboard home (recent diagrams)
    ├── saved/page.tsx               # Cloud-saved diagrams (Firestore)
    ├── image/page.tsx               # Image-to-diagram extraction (GPT-4o Vision)
    ├── [category]/
    │   ├── page.tsx                 # Category overview
    │   └── [diagram]/
    │       ├── page.tsx             # Diagram type landing
    │       ├── create/page.tsx      # Prompt input + generation
    │       └── canvas/page.tsx      # Main editor canvas
```

### 6.2 Canvas Components

There are three distinct canvas implementations depending on diagram type:

| Canvas | File | Diagram Types |
|---|---|---|
| **CanvasInner** (ReactFlow) | `canvas/page.tsx` | All graph types (flowchart, ERD, class, use case, etc.) |
| **SequenceCanvas** | `components/dashboard/sequence/SequenceCanvas.tsx` | sequence |
| **ArchitectureCanvas** | `components/dashboard/architecture/ArchitectureCanvas.tsx` | system_arch |

The outer `canvas/page.tsx` component detects `diagramType` and routes to the correct canvas.

### 6.3 Hooks

| Hook | File | Purpose |
|---|---|---|
| `useAutosaveDiagram` | `hooks/useAutosaveDiagram.ts` | Debounced (1s) local autosave to IndexedDB |
| `useVariantManager` | `hooks/useVariantManager.ts` | Variant CRUD, switching, dirty state |
| `useRestoreSession` | `hooks/useRestoreSession.ts` | Rehydrate last session from IDB on page load |
| `useSaveDiagram` | `hooks/useSaveDiagram.ts` | Manual cloud save to Firestore |
| `useLoadDiagrams` | `hooks/useLoadDiagrams.ts` | Fetch user's cloud diagrams from Firestore |

### 6.4 Undo / Redo System

The graph canvas (`CanvasInner`) implements a 50-step undo/redo stack:

- **Data**: `undoStack` and `redoStack` are `useRef<HistoryEntry[]>` — zero re-renders on push
- **UI**: `undoCount` and `redoCount` are `useState<number>` — trigger button disabled state
- **`pushHistory()`**: snapshots current `getNodes()` + `getEdges()` onto the undo stack, called **before** every mutation
- **`undo()`**: pops from undo stack, pushes current state onto redo stack, applies snapshot
- **`redo()`**: pops from redo stack, pushes current state onto undo stack, applies snapshot
- Keyboard: `Cmd/Ctrl+Z` for undo, `Cmd/Ctrl+Y` or `Cmd/Ctrl+Shift+Z` for redo

### 6.5 Variant System

Each diagram can have multiple "variants" — independent snapshots of the IR:

- Variants are stored in IndexedDB (`variants` store)
- The active variant is shown in the canvas
- Switching variants with unsaved changes shows a modal (discard / save working copy)
- A thumbnail preview SVG is generated and stored in the `previews` IDB store
- `useVariantManager` handles all CRUD and dirty-state tracking

---

## 7. Backend / Middleware

### 7.1 FastAPI Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check (used by Docker healthcheck) |
| `POST` | `/generate` | Generate N diagram variants from a prompt |
| `POST` | `/refine-prompt` | Expand a rough prompt into a structured specification |
| `POST` | `/edit` | Apply a free-text instruction to an existing diagram IR |
| `POST` | `/sequence/normalize` | Convert a legacy graph-format sequence to the proper sequence IR |
| `POST` | `/export/mermaid` | Convert diagram IR to Mermaid syntax |
| `POST` | `/export/drawio` | Convert diagram IR to draw.io XML |
| `POST` | `/image/extract` | Extract a diagram IR from an uploaded image (GPT-4o Vision) |

### 7.2 DiagramService

`diagram_service.py` — the core business logic class:

- **Backend selection**: If `GPT_API_KEY` is set, uses `_OpenAIBackend` (GPT-4.1). If only `GEMINI_API_KEY` is set, uses `_GeminiBackend` (Gemini 2.0 Flash). Both required keys absent → startup error.
- **Rate limit handling**: Both backends retry up to 3 times with exponential backoff (15s → 30s → 60s). If still rate-limited after 3 retries, raises `RateLimitError` → HTTP 429 to client.
- **Variant gap**: Sleeps 4 seconds between generating variant 1 and variant 2 to avoid hitting rate limits.
- **Prompt refinement**: `refine_prompt()` calls the LLM with a diagram-type-specific template to turn rough prompts into structured specs before generation.
- **Editing**: `edit_diagram()` sends the current IR + instruction to the LLM with type-aware edit instructions (graph, sequence, or architecture mode).

### 7.3 Pydantic Models (`models.py`)

Three IR types, validated by Pydantic v2:

**`GraphDiagramIR`** — used by all graph-based diagram types:
- `nodes: List[GraphNode]` — each with id, label, type, optional fields/methods
- `edges: List[GraphEdge]` — each with source, target, optional label/relationshipType
- `@model_validator`: drops edges whose source/target don't exist in nodes (LLM hallucination tolerance)

**`SequenceDiagramIR`** — used by sequence diagrams:
- `participants`, `steps` (message/note/divider), `activations`, `fragments`
- `schemaVersion: 2`
- `@model_validator`: validates all cross-references (participant IDs, step IDs)

**`ArchitectureDiagramIR`** — used by system_arch:
- `layers: List[ArchitectureLayer]` — ordered horizontal swim-lane rows
- `nodes: List[ArchitectureNode]` — each belongs to a layer via `layerId`
- `edges: List[ArchitectureEdge]` — typed relationships with routing and style
- `@model_validator`: drops nodes with invalid layerId, prunes orphaned childNodeIds, drops edges with phantom endpoints
- `@field_validator(mode="before")` on edge fields: normalizes LLM near-miss values (e.g. `"vertical"` → `"orthogonal"`, `"api_call"` → `"external_api_call"`)

### 7.4 Diagram Module System

`diagram_modules/` — a plugin registry for diagram-type-specific generation prompts:

- Each module defines: `generation_hint` (appended to base LLM system prompt), `edit_instructions` (used for AI Edit)
- `registry.py` maps diagram type strings to modules
- Diagram types without a module fall back to `DIAGRAM_TYPE_HINTS` dict in `diagram_service.py`
- Currently registered modules: `use_case`, `user_flow`, `user_journey`, `data_flow`, `network`, `component`, `deployment`, `cloud_arch`, `cicd`

---

## 8. Diagram Generation Pipeline

```
1. User submits prompt
   │
2. (Optional) POST /refine-prompt
   │   LLM receives diagram-type-specific refinement template
   │   Returns structured specification (not JSON — plain text)
   │
3. POST /generate { prompt, num_variants: 2, diagram_type }
   │
4. build_system_prompt(diagram_type)
   │   BASE_INSTRUCTIONS (shared schema rules)
   │   + DIAGRAM_TYPE_HINTS[diagram_type] (type-specific node types + rules)
   │   OR module.generation_hint (from diagram_modules registry)
   │   For sequence: SEQUENCE_BASE_INSTRUCTIONS replaces BASE_INSTRUCTIONS
   │
5. LLM call (temperature=0.3)
   │   Model: Gemini 2.0 Flash or GPT-4.1-2025-04-14
   │   max_tokens: 4096
   │   Output: raw JSON string
   │
6. _clean_json() — strip markdown fences if LLM added them
   │
7. json.loads() → dict
   │
8. parse_diagram_document(data)
   │   kind="sequence" → SequenceDiagramIR(**data)
   │   kind="architecture" → ArchitectureDiagramIR(**data)
   │   else → GraphDiagramIR(**data)
   │   Pydantic validates schema + runs model validators
   │   Invalid enum values: normalized via field_validator(mode="before")
   │   Invalid edges: dropped with warning (not raised as errors)
   │
9. dump_diagram_document(ir) → model_dump(by_alias=True, exclude_none=True)
   │
10. Return { variants: [dict, dict] } to frontend
    │
11. Frontend: irToFlow(ir, diagramType) → { nodes: Node[], edges: Edge[] }
    │
12. ReactFlow renders canvas
    │
13. useAutosaveDiagram debounced save to IndexedDB (1s delay)
```

---

## 9. Diagram Editing Flow

### AI Edit (free-text instruction)

```
User types instruction in AI Edit panel
       ↓
POST /edit { diagram: currentIR, instruction, diagram_type }
       ↓
build_edit_instructions(diagram_type)
  → GRAPH_EDIT_INSTRUCTIONS (default)
  → SEQUENCE_EDIT_INSTRUCTIONS (sequence)
  → ARCHITECTURE_EDIT_INSTRUCTIONS (system_arch)
  → module.edit_instructions (registered modules)
       ↓
LLM returns updated IR JSON
       ↓
parse_diagram_document() → validate
       ↓
pushHistory() → snapshot pre-edit state to undo stack
       ↓
irToFlow(newIR) → apply to React Flow state
       ↓
markDirty() → trigger autosave
```

### Manual Node/Edge Editing

- **Drag node**: `onNodeDragStart` pushes history, React Flow handles position update
- **Connect nodes**: `onConnect` pushes history, adds edge (with pending edge type applied)
- **Delete**: `deleteSelected()` filters nodes/edges, pushes history
- **Add blank node**: `addBlankNode()` creates a node at canvas center, pushes history
- **ERD / Class Inspector**: Side panel for editing node fields, methods, and edge relationship types
- **Architecture Inspector**: Side panel for editing layer properties, node labels, edge relationships

### Image-to-Diagram

```
User uploads image on /dashboard/image
       ↓
POST /image/extract { file, diagram_type }
       ↓
GPT-4o Vision (requires GPT_API_KEY)
  → type-specific extraction prompt
  → returns JSON IR
       ↓
parse_diagram_document() → validate
       ↓
sessionStorage → redirect to canvas
```

---

## 10. Data Model

### Frontend IR Types (`lib/diagramTypes.ts`)

```typescript
// All graph-based diagrams
interface GraphDiagram {
  kind?: "graph";
  nodes: GraphNode[];   // { id, label, type, fields?, methods? }
  edges: GraphEdge[];   // { source, target, label?, relationshipType?, ... }
}

// Sequence diagrams
interface SequenceDiagram {
  kind: "sequence";
  schemaVersion: 2;
  participants: SequenceParticipant[];
  steps: SequenceStep[];        // message | note | divider
  activations: SequenceActivation[];
  fragments: SequenceFragment[];
}

// System architecture diagrams
interface ArchitectureDiagram {
  kind: "architecture";
  schemaVersion: 1;
  layers: ArchitectureLayer[];
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];    // typed with relationshipType, routing, style
}

type DiagramDocument = GraphDiagram | SequenceDiagram | ArchitectureDiagram;
```

### Firestore Document Schema (`FirestoreDiagram`)

```typescript
interface FirestoreDiagram {
  id: string;              // Firestore auto-generated document ID
  userId: string;          // Firebase Auth UID
  title: string;           // User-visible label
  diagramType: string;     // "flowchart" | "sequence" | "system_arch" | ...
  categoryId: string;      // "core" | "product_ux" | "scalable" | "devops_cloud"
  localMetaId: string;     // Links to IndexedDB DiagramMeta.id
  diagramIR: DiagramDocument;
  previewSVG?: string;     // SVG thumbnail
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;         // Incremented on every update
}
```

### IndexedDB Schema

| Store | Key | Shape |
|---|---|---|
| `diagrams` | `id` (nanoid) | `DiagramMeta` — name, diagramType, categoryId, activeVariantId, **firestoreId?** |
| `variants` | `id` (nanoid) | `StoredVariant` — diagramMetaId FK, ir, label, isBaseGenerated, isWorkingCopy |
| `previews` | `variantId` | `StoredPreview` — svgPayload |
| `sessions` | `"current"` (singleton) | `SessionRecord` — last open diagram state |

---

## 11. Storage System

### Hybrid Strategy

```
IndexedDB (local)                    Firestore (cloud)
─────────────────                    ─────────────────
Runs continuously                    Manual trigger only
Debounced 1s autosave                User clicks "Save" button
No auth required                     Requires Firebase Auth
Free (browser storage)               Costs money per write
Fast (synchronous reads)             Network latency
Lost if browser data cleared         Persistent across devices
```

### useAutosaveDiagram

- Listens for `markDirty()` calls from canvas change handlers
- Debounces 1 second (collapses rapid edits into one write)
- Writes current IR to IndexedDB `variants` store for the active variant
- Calls `onSaved()` → clears dirty indicator in toolbar

### useSaveDiagram

- Called only on explicit user action
- `firestoreId === null` → `createDiagram()` → stores returned ID in both Firestore and IndexedDB
- `firestoreId !== null` → `updateDiagram()` → increments version counter
- `stripUndefinedDeep()` cleans the IR before sending (Firestore rejects `undefined` values)
- Error recovery: if `updateDiagram()` returns `not-found` or `permission-denied` (stale local ID), automatically falls back to `createDiagram()` and updates the stored ID
- Error states surface on the button: gray=idle, spinner=saving, green=saved, red=error

---

## 12. Cloud Persistence — Firestore

### Collection Layout

```
/diagrams/{diagramId}
  userId: string
  title: string
  diagramType: string
  categoryId: string
  localMetaId: string
  diagramIR: { ... }
  previewSVG: string (optional)
  createdAt: Timestamp
  updatedAt: Timestamp
  version: number
```

### Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /diagrams/{diagramId} {
      allow read:          if request.auth != null && request.auth.uid == resource.data.userId;
      allow create:        if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Required Composite Index

The `getUserDiagrams()` query uses `where("userId") + orderBy("updatedAt", "desc")` which requires a composite index:

| Collection | Field | Order |
|---|---|---|
| `diagrams` | `userId` | Ascending |
| `diagrams` | `updatedAt` | Descending |

Create via Firebase Console → Firestore → Indexes, or by clicking the auto-generated link in browser DevTools when the query first runs.

### CRUD Service (`lib/firestore/diagramService.ts`)

| Function | Description |
|---|---|
| `createDiagram(userId, payload)` | `addDoc()` → returns new Firestore document ID |
| `getUserDiagrams(userId, pageSize=50)` | Query + orderBy updatedAt desc, limit 50 |
| `getDiagramById(firestoreId)` | `getDoc()` for a single document |
| `updateDiagram(firestoreId, payload)` | `getDoc()` version + `updateDoc()` |
| `deleteDiagram(firestoreId)` | `deleteDoc()` |

### Saved Diagrams Page (`app/dashboard/saved/page.tsx`)

- Lists all cloud-saved diagrams from Firestore with preview thumbnails
- **Open**: creates fresh IndexedDB records (DiagramMeta + StoredVariant) from the Firestore IR, sets session, redirects to canvas — the `firestoreId` is preserved so subsequent saves call `updateDiagram()` instead of creating a duplicate
- **Delete**: `deleteDiagram()` + removes from local state
- **Refresh**: manual re-fetch button

### Deploying Rules

```bash
firebase init firestore     # one-time setup (select existing project)
firebase deploy --only firestore:rules
```

---

## 13. Authentication System

Firebase Auth is used exclusively. The `AuthContext` (`contexts/AuthContext.tsx`) wraps the entire app:

```typescript
interface AuthContextValue {
  user: User | null;        // Firebase User object
  loading: boolean;         // true during initial auth state check
  login(email, password): Promise<void>
  signup(email, password): Promise<void>
  loginWithGoogle(): Promise<void>   // Google OAuth popup
  logout(): Promise<void>
  resetPassword(email): Promise<void>
}
```

Route protection is handled by `middleware.ts` — unauthenticated users accessing `/dashboard/*` are redirected to `/login`.

---

## 14. File-by-File Breakdown

### Backend

| File | Purpose |
|---|---|
| `main.py` | FastAPI app, all route handlers, CORS config, image extraction |
| `diagram_service.py` | DiagramService class, LLM backends, prompt system, Mermaid/draw.io export |
| `models.py` | Pydantic IR schemas for all 3 diagram types, validators, parse/dump helpers |
| `diagram_modules/registry.py` | Maps diagram type string → module |
| `diagram_modules/*.py` | Per-type generation hints and edit instructions |
| `Dockerfile` | `python:3.11-slim`, uvicorn |
| `requirements.txt` | fastapi, pydantic, google-generativeai, openai, uvicorn |

### Frontend — Core

| File | Purpose |
|---|---|
| `lib/firebase.ts` | Firebase app init, `auth` and `db` exports |
| `lib/api.ts` | Typed wrappers for all backend HTTP calls |
| `lib/diagramTypes.ts` | TypeScript interfaces for all 3 IR types |
| `lib/flowUtils.ts` | `irToFlow()` and `flowToIr()` — IR ↔ ReactFlow conversion |
| `lib/categories.ts` | Diagram type metadata (label, icon, color, category) |
| `lib/canvasLibrary.ts` | Shape palette and edge type definitions per diagram type |
| `contexts/AuthContext.tsx` | Firebase Auth state provider |
| `middleware.ts` | Route protection — redirects unauthenticated users |

### Frontend — Storage

| File | Purpose |
|---|---|
| `lib/db/indexedDb.ts` | Raw IDB singleton, helper functions, `DiagramMeta`/`StoredVariant`/`StoredPreview`/`SessionRecord` types |
| `lib/db/diagramRepository.ts` | CRUD for `diagrams` IDB store + `setFirestoreId()` |
| `lib/db/variantRepository.ts` | CRUD for `variants` IDB store |
| `lib/db/previewRepository.ts` | CRUD for `previews` IDB store |
| `lib/db/sessionRepository.ts` | Read/write last session singleton |
| `lib/firestore/diagramService.ts` | Firestore CRUD for the `diagrams` collection |

### Frontend — Hooks

| File | Purpose |
|---|---|
| `hooks/useAutosaveDiagram.ts` | Debounced local autosave to IndexedDB |
| `hooks/useVariantManager.ts` | Variant CRUD, switching, dirty state |
| `hooks/useRestoreSession.ts` | Rehydrate canvas state from last IDB session |
| `hooks/useSaveDiagram.ts` | Manual cloud save — create or update Firestore document |
| `hooks/useLoadDiagrams.ts` | Fetch + manage user's cloud diagrams list |

### Frontend — Canvas Pages

| File | Purpose |
|---|---|
| `app/dashboard/[category]/[diagram]/canvas/page.tsx` | Main canvas — ReactFlow for all graph types |
| `components/dashboard/sequence/SequenceCanvas.tsx` | Custom sequence diagram renderer |
| `components/dashboard/architecture/ArchitectureCanvas.tsx` | System architecture canvas with layers |

### Frontend — Inspector Panels

| File | Purpose |
|---|---|
| `components/dashboard/ERDInspector.tsx` | Edit ERD entity fields and relationships |
| `components/dashboard/ClassInspector.tsx` | Edit class attributes, methods, visibility |
| `components/dashboard/RelationshipInspector.tsx` | Edit UML edge relationship types |
| `components/dashboard/architecture/ArchitectureInspector.tsx` | Edit arch layers, nodes, edge types |
| `components/dashboard/sequence/SequenceInspector.tsx` | Edit sequence participants, steps |

### Frontend — Pages

| File | Purpose |
|---|---|
| `app/dashboard/saved/page.tsx` | Cloud-saved diagrams list (Firestore) |
| `app/dashboard/image/page.tsx` | Image upload → diagram extraction |
| `app/dashboard/page.tsx` | Dashboard home with recents |
| `app/(auth)/login/page.tsx` | Login form |
| `app/(auth)/signup/page.tsx` | Signup form |

---

## 15. Diagram Types Reference

There are **14 diagram types** across 4 categories. These are the exact types exposed in the frontend (`lib/categories.ts`).

### Core Diagrams — 5 types (category: `core`)

| Type Key | Label | Purpose | Canvas | IR Format |
|---|---|---|---|---|
| `system_arch` | System Architecture | Services, APIs, databases, data flow | ArchitectureCanvas | Architecture IR |
| `flowchart` | Flowchart | Logic, process steps, branch decisions | ReactFlow | Graph IR |
| `sequence` | Sequence Diagram | Actor interactions and messages over time | SequenceCanvas | Sequence IR |
| `erd` | ER Diagram | Entities, attributes, and relationships | ReactFlow | Graph IR (entity nodes with `fields`) |
| `class` | Class Diagram | OOP classes, methods, and inheritance | ReactFlow | Graph IR (with `fields` + `methods`) |

### Scalable Systems — 3 types (category: `scalable`)

| Type Key | Label | Purpose | Canvas | IR Format |
|---|---|---|---|---|
| `component` | Component Diagram | Module interfaces and dependencies | ReactFlow | Graph IR |
| `deployment` | Deployment Diagram | Hardware nodes and software artifacts | ReactFlow | Graph IR |
| `data_flow` | Data Flow Diagram | Data movement through processes and stores | ReactFlow | Graph IR |

### Product & UX — 3 types (category: `product_ux`)

| Type Key | Label | Purpose | Canvas | IR Format |
|---|---|---|---|---|
| `use_case` | Use Case Diagram | Actor goals and system behavior | ReactFlow | Graph IR |
| `user_flow` | User Flow | Screens, decisions, and navigation paths | ReactFlow | Graph IR |
| `user_journey` | User Journey Map | Touchpoints, emotions, and opportunities | ReactFlow | Graph IR |

### DevOps & Cloud — 3 types (category: `devops_cloud`)

| Type Key | Label | Purpose | Canvas | IR Format |
|---|---|---|---|---|
| `cloud_arch` | Cloud Architecture | Cloud services, regions, and networking | ReactFlow | Graph IR |
| `network` | Network Diagram | Routers, switches, and topology | ReactFlow | Graph IR |
| `cicd` | CI/CD Pipeline | Build, test, and deployment stages | ReactFlow | Graph IR |

> **Note:** The backend `diagram_service.py` contains generation prompts for additional types (`aws`, `azure`, `kubernetes`, `terraform`, `state`, `bpmn`, `swimlane`, etc.) that are supported at the API level but not currently exposed as UI routes in the frontend.

---

## 16. Performance Considerations

### Frontend

- **IndexedDB autosave debounced at 1 second** — prevents write storms during rapid edits
- **Undo/redo uses `useRef` stacks** — stack mutations cause zero re-renders; only count integers are in state
- **`onNodesChange` / `onEdgesChange` wrapped in `useCallback` with stable deps** — prevents React Flow infinite loops
- **Variant previews lazy-loaded** — SVG thumbnails fetched from IDB only when the variant panel is visible
- **Firestore writes only on explicit user action** — no autosave to cloud, avoids cost and latency

### Backend

- **Inter-variant sleep of 4 seconds** — prevents rate limits when generating 2 variants back-to-back
- **Exponential backoff** — 15s → 30s → 60s on LLM rate limit errors
- **`exclude_none=True` in `dump_diagram_document()`** — reduces JSON payload size
- **LLM temperature 0.3 for generation, 0.2 for editing** — lower for editing to keep changes focused

---

## 17. Challenges & Solutions

| Challenge | Solution |
|---|---|
| LLM generates phantom node IDs in edges | `model_validator` drops invalid edges with a warning instead of failing the entire generation |
| LLM generates invalid enum values (e.g. `"vertical"` for routing mode) | `field_validator(mode="before")` maps near-miss values to valid ones before Pydantic type check |
| React Flow callbacks mutating state cause infinite loops | `useCallback` with minimal stable deps; `getNodes()`/`getEdges()` used inside callbacks instead of captured state |
| `pushHistory` used before declaration (TypeScript error) | `useCallback` does not hoist — moved declaration before all callers |
| Stale `firestoreId` in `saveToCloud` closure after first save | `firestoreIdRef` pattern — ref stays current even if state update hasn't propagated |
| Firestore rejects `undefined` field values | `stripUndefinedDeep()` recursive cleaner applied before every Firestore write |
| `NEXT_PUBLIC_*` vars missing in Docker | Firebase env vars passed as both `ARG` and `ENV` in Dockerfile; baked in at `npm run build` time |
| Sequence diagrams use different IR format than graph diagrams | Three separate canvas components; `useSaveDiagram` accepts optional `irOverride` parameter to bypass `flowToIr()` |
| LLM class diagram puts methods in label instead of fields array | Explicit `CRITICAL` instruction in both generation and edit prompts; `WRONG` / `CORRECT` examples shown |

---

## Appendix

### A. Environment Variables

| Variable | Where Set | Required By |
|---|---|---|
| `GPT_API_KEY` | backend `.env` / Docker | Backend (OpenAI LLM + image extraction) |
| `GEMINI_API_KEY` | backend `.env` / Docker | Backend (Gemini LLM — alternative to GPT) |
| `NEXT_PUBLIC_API_URL` | frontend-web `.env.local` | Frontend HTTP calls to backend |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | frontend-web `.env.local` + Docker | Firebase SDK init |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | frontend-web `.env.local` + Docker | Firebase Auth |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | frontend-web `.env.local` + Docker | Firestore |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | frontend-web `.env.local` + Docker | Firebase Storage |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | frontend-web `.env.local` + Docker | FCM |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | frontend-web `.env.local` + Docker | Firebase App |

### B. Key Architectural Decisions

| Decision | Rationale |
|---|---|
| IndexedDB for autosave, Firestore for manual save | Firestore costs money per write; autosaving on every keystroke would be expensive. IDB is free and fast. |
| Three separate canvas implementations | Sequence and architecture diagrams have fundamentally different data models; forcing them into ReactFlow would require excessive hacks |
| Pydantic `field_validator(mode="before")` for LLM output | LLMs reliably produce near-miss enum values. Pre-validation normalization is more reliable than prompt engineering alone |
| `model_validator` drops invalid edges instead of raising | A diagram with 1 bad edge is still useful; failing the entire 4-second LLM call for a phantom node reference is not |
| Docker health check on `/health` before frontend starts | Prevents frontend from loading and making API calls while the backend is still initializing |
| `firestoreIdRef` pattern in `useSaveDiagram` | React state batching means `firestoreId` state may not be current inside a `useCallback` closure; a ref always reflects the latest value |

### C. Build & Run Commands

```bash
# Development
npm run dev          # Next.js dev server (hot reload)
npm run build        # Production build
npm run lint         # ESLint check
npx tsc --noEmit     # TypeScript type check

# Docker
docker-compose up --build       # Build images + start all services
docker-compose up -d            # Start in background
docker-compose down             # Stop all services
docker-compose logs -f backend  # Tail backend logs
docker-compose logs -f web      # Tail frontend logs

# Firebase
firebase login
firebase init firestore
firebase deploy --only firestore:rules

# Backend (local)
uvicorn main:app --reload --port 8000
```

### D. System Architecture ASCII Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        DOCKER HOST                          │
│                                                             │
│  ┌─────────────┐    ┌─────────────────┐    ┌────────────┐  │
│  │  afd_web    │    │   afd_backend   │    │ afd_front  │  │
│  │  Next.js    │───▶│   FastAPI       │    │ Streamlit  │  │
│  │  port 3000  │    │   port 8000     │    │ port 8501  │  │
│  └──────┬──────┘    └────────┬────────┘    └────────────┘  │
│         │                   │                               │
└─────────┼───────────────────┼───────────────────────────────┘
          │                   │
          ▼                   ▼
   ┌─────────────┐    ┌──────────────────────────┐
   │  Firebase   │    │       LLM APIs           │
   │  Auth       │    │  Gemini 2.0 Flash        │
   │  Firestore  │    │  GPT-4.1 / GPT-4o Vision │
   └─────────────┘    └──────────────────────────┘
```
