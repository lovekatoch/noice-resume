"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectIsPremium } from "lib/redux/userSlice";
import { UpgradeModal } from "./UpgradeModal";

interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showBadge?: boolean;
  badgeText?: string;
}

export const PremiumGate = ({
  children,
  fallback,
  showBadge = false,
  badgeText = "Premium",
}: PremiumGateProps) => {
  const isPremium = useSelector(selectIsPremium);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <>
      {showBadge && (
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#5E6AD2] to-[#4a56b8] px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
          {badgeText}
        </span>
      )}
      {fallback ? (
        fallback
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#5E6AD2] to-[#4a56b8] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="mb-3 text-sm font-medium text-gray-900">
            AI Enhancement is a Premium Feature
          </p>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Upgrade to Premium
          </button>
        </div>
      )}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </>
  );
};
