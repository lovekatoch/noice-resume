"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  getReferralLink,
  getShareCount,
  getConversionCount,
  recordShare,
  getMilestoneProgress,
  isIncentiveUnlocked,
  getReferredBy,
  SHARE_MILESTONE,
} from "lib/referral";

function GiftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export const ReferralDashboard = ({
  onClose,
  shareUrl: propShareUrl,
  profileName,
}: {
  onClose: () => void;
  shareUrl?: string;
  profileName?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const referralLink = propShareUrl
    ? `${propShareUrl}?ref=${getReferralLink().split("?ref=")[1] || ""}`
    : getReferralLink();
  const progress = getMilestoneProgress();
  const unlocked = progress.unlocked || isIncentiveUnlocked();
  const shares = getShareCount();
  const conversions = getConversionCount();
  const referredBy = getReferredBy();

  const shareText = profileName
    ? `Build your resume with NoiceResume -- the best free AI resume builder`
    : "Build your resume with NoiceResume -- the best free AI resume builder";

  useEffect(() => {
    closeRef.current?.focus();
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  });

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  }, [handleClose]);

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      recordShare();
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTweet = () => {
    recordShare();
    const tweetText = encodeURIComponent(`${shareText}\n\n${referralLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const percentComplete = Math.min((shares / SHARE_MILESTONE) * 100, 100);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${exiting ? "animate-share-exit" : ""}`}
      style={{
        backgroundColor: entered && !exiting ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background-color 0.25s ease-out",
      }}
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Referral program"
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
          opacity: entered && !exiting ? 1 : 0,
          transform: entered && !exiting ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-5">
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
            style={{ width: 32, height: 32, backgroundColor: "rgba(30,58,95,0.12)", color: "var(--accent)" }}
          >
            <GiftIcon />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
              Referral Program
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--body)" }}>
              Share with friends, unlock premium templates
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={handleClose}
            className="flex items-center justify-center rounded-full transition-colors duration-150 hover:bg-[var(--accent-light)] flex-shrink-0"
            style={{ width: 28, height: 28, color: "var(--muted)" }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {referredBy && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-4 text-xs"
            style={{ backgroundColor: "rgba(30,58,95,0.06)", color: "var(--body)" }}
          >
            <CheckCircleIcon />
            You were invited by a friend
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: "var(--canvas)", border: "1px solid var(--border)" }}
          >
            <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
              {shares}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
              Shares
            </p>
          </div>
          <div
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: "var(--canvas)", border: "1px solid var(--border)" }}
          >
            <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
              {conversions}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
              Conversions
            </p>
          </div>
        </div>

        {!unlocked && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
                Share {SHARE_MILESTONE} times to unlock premium templates
              </span>
              <span className="text-[11px] font-semibold" style={{ color: "var(--accent)" }}>
                {shares}/{SHARE_MILESTONE}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--border)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentComplete}%`,
                  backgroundColor: percentComplete >= 100 ? "var(--success, #27A644)" : "var(--accent)",
                }}
              />
            </div>
          </div>
        )}

        {unlocked && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-4 text-xs font-medium"
            style={{ backgroundColor: "rgba(39,166,68,0.1)", color: "var(--success, #27A644)" }}
          >
            <CheckCircleIcon />
            Premium templates unlocked
          </div>
        )}

        <div className="flex flex-col gap-2 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-wider mb-0.5" style={{ color: "var(--muted)" }}>
            Your referral link
          </p>
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs"
            style={{
              backgroundColor: "var(--canvas)",
              border: "1px solid var(--border)",
              color: "var(--body)",
              overflow: "hidden",
            }}
          >
            <span className="truncate flex-1 font-mono">{referralLink}</span>
            <button
              onClick={handleCopyLink}
              className="flex-shrink-0 p-1 rounded transition-colors hover:bg-[var(--accent-light)]"
              style={{ color: linkCopied ? "var(--success, #27A644)" : "var(--muted)" }}
              aria-label="Copy referral link"
            >
              {linkCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopyReferralLink}
            className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <ShareIcon />
            {copied ? "Link copied!" : "Share your link"}
          </button>

          <button
            onClick={handleTweet}
            className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
            style={{
              backgroundColor: "var(--canvas)",
              border: "1px solid var(--border)",
              color: "var(--fg)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#000", flexShrink: 0 }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on X / Twitter
          </button>
        </div>

        <div className="mt-4 pt-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-[11px]" style={{ color: "var(--muted)" }}>
            No sign-up required. Share your referral link with anyone.
          </p>
        </div>
      </div>
    </div>
  );
};
