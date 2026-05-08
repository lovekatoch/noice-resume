"use client";
import { useState, useEffect } from "react";
import { ImportButton } from "components/ImportButton";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  const [savedName, setSavedName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("open-resume-state");
      if (saved) {
        const state = JSON.parse(saved);
        const name = state?.resume?.profile?.name;
        if (name && name.trim()) {
          setSavedName(name.trim());
        }
      }
    } catch {}
  }, []);

  const handleStartFresh = () => {
    localStorage.removeItem("open-resume-state");
    router.push("/resume-builder");
  };

  const handleContinue = () => {
    router.push("/resume-builder");
  };

  return (
    <section className="relative overflow-hidden bg-[#ffffff] px-6 py-24 md:py-32 lg:py-40">
      {/* Subtle gradient mesh — Stripe-style atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(94,106,210,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 80% 30%, rgba(94,106,210,0.03) 0%, transparent 50%),
            radial-gradient(ellipse 25% 30% at 20% 40%, rgba(94,106,210,0.02) 0%, transparent 50%)
          `,
        }}
      />
      <div className="mx-auto max-w-[820px] text-center">
        {/* Badge pill */}
        <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-light)] bg-white px-4 py-1.5 text-sm font-medium text-[var(--accent)] shadow-sm">
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6l7-4 7 4v8l-7 4-7-4V6z" />
            <path d="M10 2v16M3 10l7 4 7-4" />
          </svg>
          AI-Powered Resume Builder
        </div>

        {/* Headline — Stripe-inspired light weight, generous tracking */}
        <h1 className="mb-6 font-display text-[clamp(2.5rem,6vw,3.75rem)] font-light leading-[1.08] tracking-[-0.03em] text-[#0C1628]">
          Land interviews at{" "}
          <span className="bg-gradient-to-r from-[var(--accent)] to-[#7b83d9] bg-clip-text text-transparent">
            top companies
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-[540px] text-lg leading-relaxed text-[#64748d]">
          Recruiters spend seconds on each resume. Make sure yours is the one they remember.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <button
              onClick={handleStartFresh}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-7 py-3 font-medium text-white shadow-[rgba(94,106,210,0.35)_0px_8px_24px_-4px] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[rgba(94,106,210,0.45)_0px_12px_28px_-6px] active:scale-[0.98]"
            >
              Start Fresh
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <ImportButton />
          </div>

          {/* Continue button */}
          {savedName && (
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-6 py-2.5 font-medium text-[var(--fg)] shadow-sm transition-all hover:border-[var(--accent)]/40 hover:shadow-[rgba(50,50,93,0.1)_0px_4px_12px]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Continue{" "}
              <span className="font-semibold text-[var(--accent)]">&ldquo;{savedName}&rdquo;</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
