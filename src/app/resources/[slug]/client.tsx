"use client";

import { useRouter } from "next/navigation";
import type { ResourceMeta } from "lib/resource-data";
import { useEffect } from "react";

const CANVAS = "#010102";
const SURFACE = "#0f1011";
const SURFACE_2 = "#141516";
const INK = "#f7f8f8";
const INK_MUTED = "#d0d6e0";
const INK_SUBTLE = "#8a8f98";
const ACCENT = "#5e6ad2";
const HAIRLINE = "#23252a";

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function HowToSchema({ resource }: { resource: ResourceMeta }) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: resource.title,
      description: resource.description,
      step: resource.sections.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.heading,
        text: s.body.slice(0, 200),
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [resource]);

  return null;
}

function BreadcrumbNav({ resource }: { resource: ResourceMeta }) {
  return (
    <nav className="px-6 pt-6" style={{ backgroundColor: CANVAS }}>
      <div className="mx-auto max-w-3xl">
        <ol className="flex items-center gap-2 text-xs" style={{ color: INK_SUBTLE }}>
          <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
          <li>/</li>
          <li>Resources</li>
          <li>/</li>
          <li style={{ color: INK_MUTED }}>{resource.title}</li>
        </ol>
      </div>
    </nav>
  );
}

function HeroSection({ resource }: { resource: ResourceMeta }) {
  const router = useRouter();

  return (
    <section className="relative flex items-center justify-center overflow-hidden px-6 py-20" style={{ backgroundColor: CANVAS }}>
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 50% 0%, rgba(94,106,210,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 30% 40% at 80% 30%, rgba(94,106,210,0.03) 0%, transparent 50%)
        `,
      }} />
      <div className="w-full max-w-3xl mx-auto text-center relative z-10">
        <p className="text-xs font-medium uppercase tracking-[0.4px] mb-4" style={{ color: ACCENT }}>Guide</p>
        <h1 className="text-[clamp(2rem,4.5vw,2.8rem)] font-semibold tracking-[-1.5px] mb-4" style={{ color: INK }}>
          {resource.headline}
        </h1>
        <p className="text-base leading-relaxed max-w-xl mx-auto mb-8" style={{ color: INK_MUTED }}>
          {resource.subheadline}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: ACCENT, borderRadius: 8 }}
        >
          Build Your Resume Free
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
}

function ContentSection({ resource }: { resource: ResourceMeta }) {
  return (
    <section className="px-6 py-16 md:py-24" style={{ backgroundColor: CANVAS }}>
      <div className="mx-auto max-w-3xl">
        <div className="space-y-12">
          {resource.sections.map((section, i) => (
            <div key={i} id={`step-${i + 1}`}>
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ backgroundColor: ACCENT, color: "#fff" }}
                >
                  {i + 1}
                </div>
                <h2 className="text-xl font-semibold tracking-[-0.4px] pt-1" style={{ color: INK }}>
                  {section.heading}
                </h2>
              </div>
              <p className="text-base leading-relaxed ml-12" style={{ color: INK_MUTED }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedTemplatesSection() {
  const router = useRouter();

  const related = [
    { slug: "ats-friendly", label: "ATS-Friendly Templates" },
    { slug: "modern", label: "Modern Resume Templates" },
    { slug: "college", label: "College Student Templates" },
  ];

  return (
    <section className="px-6 py-16" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold tracking-[-0.4px] mb-8 text-center" style={{ color: INK }}>
          Related Templates
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {related.map((r) => (
            <button
              key={r.slug}
              onClick={() => router.push(`/templates/${r.slug}`)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: CANVAS,
                border: `1px solid ${HAIRLINE}`,
                color: INK_MUTED,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const router = useRouter();

  return (
    <section className="px-6 py-20" style={{ backgroundColor: CANVAS }}>
      <div
        className="mx-auto max-w-2xl text-center p-12 rounded-lg"
        style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <h2 className="text-2xl font-semibold tracking-[-0.6px] mb-4" style={{ color: INK }}>
          Put this guide into action
        </h2>
        <p className="text-sm mb-8" style={{ color: INK_SUBTLE }}>
          Stop wrestling with formatting. Build your resume in minutes with NoiceResume.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: ACCENT, borderRadius: 8 }}
        >
          Build Your Resume Now
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

export function ResourcePageClient({ resource }: { resource: ResourceMeta | undefined }) {
  if (!resource) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: CANVAS }}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4" style={{ color: INK }}>Resource not found</h1>
          <a href="/" className="text-sm" style={{ color: ACCENT }}>Return home</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <HowToSchema resource={resource} />
      <BreadcrumbNav resource={resource} />
      <HeroSection resource={resource} />
      <ContentSection resource={resource} />
      <RelatedTemplatesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
