"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { captureTemplateView, captureTemplateBrowsed } from "lib/analytics";
import type { TemplateMeta } from "lib/template-data";
import { ALL_TEMPLATES } from "lib/template-data";
import StructuredData from "components/StructuredData";
import {
  breadcrumbSchema,
  productSchema,
  SITE_URL,
} from "lib/structured-data";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="pointer-events-none absolute inset-0 -z-10" style={{
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 50% 0%, rgba(30,58,95,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 30% 40% at 80% 30%, rgba(30,58,95,0.03) 0%, transparent 50%)
        `,
      }} />
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        <h1 className="text-[clamp(2.2rem,5vw,3.2rem)] mb-4 font-semibold tracking-[-1.8px]" style={{ color: "var(--fg)", fontFamily: "Inter, -apple-system, system-ui, sans-serif" }}>
          {template.headline}
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed" style={{ color: "var(--body)" }}>
          {template.subheadline}
        </p>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => {
              localStorage.removeItem("open-resume-state");
              router.push("/resume-builder");
            }}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Build Your Resume
            <ArrowRightIcon />
          </button>
          <p className="text-xs" style={{ color: "var(--muted-subtle)" }}>No sign-up required. Free forever.</p>
        </div>
      </div>
    </section>
  );
}

function ScreenshotSection({ template }: { template: TemplateMeta }) {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto max-w-4xl">
        <div style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          overflow: "hidden",
        }}>
          <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#28C840" }} />
          </div>
          <img
            src={template.sampleResumeImage}
            alt={`${template.title} example`}
            className="block w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ template }: { template: TemplateMeta }) {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-14 text-center text-2xl font-semibold tracking-[-0.6px]" style={{ color: "var(--fg)" }}>
          Why use this template?
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {template.benefits.map((benefit, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border p-5"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="mt-0.5 flex-shrink-0" style={{ color: "var(--success)" }}><CheckIcon /></div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--body)" }}>{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DescriptionSection({ template }: { template: TemplateMeta }) {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-xl font-semibold tracking-[-0.4px]" style={{ color: "var(--fg)" }}>
          About this template
        </h2>
        <p className="text-base leading-relaxed" style={{ color: "var(--body)" }}>
          {template.description}
        </p>
      </div>
    </section>
  );
}

function CTASection() {
  const router = useRouter();

  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--surface)" }}>
      <div
        className="mx-auto max-w-2xl rounded-lg border p-12 text-center"
        style={{ backgroundColor: "var(--canvas-soft)", borderColor: "var(--border)" }}
      >
        <h2 className="mb-4 text-2xl font-semibold tracking-[-0.6px]" style={{ color: "var(--fg)" }}>
          Ready to build your resume?
        </h2>
        <p className="mb-8 text-sm" style={{ color: "var(--muted-subtle)" }}>
          No sign-up. No paywalls. Just a fast way to create a resume that works.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "var(--accent)" }}
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
    <section className="px-6 py-10" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm" style={{ color: "var(--muted-subtle)" }}>
          NoiceResume — Free, modern resume builder.
        </p>
      </div>
    </section>
  );
}

export function TemplatePageClient({ template }: { template: TemplateMeta | undefined }) {
  useEffect(() => {
    if (!template) return;
    captureTemplateView({ templateSlug: template.slug, templateName: template.title });
    captureTemplateBrowsed({ templateCount: ALL_TEMPLATES.length });
  }, [template]);

  if (!template) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6" style={{ backgroundColor: "var(--canvas)" }}>
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--fg)" }}>Template not found</h1>
          <a href="/" className="text-sm" style={{ color: "var(--accent)" }}>Return home</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <StructuredData
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Templates", url: `${SITE_URL}/templates` },
            { name: template.title, url: `${SITE_URL}/templates/${template.slug}` },
          ]),
          productSchema({
            name: template.title,
            description: template.description,
            image: template.sampleResumeImage,
          }),
        ]}
      />
      <HeroSection template={template} />
      <ScreenshotSection template={template} />
      <BenefitsSection template={template} />
      <DescriptionSection template={template} />
      <CTASection />
      <Footer />
    </main>
  );
}
