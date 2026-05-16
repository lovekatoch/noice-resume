"use client";

import { useRouter } from "next/navigation";

const EXAMPLES = [
  {
    src: "/sample-resumes/resume-classic-1.png",
    name: "Classic",
    role: "Marketing Manager",
    template: "executive-simple",
  },
  {
    src: "/sample-resumes/resume-modern-1.png",
    name: "Modern",
    role: "Software Engineer",
    template: "sb2nov-modern",
  },
  {
    src: "/sample-resumes/resume-stackoverflow-1.png",
    name: "Compact",
    role: "Senior Product Manager",
    template: "stackoverflow",
  },
];

export function ExampleGallery() {
  const router = useRouter();

  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-center font-display text-3xl font-light tracking-tight" style={{ color: "var(--fg)" }}>
          Real resumes, real results
        </h2>
        <p className="mb-14 text-center text-base" style={{ color: "var(--muted)" }}>
          See what others have built. Each template adapts to your content.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.name}
              onClick={() => router.push(`/resume-builder?template=${ex.template}`)}
              className="group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
              }}
            >
              <div className="overflow-hidden" style={{ borderBottom: "1px solid var(--border)" }}>
                <img
                  src={ex.src}
                  alt={`${ex.role} resume example using ${ex.name} template`}
                  className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                  {ex.role}
                </p>
                <h3 className="mt-0.5 text-sm font-semibold" style={{ color: "var(--fg)" }}>
                  {ex.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
