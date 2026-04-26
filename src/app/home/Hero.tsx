"use client";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { ImportButton } from "components/ImportButton";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();

  const handleStartFresh = () => {
    localStorage.removeItem("open-resume-state");
    router.push("/resume-builder");
  };

  return (
    <section className="bg-[var(--notion-white)] lg:flex lg:min-h-[600px] lg:items-center lg:justify-center lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:mx-0 lg:flex-row lg:items-center lg:gap-12">
        <div className="lg:w-1/2">
          <img
            src="/images/online-resume.svg"
            alt="Resume illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
        <div className="lg:w-1/2 lg:text-left">
          <h1
            className="mb-4 font-serif text-4xl font-bold tracking-tight text-[var(--notion-black)] lg:text-5xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Create a professional
            <br />
            resume with ease
          </h1>
          <p className="mb-8 text-lg text-[var(--notion-warm-gray-500)]">
            A free, beautifully designed resume builder that helps you stand out.
            No sign-up required.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start sm:gap-0">
            <div className="inline-flex rounded-lg border border-[var(--notion-border)]">
              <ImportButton />
              <button
                onClick={handleStartFresh}
                className="notion-btn notion-btn-primary rounded-l-none"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
