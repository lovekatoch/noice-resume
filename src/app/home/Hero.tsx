"use client";
import { ImportButton } from "components/ImportButton";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();

  const handleStartFresh = () => {
    localStorage.removeItem("open-resume-state");
    router.push("/resume-builder");
  };

  return (
    <section className="bg-[var(--bg)] px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-[720px] text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-[var(--accent-light)] px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
          ✨ AI-Powered Resume Builder
        </div>
        <h1 className="mb-5 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--fg)]">
          Create a professional resume with ease
        </h1>
        <p className="mx-auto mb-10 max-w-[540px] text-lg text-[var(--muted)]">
          A free, beautifully designed resume builder that helps you stand out. No sign-up required.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={handleStartFresh}
            className="inline-flex items-center rounded-md bg-[var(--accent)] px-6 py-2.5 font-semibold text-white transition hover:bg-[var(--accent-hover)]"
          >
            Start Fresh
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
          <ImportButton />
        </div>
      </div>
    </section>
  );
};
