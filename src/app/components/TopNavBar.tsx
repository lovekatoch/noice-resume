"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { ImportButton } from "components/ImportButton";
import { ReferralDashboard } from "components/ReferralDashboard";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";

function GiftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

export const TopNavBar = () => {
  const pathname = usePathname();
  const resume = useAppSelector(selectResume);
  const [showReferral, setShowReferral] = useState(false);

  const handleOpenReferral = useCallback(() => {
    setShowReferral(true);
  }, []);

  const handleCloseReferral = useCallback(() => {
    setShowReferral(false);
  }, []);

  if (pathname === "/") return null;

  const isEditor = pathname === "/resume-builder";

  return (
    <header
      aria-label="Site Header"
      className="border-b bg-[var(--surface)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center justify-between py-3 px-4 md:px-12 w-full"
        style={{ maxWidth: 1200 }}
      >
        <Link href="/" className="md:mx-0">
          <img
            src="/noiceresume-logo-white.svg"
            alt="NoiceResume"
            style={{ width: 180, height: "auto" }}
            className="block"
          />
        </Link>

        <nav className="flex items-center gap-3">
          {isEditor && (
            <>
              <button
                onClick={handleOpenReferral}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: "var(--canvas)", border: "1px solid var(--border)", color: "var(--accent)" }}
              >
                <GiftIcon />
                Refer
              </button>
              <div className="flex-shrink-0">
                <ImportButton compact />
              </div>
            </>
          )}
        </nav>
      </div>

      {showReferral && (
        <ReferralDashboard
          onClose={handleCloseReferral}
          profileName={resume.profile.name || undefined}
        />
      )}
    </header>
  );
};
