import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.classifier import classify
from app.models import (
    Classification,
    ClassifyRequest,
    SearchRequest,
    SearchResponse,
    SeoContent,
)
from app.places import search_places
from app.seo import generate_seo

app = FastAPI(title="PointMe API", version="1.0.0")

_origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/classify", response_model=Classification)
async def classify_endpoint(req: ClassifyRequest):
    try:
        return await classify(req.problem)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"classification failed: {e}")


@app.post("/api/search", response_model=SearchResponse)
async def search_endpoint(req: SearchRequest):
    try:
        providers = await search_places(req.search_query, req.location, req.radius_m)
        return SearchResponse(providers=providers)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"search failed: {e}")


@app.get("/api/seo/{slug}", response_model=SeoContent)
async def seo_endpoint(slug: str):
    try:
        return await generate_seo(slug)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"seo generation failed: {e}")
