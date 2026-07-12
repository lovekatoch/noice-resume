"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImportButton } from "components/ImportButton";

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#lg)" strokeWidth="1.5" fill="rgba(139,92,246,0.08)" />
      <path d="M10 12h12M10 16h8M10 20h10" stroke="url(#lg)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="5" fill="url(#lg)" opacity="0.3" />
      <circle cx="24" cy="24" r="2" fill="url(#lg)" />
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const TopNavBar = () => {
  const pathname = usePathname();

  // Hide on landing page
  if (pathname === "/") return null;

  const isEditor = pathname === "/resume-builder";

  return (
    <header
      aria-label="Site Header"
      className="border-b"
      style={{
        backgroundColor: "rgba(18,18,26,0.9)",
        borderColor: "var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="flex items-center justify-between py-3 px-4 md:px-12 w-full"
        style={{ maxWidth: 1200 }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--fg)" }}>
            noiceresume
          </span>
        </Link>

        {isEditor && (
          <div className="flex-shrink-0">
            <ImportButton compact />
          </div>
        )}
      </div>
    </header>
  );
};
