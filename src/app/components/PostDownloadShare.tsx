"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { captureShareEvent } from "lib/analytics";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#5865F2", flexShrink: 0 }}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

interface PostDownloadShareProps {
  onClose: () => void;
  shareUrl?: string;
  shareId?: string;
  profileName?: string;
  headline?: string;
  onDownload?: () => void;
  downloadLabel?: string;
}

export function PostDownloadShare({
  onClose,
  shareUrl: propShareUrl,
  shareId,
  profileName,
  headline,
  onDownload,
  downloadLabel = "Download PDF",
}: PostDownloadShareProps) {
  const [copied, setCopied] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const shareUrl = propShareUrl || "https://noiceresume.pages.dev";
  const shareText = profileName
    ? headline
      ? `Check out ${profileName}'s resume (${headline}) -- built with NoiceResume`
      : `Check out ${profileName}'s resume -- built with NoiceResume`
    : headline
      ? `Check out this resume (${headline}) -- built with NoiceResume`
      : "Check out my resume -- built with NoiceResume";
  const shareTagline = "Free AI resume builder, no sign-up: noiceresume.pages.dev";
  const referralUrl = shareId
    ? `${shareUrl}?ref=${shareId}`
    : `${shareUrl}?ref=invite`;

  useEffect(() => {
    closeRef.current?.focus();
    const frame = requestAnimationFrame(() => setEntered(true));
    captureShareEvent("share_modal_viewed", {
      share_url: shareUrl,
      has_profile: !!profileName,
      has_headline: !!headline,
    });
    return () => cancelAnimationFrame(frame);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  }, [handleClose]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      captureShareEvent("share_link_copied", { share_url: shareUrl });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTweet = () => {
    captureShareEvent("share_clicked", { share_medium: "twitter" });
    const tweetText = encodeURIComponent(`${shareText}\n\n${shareTagline}\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank", "noopener,noreferrer");
  };

  const handleLinkedIn = () => {
    captureShareEvent("share_clicked", { share_medium: "linkedin" });
    const linkedInText = encodeURIComponent(`${shareText}\n\n${shareTagline}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${linkedInText}`, "_blank", "noopener,noreferrer");
  };

  const [discordCopied, setDiscordCopied] = useState(false);

  const handleReferralLink = () => {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setReferralCopied(true);
      captureShareEvent("share_link_copied", { share_url: referralUrl, is_referral: true });
      setTimeout(() => setReferralCopied(false), 2000);
    });
  };

  const handleDiscordShare = () => {
    const discordText = [
      `**${shareText}**`,
      `${shareUrl}`,
      "",
      `${shareTagline}`,
    ].join("\n");
    navigator.clipboard.writeText(discordText).then(() => {
      setDiscordCopied(true);
      captureShareEvent("share_clicked", { share_medium: "discord" });
      setTimeout(() => setDiscordCopied(false), 2000);
    });
  };

  const sharedBtnClasses = "share-btn flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full";
  const sharedBtnStyle: React.CSSProperties = {
    backgroundColor: "var(--canvas)",
    border: "1px solid var(--border)",
    color: "var(--fg)",
  };

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
        aria-label="Share your resume"
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
            className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 animate-success-ring"
            style={{
              width: 32,
              height: 32,
              backgroundColor: "rgba(39,166,68,0.12)",
              color: "var(--success)",
            }}
          >
            <CheckIcon />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
              Your resume is ready
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--body)" }}>
              Download and share with your network
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {onDownload && (
          <button
            onClick={onDownload}
            className="flex w-full items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] mb-5"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloadLabel}
          </button>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            Share
          </p>

          <button onClick={handleTweet} className={sharedBtnClasses} style={sharedBtnStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#000", flexShrink: 0 }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on X / Twitter
          </button>

          <button onClick={handleLinkedIn} className={sharedBtnClasses} style={sharedBtnStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#0A66C2", flexShrink: 0 }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Share on LinkedIn
          </button>

          <button onClick={handleDiscordShare} className={sharedBtnClasses} style={{
            ...sharedBtnStyle,
            color: discordCopied ? "var(--success)" : "var(--fg)",
          }}>
            {discordCopied ? <CheckIcon /> : <DiscordIcon />}
            {discordCopied ? "Copied for Discord!" : "Share on Discord"}
          </button>

          <button onClick={handleCopyLink} className={sharedBtnClasses} style={{
            ...sharedBtnStyle,
            color: copied ? "var(--success)" : "var(--fg)",
          }}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Link copied!" : "Copy link"}
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div style={{ borderTop: "1px solid var(--border)" }} className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)", backgroundColor: "var(--surface)" }}>
              Share the love
            </span>
          </div>
        </div>

        <button
          onClick={handleReferralLink}
          className="share-btn flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full"
          style={{
            backgroundColor: "var(--accent-light)",
            border: "1px solid transparent",
            color: referralCopied ? "var(--success)" : "var(--accent)",
          }}
        >
          {referralCopied ? <CheckIcon /> : <HeartIcon />}
          {referralCopied ? "Referral link copied!" : "Invite a friend — you'll both benefit"}
        </button>

        <div className="mt-4 pt-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-[11px]" style={{ color: "var(--muted)" }}>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>8,400+</span> resumes created this month
          </p>
        </div>
      </div>
    </div>
  );
}
