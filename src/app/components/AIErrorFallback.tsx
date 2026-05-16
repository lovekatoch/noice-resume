"use client";

import { useEffect } from "react";
import { capture } from "lib/analytics";

interface AIErrorFallbackProps {
  error: Error;
  reset: () => void;
  onDismiss?: () => void;
}

export function AIErrorFallback({ error, reset, onDismiss }: AIErrorFallbackProps) {
  useEffect(() => {
    capture("ai_error_fallback", {
      error_message: error.message,
      stack: error.stack,
    });
  }, [error]);
  const isNetworkError =
    error.message?.toLowerCase().includes("network") ||
    error.message?.toLowerCase().includes("fetch") ||
    error.message?.toLowerCase().includes("failed to fetch");

  const isRateLimit =
    error.message?.toLowerCase().includes("limit") ||
    error.message?.toLowerCase().includes("rate");

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        backgroundColor: "var(--canvas)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--accent-light)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            style={{ color: "var(--accent)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>
            AI Enhancement Unavailable
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
            {isNetworkError
              ? "Could not reach the AI service. Check your connection."
              : isRateLimit
                ? "Too many requests. Please wait a moment before trying again."
                : error.message || "Something went wrong with the AI enhancement."}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--surface-2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
