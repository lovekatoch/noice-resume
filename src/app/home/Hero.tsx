"use client";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();

  return (
    <section className="bg-[var(--bg)] px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-[720px] text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-[var(--accent-light)] px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
          ✨ AI-Powered Resume Builder
        </div>
        <h1 className="mb-5 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--fg)]">
          Create a professional resume with ease
        </h1>
        <p className="mx-auto max-w-[540px] text-lg text-[var(--muted)]">
          A free, beautifully designed resume builder that helps you stand out. No sign-up required.
        </p>
      </div>
    </section>
  );
};
