export type UrgencyLevel = "emergency" | "urgent" | "soon" | "routine";

export interface Classification {
  category: string;
  urgency: UrgencyLevel;
  is_emergency: boolean;
  explanation: string;
  professional_type: string;
  search_query: string;
  safety_note: string | null;
}

export interface Provider {
  id: string;
  name: string;
  rating?: number | null;
  user_rating_count?: number | null;
  address?: string | null;
  phone?: string | null;
  distance_km?: number | null;
  lat?: number | null;
  lng?: number | null;
  open_now?: boolean | null;
  maps_url?: string | null;
}

export interface SeoContent {
  slug: string;
  title: string;
  meta_description: string;
  intro: string;
  likely_causes: string[];
  who_to_see: string;
  when_urgent: string;
}
