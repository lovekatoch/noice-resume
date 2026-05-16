"use client";

const TESTIMONIALS = [
  {
    quote:
      "NoiceResume's auto-format feature is a great help to ensure consistent format. Small mistakes like inconsistent bullet points or font sizes are caught automatically.",
    name: "Ms. Spiegel",
    title: "Educator",
  },
  {
    quote:
      "I used NoiceResume during my last job search and was invited to interview at top tech companies thanks to its clean, professional resume design.",
    name: "Santi",
    title: "Software Engineer",
  },
  {
    quote:
      "Creating a professional resume on NoiceResume is so smooth and easy. It saves me so much time and headache compared to dealing with template formatting.",
    name: "Vivian",
    title: "College Student",
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-center font-display text-3xl font-light tracking-tight" style={{ color: "var(--fg)" }}>
          Trusted by job seekers
        </h2>
        <p className="mb-14 text-center text-base" style={{ color: "var(--muted)" }}>
          Real people, real results.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col p-6"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
              }}
            >
              <div className="mb-3 font-display text-3xl leading-none" style={{ color: "var(--accent)" }}>
                &ldquo;
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {t.quote}
              </blockquote>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: "var(--muted-subtle)" }}>
                  {t.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
