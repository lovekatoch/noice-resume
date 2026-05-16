"use client";

import { useRouter } from "next/navigation";
import type { ComparisonMeta } from "lib/compare-data";
import StructuredData from "components/StructuredData";
import { COMPARISONS } from "lib/compare-data";
import {
  breadcrumbSchema,
  articleSchema,
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

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9z" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 9H6v3a6 6 0 0 0 12 0V9z" />
    </svg>
  );
}

function ComparisonStructuredData({ comparison }: { comparison: ComparisonMeta }) {
  return (
    <StructuredData
      schemas={[
        breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Comparisons", url: `${SITE_URL}/compare` },
          { name: comparison.title, url: `${SITE_URL}/compare/${comparison.slug}` },
        ]),
        articleSchema(comparison.ogTitle, comparison.ogDescription, "2025-01-01"),
      ]}
    />
  );
}

function BreadcrumbNav({ comparison }: { comparison: ComparisonMeta }) {
  return (
    <nav className="px-6 pt-6" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto max-w-3xl">
        <ol className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-subtle)" }}>
          <li><a href="/" className="transition-colors" style={{ color: "var(--accent)" }}>Home</a></li>
          <li>/</li>
          <li><a href="/compare" className="transition-colors" style={{ color: "var(--accent)" }}>Comparisons</a></li>
          <li>/</li>
          <li style={{ color: "var(--body)" }}>{comparison.title}</li>
        </ol>
      </div>
    </nav>
  );
}

function HeroSection({ comparison }: { comparison: ComparisonMeta }) {
  const router = useRouter();

  const winnerBadge = {
    noiceresume: { label: "NoiceResume wins", color: "var(--accent)", bg: "rgba(30,58,95,0.1)" },
    competitor: { label: `${comparison.competitor} wins`, color: "#DC2626", bg: "rgba(239,68,68,0.1)" },
    depends: { label: "Depends on your needs", color: "#B8860B", bg: "rgba(255,204,0,0.1)" },
  }[comparison.winner];

  return (
    <section className="relative flex items-center justify-center overflow-hidden px-6 py-20" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 50% 0%, rgba(30,58,95,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 30% 40% at 80% 30%, rgba(30,58,95,0.03) 0%, transparent 50%)
        `,
      }} />
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <span
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: winnerBadge.bg, color: winnerBadge.color }}
        >
          <TrophyIcon />
          {winnerBadge.label}
        </span>
        <h1 className="text-[clamp(2rem,4.5vw,2.8rem)] mb-4 font-semibold tracking-[-1.5px]" style={{ color: "var(--fg)" }}>
          {comparison.headline}
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed" style={{ color: "var(--body)" }}>
          {comparison.subheadline}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("open-resume-state");
            router.push("/resume-builder");
          }}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Try NoiceResume Free
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
}

function VerdictBanner({ comparison }: { comparison: ComparisonMeta }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto max-w-3xl rounded-xl border p-6"
        style={{
          backgroundColor: "var(--canvas)",
          borderColor: comparison.winner === "noiceresume" ? "rgba(30,58,95,0.2)" : "var(--border)",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }}>
            <TrophyIcon />
          </div>
          <div>
            <h2 className="mb-1 text-sm font-semibold" style={{ color: "var(--fg)" }}>Our Verdict</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--body)" }}>{comparison.winnerReason}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentSection({ comparison }: { comparison: ComparisonMeta }) {
  return (
    <section className="px-6 py-16 md:py-24" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto max-w-3xl">
        <div className="space-y-12">
          {comparison.sections.map((section, i) => (
            <div key={i}>
              <h2 className="mb-4 text-xl font-semibold tracking-[-0.4px]" style={{ color: "var(--fg)" }}>
                {section.heading}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "var(--body)" }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MoreComparisonsSection({ currentSlug }: { currentSlug: string }) {
  const router = useRouter();
  const others = COMPARISONS.filter((c: ComparisonMeta) => c.slug !== currentSlug).slice(0, 3);

  return (
    <section className="px-6 py-16" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-xl font-semibold tracking-[-0.4px]" style={{ color: "var(--fg)" }}>
          More Comparisons
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {others.map((c: ComparisonMeta) => (
            <button
              key={c.slug}
              onClick={() => router.push(`/compare/${c.slug}`)}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--body)" }}
            >
              {c.title}
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
          Ready to build your resume?
        </h2>
        <p className="mb-8 text-sm" style={{ color: "var(--muted-subtle)" }}>
          Stop comparing. Start building. NoiceResume is free, fast, and requires no sign-up.
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

export function ComparisonPageClient({ comparison }: { comparison: ComparisonMeta | undefined }) {
  if (!comparison) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6" style={{ backgroundColor: "var(--canvas)" }}>
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--fg)" }}>Comparison not found</h1>
          <a href="/compare" className="text-sm" style={{ color: "var(--accent)" }}>View all comparisons</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <ComparisonStructuredData comparison={comparison} />
      <BreadcrumbNav comparison={comparison} />
      <HeroSection comparison={comparison} />
      <VerdictBanner comparison={comparison} />
      <ContentSection comparison={comparison} />
      <MoreComparisonsSection currentSlug={comparison.slug} />
      <CTASection />
      <Footer />
    </main>
  );
}
