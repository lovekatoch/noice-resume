"use client";

import { useEffect, useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function AnimatedCount({ target }: { target: number }) {
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
      {count.toLocaleString()}{done ? "+" : ""}
    </span>
  );
}

export function SocialProofBar() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedBefore = localStorage.getItem("builder-social-proof-dismissed");
    if (!dismissedBefore) {
      const timer = setTimeout(() => setVisible(true), 1500);
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
      className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs transition-all duration-500 overflow-hidden border-b ${
        visible ? "opacity-100 max-h-10" : "opacity-0 max-h-0 py-0"
      }`}
      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span style={{ color: "var(--accent)" }}>
        <AnimatedCount target={1200} />
      </span>
      <span>downloaded this week</span>
      <button
        onClick={handleDismiss}
        className="ml-auto flex items-center justify-center rounded-full hover:opacity-70 transition-opacity flex-shrink-0"
        style={{ color: "var(--muted-subtle)" }}
        aria-label="Dismiss"
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
    </div>
  );
}
