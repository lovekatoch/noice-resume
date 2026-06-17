"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImportButton } from "components/ImportButton";

const INDIGO = "#4338CA";
const INDIGO_DARK = "#3730A3";
const CYAN = "#0891B2";
const SLATE = "#F1F5F9";
const WARM_WHITE = "#F8FAFC";
const NEAR_BLACK = "#0F172A";

// ─── REUSABLE ───────────────────────────────────────────────────────

function SectionHeading({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-10 md:mb-16">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ color: NEAR_BLACK, letterSpacing: "-0.03em" }}>
        {children}
      </h2>
      {subtitle && (
        <p className="mt-2 md:mt-3 text-sm md:text-lg" style={{ color: "#64748B" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────

function Hero() {
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

  return (
    <section className="relative overflow-hidden px-6 pt-12 pb-16 md:pt-20 md:pb-28" style={{ backgroundColor: WARM_WHITE }}>
      {/* Subtle grid overlay instead of decorative circles */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${INDIGO} 1px, transparent 1px), linear-gradient(90deg, ${INDIGO} 1px, transparent 1px)`,
          backgroundSize: "64px 64px"
        }}
      />

      {/* Continue button */}
      {savedName && (
        <div className="absolute top-4 right-6 md:top-6 md:right-8 z-10">
          <button
            onClick={() => router.push("/resume-builder")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-all shadow-sm hover:shadow-md"
            style={{ color: "#6B6B6B", backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Continue{" "}
            <span style={{ color: INDIGO, fontWeight: 600 }}>"{savedName}"</span>
          </button>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Text side */}
          <div className="w-full md:flex-1 order-2 md:order-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium mb-5 md:mb-6"
              style={{ backgroundColor: `${INDIGO}12`, color: INDIGO }}
            >
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 12l2 2 4-4" />
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Free Resume Builder
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.08] mb-5 md:mb-6"
              style={{ color: NEAR_BLACK, letterSpacing: "-0.04em" }}
            >
              Build a Resume{" "}
              <span className="inline-block" style={{ color: INDIGO }}>
                That Actually Gets You Hired
              </span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-7 md:mb-8 max-w-[520px] mx-auto md:mx-0"
              style={{ color: "#64748B" }}
            >
              Three beautifully designed, ATS-friendly templates. Real-time preview. 
              No sign-up, no paywalls, no account needed — just pick a template and go.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 justify-center md:justify-start">
              <button
                onClick={handleStartFresh}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold shadow-md transition-all hover:shadow-lg active:scale-[0.97]"
                style={{ backgroundColor: INDIGO, color: "white" }}
              >
                Create Your Resume
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <ImportButton />
            </div>

            {/* Trust line */}
            <div className="mt-8 flex items-center gap-3 text-xs justify-center md:justify-start" style={{ color: "#94A3B8" }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Takes 5 minutes. No account needed.
            </div>
          </div>

          {/* Resume preview mockup — 3 template cards instead of abstract shapes */}
          <div className="w-full md:flex-1 order-1 md:order-2 flex justify-center">
            <div className="relative" style={{ perspective: "1200px" }}>
              {/* Template preview cards — fanned out like real resumes */}
              <div className="relative flex items-center justify-center" style={{ width: 320, height: 420 }}>
                {/* Card 3 — StackOverflow */}  
                <div className="absolute rounded-xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2"
                  style={{ width: 240, height: 320, transform: "rotate(-6deg) translateX(-20px)", zIndex: 1, backgroundColor: "white", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="w-full h-full overflow-hidden">
                    <img src="/sample-resumes/tpl-stackoverflow.png" alt="StackOverflow template" className="w-full h-full object-cover object-top" loading="lazy" />
                  </div>
                </div>
                {/* Card 2 — Modern */}
                <div className="absolute rounded-xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2"
                  style={{ width: 260, height: 340, transform: "rotate(0deg)", zIndex: 2, backgroundColor: "white", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="w-full h-full overflow-hidden">
                    <img src="/sample-resumes/tpl-modern.png" alt="Modern template" className="w-full h-full object-cover object-top" loading="lazy" />
                  </div>
                </div>
                {/* Card 1 — Classic (front) */}
                <div className="absolute rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ width: 280, height: 360, transform: "rotate(4deg) translateX(18px)", zIndex: 3, backgroundColor: "white", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="w-full h-full overflow-hidden">
                    <img src="/sample-resumes/tpl-classic.png" alt="Classic template" className="w-full h-full object-cover object-top" loading="lazy" />
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-medium shadow-lg"
                style={{ backgroundColor: "white", color: "#64748B", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                3 professional templates
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ───────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Pick a Template",
      text: "Choose from Classic, Modern, or StackOverflow. Each is professionally designed and ATS-friendly.",
      icon: (
        <svg className="w-6 h-6 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Fill in Your Details",
      text: "Add your experience, education, and skills. See changes instantly in the live preview.",
      icon: (
        <svg className="w-6 h-6 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Download Your PDF",
      text: "Export a clean, professional PDF ready to send. One click, no strings attached.",
      icon: (
        <svg className="w-6 h-6 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative px-6 py-16 md:py-28" style={{ backgroundColor: "white" }}>
      {/* Subtle divider line at top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <SectionHeading subtitle="From start to done in minutes.">
          How It Works
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step, idx) => (
            <div key={idx} className="group relative flex md:flex-col items-start gap-5 md:items-center md:text-center p-6 rounded-xl transition-all duration-300 hover:shadow-md"
              style={{ backgroundColor: idx % 2 === 0 ? WARM_WHITE : "white", border: "1px solid rgba(0,0,0,0.04)" }}
            >
              {/* Connecting line — visible on desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px" style={{ background: `linear-gradient(90deg, ${INDIGO}30, transparent)` }} />
              )}

              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-colors group-hover:shadow-sm"
                style={{ backgroundColor: `${INDIGO}10`, color: INDIGO }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div className="min-w-0">
                <div className="text-xs font-semibold tracking-wider mb-1.5" style={{ color: INDIGO }}>
                  Step {step.number}
                </div>
                <h3 className="text-base md:text-lg font-bold" style={{ color: NEAR_BLACK }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed mt-1" style={{ color: "#64748B" }}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TEMPLATES ──────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout. Clean, professional, and timeless.",
    screenshot: "/sample-resumes/tpl-classic.png",
    full: "/sample-resumes/sample-classic.png",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek single-column with modern typography and clean section headers.",
    screenshot: "/sample-resumes/tpl-modern.png",
    full: "/sample-resumes/sample-modern.png",
  },
  {
    id: "stackoverflow",
    name: "StackOverflow",
    description: "Two-column layout with sidebar skills. Stand out with a developer-favorite style.",
    screenshot: "/sample-resumes/tpl-stackoverflow.png",
    full: "/sample-resumes/sample-stackoverflow.png",
  },
];

function Templates() {
  const [activePreview, setActivePreview] = useState<string | null>(null);

  return (
    <section id="templates" className="relative px-6 py-16 md:py-28" style={{ backgroundColor: SLATE }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <SectionHeading subtitle="Professionally designed, ATS-friendly templates.">
          Choose Your Template
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: "white", boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px rgba(0,0,0,0.04)" }}
            >
              {/* Screenshot */}
              <div className="relative aspect-[210/297] bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden cursor-pointer"
                onClick={() => setActivePreview(activePreview === tpl.full ? null : tpl.full)}
              >
                <img
                  src={tpl.screenshot}
                  alt={`${tpl.name} template`}
                  className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ backgroundColor: `${INDIGO}CC` }}
                >
                  <span className="text-white font-semibold text-sm flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Preview
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold mb-0.5" style={{ color: NEAR_BLACK }}>
                  {tpl.name}
                </h3>
                <p className="text-xs md:text-sm mb-3 md:mb-4" style={{ color: "#64748B" }}>
                  {tpl.description}
                </p>
                <a
                  href={`/resume-builder?template=${tpl.id.toUpperCase()}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2"
                  style={{ color: INDIGO }}
                >
                  Use This Template
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Full preview modal */}
        {activePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ backgroundColor: "rgba(15,23,42,0.8)", backdropFilter: "blur(4px)" }}
            onClick={() => setActivePreview(null)}
          >
            <div className="relative max-w-3xl w-full rounded-xl overflow-hidden shadow-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
                style={{ backgroundColor: "rgba(0,0,0,0.4)", color: "white" }}
                onClick={() => setActivePreview(null)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img src={activePreview} alt="Resume preview" className="w-full h-auto" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── FEATURES ───────────────────────────────────────────────────────

const FEATURES = [
  {
    title: "3 Beautiful Templates",
    text: "Classic, Modern, or StackOverflow — pick the style that fits your industry and personality.",
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    title: "Real-time Preview",
    text: "See changes instantly as you type. No switching tabs, no waiting for renders.",
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "Import from PDF",
    text: "Already have a resume? Upload your PDF and we'll parse your data automatically.",
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l3 3 3-3M12 12v6" />
      </svg>
    ),
  },
  {
    title: "Free Forever",
    text: "No paywalls, no sign-up, no credit card. Just a resume builder that works.",
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 7l-5-5-5 5" />
        <circle cx="12" cy="16" r="4" />
      </svg>
    ),
  },
];

function Features() {
  return (
    <section className="relative px-6 py-16 md:py-28" style={{ backgroundColor: "white" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Feature cards — visual side */}
          <div className="order-2 md:order-1">
            <SectionHeading subtitle="Everything you need, nothing you don't.">
              Why NoiceResume
            </SectionHeading>

            <div className="space-y-5 md:space-y-6">
              {FEATURES.map((feat) => (
                <div key={feat.title} className="flex gap-4 items-start p-4 -mx-4 rounded-xl transition-colors hover:bg-[#F8FAFC]">
                  <div
                    className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${INDIGO}12`, color: INDIGO }}
                  >
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base" style={{ color: NEAR_BLACK }}>
                      {feat.title}
                    </h3>
                    <p className="text-xs md:text-sm mt-0.5 md:mt-1 leading-relaxed" style={{ color: "#64748B" }}>
                      {feat.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual side — editor mockup */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-[400px]">
              <div className="rounded-2xl overflow-hidden shadow-xl"
                style={{ backgroundColor: "white", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                {/* Mockup window chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3" style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#EF4444" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#10B981" }} />
                  <div className="ml-3 text-[11px] font-medium" style={{ color: "#94A3B8" }}>resume-builder</div>
                </div>
                {/* Mockup form content */}
                <div className="p-5 space-y-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: `${INDIGO}15` }} />
                    <div>
                      <div className="h-3 w-28 rounded" style={{ backgroundColor: `${NEAR_BLACK}15` }} />
                      <div className="h-2.5 w-20 rounded mt-1.5" style={{ backgroundColor: `${NEAR_BLACK}08` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-8 rounded-lg" style={{ backgroundColor: `${NEAR_BLACK}06` }} />
                    <div className="h-8 rounded-lg" style={{ backgroundColor: `${NEAR_BLACK}06` }} />
                  </div>
                  <div className="h-20 rounded-lg" style={{ backgroundColor: `${NEAR_BLACK}04` }} />
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 rounded-lg" style={{ backgroundColor: `${NEAR_BLACK}06` }} />
                    <div className="w-20 h-8 rounded-lg" style={{ backgroundColor: `${INDIGO}20` }} />
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 rounded-full px-3 py-1 text-xs font-semibold shadow-lg"
                style={{ backgroundColor: INDIGO, color: "white" }}
              >
                Live Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BANNER ───────────────────────────────────────────────────

function StatsBanner() {
  const stats = [
    { value: "3", label: "Templates" },
    { value: "100%", label: "Free" },
    { value: "ATS", label: "Friendly" },
    { value: "5 min", label: "To Done" },
  ];

  return (
    <section className="relative px-6 py-12 md:py-16" style={{ backgroundColor: INDIGO }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 1px, transparent 0)`,
          backgroundSize: "50px 50px"
        }}
      />
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-4xl font-extrabold text-white" style={{ letterSpacing: "-0.03em" }}>
                {stat.value}
              </div>
              <div className="text-xs md:text-sm mt-1 font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ─────────────────────────────────────────────────────

function CtaBanner() {
  return (
    <section className="relative px-6 py-16 md:py-24 text-center overflow-hidden" style={{ backgroundColor: SLATE }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${INDIGO} 1px, transparent 1px), linear-gradient(90deg, ${INDIGO} 1px, transparent 1px)`,
          backgroundSize: "64px 64px"
        }}
      />
      <div className="mx-auto max-w-[580px] relative">
        <h2 className="text-2xl md:text-4xl font-extrabold leading-tight mb-3 md:mb-4" style={{ color: NEAR_BLACK, letterSpacing: "-0.03em" }}>
          Ready to Build Your Resume?
        </h2>
        <p className="text-sm md:text-base mb-7 md:mb-8" style={{ color: "#64748B" }}>
          Start building in seconds. No account needed.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/resume-builder"
            className="inline-flex items-center gap-2 rounded-lg px-7 py-3 md:px-8 md:py-3.5 font-bold text-sm md:text-base shadow-lg transition-all hover:shadow-xl active:scale-[0.97]"
            style={{ backgroundColor: INDIGO, color: "white" }}
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <ImportButton compact />
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ backgroundColor: "#1E293B" }}>
      <div className="px-6 py-8 md:py-10">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <img src="/noiceresume-logo-white.svg" alt="NoiceResume" style={{ width: 130, height: "auto" }} />
            <span className="text-xs" style={{ color: "#64748B" }}>Free Resume Builder</span>
          </div>
          <div className="flex items-center gap-5 text-xs" style={{ color: "#94A3B8" }}>
            <a href="/resume-builder" className="hover:text-white transition-colors">Templates</a>
            <span className="w-px h-3" style={{ backgroundColor: "#475569" }} />
            <a href="/resume-parser" className="hover:text-white transition-colors">Parser</a>
            <span className="w-px h-3" style={{ backgroundColor: "#475569" }} />
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <span className="w-px h-3" style={{ backgroundColor: "#475569" }} />
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          </div>
          <p className="text-xs" style={{ color: "#475569" }}>
            &copy; {new Date().getFullYear()} NoiceResume. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Templates />
      <Features />
      <StatsBanner />
      <CtaBanner />
      <Footer />
    </main>
  );
}
