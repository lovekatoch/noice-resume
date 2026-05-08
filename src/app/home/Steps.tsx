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
    <section className="bg-[#f8f9fb] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-2 font-display text-3xl font-light tracking-tight text-[#0C1628]">
          Three steps to a better resume
        </h2>
        <p className="mb-14 text-base text-[#64748d]">
          From upload to interview call in minutes.
        </p>
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Desktop connecting line */}
          <div className="absolute left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] top-8 hidden h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent md:block" />

          {STEPS.map(({ number, title, text }, idx) => (
            <div
              key={idx}
              className="group relative rounded-lg border border-[#e5edf5] bg-white p-8 text-center transition-all duration-200 hover:border-[var(--accent)]/20 hover:shadow-[rgba(50,50,93,0.08)_0px_6px_24px]"
            >
              {/* Step number */}
              <div className="relative mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-medium text-[var(--accent)] shadow-[rgba(50,50,93,0.08)_0px_2px_8px] transition-all duration-200 group-hover:shadow-[rgba(94,106,210,0.2)_0px_4px_16px]">
                <span className="relative z-10">{number}</span>
              </div>
              <h3 className="mb-2 font-semibold text-[#0C1628]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#64748d]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
