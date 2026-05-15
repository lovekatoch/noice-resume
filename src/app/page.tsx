"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── LINEAR DESIGN TOKENS ──────────────────────────────────────────
// Canvas: #010102 · Accent: #5e6ad2 lavender · Surface: #0f1011
// Ink: #f7f8f8 · Ink Muted: #d0d6e0 · Ink Subtle: #8a8f98

const CANVAS = "#010102";
const SURFACE = "#0f1011";
const SURFACE_2 = "#141516";
const INK = "#f7f8f8";
const INK_MUTED = "#d0d6e0";
const INK_SUBTLE = "#8a8f98";
const ACCENT = "#5e6ad2";
const ACCENT_HOVER = "#828fff";
const HAIRLINE = "#23252a";

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────

function Hero() {
  const router = useRouter();
  const [savedName, setSavedName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("open-resume-state");
      if (saved) {
        const state = JSON.parse(saved);
        const name = state?.resume?.profile?.name;
        if (name && name.trim()) setSavedName(name.trim());
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
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20"
      style={{ backgroundColor: CANVAS }}
    >
      <div className="w-full max-w-sm mx-auto text-center relative z-10">
        {/* Brand */}
        <h1
          className="text-4xl font-semibold tracking-tight mb-4"
          style={{
            color: INK,
            letterSpacing: "-1.2px",
            fontFamily: "Inter, -apple-system, system-ui, sans-serif",
          }}
        >
          NOICE<span style={{ color: ACCENT }}>RESUME</span>
        </h1>

        {/* Tagline */}
        <p
          className="text-base leading-relaxed max-w-xs mx-auto mb-10"
          style={{ color: INK_MUTED }}
        >
          Free, modern resume builder. No sign-up, no paywalls — just a fast way to create a resume that works.
        </p>

        {/* Continue for returning users */}
        {savedName && (
          <div className="mb-8">
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:opacity-70"
              style={{ color: ACCENT_HOVER }}
            >
              Continue &ldquo;{savedName}&rdquo;
              <ArrowRightIcon />
            </button>
          </div>
        )}

        {/* Two CTAs */}
        <div className="flex flex-col gap-3 mb-14">
          {/* Outline — Improve existing */}
          <button
            onClick={() => router.push("/resume-import")}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-medium transition-all hover:opacity-80 active:scale-[0.98]"
            style={{
              color: INK,
              backgroundColor: SURFACE,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 8,
            }}
          >
            <UploadIcon />
            I want to improve my existing Resume!
          </button>

          {/* "or" divider */}
          <div className="flex items-center gap-3 justify-center">
            <span className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
            <span
              className="text-xs font-semibold uppercase tracking-[0.06em]"
              style={{ color: INK_SUBTLE }}
            >
              or
            </span>
            <span className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          </div>

          {/* Primary — Start Fresh */}
          <button
            onClick={handleStartFresh}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: ACCENT,
              borderRadius: 8,
            }}
          >
            <PlusIcon />
            Start Fresh !
          </button>
        </div>

        {/* Product screenshot card */}
        <div
          className="overflow-hidden"
          style={{
            backgroundColor: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 16,
          }}
        >
          {/* MacOS traffic light bar */}
          <div
            className="flex items-center gap-1.5 px-4 py-2.5"
            style={{ borderBottom: `1px solid ${HAIRLINE}` }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28C840" }} />
          </div>
          <img
            src="/sample-resumes/resume-classic-1.png"
            alt="Professional resume example"
            className="w-full h-auto block"
          />
        </div>

        {/* Inline footer */}
        <div className="pt-6 mt-10" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-sm" style={{ color: INK_SUBTLE }}>
            Built with <span style={{ color: ACCENT }}>&#x2764;</span> by Love
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
