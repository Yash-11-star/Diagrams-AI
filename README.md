# Agentic Figure Drawing

## Architecture

```
User → Streamlit Frontend (port 8501)
            ↓ HTTP
       FastAPI Backend (port 8000)
            ↓
       Gemini 2.0 Flash  ─or─  GPT-4.1
            ↓
       Structured JSON IR (Pydantic validated)
            ↓
       Mermaid (.mmd) / draw.io XML export
```

**Backend selection:** If `GPT_API_KEY` is set it takes priority; otherwise `GEMINI_API_KEY` is used. Both support automatic exponential-backoff retry on rate limits.

---

## Quick Start

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free tier available) **or** an OpenAI API key

### 2. Configure your API key
Create a `.env` file in the project root:

```bash
# Use Gemini (free tier available)
GEMINI_API_KEY=your_gemini_key_here

# Or use GPT-4.1 (OpenAI — takes priority if both are set)
# GPT_API_KEY=your_openai_key_here
```

### 3. Build and run
```bash
docker compose up --build
```

### 4. Open the app
| Service | URL |
|---------|-----|
| Frontend (Streamlit) | http://localhost:8501 |
| Backend API docs | http://localhost:8000/docs |

### 5. Stop
```bash
docker compose down
```

---

## Usage

### Generate Tab
1. Enter a natural-language diagram description or pick a quick example
2. Set the number of variants (1–3) in the sidebar
3. Click **Generate Variants** — the LLM produces JSON IR variants
4. Select a variant to preview it as a Mermaid diagram
5. Inspect the raw JSON IR in the expander

### Edit Tab
1. Describe a modification in plain English (or pick a quick-edit example)
2. Click **Apply Edit** — the LLM updates the JSON IR incrementally
3. Use **Undo** to step back through the full edit history

### Export Tab
| Format | Use case |
|--------|----------|
| **Mermaid (.mmd)** | Paste into GitHub, GitLab, Notion, or any Mermaid-compatible tool |
| **draw.io XML (.drawio)** | Open at [diagrams.net](https://app.diagrams.net) for full visual editing |
| **JSON IR (.json)** | Canonical intermediate representation — import into any future tool |

---

## JSON Intermediate Representation (IR)

The IR is the source of truth for every diagram. It is a Pydantic-validated JSON object:

```json
{
  "nodes": [
    { "id": "start_node", "label": "Start", "type": "start" },
    { "id": "check_auth", "label": "Authenticated?", "type": "decision" }
  ],
  "edges": [
    { "source": "start_node", "target": "check_auth", "label": "begin" }
  ]
}
```

**Supported node types:** `start` · `end` · `process` · `decision` · `input_output` · `queue` · `storage` · `actor` · `step` · `action` · `status`

---

## Project Structure

```
.
├── backend/
│   ├── main.py            # FastAPI app + endpoints
│   ├── diagram_service.py # LLM backends, export logic, rate-limit retry
│   ├── models.py          # Pydantic JSON IR schema (Node, Edge, DiagramIR)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app.py             # Streamlit UI (Generate / Edit / Export tabs)
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── .env                   # ← create this (never commit it)
└── README.md
```

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/generate` | Generate diagram variants from a prompt |
| `POST` | `/edit` | Apply a modification instruction to an existing IR |
| `POST` | `/export/mermaid` | Convert IR → Mermaid syntax |
| `POST` | `/export/drawio` | Convert IR → draw.io XML |

Full interactive docs at `http://localhost:8000/docs`.
