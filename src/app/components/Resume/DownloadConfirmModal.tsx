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

      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {!isComplete ? (
          <>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--notion-blue)]/10">
                <CheckCircleIcon className="h-5 w-5 text-[var(--notion-blue)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ready to Download
                </h3>
                <p className="text-sm text-gray-500">Confirm your resume file</p>
              </div>
            </div>

            <div className="mb-5 rounded-md bg-[var(--notion-warm-white)] p-3">
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-500">{formatLabel}</p>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Export Format
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onFormatChange("pdf")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors ${
                    format === "pdf"
                      ? "border-[var(--notion-blue)] bg-[var(--notion-blue)]/5 text-[var(--notion-blue)]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <DocumentIcon className="h-4 w-4" />
                  PDF
                </button>
                <button
                  onClick={() => onFormatChange("docx")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors ${
                    format === "docx"
                      ? "border-[var(--notion-blue)] bg-[var(--notion-blue)]/5 text-[var(--notion-blue)]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <DocumentIcon className="h-4 w-4" />
                  DOCX
                </button>
              </div>
            </div>

            <div className="mb-5 rounded-md bg-gray-50 p-3">
              <p className="mb-1 text-xs font-medium text-gray-500">Share your resume</p>
              <p className="text-xs text-gray-400">
                Send the preview link to recruiters or share directly from the browser address bar.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="notion-btn notion-btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDownloading}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--notion-green)]/10">
              <CheckCircleIcon className="h-6 w-6 text-[var(--notion-green)]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Downloaded Successfully!
            </h3>
            <p className="mt-1 text-sm text-gray-500">{fileName}</p>
            <div className="mt-4 w-full space-y-2 rounded-md bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-500">Next steps</p>
              <ul className="space-y-1 text-xs text-gray-400">
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