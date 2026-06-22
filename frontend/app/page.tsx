import { ProblemFinder } from "@/components/ProblemFinder";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    tone: "grape",
    title: "Describe it",
    body: "Type your problem in plain words. No forms, no categories to guess.",
  },
  {
    n: "02",
    tone: "lime",
    title: "AI matches you",
    body: "We figure out what's wrong, how urgent it is, and exactly who to call.",
  },
  {
    n: "03",
    tone: "gold",
    title: "Get help nearby",
    body: "See trusted local pros — then call, WhatsApp, or get directions in one tap.",
  },
];

const PROBLEMS = [
  "Tooth ache",
  "Leaking pipe",
  "Car won't start",
  "Locked out",
  "Tax help",
  "Anxiety support",
  "Blocked drain",
  "Cracked screen",
  "Pest control",
  "Flat tyre",
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section id="top" className="relative scroll-mt-10">
        {/* animated backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-dotgrid [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-grape/30 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute right-[8%] top-24 -z-10 h-72 w-72 rounded-full bg-lime/40 blur-3xl animate-float" />
        <div className="pointer-events-none absolute left-[6%] top-40 -z-10 h-64 w-64 rounded-full bg-gold/30 blur-3xl animate-float-slow" />

        <div className="mx-auto max-w-4xl px-5 pb-10 pt-24 text-center sm:pt-32">
          <Reveal direction="none">
            <span className="chip mx-auto bg-white/70 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-lime" />
              AI-matched real-world help
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="display mt-7 text-[clamp(2.8rem,9vw,6.5rem)]">
              Got a problem?
              <br />
              <span className="text-gradient">Point me</span> to it.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-7 max-w-xl text-balance text-lg leading-relaxed text-black/55 sm:text-xl">
              Describe anything in your own words. PointMe instantly matches you to the
              right professional nearby — and lets you reach them in one tap.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mx-auto mt-12 max-w-2xl">
            <ProblemFinder />
          </Reveal>
        </div>

        {/* scrolling problem marquee */}
        <div className="relative mt-6 flex overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="flex shrink-0 animate-marquee gap-3 pr-3">
            {[...PROBLEMS, ...PROBLEMS].map((p, i) => (
              <span key={i} className="chip whitespace-nowrap text-black/60">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="mx-auto max-w-6xl px-5 py-28">
        <Reveal>
          <h2 className="display text-balance text-center text-[clamp(2rem,5vw,3.5rem)]">
            Help in three taps.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} direction="up">
              <div className="card group h-full p-8">
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold
                    ${s.tone === "grape" ? "bg-grape-soft text-grape" : ""}
                    ${s.tone === "lime" ? "bg-lime-soft text-lime" : ""}
                    ${s.tone === "gold" ? "bg-gold-soft text-gold" : ""}`}
                >
                  {s.n}
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-black/55">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== DARK CTA ===== */}
      <section className="px-5 pb-28">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-5xl bg-ink px-6 py-24 text-center text-white">
            <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-grape/40 blur-3xl animate-blob" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gold/30 blur-3xl animate-float" />
            <h2 className="display relative text-balance text-[clamp(2.2rem,6vw,4.5rem)]">
              Stop Googling.
              <br />
              <span className="text-gradient">Start solving.</span>
            </h2>
            <p className="relative mx-auto mt-6 max-w-md text-balance text-lg text-white/60">
              The right help is closer than you think.
            </p>
            <a href="#top" className="btn-grape relative mt-10 text-base">
              Find help now
            </a>
          </div>
        </Reveal>
      </section>

      <footer className="mx-auto max-w-6xl px-5 pb-16 text-center text-xs text-black/35">
        PointMe offers guidance, not professional or medical advice. In an emergency, call your
        local emergency number.
      </footer>
    </main>
  );
}
