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
      {/* Feature cards */}
      <section className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center font-display text-3xl font-light tracking-tight text-[#0C1628]">
            Why NoiceResume
          </h2>
          <p className="mb-12 text-center text-base text-[#64748d]">
            A resume builder that does the hard part for you.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {ITEMS.map(({ title, text, icon }) => (
              <div
                key={title}
                className="group flex items-start gap-5 rounded-lg border border-[#e5edf5] bg-white p-7 transition-all duration-200 hover:border-[var(--accent)]/20 hover:shadow-[rgba(50,50,93,0.08)_0px_6px_24px]"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)] transition-all group-hover:bg-[var(--accent)]/15">
                  {icon}
                </div>
                <div>
                  <h3 className="mb-1.5 font-semibold text-[#0C1628]">{title}</h3>
                  <p className="text-sm leading-relaxed text-[#64748d]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA band — Stripe-inspired brand section */}
      <section className="border-t border-[var(--border)] bg-[#0C1628] px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-[540px]">
          {/* Decorative accent line */}
          <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

          <h2 className="mb-4 font-display text-3xl font-light tracking-tight">
            Your next role starts here
          </h2>
          <p className="mb-10 text-base leading-relaxed text-white/50">
            No sign-up required. No credit card. Just a resume that works.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/resume-builder"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-7 py-3 font-medium text-white shadow-[rgba(94,106,210,0.35)_0px_8px_24px_-4px] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[rgba(94,106,210,0.5)_0px_12px_28px_-6px] active:scale-[0.98]"
            >
              Start Fresh
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/resume-import"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-7 py-3 font-medium text-white/80 transition-all hover:border-white/30 hover:text-white"
            >
              Import PDF
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
