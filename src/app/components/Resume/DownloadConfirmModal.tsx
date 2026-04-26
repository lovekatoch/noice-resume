"use client";
import { useState } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface DownloadConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
}

/**
 * Notion-style download confirmation modal.
 * Shows before download starts to let user confirm or cancel.
 */
export const DownloadConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
}: DownloadConfirmModalProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsDownloading(true);
    onConfirm();
    // Give time for download to start before showing complete
    setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onClose();
        setIsDownloading(false);
        setIsComplete(false);
      }, 800);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {!isComplete ? (
          <>
            {/* Header */}
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

            {/* File info */}
            <div className="mb-5 rounded-md bg-[var(--notion-warm-white)] p-3">
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-500">PDF Document</p>
            </div>

            {/* Actions */}
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
                  "Download"
                )}
              </button>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="flex flex-col items-center py-4">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--notion-green)]/10">
              <CheckCircleIcon className="h-6 w-6 text-[var(--notion-green)]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Downloaded!</h3>
            <p className="text-sm text-gray-500">{fileName}</p>
          </div>
        )}
      </div>
    </div>
  );
};