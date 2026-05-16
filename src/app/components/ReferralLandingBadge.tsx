"use client";

import { useState, useEffect } from "react";
import { getReferredBy } from "lib/referral";

export const ReferralLandingBadge = () => {
  const [visible, setVisible] = useState(true);
  const [referredBy, setReferredBy] = useState<string | null>(null);

  useEffect(() => {
    setReferredBy(getReferredBy());
  }, []);

  if (!referredBy || !visible) return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium animate-fade-in"
      style={{
        backgroundColor: "rgba(30,58,95,0.06)",
        color: "var(--body)",
        border: "1px solid var(--border)",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <span>Invited by a friend</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-0.5 p-0.5 rounded-full hover:opacity-60 transition-opacity"
        style={{ color: "var(--muted-subtle)" }}
        aria-label="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};
