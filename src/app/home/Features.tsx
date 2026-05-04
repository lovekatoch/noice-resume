import Image from "next/image";
import featureFreeSrc from "public/assets/feature-free.svg";
import featureUSSrc from "public/assets/feature-us.svg";
import featurePrivacySrc from "public/assets/feature-privacy.svg";
import featureOpenSourceSrc from "public/assets/feature-open-source.svg";
import { Link } from "components/documentation";

const FEATURES = [
  {
    src: featureFreeSrc,
    title: "Completely Free",
    text: "No hidden fees, no premium tiers. A professional resume builder that respects your wallet.",
  },
  {
    src: featureUSSrc,
    title: "Built for Global Job Market",
    text: "Built for the U.S. job market. Your resume will pass through Applicant Tracking Systems.",
  },
  {
    src: featurePrivacySrc,
    title: "Your Data Stays Local",
    text: "Nothing leaves your browser. Your resume, your privacy, completely under your control.",
  },
  {
    src: featureOpenSourceSrc,
    title: "Built on OpenResume",
    text: (
      <>
        Powered by{" "}
        <Link href="https://github.com/xitanggg/open-resume">
          OpenResume
        </Link>
        , an open-source project.
      </>
    ),
  },
];

export const Features = () => {
  return (
    <>
      {/* Benefits Section */}
      <section className="bg-[var(--bg)] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[1px] text-[var(--accent)]">
            Why NoiceResume
          </p>
          <h2 className="mb-2 text-center font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Get hired, not filtered out
          </h2>
          <p className="mb-10 text-center text-base text-[var(--muted)]">
            Stop sending resumes that vanish into ATS black holes. Here&apos;s what changes.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)]">
                <svg className="h-5 w-5 text-[var(--accent)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="10" cy="10" r="8" />
                  <path d="M7 10l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-[var(--fg)]">ATS-Optimized Automatically</h3>
                <p className="text-sm text-[var(--muted)]">Every resume is scored and tuned to pass through applicant tracking systems.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)]">
                <svg className="h-5 w-5 text-[var(--accent)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M10 2v16M2 10h16" />
                  <circle cx="10" cy="10" r="4" />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-[var(--fg)]">Apply in Under 60 Seconds</h3>
                <p className="text-sm text-[var(--muted)]">One-click import. One-click apply. Spend time preparing, not formatting.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)]">
                <svg className="h-5 w-5 text-[var(--accent)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 6l7-4 7 4v8l-7 4-7-4V6z" />
                  <path d="M10 2v16M3 10l7 4 7-4" />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-[var(--fg)]">AI That Knows What Recruiters Want</h3>
                <p className="text-sm text-[var(--muted)]">Our models are trained on real hiring data — not generic advice.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)]">
                <svg className="h-5 w-5 text-[var(--accent)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="16" height="12" rx="2" />
                  <path d="M6 8h8M6 12h5" />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-[var(--fg)]">Your History, Perfectly Presented</h3>
                <p className="text-sm text-[var(--muted)]">We translate your experience into accomplishments that recruiters actually care about.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[var(--surface)] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[1px] text-[var(--accent)]">
            Built for professionals
          </p>
          <h2 className="mb-2 text-center font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Everything you need to win
          </h2>
          <p className="mb-10 text-center text-base text-[var(--muted)]">
            Practical features, not feature sprawl.
          </p>
          <dl className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {FEATURES.map(({ src, title, text }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)]">
                  <Image src={src} alt="" className="h-6 w-6" />
                </div>
                <div>
                  <dt className="mb-1 font-semibold text-[var(--fg)]">
                    {title}
                  </dt>
                  <dd className="text-sm text-[var(--muted)]">{text}</dd>
                </div>
              </div>
            ))}
          </dl>
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
