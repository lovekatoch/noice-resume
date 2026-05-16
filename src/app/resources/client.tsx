"use client";

import { useRouter } from "next/navigation";
import type { ResourceMeta } from "lib/resource-data";

const CANVAS = "#010102";
const SURFACE = "#0f1011";
const ACCENT = "#5e6ad2";
const INK = "#f7f8f8";
const INK_MUTED = "#d0d6e0";
const INK_SUBTLE = "#8a8f98";
const HAIRLINE = "#23252a";

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

  return (
    <main style={{ backgroundColor: CANVAS, minHeight: "100vh" }}>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-semibold tracking-[-1.5px] mb-4" style={{ color: INK }}>
              Resume Resources & Guides
            </h1>
            <p className="text-base" style={{ color: INK_MUTED }}>
              Expert advice on resume writing, ATS optimization, and career growth.
            </p>
          </div>
          <div className="grid gap-6">
            {resources.map((r) => (
              <div
                key={r.slug}
                onClick={() => router.push(`/resources/${r.slug}`)}
                className="p-6 rounded-xl transition-all cursor-pointer hover:-translate-y-0.5"
                style={{
                  backgroundColor: SURFACE,
                  border: `1px solid ${HAIRLINE}`,
                }}
              >
                <h2 className="text-lg font-semibold mb-2" style={{ color: INK }}>
                  {r.headline}
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: INK_MUTED }}>
                  {r.subheadline}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: ACCENT }}>
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
