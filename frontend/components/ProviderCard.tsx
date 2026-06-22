import type { Provider } from "@/lib/types";

function StarRow({ rating, count }: { rating?: number | null; count?: number | null }) {
  if (rating == null) return <span className="text-sm text-black/40">No rating yet</span>;
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="text-gold">★</span>
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {count != null && <span className="text-black/40">({count})</span>}
    </div>
  );
}

export function ProviderCard({ provider }: { provider: Provider }) {
  const waNumber = provider.phone?.replace(/[^\d]/g, "");
  const directions = provider.maps_url
    ? provider.maps_url
    : provider.lat && provider.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lng}`
    : null;

  return (
    <div className="card animate-fade-up p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-semibold tracking-tight">{provider.name}</h3>
          {provider.address && (
            <p className="mt-1 truncate text-sm text-black/45">{provider.address}</p>
          )}
        </div>
        {provider.distance_km != null && (
          <span className="shrink-0 rounded-full bg-grape-soft px-3 py-1 text-xs font-semibold text-grape">
            {provider.distance_km} km
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <StarRow rating={provider.rating} count={provider.user_rating_count} />
        {provider.open_now != null && (
          <span className={`text-sm font-medium ${provider.open_now ? "text-green-600" : "text-black/40"}`}>
            {provider.open_now ? "Open now" : "Closed"}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {provider.phone && (
          <a href={`tel:${provider.phone}`} className="btn-primary px-5 py-2.5 text-sm">
            Call
          </a>
        )}
        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm"
          >
            WhatsApp
          </a>
        )}
        {directions && (
          <a href={directions} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
            Directions
          </a>
        )}
      </div>
    </div>
  );
}
