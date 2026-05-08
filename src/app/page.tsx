import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { Features } from "home/Features";

export default function Home() {
  return (
    <main className="bg-[var(--bg)] text-[var(--fg)]">
      <Hero />
      <Steps />
      <Features />
      <footer className="border-t border-[var(--border)] px-6 py-8 text-center text-xs text-[var(--muted)]">
        Built with care by{" "}
        <a
          href="https://www.linkedin.com/in/lovekatoch"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--accent)] hover:underline"
        >
          Love Katoch
        </a>
      </footer>
    </main>
  );
}
