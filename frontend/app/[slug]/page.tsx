import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSeoContent } from "@/lib/api";
import { ProblemFinder } from "@/components/ProblemFinder";
import type { SeoContent } from "@/lib/types";

// Pre-render a curated set; others render on-demand and are cached (ISR).
export const dynamicParams = true;
export const revalidate = 86400;

const SEED_SLUGS = [
  "dental-pain-help",
  "emergency-plumber-near-me",
  "blocked-drain-help",
  "car-wont-start-help",
  "locksmith-near-me",
  "anxiety-support-help",
];

export function generateStaticParams() {
  return SEED_SLUGS.map((slug) => ({ slug }));
}

async function load(slug: string): Promise<SeoContent | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return await getSeoContent(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await load(params.slug);
  if (!data) return { title: "Help near you" };
  return {
    title: data.title,
    description: data.meta_description,
    alternates: { canonical: `/${params.slug}` },
    openGraph: { title: data.title, description: data.meta_description, type: "article" },
  };
}

export default async function SeoPage({ params }: { params: { slug: string } }) {
  const data = await load(params.slug);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: data.title,
        acceptedAnswer: { "@type": "Answer", text: data.intro },
      },
      {
        "@type": "Question",
        name: "Who should I see?",
        acceptedAnswer: { "@type": "Answer", text: data.who_to_see },
      },
      {
        "@type": "Question",
        name: "When is it urgent?",
        acceptedAnswer: { "@type": "Answer", text: data.when_urgent },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-16 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <h1 className="display text-balance text-[clamp(2.4rem,7vw,4.5rem)]">{data.title}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/60">{data.intro}</p>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Possible causes</h2>
          <ul className="mt-5 space-y-3">
            {data.likely_causes.map((c) => (
              <li key={c} className="card flex gap-3 p-4 text-[15px] text-black/70">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-grape" />
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Who to see</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-black/60">{data.who_to_see}</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">When it&apos;s urgent</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-black/60">{data.when_urgent}</p>
          </div>
        </section>
      </article>

      <section className="mt-14">
        <h2 className="mb-4 text-center text-2xl font-semibold tracking-tight">Find help near you</h2>
        <ProblemFinder initialQuery={data.slug.replace(/-/g, " ")} />
      </section>

      <p className="mt-12 text-center text-xs text-black/30">
        PointMe offers general guidance, not professional or medical advice.
      </p>
    </main>
  );
}
