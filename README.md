# PointMe

Describe any problem in plain language and get matched to the right real-world professional
nearby — then call, WhatsApp, or get directions instantly.

- **Frontend:** Next.js (App Router) + Tailwind, deployed to Vercel
- **Backend:** FastAPI, deployed to Render
- **AI:** OpenRouter (problem classification + SEO content)
- **Data:** Google Places API (New)

## Quick start

Backend:
```bash
cd backend
python -m venv .venv && source .venv/Scripts/activate   # or .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # add OPENROUTER_API_KEY + GOOGLE_PLACES_API_KEY
uvicorn main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_BASE at the backend
npm run dev
```

Open http://localhost:3000.

## How it works

1. **Classify** — `POST /api/classify` sends the problem to OpenRouter, which returns strict
   JSON (category, urgency, non-diagnostic explanation, professional type, search query). A
   deterministic keyword check (`app/safety.py`) overrides the model to flag emergencies.
2. **Locate** — the browser provides geolocation.
3. **Search** — `POST /api/search` queries Google Places with the AI's search query and returns
   nearby providers sorted by distance.
4. **Act** — each result card offers click-to-call, WhatsApp, and directions.
5. **SEO** — `/{slug}` (e.g. `/dental-pain-help`) renders AI-generated, non-diagnostic landing
   pages with metadata and FAQ structured data, plus a "find help near you" CTA.

## Safety

PointMe never diagnoses. Health problems are explained in plain, non-medical terms with a
referral to the right professional, and emergency phrasing always surfaces a crisis banner.

## Deploy

- **Backend → Render:** `render.yaml` is included (Python runtime). Set `OPENROUTER_API_KEY`,
  `GOOGLE_PLACES_API_KEY`, and `ALLOWED_ORIGINS` in the dashboard.
- **Frontend → Vercel:** set `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_SITE_URL`. Any
  `*.vercel.app` origin is already allowed by the backend CORS config.
