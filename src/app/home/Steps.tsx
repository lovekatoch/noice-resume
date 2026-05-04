const STEPS = [
  {
    title: "Import your existing resume",
    text: "Drop a PDF or start from scratch. Our AI reads everything in seconds.",
  },
  {
    title: "AI refines your content",
    text: "We optimize wording, structure, and keywords so recruiters notice you first.",
  },
  {
    title: "Download and apply with confidence",
    text: "Get a resume that's built to impress — then land the interview you've earned.",
  },
];

export const Steps = () => {
  return (
    <section className="bg-[var(--surface)] px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-2 font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
          Three steps to a better resume
        </h2>
        <p className="mb-12 text-base text-[var(--muted)]">
          From upload to interview call in minutes.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
      </div>
    </section>
  );
};
