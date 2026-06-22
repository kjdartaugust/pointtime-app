# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PointMe matches a free-text problem ("my tooth has been throbbing for two days") to the right
real-world professional nearby. Two services: a **FastAPI** backend (`backend/`) that does AI
classification + Places search + SEO content generation, and a **Next.js App Router** frontend
(`frontend/`). Deploy targets: Vercel (frontend) + Render (backend).

## Commands

Backend (run from `backend/`):
```bash
python -m venv .venv && source .venv/Scripts/activate   # Windows Git Bash; use bin/activate on *nix
pip install -r requirements.txt
cp .env.example .env                                     # then fill in keys
uvicorn main:app --reload --port 8000                   # http://localhost:8000, docs at /docs
```

Frontend (run from `frontend/`):
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also the Vercel build step)
npm run lint
```

There is no test suite yet. Verify backend changes against the interactive docs at `/docs`.

## Required environment

Backend (`backend/.env`, see `.env.example`): `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`,
`GOOGLE_PLACES_API_KEY`, `ALLOWED_ORIGINS` (comma-separated). CORS also allows any
`*.vercel.app` origin via regex in `main.py`.

Frontend: `NEXT_PUBLIC_API_BASE` (the backend URL; defaults to `http://localhost:8000`).

## Architecture

**Request flow (home page):** `ProblemFinder.tsx` orchestrates a 3-step client sequence —
`classifyProblem` → `getUserLocation` (browser geolocation) → `searchProviders`. The AI's
`search_query` from step 1 is what gets passed to Places in step 3; the AI never sees the
results. All backend calls go through `frontend/lib/api.ts`.

**Backend modules (`backend/app/`):**
- `classifier.py` — OpenRouter call returning strict JSON. Uses `response_format: json_object`
  plus `_strip_fences` as a fallback parser.
- `places.py` — Google Places API (New) text search with `locationBias`; computes haversine
  distance and sorts nearest-first. Fields are requested via the `X-Goog-FieldMask` header.
- `seo.py` — generates per-slug landing-page content; reuses `OPENROUTER_URL`/`_strip_fences`
  from `classifier.py`.
- `models.py` — Pydantic models shared across endpoints; mirrored manually in
  `frontend/lib/types.ts` (keep the two in sync when changing shapes).
- `main.py` — wires the three endpoints: `POST /api/classify`, `POST /api/search`,
  `GET /api/seo/{slug}`.

**Safety is non-negotiable and deterministic.** `safety.py` runs a keyword regex pass
(`detect_emergency`) that overrides the model: even if the AI returns a low urgency, a matched
emergency phrase forces `is_emergency=True`, `urgency="emergency"`, and a crisis `safety_note`.
The classifier prompt also forbids medical diagnosis — health problems must explain *likely*
causes non-medically and point to a professional. Preserve both layers when editing AI prompts
or response handling.

**Programmatic SEO:** `frontend/app/[slug]/page.tsx` is the dynamic landing page. It validates
the slug (`^[a-z0-9-]+$`), fetches AI content with ISR (`revalidate = 86400`), pre-renders a
seed list in `generateStaticParams`, emits `generateMetadata` + FAQPage JSON-LD, and embeds
`ProblemFinder` as the "find help near you" CTA.

## Design language

Apple-inspired: Inter font, black/white palette with a single accent (`accent` blue in
`tailwind.config.ts`), heavy whitespace, large rounded corners (`rounded-4xl`), soft shadows,
frosted glass (`.glass` utility in `globals.css`), and subtle `framer-motion` / `animate-fade-up`
micro-animations. Mobile-first. Keep it minimal — favor whitespace over chrome.
