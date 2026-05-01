import { useEffect, useRef } from "react";
import { SparkleIconButton } from "./SparkleIconButton";

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (text: string) => void;
  onRegenerate: () => void;
  streamingText: string;
  isLoading: boolean;
  error?: string;
}

export const AIPanel = ({
  isOpen,
  onClose,
  onAccept,
  onRegenerate,
  streamingText,
  isLoading,
  error,
}: AIPanelProps) => {
  const textAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }, [streamingText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ai-panel-overlay fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="ai-panel relative z-10 w-full max-w-md rounded-lg border border-[var(--notion-border)] bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--notion-border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-[var(--notion-blue)]"
            >
              <path
                fillRule="evenodd"
                d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-gray-900">AI Enhance</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          ref={textAreaRef}
          className="min-h-[120px] max-h-[200px] overflow-y-auto p-4 text-sm text-gray-700"
        >
          {isLoading && !streamingText && (
            <div className="flex items-center gap-2 text-gray-400">
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.216A8 8 0 0112 20v0C5.373 20 0 14.627 0 8h2zm2-5.216A8 8 0 0112 4v0c5.523 0 10 4.477 10 10h-2zm2 5.216a8 8 0 01-4 1.932v0c-2.514 0-4.728-.962-6.356-2.509l1.356 1.509A6 6 0 0112 16v0z"
                />
              </svg>
              <span>Generating...</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {streamingText && (
            <p className="whitespace-pre-wrap">
              {streamingText}
              {isLoading && <span className="ai-streaming-cursor">|</span>}
            </p>
          )}
          {!isLoading && !streamingText && !error && (
            <p className="text-gray-400 italic">
              Click Regenerate to generate AI suggestions
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--notion-border)] px-4 py-3">
          <button
            onClick={onClose}
            className="notion-btn notion-btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onRegenerate}
            className="notion-btn notion-btn-secondary"
            disabled={isLoading}
          >
            Regenerate
          </button>
          <button
            onClick={() => onAccept(streamingText)}
            className="notion-btn notion-btn-primary"
            disabled={isLoading || !streamingText}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};