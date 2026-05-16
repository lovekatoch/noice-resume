"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { captureShareEvent } from "lib/analytics";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface PostDownloadShareProps {
  onClose: () => void;
  shareUrl?: string;
  profileName?: string;
  onDownload?: () => void;
  downloadLabel?: string;
}

export function PostDownloadShare({
  onClose,
  shareUrl: propShareUrl,
  profileName,
  onDownload,
  downloadLabel = "Download PDF",
}: PostDownloadShareProps) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const shareUrl = propShareUrl || "https://noiceresume.pages.dev";
  const namePart = profileName ? ` ${profileName}'s` : " my";
  const shareText = `Check out${namePart} resume built with NoiceResume — free AI resume builder, no sign-up needed:`;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    closeRef.current?.focus();
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false);
        setTimeout(onClose, 200);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      captureShareEvent("share_link_copied", { share_url: shareUrl });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTweet = () => {
    captureShareEvent("share_clicked", { share_medium: "twitter" });
    const tweetText = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank", "noopener,noreferrer");
  };

  const handleLinkedIn = () => {
    captureShareEvent("share_clicked", { share_medium: "linkedin" });
    const linkedInText = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${linkedInText}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)" }}
      onClick={handleBackdropClick}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Share your resume"
        className="w-full max-w-sm rounded-xl p-6 transition-all duration-200 ease"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          transform: visible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
          opacity: visible ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
            Your resume is ready
          </h3>
          <button
            ref={closeRef}
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 200);
            }}
            className="flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ width: 28, height: 28, color: "var(--muted)" }}
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>

        {onDownload && (
          <button
            onClick={onDownload}
            className="flex w-full items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] mb-3"
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

        <p className="text-xs mb-3 leading-relaxed text-center" style={{ color: "var(--body)" }}>
          Share with your network — it helps NoiceResume grow
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleTweet}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: "var(--canvas)", border: "1px solid var(--border)", color: "var(--fg)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#000" }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on X / Twitter
          </button>

          <button
            onClick={handleLinkedIn}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: "var(--canvas)", border: "1px solid var(--border)", color: "var(--fg)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#0A66C2" }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Share on LinkedIn
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: "var(--canvas)", border: "1px solid var(--border)", color: copied ? "var(--success)" : "var(--fg)" }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Link copied!" : "Copy link"}
          </button>
        </div>

        <p className="text-xs mt-4 text-center" style={{ color: "var(--muted)" }}>
          NoiceResume — free AI resume builder
        </p>
      </div>
    </div>
  );
}
