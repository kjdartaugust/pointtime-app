"""AI Problem Classifier — OpenRouter → strict JSON. Never diagnoses."""
import json
import os

import httpx

from .models import Classification
from .safety import detect_emergency, CRISIS_NOTE

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT = """You are PointMe's problem classifier. The user describes any \
real-world problem in plain language. Return ONLY a JSON object — no prose, no \
markdown fences.

Schema:
{
  "category": string,            // short domain, e.g. "Dental", "Plumbing", "Legal", "Auto Repair", "Mental Health"
  "urgency": "emergency" | "urgent" | "soon" | "routine",
  "is_emergency": boolean,       // true only for life/safety-threatening situations
  "explanation": string,         // 1-2 sentences, plain language, likely cause
  "professional_type": string,   // who to see, e.g. "Dentist", "Emergency Plumber", "Family Lawyer"
  "search_query": string,        // concise query for a maps/places search, e.g. "emergency dentist"
  "safety_note": string | null   // short caution if relevant, else null
}

CRITICAL RULES:
- For health/medical problems you MUST NOT diagnose. Do not name a specific disease \
as fact. Explain only *likely* non-medical causes in everyday terms and direct the \
user to the right professional. Use hedging language ("could be", "is often \
associated with").
- Set is_emergency=true and urgency="emergency" for anything life-threatening \
(chest pain, trouble breathing, severe bleeding, stroke signs, suicidal thoughts, \
poisoning, etc.) and put an appropriate warning in safety_note.
- Keep every field concise. search_query must be something a local directory would \
understand.
- Output valid JSON only."""


def _strip_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1] if "```" in text[3:] else text
        text = text.lstrip("json").strip().rstrip("`").strip()
    return text


def _parse_json(content: str) -> dict:
    """Tolerant JSON parse: try as-is, then the outermost {...} substring."""
    text = _strip_fences(content)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end > start:
            return json.loads(text[start : end + 1])
        raise


async def _request_classification(problem: str) -> dict:
    api_key = (os.environ.get("OPENROUTER_API_KEY") or "").strip()
    model = os.environ.get("OPENROUTER_MODEL", "openrouter/auto").strip()
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not set")

    payload = {
        "model": model,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": problem},
        ],
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "X-Title": "PointMe",
    }

    async with httpx.AsyncClient(timeout=40) as client:
        resp = await client.post(OPENROUTER_URL, json=payload, headers=headers)
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]

    return _parse_json(content)


async def classify(problem: str) -> Classification:
    # Retry once: models occasionally emit malformed JSON. This path is
    # safety-critical, so we never want a transient parse miss to drop the
    # emergency check below.
    try:
        data = await _request_classification(problem)
    except (json.JSONDecodeError, KeyError):
        data = await _request_classification(problem)

    result = Classification(**data)

    # Deterministic safety override — never trust the model alone for emergencies.
    if detect_emergency(problem):
        result.is_emergency = True
        result.urgency = "emergency"
        if not result.safety_note:
            result.safety_note = CRISIS_NOTE

    return result
