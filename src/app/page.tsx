import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { Features } from "home/Features";

export default function Home() {
  return (
    <main className="bg-[var(--bg)] text-[var(--fg)]">
      <Hero />
      <Steps />
      <Features />
    </main>
  );
}
