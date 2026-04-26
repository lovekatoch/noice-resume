import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { Features } from "home/Features";

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-2xl bg-[var(--notion-warm-white)] text-[var(--notion-black)]">
      <Hero />
      <Steps />
      <Features />
    </main>
  );
}
