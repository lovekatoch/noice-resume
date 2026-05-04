import { useEffect, useState, useRef } from "react";

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (text: string) => void;
  onRegenerate: () => void;
  streamingText: string;
  isLoading: boolean;
  error?: string;
}

type Tone = "confident" | "casual" | "professional";

const TONES: { value: Tone; label: string }[] = [
  { value: "confident", label: "Confident" },
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
];

export const AIPanel = ({
  isOpen,
  onClose,
  onAccept,
  onRegenerate,
  streamingText,
  isLoading,
  error,
}: AIPanelProps) => {
  const [selectedTone, setSelectedTone] = useState<Tone>("casual");
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes cursor-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
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

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 transition-opacity duration-[350ms]"
        style={{
          backgroundColor: "rgba(0,0,0,0.45)",
          opacity: visible ? 1 : 0,
          backdropFilter: visible ? "blur(2px)" : "none",
        }}
        onClick={onClose}
      />
      <div
        className="absolute bottom-0 left-0 right-0 overflow-y-auto"
        style={{
          maxHeight: "80vh",
          backgroundColor: "var(--surface)",
          borderRadius: "16px 16px 0 0",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onTransitionEnd={() => {
          if (!visible) setMounted(false);
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div
            className="rounded-full"
            style={{ width: 36, height: 4, backgroundColor: "rgba(0,0,0,0.15)" }}
          />
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-base font-semibold inline-flex items-center gap-1.5" style={{ color: "var(--fg)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sparkle-animate" style={{ color: "var(--accent)" }}>
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
            </svg>
            Smart Suggestions
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
            style={{ color: "var(--muted)" }}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 px-5 pb-4">
          {TONES.map((tone) => {
            const active = selectedTone === tone.value;
            return (
              <button
                key={tone.value}
                onClick={() => setSelectedTone(tone.value)}
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  backgroundColor: active ? "var(--accent-light)" : "transparent",
                  color: active ? "var(--accent)" : "var(--muted)",
                  transition: "all 200ms",
                  transform: active ? "scale(1.02)" : "scale(1)",
                }}
              >
                {tone.label}
              </button>
            );
          })}
        </div>

        <div
          ref={textRef}
          className="px-5 pb-6 space-y-3 max-h-[50vh] overflow-y-auto"
        >
          {isLoading && !streamingText && (
            <div className="flex items-center justify-center gap-3 py-8" style={{ color: "var(--muted)" }}>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.216A8 8 0 0112 20v0C5.373 20 0 14.627 0 8h2zm2-5.216A8 8 0 0112 4v0c5.523 0 10 4.477 10 10h-2zm2 5.216a8 8 0 01-4 1.932v0c-2.514 0-4.728-.962-6.356-2.509l1.356 1.509A6 6 0 0112 16v0z" />
              </svg>
              <span className="text-sm">Enhancing...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {streamingText && (
            <div
              className="rounded-lg border p-3.5"
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--border)",
                animation: "fadeSlideUp 300ms ease-out",
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="rounded px-2 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--accent-light)",
                    color: "var(--accent)",
                  }}
                >
                  Strong
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  AI Suggestion
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm" style={{ color: "var(--fg)" }}>
                {streamingText}
                {isLoading && (
                  <span
                    className="ai-streaming-cursor"
                    style={{
                      display: "inline-block",
                      width: "2px",
                      height: "1em",
                      backgroundColor: "var(--accent)",
                      marginLeft: "2px",
                      animation: "cursor-blink 1s ease-in-out infinite",
                      verticalAlign: "text-bottom",
                    }}
                  />
                )}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onAccept(streamingText)}
                  className="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
                  style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                  disabled={isLoading}
                >
                  Apply
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--fg)",
                  }}
                  disabled={isLoading}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {!isLoading && !streamingText && !error && (
            <p className="py-8 text-center text-sm italic" style={{ color: "var(--muted)" }}>
              Click Regenerate to generate AI suggestions
            </p>
          )}
        </div>

        <div
          className="flex items-center justify-end gap-2 px-5 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button onClick={onClose} disabled={isLoading}
            className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--bg)", color: "var(--fg)", border: "1px solid var(--border)" }}>
            Cancel
          </button>
          <button onClick={onRegenerate} disabled={isLoading}
            className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--bg)", color: "var(--fg)", border: "1px solid var(--border)" }}>
            Regenerate
          </button>
          <button
            onClick={() => onAccept(streamingText)}
            disabled={isLoading || !streamingText}
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)" }}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
