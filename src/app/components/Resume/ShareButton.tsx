"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  LinkIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { saveShare, SHARE_WORKER_URL } from "lib/share";
import type { Resume } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";

interface ShareButtonProps {
  resume: Resume;
  settings: Settings;
}

export const ShareButton = ({ resume, settings }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const handleShare = useCallback(async () => {
    if (shareUrl) {
      setIsOpen(true);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { id } = await saveShare({ resume, settings });
      const url = `${SHARE_WORKER_URL}/${id}`;
      setShareUrl(url);
      setIsOpen(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create share link"
      );
      setIsOpen(true);
    } finally {
      setIsSaving(false);
    }
  }, [resume, settings, shareUrl]);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = containerRef.current?.querySelector("input");
      input?.select();
    }
  }, [shareUrl]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" && !isOpen) {
        e.preventDefault();
        handleShare();
      }
    },
    [isOpen, handleShare]
  );

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        onClick={handleShare}
        disabled={isSaving}
        className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: "var(--accent)" }}
        aria-label="Create share link"
      >
        {isSaving ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <LinkIcon className="h-4 w-4" />
        )}
        Share
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Share resume"
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[340px] overflow-hidden rounded-lg border shadow-lg"
          style={{
            backgroundColor: "var(--surface-2)",
            borderColor: "var(--border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
              Share Resume
            </span>
            <button
              onClick={handleClose}
              className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[var(--border)]"
              aria-label="Close"
            >
              <XMarkIcon className="h-4 w-4" style={{ color: "var(--muted)" }} />
            </button>
          </div>

          <div className="p-4">
            {error ? (
              <div
                className="rounded-md p-3 text-sm"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                }}
              >
                {error}
              </div>
            ) : shareUrl ? (
              <>
                <p
                  className="mb-2 text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--muted-subtle)" }}
                >
                  Share this link
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 rounded-md border px-3 py-2 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                      color: "var(--fg)",
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all hover:opacity-90"
                    style={{
                      backgroundColor: copied
                        ? "rgba(34,197,94,0.15)"
                        : "var(--accent)",
                      color: copied ? "#22c55e" : "#fff",
                    }}
                    aria-label={copied ? "Copied" : "Copy link"}
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p
                  className="mt-2 text-xs"
                  style={{ color: "var(--muted-subtle)" }}
                >
                  Anyone with this link can view your resume
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center py-4">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
