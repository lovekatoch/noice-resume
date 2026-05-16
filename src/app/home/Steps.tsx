const STEPS = [
  {
    number: "01",
    title: "Import your resume",
    text: "Upload a PDF or start fresh. The AI reads it in seconds.",
  },
  {
    number: "02",
    title: "Polish with AI",
    text: "Get suggestions that make your experience sound better. Tweak until it feels right.",
  },
  {
    number: "03",
    title: "Download and apply",
    text: "Export a clean PDF and send it out. That is all it takes.",
  },
];

export const Steps = () => {
  return (
    <section className="bg-canvas-soft px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-2 font-display text-3xl font-light tracking-tight" style={{ color: "var(--fg)" }}>
          Three steps to a better resume
        </h2>
        <p className="mb-14 text-base" style={{ color: "var(--body)" }}>
          From upload to interview call in minutes.
        </p>
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Desktop connecting line */}
          <div className="absolute left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] top-8 hidden h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent md:block" />

          {STEPS.map(({ number, title, text }, idx) => (
            <div
              key={idx}
              className="group relative rounded-lg border bg-surface p-8 text-center transition-all duration-200 hover:shadow-[rgba(50,50,93,0.08)_0px_6px_24px]"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Step number */}
              <div className="relative mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-sm font-medium shadow-[rgba(50,50,93,0.08)_0px_2px_8px] transition-all duration-200 group-hover:shadow-[rgba(30,58,95,0.2)_0px_4px_16px]" style={{ color: "var(--accent)" }}>
                <span className="relative z-10">{number}</span>
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: "var(--fg)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--body)" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
