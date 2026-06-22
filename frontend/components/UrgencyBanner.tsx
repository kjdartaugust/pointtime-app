import type { UrgencyLevel } from "@/lib/types";

const STYLES: Record<UrgencyLevel, { bg: string; label: string; dot: string }> = {
  emergency: { bg: "bg-red-50 border-red-200 text-red-700", label: "Emergency", dot: "bg-red-500" },
  urgent: { bg: "bg-gold-soft border-gold/30 text-gold", label: "Urgent", dot: "bg-gold" },
  soon: { bg: "bg-amber-50 border-amber-200 text-amber-700", label: "See someone soon", dot: "bg-amber-500" },
  routine: { bg: "bg-lime-soft border-lime/40 text-lime", label: "Routine", dot: "bg-lime" },
};

export function UrgencyBanner({
  urgency,
  safetyNote,
}: {
  urgency: UrgencyLevel;
  safetyNote?: string | null;
}) {
  const s = STYLES[urgency];
  const isEmergency = urgency === "emergency";

  return (
    <div
      role={isEmergency ? "alert" : undefined}
      className={`animate-fade-up rounded-4xl border px-6 py-5 ${s.bg} ${
        isEmergency ? "shadow-soft" : ""
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 rounded-full ${s.dot} ${isEmergency ? "animate-pulse" : ""}`} />
        <span className="text-sm font-bold uppercase tracking-wide">{s.label}</span>
      </div>
      {safetyNote && <p className="mt-2 text-sm leading-relaxed">{safetyNote}</p>}
      {isEmergency && (
        <a href="tel:911" className="mt-3 inline-flex rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5">
          Call emergency services
        </a>
      )}
    </div>
  );
}
