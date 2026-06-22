"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { classifyProblem, getUserLocation, searchProviders } from "@/lib/api";
import type { Classification, Provider } from "@/lib/types";
import { UrgencyBanner } from "./UrgencyBanner";
import { ProviderCard } from "./ProviderCard";

type Stage = "idle" | "classifying" | "locating" | "searching" | "done" | "error";

const EXAMPLES = [
  "My tooth has been throbbing for two days",
  "Kitchen sink is leaking under the cabinet",
  "Need help with a tenancy dispute",
  "My car won't start this morning",
];

export function ProblemFinder({ initialQuery = "" }: { initialQuery?: string }) {
  const [problem, setProblem] = useState(initialQuery);
  const [stage, setStage] = useState<Stage>("idle");
  const [classification, setClassification] = useState<Classification | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [error, setError] = useState<string>("");

  const busy = stage === "classifying" || stage === "locating" || stage === "searching";

  async function run(text: string) {
    const q = text.trim();
    if (q.length < 3) return;
    setError("");
    setProviders([]);
    setClassification(null);
    try {
      setStage("classifying");
      const c = await classifyProblem(q);
      setClassification(c);

      setStage("locating");
      const loc = await getUserLocation();

      setStage("searching");
      const { providers } = await searchProviders(c.search_query, loc);
      setProviders(providers);
      setStage("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStage("error");
    }
  }

  const stageLabel = {
    classifying: "Understanding your problem…",
    locating: "Finding your location…",
    searching: "Searching nearby help…",
  }[stage as "classifying" | "locating" | "searching"];

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(problem);
        }}
        className="rounded-4xl border border-black/[0.07] bg-white p-2 shadow-soft transition-shadow focus-within:shadow-glow"
      >
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              run(problem);
            }
          }}
          placeholder="Describe your problem in your own words…"
          rows={2}
          className="w-full resize-none rounded-3xl bg-transparent px-4 py-3 text-lg outline-none placeholder:text-black/30"
        />
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="text-xs text-black/30">Press Enter to find help</span>
          <button type="submit" disabled={busy} className="btn-grape disabled:opacity-50">
            {busy ? "Working…" : "Find help"}
          </button>
        </div>
      </form>

      {stage === "idle" && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setProblem(ex);
                run(ex);
              }}
              className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-black/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-grape/40 hover:text-grape"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {busy && (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 text-center text-black/50"
          >
            {stageLabel}
          </motion.p>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {classification && (
        <div className="mt-8 space-y-4">
          {classification.urgency !== "routine" || classification.safety_note ? (
            <UrgencyBanner urgency={classification.urgency} safetyNote={classification.safety_note} />
          ) : null}

          <div className="card animate-fade-up p-6 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-grape-soft px-3 py-1 text-xs font-semibold text-grape">
                {classification.category}
              </span>
              <span className="text-sm text-black/50">
                See a <strong className="text-ink">{classification.professional_type}</strong>
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-black/70">{classification.explanation}</p>
          </div>
        </div>
      )}

      {providers.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}

      {stage === "done" && providers.length === 0 && (
        <p className="mt-8 text-center text-black/50">No nearby providers found — try rephrasing your problem.</p>
      )}
    </div>
  );
}
