import Image from "next/image";
import morningPlansSrc from "public/assets/undraw-morning-plans.svg";

const STEPS = [
  {
    title: "Import your resume",
    text: "Upload a PDF or start fresh. The AI reads it in seconds.",
  },
  {
    title: "Polish with AI",
    text: "Get suggestions that make your experience sound better. Tweak until it feels right.",
  },
  {
    title: "Download and apply",
    text: "Export a clean PDF and send it out. That is all it takes.",
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
        <div className="mx-auto mt-10 max-w-[500px]">
          <Image
            src={morningPlansSrc}
            alt=""
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
};
