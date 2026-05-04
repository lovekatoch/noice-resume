const ITEMS = [
  {
    title: "Free for everyone",
    text: "No paid plans, no trials, no credit card. Just a resume builder that works.",
    icon: (
      <svg className="h-5 w-5 text-[var(--accent)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4" />
        <circle cx="10" cy="10" r="8" />
      </svg>
    ),
  },
  {
    title: "Built for ATS",
    text: "Most resumes get filtered out by software before anyone reads them. Yours won't be one of them.",
    icon: (
      <svg className="h-5 w-5 text-[var(--accent)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="14" height="14" rx="2" />
        <path d="M7 10l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "AI suggestions that help",
    text: "Not generic advice you have seen before. Real suggestions based on what recruiters actually look for.",
    icon: (
      <svg className="h-5 w-5 text-[var(--accent)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 6l7-4 7 4v8l-7 4-7-4V6z" />
        <path d="M10 2v16M3 10l7 4 7-4" />
      </svg>
    ),
  },
  {
    title: "Stays on your device",
    text: "Nothing gets uploaded to a server. Your resume never leaves your browser.",
    icon: (
      <svg className="h-5 w-5 text-[var(--accent)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="12" height="12" rx="2" />
        <path d="M7 10h6M10 7v6" />
      </svg>
    ),
  },
];

export const Features = () => {
  return (
    <>
      <section className="bg-[var(--bg)] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Why NoiceResume
          </h2>
          <p className="mb-10 text-center text-base text-[var(--muted)]">
            A resume builder that does the hard part for you.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {ITEMS.map(({ title, text, icon }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)]">
                  {icon}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[var(--fg)]">{title}</h3>
                  <p className="text-sm text-[var(--muted)]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-[var(--fg)] px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-[540px]">
          <h2 className="mb-2 font-display text-2xl font-semibold tracking-tight">
            Your next role starts here
          </h2>
          <p className="mb-8 text-base text-white/70">
            No sign-up required. No credit card. Just a resume that works.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/resume-builder"
              className="inline-flex items-center rounded-md bg-[var(--accent)] px-6 py-2.5 font-semibold text-white transition hover:bg-[var(--accent-hover)]"
            >
              Start Fresh
            </a>
            <a
              href="/resume-import"
              className="inline-flex items-center rounded-md border border-white/30 px-6 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              Import PDF
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
