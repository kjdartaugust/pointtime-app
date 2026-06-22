import type { Classification, Provider, SeoContent } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${detail}`);
  }
  return res.json();
}

export function classifyProblem(problem: string): Promise<Classification> {
  return post<Classification>("/api/classify", { problem });
}

export function searchProviders(
  search_query: string,
  location: { lat: number; lng: number },
  radius_m = 15000
): Promise<{ providers: Provider[] }> {
  return post("/api/search", { search_query, location, radius_m });
}

export async function getSeoContent(slug: string): Promise<SeoContent> {
  const res = await fetch(`${API_BASE}/api/seo/${slug}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`SEO fetch failed: ${res.status}`);
  return res.json();
}

export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message || "Could not get your location.")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}
