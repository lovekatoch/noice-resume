const STEPS = [
  { title: "Create your resume", text: "Fill in your details or import existing" },
  { title: "Preview and edit", text: "See changes in real-time" },
  { title: "Download and apply", text: "Get your professional resume PDF" },
];

export const Steps = () => {
  return (
    <section className="bg-[var(--notion-warm-white)] px-8 py-16">
      <h2
        className="mb-10 text-center font-serif text-2xl font-semibold tracking-tight text-[var(--notion-black)]"
      >
        How it works
      </h2>
      <div className="mx-auto max-w-3xl">
        <dl className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-4">
          {STEPS.map(({ title, text }, idx) => (
            <div key={idx} className="notion-card p-6 text-center">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--notion-blue)] text-white">
                <span className="text-lg font-semibold">{idx + 1}</span>
              </div>
              <dt className="mb-2 font-semibold text-[var(--notion-black)]">
                {title}
              </dt>
              <dd className="text-sm text-[var(--notion-warm-gray-500)]">
                {text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
