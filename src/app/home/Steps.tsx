const STEPS = [
  { title: "Create your resume", text: "Fill in your details or import existing" },
  { title: "Preview and edit", text: "See changes in real-time" },
  { title: "Download and apply", text: "Get your professional resume PDF" },
];

export const Steps = () => {
  return (
    <section className="bg-[var(--surface)] px-6 py-16">
      <h2 className="mb-12 text-center font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
        How it works
      </h2>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map(({ title, text }, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
              {idx + 1}
            </div>
            <h3 className="mb-2 font-semibold text-[var(--fg)]">{title}</h3>
            <p className="text-sm text-[var(--muted)]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
