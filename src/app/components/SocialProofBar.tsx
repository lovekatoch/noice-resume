"use client";

import { useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function AnimatedCount({ target, suffix }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      setCount(current);
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target]);

  return (
    <span className="font-semibold tabular-nums">
      {count.toLocaleString()}{done ? "+" : ""}{suffix || ""}
    </span>
  );
}

export function SocialProofBar() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedBefore = localStorage.getItem("builder-social-proof-dismissed");
    if (!dismissedBefore) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("builder-social-proof-dismissed", "true");
    setTimeout(() => setDismissed(true), 300);
  };

  if (dismissed) return null;

  return (
    <div
      className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs transition-all duration-500 overflow-hidden ${
        visible ? "opacity-100 max-h-10" : "opacity-0 max-h-0 py-0"
      }`}
      style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
    >
      <AnimatedCount target={8400} />
      <span>resumes created this month</span>
      <span className="hidden sm:inline">&middot; join them</span>
      <button
        onClick={handleDismiss}
        className="ml-2 flex items-center justify-center rounded-full hover:opacity-70 transition-opacity flex-shrink-0"
        aria-label="Dismiss"
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
    </div>
  );
}
