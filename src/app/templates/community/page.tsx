"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CANVAS = "#010102";
const SURFACE = "#0f1011";
const SURFACE_2 = "#141516";
const INK = "#f7f8f8";
const INK_MUTED = "#d0d6e0";
const INK_SUBTLE = "#8a8f98";
const ACCENT = "#5e6ad2";
const ACCENT_HOVER = "#828fff";
const HAIRLINE = "#23252a";

type SortKey = "most-used" | "newest" | "trending";

interface CommunityTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  creator: {
    name: string;
    initials: string;
  };
  preview: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
  trending: boolean;
}

const COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    tagline: "Clean & focused",
    description:
      "A stripped-down single-column layout with generous whitespace. Perfect for design roles and creative professionals.",
    creator: { name: "Alex Chen", initials: "AC" },
    preview: "/sample-resumes/tpl-classic.png",
    tags: ["minimal", "single-column", "creative"],
    usageCount: 342,
    createdAt: "2025-11-15",
    trending: true,
  },
  {
    id: "bold-executive",
    name: "Bold Executive",
    tagline: "Command attention",
    description:
      "Impactful dark header with a striking accent bar. Built for senior leadership and executive job searches.",
    creator: { name: "Samantha Ruiz", initials: "SR" },
    preview: "/sample-resumes/tpl-modern.png",
    tags: ["executive", "bold", "dark-header"],
    usageCount: 218,
    createdAt: "2025-12-03",
    trending: false,
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    tagline: "Show, don't just tell",
    description:
      "Visual-forward layout with an icon sidebar and project showcase section. For designers, artists, and media professionals.",
    creator: { name: "Design Jam", initials: "DJ" },
    preview: "/sample-resumes/resume-modern-1.png",
    tags: ["visual", "portfolio", "icons"],
    usageCount: 189,
    createdAt: "2026-01-20",
    trending: true,
  },
  {
    id: "technical-report",
    name: "Technical Report",
    tagline: "Data speaks volumes",
    description:
      "Dense, data-driven two-column layout with skill metrics and publication timeline. Ideal for engineers and data scientists.",
    creator: { name: "Dev Mike", initials: "DM" },
    preview: "/sample-resumes/tpl-stackoverflow.png",
    tags: ["technical", "two-column", "data-driven"],
    usageCount: 156,
    createdAt: "2026-01-28",
    trending: false,
  },
  {
    id: "academic-cv",
    name: "Academic CV",
    tagline: "Research-ready",
    description:
      "Publication-focused layout with citation formatting, grant history, and conference track record.",
    creator: { name: "Dr. Priya Sharma", initials: "PS" },
    preview: "/sample-resumes/sample-classic.png",
    tags: ["academic", "publications", "citations"],
    usageCount: 97,
    createdAt: "2026-02-10",
    trending: false,
  },
  {
    id: "startup-hustle",
    name: "Startup Hustle",
    tagline: "Move fast & build things",
    description:
      "Energetic compact layout with achievement metrics and growth timeline. For startup roles and fast-moving teams.",
    creator: { name: "Kate Okafor", initials: "KO" },
    preview: "/sample-resumes/sample-modern.png",
    tags: ["startup", "compact", "metrics"],
    usageCount: 73,
    createdAt: "2026-03-05",
    trending: true,
  },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "most-used", label: "Most used" },
  { key: "newest", label: "Newest" },
  { key: "trending", label: "Trending" },
];

function CreatorAvatar({ initials }: { initials: string }) {
  return (
    <div
      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: ACCENT, color: "#fff" }}
    >
      {initials}
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function CommunityCard({ template }: { template: CommunityTemplate }) {
  const router = useRouter();

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5"
      style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "210/297" }}>
        <img
          src={template.preview}
          alt={`${template.name} template preview`}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 60%, rgba(1,1,2,0.6) 100%)",
          }}
        />
        <div
          className="absolute right-2 top-2 rounded-md px-2 py-1 text-[10px] font-medium"
          style={{
            backgroundColor: "rgba(1,1,2,0.7)",
            color: INK_MUTED,
            backdropFilter: "blur(4px)",
          }}
        >
          {formatCount(template.usageCount)} uses
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <CreatorAvatar initials={template.creator.initials} />
          <span className="text-xs font-medium" style={{ color: INK_SUBTLE }}>
            by {template.creator.name}
          </span>
        </div>

        <div>
          <h3 className="text-base font-semibold" style={{ color: INK }}>
            {template.name}
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: INK_SUBTLE }}>
            {template.tagline}
          </p>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: INK_MUTED }}>
          {template.description}
        </p>

        <ul className="mt-auto flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md px-2 py-1 text-[11px] font-medium"
              style={{ backgroundColor: SURFACE_2, color: INK_SUBTLE }}
            >
              {tag}
            </li>
          ))}
        </ul>

        <button
          onClick={() => router.push("/resume-builder")}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: ACCENT, color: "#fff" }}
        >
          Use this template
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function CommunityTemplatesPage() {
  const [activeSort, setActiveSort] = useState<SortKey>("trending");

  const sorted = useMemo(() => {
    const list = [...COMMUNITY_TEMPLATES];
    switch (activeSort) {
      case "most-used":
        return list.sort((a, b) => b.usageCount - a.usageCount);
      case "newest":
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "trending":
        return list.sort((a, b) => {
          const ta = a.trending ? 1 : 0;
          const tb = b.trending ? 1 : 0;
          if (ta !== tb) return tb - ta;
          return b.usageCount - a.usageCount;
        });
      default:
        return list;
    }
  }, [activeSort]);

  return (
    <main style={{ backgroundColor: CANVAS, minHeight: "100vh" }}>
      <section className="relative px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/templates"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-70"
            style={{ color: INK_SUBTLE }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All templates
          </Link>

          <h1
            className="text-3xl font-semibold tracking-tight md:text-4xl"
            style={{ color: INK, letterSpacing: "-1.2px" }}
          >
            Community showcase
          </h1>
          <p
            className="mt-3 max-w-lg text-base leading-relaxed"
            style={{ color: INK_MUTED }}
          >
            Templates crafted by the NoiceResume community. Pick a design,
            customise it, and make it yours.
          </p>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          <div
            className="flex w-fit items-center gap-1 rounded-xl p-1"
            style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setActiveSort(opt.key)}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    activeSort === opt.key ? SURFACE_2 : "transparent",
                  color: activeSort === opt.key ? INK : INK_SUBTLE,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          {sorted.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((tpl) => (
                <CommunityCard key={tpl.id} template={tpl} />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center rounded-xl py-20 text-center"
              style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: SURFACE_2 }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: INK_SUBTLE }}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: INK_MUTED }}>
                No templates found
              </p>
              <p className="mt-1 text-sm" style={{ color: INK_SUBTLE }}>
                Try a different sort or check back later.
              </p>
            </div>
          )}

          <div
            className="mt-12 overflow-hidden rounded-xl"
            style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}
          >
            <div className="flex flex-col items-center gap-4 px-6 py-10 text-center md:flex-row md:justify-between md:text-left md:px-10">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: INK }}>
                  Have a template to share?
                </h3>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: INK_MUTED }}
                >
                  Submit your design to the community showcase. We&apos;ll
                  review and add it so everyone can use it.
                </p>
              </div>
              <a
                href="/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: ACCENT, color: "#fff" }}
              >
                Submit your template
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
