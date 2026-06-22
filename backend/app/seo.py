"""Programmatic SEO — AI-generated, non-diagnostic content per problem slug."""
import json
import os

import httpx

from .classifier import OPENROUTER_URL, _strip_fences
from .models import SeoContent

SEO_SYSTEM_PROMPT = """You write SEO landing-page content for PointMe, an app that \
matches people to real-world professionals. Given a problem slug (e.g. \
"dental-pain-help"), return ONLY JSON:
{
  "title": string,              // <=60 chars, includes the problem + "Near You"
  "meta_description": string,   // <=155 chars, helpful + CTA tone
  "intro": string,              // 2-3 friendly sentences
  "likely_causes": [string],    // 3-5 plain-language, NON-diagnostic possibilities
  "who_to_see": string,         // which professional to contact
  "when_urgent": string         // when to seek urgent/emergency help
}
For health topics NEVER diagnose — use "could be"/"is often linked to" and always \
recommend seeing a qualified professional. Output valid JSON only."""


async def generate_seo(slug: str) -> SeoContent:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    model = os.environ.get("OPENROUTER_MODEL", "anthropic/claude-3.5-sonnet")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not set")

    topic = slug.replace("-", " ")
    payload = {
        "model": model,
        "temperature": 0.4,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": SEO_SYSTEM_PROMPT},
            {"role": "user", "content": f'slug: "{slug}" (topic: {topic})'},
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

    data = json.loads(_strip_fences(content))
    return SeoContent(slug=slug, **data)
