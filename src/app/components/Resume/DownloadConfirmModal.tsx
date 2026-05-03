"use client";
import { useState } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import type { ExportFormat } from "./index";

interface DownloadConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
}

export const DownloadConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  format,
  onFormatChange,
}: DownloadConfirmModalProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsDownloading(true);
    onConfirm();
    setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onClose();
        setIsDownloading(false);
        setIsComplete(false);
      }, 1000);
    }, 500);
  };

  const formatLabel = format === "docx" ? "Word Document" : "PDF Document";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-sm rounded-lg p-6 shadow-lg"
        style={{ backgroundColor: "var(--surface)", color: "var(--fg)" }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 transition-colors"
          style={{ color: "var(--muted)" }}
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {!isComplete ? (
          <>
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
              >
                <CheckCircleIcon className="h-5 w-5" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
                  Ready to Download
                </h3>
                <p style={{ color: "var(--muted)" }} className="text-sm">Confirm your resume file</p>
              </div>
            </div>

            <div className="mb-5 rounded-md p-3" style={{ backgroundColor: "var(--bg)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>{fileName}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{formatLabel}</p>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                Export Format
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onFormatChange("pdf")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: format === "pdf" ? "var(--accent)" : "var(--border)",
                    backgroundColor: format === "pdf" ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "transparent",
                    color: format === "pdf" ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  <DocumentIcon className="h-4 w-4" />
                  PDF
                </button>
                <button
                  onClick={() => onFormatChange("docx")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: format === "docx" ? "var(--accent)" : "var(--border)",
                    backgroundColor: format === "docx" ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "transparent",
                    color: format === "docx" ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  <DocumentIcon className="h-4 w-4" />
                  DOCX
                </button>
              </div>
            </div>

            <div className="mb-5 rounded-md p-3" style={{ backgroundColor: "var(--bg)" }}>
              <p className="mb-1 text-xs font-medium" style={{ color: "var(--muted)" }}>Share your resume</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Send the preview link to recruiters or share directly from the browser address bar.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--fg)",
                  border: "1px solid var(--border)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDownloading}
                className="flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent)",
                }}
              >
                {isDownloading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    Download
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, #22c55e 10%, transparent)" }}
            >
              <CheckCircleIcon className="h-6 w-6" style={{ color: "#22c55e" }} />
            </div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
              Downloaded Successfully!
            </h3>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{fileName}</p>
            <div className="mt-4 w-full space-y-2 rounded-md p-3" style={{ backgroundColor: "var(--bg)" }}>
              <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Next steps</p>
              <ul className="space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                <li>• Open in Word to edit further</li>
                <li>• Submit to job applications</li>
                <li>• Share the preview link with recruiters</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};