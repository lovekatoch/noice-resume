"use client";

import { useRouter } from "next/navigation";
import type { RoleGuideMeta } from "lib/role-guide-data";
import StructuredData from "components/StructuredData";
import {
  breadcrumbSchema,
  articleSchema,
  howToSchema,
  SITE_URL,
} from "lib/structured-data";

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function RoleGuideStructuredData({ guide }: { guide: RoleGuideMeta }) {
  return (
    <StructuredData
      schemas={[
        breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Role-Specific Resume Guides", url: `${SITE_URL}/guides/role` },
          { name: guide.title, url: `${SITE_URL}/guides/role/${guide.slug}` },
        ]),
        articleSchema(guide.ogTitle, guide.ogDescription, "2025-01-01"),
        howToSchema(
          guide.sections.map((s) => ({
            name: s.heading,
            text: s.body.slice(0, 200),
          }))
        ),
      ]}
    />
  );
}

function BreadcrumbNav({ guide }: { guide: RoleGuideMeta }) {
  return (
    <nav className="px-6 pt-6" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto max-w-3xl">
        <ol className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-subtle)" }}>
          <li><a href="/" className="transition-colors" style={{ color: "var(--accent)" }}>Home</a></li>
          <li>/</li>
          <li><a href="/guides/role" className="transition-colors" style={{ color: "var(--accent)" }}>Role Guides</a></li>
          <li>/</li>
          <li style={{ color: "var(--body)" }}>{guide.role}</li>
        </ol>
      </div>
    </nav>
  );
}

function HeroSection({ guide }: { guide: RoleGuideMeta }) {
  const router = useRouter();

  return (
    <section className="relative flex items-center justify-center overflow-hidden px-6 py-20" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 50% 0%, rgba(30,58,95,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 30% 40% at 80% 30%, rgba(30,58,95,0.03) 0%, transparent 50%)
        `,
      }} />
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.4px]" style={{ color: "var(--accent)" }}>
          {guide.role} Resume Guide
        </p>
        <h1 className="text-[clamp(2rem,4.5vw,2.8rem)] mb-4 font-semibold tracking-[-1.5px]" style={{ color: "var(--fg)" }}>
          {guide.headline}
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed" style={{ color: "var(--body)" }}>
          {guide.subheadline}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Build Your Resume Free
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
}

function ContentSection({ guide }: { guide: RoleGuideMeta }) {
  return (
    <section className="px-6 py-16 md:py-24" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto max-w-3xl">
        <div className="space-y-12">
          {guide.sections.map((section, i) => (
            <div key={i}>
              <div className="mb-4 flex items-start gap-4">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {i + 1}
                </div>
                <h2 className="pt-1 text-xl font-semibold tracking-[-0.4px]" style={{ color: "var(--fg)" }}>
                  {section.heading}
                </h2>
              </div>
              <p className="ml-12 text-base leading-relaxed" style={{ color: "var(--body)" }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedTemplatesSection({ guide }: { guide: RoleGuideMeta }) {
  const router = useRouter();

  const relatedBySlug: Record<string, { slug: string; label: string }[]> = {
    "software-engineer": [
      { slug: "tech", label: "Tech Resume Templates" },
      { slug: "software-engineer", label: "SWE-Specific Template" },
      { slug: "ats-friendly", label: "ATS-Friendly Templates" },
    ],
    "product-manager": [
      { slug: "product-manager", label: "PM-Specific Template" },
      { slug: "modern", label: "Modern Templates" },
      { slug: "ats-friendly", label: "ATS-Friendly Templates" },
    ],
    "data-scientist": [
      { slug: "data-scientist", label: "Data Scientist Template" },
      { slug: "tech", label: "Tech Templates" },
      { slug: "modern", label: "Modern Templates" },
    ],
    "marketing": [
      { slug: "marketing", label: "Marketing Template" },
      { slug: "modern", label: "Modern Templates" },
      { slug: "ats-friendly", label: "ATS-Friendly Templates" },
    ],
    "ux-designer": [
      { slug: "ux-designer", label: "UX Designer Template" },
      { slug: "modern", label: "Modern Templates" },
      { slug: "ats-friendly", label: "ATS-Friendly Templates" },
    ],
    "project-manager": [
      { slug: "project-manager", label: "PM Template" },
      { slug: "ats-friendly", label: "ATS-Friendly Templates" },
      { slug: "college", label: "College Templates" },
    ],
    "consultant": [
      { slug: "ats-friendly", label: "ATS-Friendly Templates" },
      { slug: "modern", label: "Modern Templates" },
      { slug: "college", label: "College Templates" },
    ],
  };

  const related = relatedBySlug[guide.slug] || [
    { slug: "ats-friendly", label: "ATS-Friendly Templates" },
    { slug: "modern", label: "Modern Templates" },
  ];

  return (
    <section className="px-6 py-16" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-xl font-semibold tracking-[-0.4px]" style={{ color: "var(--fg)" }}>
          Related Templates
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {related.map((r) => (
            <button
              key={r.slug}
              onClick={() => router.push(`/templates/${r.slug}`)}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--body)" }}
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
    <section className="px-6 py-20" style={{ backgroundColor: "var(--canvas)" }}>
      <div
        className="mx-auto max-w-2xl rounded-lg border p-12 text-center"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <h2 className="mb-4 text-2xl font-semibold tracking-[-0.6px]" style={{ color: "var(--fg)" }}>
          Put this guide into action
        </h2>
        <p className="mb-8 text-sm" style={{ color: "var(--muted-subtle)" }}>
          Stop wrestling with formatting. Build your resume in minutes with NoiceResume.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "var(--accent)" }}
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
    <section className="px-6 py-10" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm" style={{ color: "var(--muted-subtle)" }}>
          NoiceResume — Free, modern resume builder.
        </p>
      </div>
    </section>
  );
}

export function RoleGuidePageClient({ guide }: { guide: RoleGuideMeta | undefined }) {
  if (!guide) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6" style={{ backgroundColor: "var(--canvas)" }}>
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--fg)" }}>Guide not found</h1>
          <a href="/guides/role" className="text-sm" style={{ color: "var(--accent)" }}>View all guides</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <RoleGuideStructuredData guide={guide} />
      <BreadcrumbNav guide={guide} />
      <HeroSection guide={guide} />
      <ContentSection guide={guide} />
      <RelatedTemplatesSection guide={guide} />
      <CTASection />
      <Footer />
    </main>
  );
}
