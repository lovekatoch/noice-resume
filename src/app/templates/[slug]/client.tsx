"use client";

import { useRouter } from "next/navigation";
import type { TemplateMeta } from "lib/template-data";

const CANVAS = "#010102";
const SURFACE = "#0f1011";
const INK = "#f7f8f8";
const INK_MUTED = "#d0d6e0";
const INK_SUBTLE = "#8a8f98";
const ACCENT = "#5e6ad2";
const HAIRLINE = "#23252a";
const SUCCESS = "#27a644";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={SUCCESS} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

function HeroSection({ template }: { template: TemplateMeta }) {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20" style={{ backgroundColor: CANVAS }}>
      <div className="pointer-events-none absolute inset-0 -z-10" style={{
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 50% 0%, rgba(94,106,210,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 30% 40% at 80% 30%, rgba(94,106,210,0.03) 0%, transparent 50%)
        `,
      }} />
      <div className="w-full max-w-2xl mx-auto text-center relative z-10">
        <h1 className="text-[clamp(2.2rem,5vw,3.2rem)] font-semibold tracking-[-1.8px] mb-4" style={{ color: INK, fontFamily: "Inter, -apple-system, system-ui, sans-serif" }}>
          {template.headline}
        </h1>
        <p className="text-base leading-relaxed max-w-lg mx-auto mb-10" style={{ color: INK_MUTED }}>
          {template.subheadline}
        </p>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => {
              localStorage.removeItem("open-resume-state");
              router.push("/resume-builder");
            }}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: ACCENT,
              borderRadius: 8,
            }}
          >
            Build Your Resume
            <ArrowRightIcon />
          </button>
          <p className="text-xs" style={{ color: INK_SUBTLE }}>No sign-up required. Free forever.</p>
        </div>
      </div>
    </section>
  );
}

function ScreenshotSection({ template }: { template: TemplateMeta }) {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CANVAS }}>
      <div className="mx-auto max-w-4xl">
        <div style={{
          backgroundColor: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          overflow: "hidden",
        }}>
          <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28C840" }} />
          </div>
          <img
            src={template.sampleResumeImage}
            alt={`${template.title} example`}
            className="w-full h-auto block"
          />
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ template }: { template: TemplateMeta }) {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-[-0.6px] text-center mb-14" style={{ color: INK }}>
          Why use this template?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {template.benefits.map((benefit, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-5 rounded-lg"
              style={{
                backgroundColor: CANVAS,
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              <div className="mt-0.5 flex-shrink-0"><CheckIcon /></div>
              <p className="text-sm leading-relaxed" style={{ color: INK_MUTED }}>{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DescriptionSection({ template }: { template: TemplateMeta }) {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CANVAS }}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold tracking-[-0.4px] mb-6" style={{ color: INK }}>
          About this template
        </h2>
        <p className="text-base leading-relaxed" style={{ color: INK_MUTED }}>
          {template.description}
        </p>
      </div>
    </section>
  );
}

function CTASection() {
  const router = useRouter();

  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: SURFACE }}>
      <div
        className="mx-auto max-w-2xl text-center p-12 rounded-lg"
        style={{
          backgroundColor: CANVAS,
          border: `1px solid ${HAIRLINE}`,
        }}
      >
        <h2 className="text-2xl font-semibold tracking-[-0.6px] mb-4" style={{ color: INK }}>
          Ready to build your resume?
        </h2>
        <p className="text-sm mb-8" style={{ color: INK_SUBTLE }}>
          No sign-up. No paywalls. Just a fast way to create a resume that works.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            backgroundColor: ACCENT,
            borderRadius: 8,
          }}
        >
          Get Started Free
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: CANVAS }}>
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm" style={{ color: INK_SUBTLE }}>
          NoiceResume — Free, modern resume builder. Built with <span style={{ color: ACCENT }}>&#x2764;</span>
        </p>
      </div>
    </section>
  );
}

export function TemplatePageClient({ template }: { template: TemplateMeta | undefined }) {
  if (!template) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: CANVAS }}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4" style={{ color: INK }}>Template not found</h1>
          <a href="/" className="text-sm" style={{ color: ACCENT }}>Return home</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <HeroSection template={template} />
      <ScreenshotSection template={template} />
      <BenefitsSection template={template} />
      <DescriptionSection template={template} />
      <CTASection />
      <Footer />
    </main>
  );
}
