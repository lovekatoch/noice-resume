"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  DocumentIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { useSound } from "lib/sound/provider";
import { captureReferralToken, notifyReferralCompleted } from "lib/referral";
import { captureDownload, captureShareUrlGenerated, captureShareEvent } from "lib/analytics";
import { PostDownloadShare } from "components/PostDownloadShare";
import { ReferralDashboard } from "components/ReferralDashboard";
import type { Resume } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";
import type { ExportFormat } from "lib/export-formats";
import {
  generateTxtBlob,
  generateJsonBlob,
  generateDocxBlob,
  EXPORT_OPTIONS,
} from "lib/export-formats";

interface ExportButtonProps {
  pdfUrl: string | null | undefined;
  baseFileName: string;
  resume: Resume;
  settings: Settings;
  template: string;
  onMilestone?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FORMAT_ICONS: Record<ExportFormat, React.ComponentType<any>> = {
  pdf: ArrowDownTrayIcon,
  docx: DocumentTextIcon,
  txt: DocumentIcon,
  json: CodeBracketIcon,
};

const SHARE_WORKER_URL = process.env.NEXT_PUBLIC_RESUME_SHARE_WORKER_URL || "";

export const ExportButton = ({
  pdfUrl,
  baseFileName,
  resume,
  settings,
  template,
  onMilestone,
}: ExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReferralDashboard, setShowReferralDashboard] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const shareIdRef = useRef<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingFormatRef = useRef<ExportFormat | null>(null);
  const { play } = useSound();

  const createShareLink = useCallback(async () => {
    if (!SHARE_WORKER_URL) {
      setShareUrl("https://noiceresume.pages.dev");
      return;
    }
    try {
      const payload = {
        resume: {
          profile: resume.profile,
          workExperiences: resume.workExperiences,
          educations: resume.educations,
          projects: resume.projects,
          skills: resume.skills,
          custom: resume.custom,
        },
        settings: {
          themeColor: settings.themeColor,
          fontFamily: settings.fontFamily,
          fontSize: settings.fontSize,
          documentSize: settings.documentSize,
          template: settings.template,
        },
      };
      const resp = await fetch(`${SHARE_WORKER_URL}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        const data = await resp.json();
        const url = `${SHARE_WORKER_URL}/${data.id}`;
        setShareUrl(url);
        setShareId(data.id);
        shareIdRef.current = data.id;
        captureShareUrlGenerated({ url });
        captureShareEvent("share_link_created", { share_id: data.id });
      } else {
        setShareUrl("https://noiceresume.pages.dev");
      }
    } catch {
      setShareUrl("https://noiceresume.pages.dev");
    }
  }, [resume, settings]);

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

  useEffect(() => {
    if (isOpen) {
      const firstItem = dropdownRef.current?.querySelector<HTMLButtonElement>(
        "[data-export-item]"
      );
      firstItem?.focus();
    }
  }, [isOpen]);

  const doDownload = useCallback(
    async (format: ExportFormat) => {
      try {
        if (format === "pdf") {
          if (pdfUrl) {
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = `${baseFileName}.pdf`;
            link.click();
          }
        } else {
          let blob: Blob;
          const fileName = `${baseFileName}${EXPORT_OPTIONS.find((o) => o.format === format)!.extension}`;

          switch (format) {
            case "docx":
              blob = await generateDocxBlob(resume);
              break;
            case "txt":
              blob = generateTxtBlob(resume);
              break;
            case "json":
              blob = generateJsonBlob(resume, settings);
              break;
            default:
              return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(url);
        }

        captureDownload({ template, fileName: baseFileName, fileType: format });
        captureShareEvent("share_flow_downloaded", { share_id: shareIdRef.current, download_after_share: true });
        const refToken = captureReferralToken();
        if (refToken) {
          void notifyReferralCompleted(refToken);
        }
        void play("hero.complete");
        onMilestone?.();
      } catch (err) {
        console.error(`Export failed for ${format}:`, err);
      }
    },
    [pdfUrl, baseFileName, resume, settings, template, play, onMilestone]
  );

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setIsExporting(format);
      setIsOpen(false);
      pendingFormatRef.current = format;
      void createShareLink().then(() => setShowShareModal(true));
    },
    [createShareLink]
  );

  const handleShareDownload = useCallback(() => {
    setShowShareModal(false);
    if (pendingFormatRef.current) {
      void doDownload(pendingFormatRef.current);
      pendingFormatRef.current = null;
    }
  }, [doDownload]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    },
    [isOpen]
  );

  return (
    <div className="contents">
      {showShareModal && (
        <PostDownloadShare
          onClose={() => setShowShareModal(false)}
          shareUrl={shareUrl || undefined}
          shareId={shareIdRef.current || undefined}
          profileName={resume.profile.name || undefined}
          headline={resume.workExperiences?.[0]?.jobTitle || undefined}
          onDownload={handleShareDownload}
          downloadLabel="Download resume"
          onReferralDashboard={() => setShowReferralDashboard(true)}
        />
      )}
      {showReferralDashboard && (
        <ReferralDashboard
          onClose={() => setShowReferralDashboard(false)}
          shareUrl={shareUrl || undefined}
          profileName={resume.profile.name || undefined}
        />
      )}
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <div className="flex">
        <button
          onClick={() => handleExport("pdf")}
          disabled={isExporting !== null}
          className="flex items-center gap-2 rounded-l-md px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "var(--accent)" }}
          aria-label="Download as PDF"
        >
          {isExporting === "pdf" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <ArrowDownTrayIcon className="h-4 w-4" />
          )}
          Download
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isExporting !== null}
          className="flex items-center rounded-r-md px-2 transition-all hover:opacity-90 disabled:opacity-60"
          style={{
            backgroundColor: "var(--accent)",
            borderLeft: "1px solid rgba(255,255,255,0.15)",
          }}
          aria-label="More export options"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <ChevronDownIcon
            className={`h-3.5 w-3.5 text-white transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label="Export format options"
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[220px] overflow-hidden rounded-lg border shadow-lg"
          style={{
            backgroundColor: "var(--surface-2)",
            borderColor: "var(--border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {EXPORT_OPTIONS.map((option, idx) => {
            const Icon = FORMAT_ICONS[option.format];
            return (
              <button
                key={option.format}
                data-export-item
                role="option"
                aria-selected={option.format === "pdf"}
                onClick={() => handleExport(option.format)}
                disabled={isExporting !== null}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  idx === 0
                    ? "rounded-t-lg"
                    : idx === EXPORT_OPTIONS.length - 1
                      ? "rounded-b-lg"
                      : ""
                }`}
                style={{ color: "var(--fg)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--accent-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--muted-subtle)" }} />
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs" style={{ color: "var(--muted-subtle)" }}>
                    {option.description}
                  </span>
                </div>
                <span
                  className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                  style={{
                    backgroundColor: "var(--border)",
                    color: "var(--muted-subtle)",
                  }}
                >
                  {option.extension}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
    </div>
  );
};
