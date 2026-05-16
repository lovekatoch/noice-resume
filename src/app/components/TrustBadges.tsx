"use client";

function ShieldCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function FileText() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function Lock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Zap() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const BADGES = [
  { icon: <ShieldCheck />, label: "No sign-up required" },
  { icon: <Lock />, label: "Your data stays on your device" },
  { icon: <FileText />, label: "ATS-friendly formatting" },
  { icon: <Zap />, label: "Free forever" },
];

export function TrustBadges() {
  return (
    <div className="px-6 py-4" style={{ backgroundColor: "var(--canvas)" }}>
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {BADGES.map((badge) => (
          <div
            key={badge.label}
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: "var(--muted-subtle)" }}
          >
            <span style={{ color: "var(--accent)" }}>{badge.icon}</span>
            {badge.label}
          </div>
        ))}
      </div>
    </div>
  );
}
