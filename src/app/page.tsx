"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Color palette ───
const colors = {
  bg: "#0A0A0F",
  surface: "#12121A",
  card: "#1A1A26",
  border: "rgba(255,255,255,0.06)",
  fg: "#F1F1F6",
  muted: "rgba(241,241,246,0.5)",
  accent: "#8B5CF6",
  accent2: "#06B6D4",
  glow: "rgba(139,92,246,0.25)",
};

const accentGradient = `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`;

// ─── Logo ───
function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#lg)" strokeWidth="1.5" fill="rgba(139,92,246,0.08)" />
      <path d="M10 12h12M10 16h8M10 20h10" stroke="url(#lg)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="5" fill="url(#lg)" opacity="0.3" />
      <circle cx="24" cy="24" r="2" fill="url(#lg)" />
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor={colors.accent} />
          <stop offset="1" stopColor={colors.accent2} />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Template data ───
const TEMPLATES = [
  { id: "classic", name: "Classic", desc: "Clean single-column, tried and tested" },
  { id: "modern", name: "Modern", desc: "Sleek sidebar layout with skills panel" },
  { id: "compact", name: "Compact", desc: "Minimalist, fits the essentials" },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v18M3 12h18" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: "AI Bullet Generation",
    desc: "Write better bullet points. Our AI rewrites vague tasks into quantified achievements that recruiters actually read.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: "ATS-Optimized Output",
    desc: "Every template is tested against major ATS parsers. Your resume lands in human hands, not the rejection pile.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7V4h16v3M4 7v9h16V7M4 7h16" />
        <path d="M9 20h6" strokeLinecap="round" />
      </svg>
    ),
    title: "PDF Import — Instant Edit",
    desc: "Upload an existing resume. AI parses it in seconds — sections, dates, bullet points — and drops you straight into the editor.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 15v-3m0 0V9m0 3H9m3 0h3" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: "Live Preview, No Sign-Up",
    desc: "Zero account required. Type on the left, see your resume render in real time on the right. Download when it's ready.",
  },
];

// ─── Components ───

function HeroSection() {
  const router = useRouter();
  const [template, setTemplate] = useState("classic");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: "rgba(10,10,15,0.8)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-sm font-semibold tracking-tight" style={{ color: colors.fg }}>noiceresume</span>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: colors.muted }}
        >
          Build →
        </button>
      </nav>

      {/* Main content */}
      <div className="relative z-10 max-w-[680px] text-center mt-20">
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-6 text-xs font-medium" style={{ background: "rgba(139,92,246,0.12)", color: colors.accent }}>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI-Powered Resume Builder
        </div>

        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] mb-4" style={{ color: colors.fg }}>
          Your resume, but
          <br />
          <span style={{ background: accentGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            actually good.
          </span>
        </h1>

        <p className="text-sm leading-relaxed mb-8 max-w-[460px] mx-auto" style={{ color: colors.muted }}>
          Drop your old PDF or start from scratch. AI rewrites your bullet points, formats for
          any ATS, and renders a beautiful resume in seconds. No account, no paywall.
        </p>

        {/* Template selector */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className="px-4 py-1.5 text-xs font-medium rounded-full transition-all"
              style={{
                background: template === t.id ? "rgba(139,92,246,0.15)" : "transparent",
                color: template === t.id ? colors.accent : colors.muted,
                border: `1px solid ${template === t.id ? "rgba(139,92,246,0.3)" : colors.border}`,
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: accentGradient, color: "#fff", boxShadow: `0 4px 24px ${colors.glow}` }}
        >
          Build Your Resume
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <p className="mt-4 text-xs" style={{ color: colors.muted }}>
          Free. No sign-up. Takes 5 minutes.
        </p>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, idx }: { icon: React.ReactNode; title: string; desc: string; idx: number }) {
  return (
    <div
      className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors"
        style={{ background: "rgba(139,92,246,0.1)", color: colors.accent }}
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: colors.fg }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>{desc}</p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: colors.fg }}>
            Why use NoiceResume?
          </h2>
          <p className="text-sm max-w-[480px] mx-auto" style={{ color: colors.muted }}>
            Built for people who want a great resume without the subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  const router = useRouter();

  return (
    <section className="px-6 py-24 md:py-32 text-center relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-[480px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: colors.fg }}>
          Ready to level up?
        </h2>
        <p className="text-sm mb-8" style={{ color: colors.muted }}>
          Your next opportunity is one click away.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: accentGradient, color: "#fff", boxShadow: `0 4px 24px ${colors.glow}` }}
        >
          Start Building
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 relative z-10" style={{ borderTop: `1px solid ${colors.border}` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xs font-medium" style={{ color: colors.muted }}>noiceresume</span>
          </div>
          <p className="text-xs" style={{ color: colors.muted }}>
            Built by Love — Free & open-source
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Page ───

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FinalCTASection />
    </>
  );
}
