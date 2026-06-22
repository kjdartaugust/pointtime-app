"""Google Places API (New) text search + distance calc."""
import math
import os

import httpx

from .models import Location, Provider

PLACES_URL = "https://places.googleapis.com/v1/places:searchText"

_FIELDS = ",".join(
    [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.internationalPhoneNumber",
        "places.location",
        "places.currentOpeningHours.openNow",
        "places.googleMapsUri",
    ]
)


def _haversine_km(a: Location, lat: float, lng: float) -> float:
    r = 6371.0
    dlat = math.radians(lat - a.lat)
    dlng = math.radians(lng - a.lng)
    h = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(a.lat)) * math.cos(math.radians(lat)) * math.sin(dlng / 2) ** 2
    )
    return round(2 * r * math.asin(math.sqrt(h)), 1)


async def search_places(query: str, location: Location, radius_m: int) -> list[Provider]:
    api_key = os.environ.get("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_PLACES_API_KEY is not set")

    payload = {
        "textQuery": query,
        "maxResultCount": 20,
        "locationBias": {
            "circle": {
                "center": {"latitude": location.lat, "longitude": location.lng},
                "radius": float(radius_m),
            }
        },
    }
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": _FIELDS,
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(PLACES_URL, json=payload, headers=headers)
        if resp.status_code >= 400:
            # Surface Google's actual error message (status + reason) for debugging.
            raise RuntimeError(f"Places API {resp.status_code}: {resp.text}")
        places = resp.json().get("places", [])

    providers: list[Provider] = []
    for p in places:
        loc = p.get("location", {})
        lat, lng = loc.get("latitude"), loc.get("longitude")
        providers.append(
            Provider(
                id=p.get("id", ""),
                name=(p.get("displayName") or {}).get("text", "Unknown"),
                rating=p.get("rating"),
                user_rating_count=p.get("userRatingCount"),
                address=p.get("formattedAddress"),
                phone=p.get("internationalPhoneNumber"),
                lat=lat,
                lng=lng,
                distance_km=_haversine_km(location, lat, lng) if lat and lng else None,
                open_now=(p.get("currentOpeningHours") or {}).get("openNow"),
                maps_url=p.get("googleMapsUri"),
            )
        )

    providers.sort(key=lambda x: (x.distance_km is None, x.distance_km or 0))
    return providers
