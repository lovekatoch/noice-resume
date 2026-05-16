"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImportButton } from "components/ImportButton";

// ─── ICONS ─────────────────────────────────────────────────────────

function CheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function Sparkles() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5z" /><path d="M18 14l1 2.5L21.5 18l-2.5 1L18 21.5l-1-2.5L14.5 18l2.5-1z" /><path d="M6 11l-.5 1.5L4 13l1.5.5L6 15l.5-1.5L8 13l-1.5-.5z" />
    </svg>
  );
}

function Shield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function Zap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function UploadSimple() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function Plus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── FEATURE ITEMS ─────────────────────────────────────────────────

const FEATURES = [
  {
    title: "Free for everyone",
    text: "No paid plans, no trials, no credit card. Just a resume builder that actually works.",
    icon: <CheckCircle />,
  },
  {
    title: "Built for ATS screening",
    text: "75% of resumes are filtered out before a human reads them. Yours won't be one of them.",
    icon: <Zap />,
  },
  {
    title: "AI that helps — not just generic tips",
    text: "Real suggestions based on what recruiters actually look for. Not the same advice you have seen before.",
    icon: <Sparkles />,
  },
  {
    title: "Stays on your device",
    text: "Nothing ever leaves your browser. No upload, no server, no privacy trade-off.",
    icon: <Shield />,
  },
];

// ─── STEPS ─────────────────────────────────────────────────────────

const STEPS = [
  { number: "01", title: "Import or start fresh", text: "Upload your existing PDF or begin with a blank slate. The AI reads your resume in seconds." },
  { number: "02", title: "Polish with AI", text: "Get suggestions that make your experience sound better. Tweak until it feels right." },
  { number: "03", title: "Download and apply", text: "Export a clean PDF and send it out. That is all it takes." },
];

// ─── FAQ ───────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "Is NoiceResume really free? No hidden plans?",
    a: "Completely free. No trials, no credit card, no 'start free then pay' bait-and-switch. You get the full resume builder, all features, forever.",
  },
  {
    q: "Do I need to sign up or create an account?",
    a: "No. Your resume never leaves your browser — it is stored in local storage, not on our servers. That is why there is no sign-up needed.",
  },
  {
    q: "Will my resume pass ATS filters?",
    a: "Yes. NoiceResume uses a single-column layout, standard section headers, and clean formatting that ATS systems parse reliably. Two-column layouts and graphics confuse ATS — we skip those on purpose.",
  },
  {
    q: "Can I import my existing resume?",
    a: "Yes. Upload your current PDF and the AI will parse it into the builder. You can then tweak, reformat, and improve it.",
  },
  {
    q: "What makes this better than a Google Doc template?",
    a: "Templates require manual formatting — copying, pasting, fixing alignment, chasing fonts. NoiceResume handles all of that automatically. Change your theme with one click. Plus, the AI helps you write better bullet points.",
  },
];

// ─── SECTION COMPONENTS ────────────────────────────────────────────

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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-20 pt-24 md:pb-24 md:pt-28"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--accent)",
            borderColor: "var(--accent-light)",
          }}
        >
          <Sparkles />
          AI-Powered Resume Builder
        </div>

        {/* Headline */}
        <h1 className="mb-6 font-display text-[clamp(2.5rem,6vw,3.75rem)] font-light leading-[1.08] tracking-[-0.03em]"
          style={{ color: "var(--fg)" }}
        >
          Land interviews at{" "}
          <span style={{ color: "var(--accent)" }}>
            top companies
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed md:text-lg"
          style={{ color: "var(--muted)" }}
        >
          Recruiters spend seconds on each resume. Make sure yours is the one they remember — with AI that helps you write better, formats for ATS, and zero sign-up.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <button
              onClick={handleStartFresh}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: "var(--accent)",
                boxShadow: "rgba(30,58,95,0.3) 0px 8px 24px -4px",
              }}
            >
              <Plus />
              Build My Resume
            </button>
            <ImportButton />
          </div>

          {/* Social proof — near CTA for trust */}
          <p className="text-sm" style={{ color: "var(--muted-subtle)" }}>
            Used by <span style={{ color: "var(--accent)", fontWeight: 600 }}>8,400+</span> job seekers this month
          </p>

          {/* Continue for returning users */}
          {savedName && (
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-all hover:opacity-70"
              style={{
                color: "var(--accent)",
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              Continue &ldquo;{savedName}&rdquo;
              <ArrowRight />
            </button>
          )}
        </div>

      </div>
    </section>
  );
}

function ProblemBar() {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold" style={{ color: "var(--accent)" }}>6 seconds</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted-subtle)" }}>Average time recruiters spend per resume</p>
          </div>
          <div>
            <p className="text-2xl font-semibold" style={{ color: "var(--accent)" }}>75%</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted-subtle)" }}>Of resumes rejected by ATS before a person sees them</p>
          </div>
          <div>
            <p className="text-2xl font-semibold" style={{ color: "var(--accent)" }}>8,400+</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted-subtle)" }}>Resumes created this month — and counting</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-center font-display text-3xl font-light tracking-tight" style={{ color: "var(--fg)" }}>
          Why NoiceResume
        </h2>
        <p className="mb-14 text-center text-base" style={{ color: "var(--muted)" }}>
          A resume builder that does the hard part for you.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {FEATURES.map(({ title, text, icon }) => (
            <div
              key={title}
              className="flex items-start gap-5 p-6 transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
              >
                {icon}
              </div>
              <div>
                <h3 className="mb-1.5 font-semibold" style={{ color: "var(--fg)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-2 font-display text-3xl font-light tracking-tight" style={{ color: "var(--fg)" }}>
          Three steps to a better resume
        </h2>
        <p className="mb-14 text-base" style={{ color: "var(--muted)" }}>
          From upload to interview call in minutes.
        </p>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map(({ number, title, text }) => (
            <div
              key={number}
              className="group relative p-8 text-center transition-all duration-200"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
              }}
            >
              <div className="relative mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--accent)",
                  boxShadow: "rgba(30,58,95,0.15) 0px 4px 16px",
                }}
              >
                <span className="relative z-10">{number}</span>
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: "var(--fg)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TemplatePreviews() {
  const router = useRouter();
  const TEMPLATES = [
    { src: "/sample-resumes/resume-classic-1.png", name: "Classic", description: "Clean, professional layout trusted by thousands", id: "executive-simple" },
    { src: "/sample-resumes/resume-modern-1.png", name: "Modern", description: "Bold headers and sleek spacing for creative roles", id: "sb2nov-modern" },
    { src: "/sample-resumes/resume-stackoverflow-1.png", name: "Compact", description: "Maximizes content density for experienced hires", id: "stackoverflow" },
  ];

  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-center font-display text-3xl font-light tracking-tight" style={{ color: "var(--fg)" }}>
          Choose your template
        </h2>
        <p className="mb-14 text-center text-base" style={{ color: "var(--muted)" }}>
          Three professionally designed layouts — switch anytime with one click.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div
              key={t.name}
              onClick={() => router.push(`/resume-builder?template=${t.id}`)}
              className="group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
              }}
            >
              <div className="overflow-hidden" style={{ borderBottom: "1px solid var(--border)" }}>
                <img
                  src={t.src}
                  alt={`${t.name} resume template`}
                  className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="px-5 py-4">
                <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{t.name}</h3>
                <p className="mt-1 text-xs" style={{ color: "var(--muted-subtle)" }}>{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-2 text-center font-display text-3xl font-light tracking-tight" style={{ color: "var(--fg)" }}>
          Questions & Answers
        </h2>
        <p className="mb-14 text-center text-base" style={{ color: "var(--muted)" }}>
          Everything you need to know before you start.
        </p>

        <div className="space-y-3">
          {FAQ.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium transition-all"
                  style={{ color: "var(--fg)" }}
                >
                  <span>{item.q}</span>
                  <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--accent)" }}
                  >
                    <ChevronDown />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const router = useRouter();

  return (
    <section className="px-6 py-24 text-center"
      style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)" }}
    >
      <h2 className="mb-4 font-display text-3xl font-light tracking-tight" style={{ color: "var(--fg)" }}>
        Your next role starts here
      </h2>
      <p className="mb-10 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
        No sign-up required. No credit card. Just a resume that works.
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            backgroundColor: "var(--accent)",
            boxShadow: "rgba(30,58,95,0.3) 0px 8px 24px -4px",
          }}
        >
          <Plus />
          Build My Resume
          <ArrowRight />
        </button>
        <ImportButton />
      </div>

      {/* Footer */}
      <div className="mt-16 pt-16" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--muted-subtle)" }}>
          Built with <span style={{ color: "var(--accent)" }}>&#x2764;</span> by Love
        </p>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemBar />
      <Features />
      <Steps />
      <TemplatePreviews />
      <FAQSection />
      <FinalCTA />
    </main>
  );
}
