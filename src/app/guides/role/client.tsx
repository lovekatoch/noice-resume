"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { RoleGuideMeta } from "lib/role-guide-data";
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

const ROLE_ICONS: Record<string, string> = {
  "software-engineer": "</>",
  "product-manager": "PM",
  "data-scientist": "DS",
  "marketing": "Mk",
  "ux-designer": "UX",
  "project-manager": "Pj",
  "nurse": "RN",
  "sales": "Sa",
  "teacher": "Ed",
  "consultant": "Co",
};

export function RoleGuidesPageClient({ guides }: { guides: RoleGuideMeta[] }) {
  const router = useRouter();

  useEffect(() => {
    captureContentPageViewed({ pageType: "guide" });
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--canvas)" }}>
      <StructuredData
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Role-Specific Resume Guides", url: `${SITE_URL}/guides/role` },
          ]),
          collectionPageSchema(
            "Role-Specific Resume Guides — NoiceResume",
            "Expert resume guides tailored to your profession."
          ),
        ]}
      />
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h1 className="text-[clamp(2rem,4vw,2.8rem)] mb-4 font-semibold tracking-[-1.5px]" style={{ color: "var(--fg)" }}>
              Resume Guides by Role
            </h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: "var(--body)" }}>
              Expert advice tailored to your profession. Learn what recruiters in your field actually look for.
            </p>
          </div>
          <div className="grid gap-6">
            {guides.map((g) => (
              <div
                key={g.slug}
                onClick={() => router.push(`/guides/role/${g.slug}`)}
                className="cursor-pointer rounded-xl border p-6 transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                    style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
                  >
                    {ROLE_ICONS[g.slug] || g.role.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-2 text-lg font-semibold" style={{ color: "var(--fg)" }}>
                      {g.headline}
                    </h2>
                    <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--body)" }}>
                      {g.subheadline}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
                      Read Guide <ArrowRightIcon />
                    </div>
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
