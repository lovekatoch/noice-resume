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
    <section className="bg-[var(--bg)] px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-[720px] text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-[var(--accent-light)] px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
          AI-Powered Resume Builder
        </div>
        <h1 className="mb-5 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--fg)]">
          Land interviews at <span className="text-[var(--accent)]">top companies</span>
        </h1>
        <p className="mx-auto mb-10 max-w-[540px] text-lg text-[var(--muted)]">
          Your resume gets reviewed in seconds. NoiceResume uses AI to make sure yours stands out and gets you noticed.
        </p>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <button
              onClick={handleStartFresh}
              className="inline-flex items-center rounded-md bg-[var(--accent)] px-6 py-2.5 font-semibold text-white transition hover:bg-[var(--accent-hover)]"
            >
              Start Fresh
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            <ImportButton />
          </div>
          {savedName && (
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-6 py-2.5 font-medium text-[var(--fg)] transition hover:bg-[var(--bg)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Continue <span className="font-semibold text-[var(--accent)]">&ldquo;{savedName}&rdquo;</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
