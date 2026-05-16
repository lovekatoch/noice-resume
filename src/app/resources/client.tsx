"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ResourceMeta } from "lib/resource-data";
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

export function ResourcesPageClient({ resources }: { resources: ResourceMeta[] }) {
  const router = useRouter();

  useEffect(() => {
    captureContentPageViewed({ pageType: "resource" });
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--canvas)" }}>
      <StructuredData
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Resources", url: `${SITE_URL}/resources` },
          ]),
          collectionPageSchema(
            "Resume Resources & Guides — NoiceResume",
            "Expert guides on resume writing, ATS optimization, and career advice. Learn how to write a resume that gets interviews."
          ),
        ]}
      />
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h1 className="text-[clamp(2rem,4vw,2.8rem)] mb-4 font-semibold tracking-[-1.5px]" style={{ color: "var(--fg)" }}>
              Resume Resources & Guides
            </h1>
            <p className="text-base" style={{ color: "var(--body)" }}>
              Expert advice on resume writing, ATS optimization, and career growth.
            </p>
          </div>
          <div className="grid gap-6">
            {resources.map((r) => (
              <div
                key={r.slug}
                onClick={() => router.push(`/resources/${r.slug}`)}
                className="cursor-pointer rounded-xl border p-6 transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <h2 className="mb-2 text-lg font-semibold" style={{ color: "var(--fg)" }}>
                  {r.headline}
                </h2>
                <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--body)" }}>
                  {r.subheadline}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
                  Read Guide <ArrowRightIcon />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
