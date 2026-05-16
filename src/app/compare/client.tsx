"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ComparisonMeta } from "lib/compare-data";
import { captureContentPageViewed } from "lib/analytics";
import StructuredData from "components/StructuredData";
import {
  breadcrumbSchema,
  collectionPageSchema,
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9z" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 9H6v3a6 6 0 0 0 12 0V9z" />
    </svg>
  );
}

export function ComparePageClient({ comparisons }: { comparisons: ComparisonMeta[] }) {
  const router = useRouter();

  useEffect(() => {
    captureContentPageViewed({ pageType: "comparison" });
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--canvas)" }}>
      <StructuredData
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Comparisons", url: `${SITE_URL}/compare` },
          ]),
          collectionPageSchema(
            "NoiceResume vs Other Resume Builders — Honest Comparisons",
            "See how NoiceResume stacks up against other resume builders. Honest, detailed comparisons."
          ),
        ]}
      />
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h1 className="text-[clamp(2rem,4vw,2.8rem)] mb-4 font-semibold tracking-[-1.5px]" style={{ color: "var(--fg)" }}>
              NoiceResume vs The Competition
            </h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: "var(--body)" }}>
              Honest, detailed comparisons to help you choose the right resume builder.
            </p>
          </div>
          <div className="grid gap-6">
            {comparisons.map((c) => (
              <div
                key={c.slug}
                onClick={() => router.push(`/compare/${c.slug}`)}
                className="cursor-pointer rounded-xl border p-6 transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="mb-2 text-lg font-semibold" style={{ color: "var(--fg)" }}>
                      {c.headline}
                    </h2>
                    <p className="mb-3 text-sm leading-relaxed" style={{ color: "var(--body)" }}>
                      {c.subheadline}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: c.winner === "noiceresume" ? "rgba(30,58,95,0.1)" : c.winner === "depends" ? "rgba(255,204,0,0.1)" : "rgba(239,68,68,0.1)",
                          color: c.winner === "noiceresume" ? "var(--accent)" : c.winner === "depends" ? "#B8860B" : "#DC2626",
                        }}
                      >
                        <TrophyIcon />
                        {c.winner === "noiceresume" ? "NoiceResume wins" : c.winner === "depends" ? "Depends on needs" : "Competitor wins"}
                      </span>
                    </div>
                  </div>
                  <div className="hidden flex-shrink-0 sm:block" style={{ color: "var(--accent)" }}>
                    <ArrowRightIcon />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
