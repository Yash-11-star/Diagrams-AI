import logging
import traceback

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diagram_service import DiagramService, RateLimitError
import os

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(title="Agentic Figure Drawing API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

service = DiagramService(
    gemini_api_key=os.environ.get("GEMINI_API_KEY", ""),
    openai_api_key=os.environ.get("GPT_API_KEY", ""),
)


class GenerateRequest(BaseModel):
    prompt: str
    num_variants: int = 2


class EditRequest(BaseModel):
    diagram: dict
    instruction: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate")
def generate(req: GenerateRequest):
    if not req.prompt.strip():
        raise HTTPException(400, "Prompt cannot be empty.")
    try:
        variants = service.generate_variants(req.prompt, req.num_variants)
        return {"variants": variants}
    except RateLimitError as e:
        logger.error("Rate limit: %s", e)
        raise HTTPException(429, str(e))
    except Exception as e:
        logger.error("Error in /generate:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))


@app.post("/edit")
def edit(req: EditRequest):
    try:
        updated = service.edit_diagram(req.diagram, req.instruction)
        return {"diagram": updated}
    except RateLimitError as e:
        logger.error("Rate limit: %s", e)
        raise HTTPException(429, str(e))
    except Exception as e:
        logger.error("Error in /edit:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))


@app.post("/export/mermaid")
def export_mermaid(diagram: dict):
    try:
        mermaid = service.to_mermaid(diagram)
        return {"mermaid": mermaid}
    except Exception as e:
        logger.error("Error in /export/mermaid:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))


@app.post("/export/drawio")
def export_drawio(diagram: dict):
    try:
        xml = service.to_drawio(diagram)
        return {"xml": xml}
    except Exception as e:
        logger.error("Error in /export/drawio:\n%s", traceback.format_exc())
        raise HTTPException(500, str(e))