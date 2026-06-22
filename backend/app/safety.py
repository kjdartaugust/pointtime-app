"""Reusable safety-check pattern to flag emergencies before/after AI classification."""
import re

# Phrases that should always trigger an emergency banner regardless of AI output.
_EMERGENCY_PATTERNS = [
    r"\bchest pain\b",
    r"\bcan'?t breathe\b",
    r"\bdifficulty breathing\b",
    r"\bshortness of breath\b",
    r"\bunconscious\b",
    r"\bnot breathing\b",
    r"\bsevere bleeding\b|\bbleeding (a lot|heavily|won'?t stop)\b",
    r"\bstroke\b|\bface drooping\b|\bslurred speech\b",
    r"\bheart attack\b",
    r"\bsuicid\w*|\bkill myself\b|\bself[- ]harm\b|\bend my life\b",
    r"\boverdose\b|\bpoison(ed|ing)?\b",
    r"\bseizure\b|\bconvuls\w+\b",
    r"\bchoking\b",
    r"\bsevere allergic\b|\banaphyla\w+\b",
    r"\bgun ?shot\b|\bstab\w*\b",
    r"\bgas leak\b|\bcarbon monoxide\b",
    r"\bhouse (is )?on fire\b|\bfire spreading\b",
]

_COMPILED = [re.compile(p, re.IGNORECASE) for p in _EMERGENCY_PATTERNS]

CRISIS_NOTE = (
    "This may be an emergency. If you or someone is in immediate danger, "
    "call your local emergency number now (e.g. 911 / 112 / 999). For mental "
    "health crises, contact a local crisis line immediately."
)


def detect_emergency(text: str) -> bool:
    """Deterministic keyword pass — cheap, runs even if the AI misses it."""
    return any(p.search(text) for p in _COMPILED)
