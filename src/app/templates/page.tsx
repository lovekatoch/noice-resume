"use client";

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

interface Template {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  preview: string;
  popular?: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: "executive-simple",
    name: "Classic",
    tagline: "Clean & professional",
    description:
      "A traditional single-column layout with centered header and accent-bar sections. Optimized for ATS parsing and conservative industries.",
    features: [
      "Centered name & contact header",
      "Accent bar section dividers",
      "ATS-friendly single column",
      "B&W print optimized",
    ],
    preview: "/sample-resumes/tpl-classic.png",
    popular: true,
  },
  {
    id: "sb2nov-modern",
    name: "Modern",
    tagline: "Sleek & contemporary",
    description:
      "A clean left-right header with border-bottom sections. Balanced whitespace and modern typography suit creative and growth-stage roles.",
    features: [
      "Left-right header layout",
      "Border-bottom section headings",
      "Serif heading accent",
      "Generous whitespace rhythm",
    ],
    preview: "/sample-resumes/tpl-modern.png",
  },
  {
    id: "stackoverflow",
    name: "StackOverflow",
    tagline: "Technical & dense",
    description:
      "A two-column layout with an orange-accented sidebar for skills and contact. Built for engineers, data scientists, and technical PMs.",
    features: [
      "Two-column page layout",
      "Sidebar skills section",
      "Compact information density",
      "Tech-community aesthetic",
    ],
    preview: "/sample-resumes/tpl-stackoverflow.png",
  },
];

function TemplateCard({ template }: { template: Template }) {
  const router = useRouter();

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: SURFACE,
        border: `1px solid ${HAIRLINE}`,
      }}
    >
      {/* Preview image */}
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
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Name + tag */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold" style={{ color: INK }}>
              {template.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: INK_SUBTLE }}>
              {template.tagline}
            </p>
          </div>
          {template.popular && (
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(94,106,210,0.15)",
                color: ACCENT_HOVER,
              }}
            >
              Popular
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: INK_MUTED }}>
          {template.description}
        </p>

        {/* Features */}
        <ul className="mt-auto flex flex-wrap gap-1.5">
          {template.features.map((feature) => (
            <li
              key={feature}
              className="rounded-md px-2 py-1 text-[11px] font-medium"
              style={{
                backgroundColor: SURFACE_2,
                color: INK_SUBTLE,
              }}
            >
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => router.push(`/resume-builder?template=${template.id}`)}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            backgroundColor: ACCENT,
            color: "#fff",
          }}
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

function ArrowLeftIcon() {
  return (
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
  );
}

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <main style={{ backgroundColor: CANVAS }}>
      {/* ─── Hero ─── */}
      <section className="relative px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Back link */}
          <button
            onClick={() => router.push("/")}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-70"
            style={{ color: INK_SUBTLE }}
          >
            <ArrowLeftIcon />
            Back to home
          </button>

          {/* Heading */}
          <h1
            className="text-3xl font-semibold tracking-tight md:text-4xl"
            style={{
              color: INK,
              letterSpacing: "-1.2px",
            }}
          >
            Template showcase
          </h1>
          <p
            className="mt-3 max-w-lg text-base leading-relaxed"
            style={{ color: INK_MUTED }}
          >
            Pick a starting point and customise every section — fonts, colors,
            spacing, and content. All templates are free, no sign-up required.
          </p>
        </div>
      </section>

      {/* ─── Template grid ─── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} />
            ))}
          </div>

          {/* Footer note */}
          <p
            className="mt-12 text-center text-sm leading-relaxed"
            style={{ color: INK_SUBTLE }}
          >
            <Link
              href="/templates/community"
              className="inline-flex items-center gap-1.5 transition-all hover:opacity-70"
              style={{ color: ACCENT }}
            >
              Browse the community showcase
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
            </Link>
            {" — "}templates crafted by the NoiceResume community.
          </p>
        </div>
      </section>
    </main>
  );
}
