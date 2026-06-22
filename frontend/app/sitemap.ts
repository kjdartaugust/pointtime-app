import type { MetadataRoute } from "next";

// Keep in sync with SEED_SLUGS in app/[slug]/page.tsx.
const SLUGS = [
  "dental-pain-help",
  "emergency-plumber-near-me",
  "blocked-drain-help",
  "car-wont-start-help",
  "locksmith-near-me",
  "anxiety-support-help",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim().replace(/\/$/, "");
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...SLUGS.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
