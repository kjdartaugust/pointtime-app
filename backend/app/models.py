from typing import Literal, Optional
from pydantic import BaseModel, Field

UrgencyLevel = Literal["emergency", "urgent", "soon", "routine"]


class ClassifyRequest(BaseModel):
    problem: str = Field(..., min_length=3, max_length=2000)


class Classification(BaseModel):
    category: str
    urgency: UrgencyLevel
    is_emergency: bool
    explanation: str  # non-diagnostic, plain-language likely cause
    professional_type: str
    search_query: str
    safety_note: Optional[str] = None


class Location(BaseModel):
    lat: float
    lng: float


class SearchRequest(BaseModel):
    search_query: str = Field(..., min_length=2, max_length=200)
    location: Location
    radius_m: int = Field(default=15000, ge=500, le=50000)


class Provider(BaseModel):
    id: str
    name: str
    rating: Optional[float] = None
    user_rating_count: Optional[int] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    distance_km: Optional[float] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    open_now: Optional[bool] = None
    maps_url: Optional[str] = None


class SearchResponse(BaseModel):
    providers: list[Provider]


class SeoContent(BaseModel):
    slug: str
    title: str
    meta_description: str
    intro: str
    likely_causes: list[str]
    who_to_see: str
    when_urgent: str
