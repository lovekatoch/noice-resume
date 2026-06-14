"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImportButton } from "components/ImportButton";

const TERRA = "#C75B39";
const SAGE = "#8FA88A";
const CREAM = "#FAF5EF";

function SectionHeading({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ color: "#2D2D2D" }}>
        {children}
      </h2>
      {subtitle && (
        <p className="mt-2 md:mt-3 text-sm md:text-lg" style={{ color: "#6B6B6B" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────────────

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
    <section
      className="relative overflow-hidden px-6 py-12 md:py-24 lg:py-32"
      style={{ backgroundColor: CREAM }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: TERRA }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: SAGE }}
        />
      </div>

      {/* Continue as Candidate — top right */}
      {savedName && (
        <div className="absolute top-4 right-6 md:top-6 md:right-8 z-10">
          <button
            onClick={() => router.push("/resume-builder")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-all hover:shadow-md"
            style={{ color: "#6B6B6B", backgroundColor: "rgba(255,255,255,0.7)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Continue{" "}
            <span style={{ color: TERRA, fontWeight: 600 }}>"{savedName}"</span>
          </button>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
          {/* Illustration - smaller on mobile, shown first */}
          <div className="w-full md:flex-1 order-1 md:order-2 flex justify-center">
            <img
              src="/undraw-illustrations/online-resume.svg"
              alt="Online resume illustration"
              className="w-48 md:w-full max-w-[400px] h-auto"
            />
          </div>

          {/* Text side */}
          <div className="w-full md:flex-1 order-2 md:order-1 text-center md:text-left">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium mb-4 md:mb-6"
              style={{ backgroundColor: "#E8D5C8", color: TERRA }}
            >
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 12l2 2 4-4" />
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Free Resume Builder
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4 md:mb-6" style={{ color: "#2D2D2D" }}>
              Build a Resume That{" "}
              <span style={{ color: TERRA }}>Gets You Hired</span>
            </h1>

            <p className="text-base md:text-xl leading-relaxed mb-6 md:mb-8" style={{ color: "#6B6B6B" }}>
              Free, modern, and beautiful resume builder. No sign-up required. Just pick a template and go.
            </p>

              <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                <button
                  onClick={handleStartFresh}
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.97]"
                  style={{ backgroundColor: TERRA }}
                >
                  Create Your Resume
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <ImportButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ───────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose a Template",
      text: "Pick from Classic, Modern, or StackOverflow. Each is optimized for ATS and designed to impress.",
    },
    {
      number: "02",
      title: "Fill in Your Details",
      text: "Add your experience, education, and skills. See changes in real-time as you type.",
    },
    {
      number: "03",
      title: "Download Your PDF",
      text: "Export a clean, professional PDF ready to send. Free, no strings attached.",
    },
  ];

  return (
    <section className="relative px-6 py-14 md:py-28" style={{ backgroundColor: "#FFFCF7" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading subtitle="From start to done in minutes.">
          How It Works
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-6 text-left md:text-center">
              {/* Illustration - small inline on mobile */}
              <div
                className="flex-shrink-0 w-14 h-14 md:w-32 md:h-32 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${TERRA}15` }}
              >
                <img
                  src="/undraw-illustrations/file-searching.svg"
                  alt={step.title}
                  className="w-8 h-8 md:w-20 md:h-20"
                />
              </div>

              {/* Content */}
              <div className="min-w-0 md:text-center">
                <div
                  className="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-bold mb-1 md:mb-4"
                  style={{ backgroundColor: TERRA, color: "white" }}
                >
                  {step.number}
                </div>
                <h3 className="text-base md:text-xl font-bold" style={{ color: "#2D2D2D" }}>
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm leading-relaxed mt-1" style={{ color: "#6B6B6B" }}>
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

// ─── TEMPLATES ──────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout. Clean, professional, and timeless.",
    screenshots: ["/sample-resumes/tpl-classic.png"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek single-column with modern typography and clean section headers.",
    screenshots: ["/sample-resumes/tpl-modern.png"],
  },
  {
    id: "stackoverflow",
    name: "StackOverflow",
    description: "Two-column layout with sidebar skills. Stand out with a developer-favorite style.",
    screenshots: ["/sample-resumes/tpl-stackoverflow.png"],
  },
];

function Templates() {
  return (
    <section id="templates" className="px-6 py-14 md:py-28" style={{ backgroundColor: CREAM }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading subtitle="Professionally designed, ATS-friendly templates.">
          Choose Your Template
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "white" }}
            >
              {/* Screenshot - shorter on mobile */}
              <div className="relative aspect-[4/3] md:aspect-[210/297] bg-gray-100 overflow-hidden">
                <img
                  src={tpl.screenshots[0]}
                  alt={`${tpl.name} template`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ backgroundColor: `${TERRA}CC` }}
                >
                  <span className="text-white font-semibold text-sm">Preview</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1" style={{ color: "#2D2D2D" }}>
                  {tpl.name}
                </h3>
                <p className="text-xs md:text-sm mb-3 md:mb-4" style={{ color: "#6B6B6B" }}>
                  {tpl.description}
                </p>
                <a
                  href={`/resume-builder?template=${tpl.id.toUpperCase()}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:gap-2"
                  style={{ color: TERRA }}
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
      </div>
    </section>
  );
}

// ─── FEATURES ───────────────────────────────────────────────────────────────

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
    <section className="relative px-6 py-14 md:py-28" style={{ backgroundColor: "#FFFCF7" }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Illustration - hidden on mobile, shown on desktop */}
          <div className="hidden md:flex justify-center order-2">
            <img
              src="/undraw-illustrations/my-resume.svg"
              alt="Resume illustration"
              className="w-full max-w-[380px] h-auto"
            />
          </div>

          {/* Features side */}
          <div className="order-1">
            <SectionHeading subtitle="Everything you need, nothing you don't.">
              Why NoiceResume
            </SectionHeading>

            <div className="space-y-5 md:space-y-6">
              {FEATURES.map((feat) => (
                <div key={feat.title} className="flex gap-3 md:gap-4 items-start">
                  <div
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${TERRA}15`, color: TERRA }}
                  >
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base" style={{ color: "#2D2D2D" }}>
                      {feat.title}
                    </h3>
                    <p className="text-xs md:text-sm mt-0.5 md:mt-1" style={{ color: "#6B6B6B" }}>
                      {feat.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ─────────────────────────────────────────────────────────────

function CtaBanner() {
  return (
    <section className="px-6 py-16 md:py-24 text-center" style={{ backgroundColor: TERRA }}>
      <div className="mx-auto max-w-[540px]">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
          Ready to Build Your Resume?
        </h2>
        <p className="text-sm md:text-base mb-6 md:mb-8" style={{ color: "#FFE8DC" }}>
          Start building in seconds. No account needed.
        </p>
        <a
          href="/resume-builder"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 md:px-8 md:py-3.5 font-bold text-sm md:text-base shadow-lg transition-all hover:shadow-xl active:scale-[0.97]"
          style={{ color: TERRA }}
        >
          Get Started Free
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-6 py-6 md:py-8" style={{ backgroundColor: "#2D2D2D" }}>
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <img src="/noiceresume-logo-white.svg" alt="NoiceResume" style={{ width: 120, height: "auto" }} />
          <span className="text-xs" style={{ color: "#888" }}>| Free Resume Builder</span>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: "#888" }}>
          <a href="/resume-builder" className="hover:text-white transition-colors">Templates</a>
          <span className="w-px h-3" style={{ backgroundColor: "#555" }} />
          <a href="/privacy" className="hover:text-white transition-colors" style={{ color: "#888" }}>Privacy</a>
          <span className="w-px h-3" style={{ backgroundColor: "#555" }} />
          <a href="/terms" className="hover:text-white transition-colors" style={{ color: "#888" }}>Terms</a>
        </div>
        <p className="text-xs" style={{ color: "#666" }}>
          &copy; {new Date().getFullYear()} NoiceResume. Built with care.
        </p>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Templates />
      <Features />
      <CtaBanner />
      <Footer />
    </main>
  );
}
