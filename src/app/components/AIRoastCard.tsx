"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import {
  captureRoastGenerated,
  captureRoastShared,
  captureRoastCardDownloaded,
} from "lib/analytics";
import { AIRoastShareCard } from "components/AIRoastShareCard";
import { toPng } from "html-to-image";

interface RoastCategory {
  name: string;
  score: number;
  tip: string;
}

interface RoastData {
  overallScore: number;
  summary: string;
  roast: string;
  categories: RoastCategory[];
  oneTip: string;
}

const ACCENT = "#1E3A5F";
const CANVAS = "#FFFFFF";
const INK = "#1D1D1F";
const INK_MUTED = "#4A4A52";
const INK_SUBTLE = "#86868B";

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 10;
  const strokeDashoffset = circumference * (1 - progress);
  const color = score >= 8 ? "#27A644" : score >= 5 ? "#E8A317" : "#DC2626";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="4"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={INK}
        fontSize={size * 0.28}
        fontFamily="Inter, sans-serif"
        fontWeight="700"
      >
        {score}
      </text>
    </svg>
  );
}

interface AIRoastCardProps {
  onClose: () => void;
}

export function AIRoastCard({ onClose }: AIRoastCardProps) {
  const resume = useAppSelector(selectResume);
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const generateRoast = async () => {
      try {
        const response = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume }),
        });
        if (!response.ok) throw new Error("Failed to generate roast");
        const data = await response.json();
        setRoastData(data);
        captureRoastGenerated({ overallScore: data.overallScore });
      } catch {
        setError("Couldn't generate your roast right now. Try again!");
      } finally {
        setLoading(false);
      }
    };
    generateRoast();
  }, [resume]);

  useEffect(() => {
    if (roastData) {
      const t = setTimeout(() => setCardReady(true), 300);
      return () => clearTimeout(t);
    }
  }, [roastData]);

  const handleDownloadCard = useCallback(async () => {
    if (!shareCardRef.current || !roastData) return;
    setDownloadLoading(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `ai-resume-roast-${roastData.overallScore}-10.png`;
      link.href = dataUrl;
      link.click();
      captureRoastCardDownloaded({ overallScore: roastData.overallScore });
    } catch {
      // fallback
    } finally {
      setDownloadLoading(false);
    }
  }, [roastData]);

  const shareUrl = `https://noiceresume.pages.dev/roast/generated`;
  const siteUrl = "https://noiceresume.pages.dev";

  const handleShareX = useCallback(() => {
    if (!roastData) return;
    const text = encodeURIComponent(
      `AI roasted my resume: "${roastData.summary}"\nScore: ${roastData.overallScore}/10\n\nBuilt with NoiceResume — free AI resume builder:`
    );
    captureRoastShared({ platform: "twitter", overallScore: roastData.overallScore });
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [roastData, shareUrl]);

  const handleShareLinkedIn = useCallback(() => {
    if (!roastData) return;
    const text = encodeURIComponent(
      `AI roasted my resume: "${roastData.summary}" (Score: ${roastData.overallScore}/10)\n\nBuilt with NoiceResume — free AI resume builder. No sign-up needed.`
    );
    captureRoastShared({ platform: "linkedin", overallScore: roastData.overallScore });
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [roastData, shareUrl]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(siteUrl).then(() => {
      setCopied(true);
      captureRoastShared({ platform: "copy", overallScore: roastData?.overallScore ?? 0 });
      setTimeout(() => setCopied(false), 2000);
    });
  }, [siteUrl, roastData]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        opacity: visible ? 1 : 0,
        transition: "opacity 350ms ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          backgroundColor: CANVAS,
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.96)",
          transition:
            "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <svg
              className="h-8 w-8 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              style={{ color: ACCENT }}
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.216A8 8 0 0112 20v0C5.373 20 0 14.627 0 8h2zm2-5.216A8 8 0 0112 4v0c5.523 0 10 4.477 10 10h-2zm2 5.216a8 8 0 01-4 1.932v0c-2.514 0-4.728-.962-6.356-2.509l1.356 1.509A6 6 0 0012 16v0z"
              />
            </svg>
            <p className="text-sm font-medium" style={{ color: INK_MUTED }}>
              AI is roasting your resume...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-12 px-6 gap-4">
            <div
              className="rounded-full p-3"
              style={{ backgroundColor: "rgba(220,38,38,0.1)" }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#DC2626"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-sm text-center" style={{ color: INK_MUTED }}>
              {error}
            </p>
            <button
              onClick={onClose}
              className="rounded-lg px-6 py-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: ACCENT, color: "white" }}
            >
              Close
            </button>
          </div>
        ) : (
          roastData && (
            <>
              {/* Header — Score + Summary */}
              <div className="pt-8 pb-4 px-6 flex flex-col items-center gap-3">
                <ScoreRing score={roastData.overallScore} size={88} />
                <p
                  className="text-lg font-semibold text-center leading-snug"
                  style={{ color: INK }}
                >
                  {roastData.summary}
                </p>
              </div>

              {/* Roast body */}
              <div className="px-6 pb-4">
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "#F5F5F7",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: INK_MUTED }}
                  >
                    {roastData.roast}
                  </p>
                </div>
              </div>

              {/* Category scores */}
              <div className="px-6 pb-4 grid grid-cols-2 gap-2">
                {roastData.categories.map((cat) => (
                  <div
                    key={cat.name}
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#F5F5F7" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-xs font-medium"
                        style={{ color: INK_SUBTLE }}
                      >
                        {cat.name}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{
                          color:
                            cat.score >= 8
                              ? "#27A644"
                              : cat.score >= 5
                              ? "#E8A317"
                              : "#DC2626",
                        }}
                      >
                        {cat.score}/10
                      </span>
                    </div>
                    <p
                      className="text-[11px] leading-tight"
                      style={{ color: INK_MUTED }}
                    >
                      {cat.tip}
                    </p>
                  </div>
                ))}
              </div>

              {/* One tip */}
              {roastData.oneTip && (
                <div className="px-6 pb-4">
                  <div
                    className="rounded-lg p-3 flex items-start gap-2"
                    style={{
                      backgroundColor: "rgba(30,58,95,0.06)",
                      border: "1px solid rgba(30,58,95,0.1)",
                    }}
                  >
                    <svg
                      className="h-4 w-4 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={ACCENT}
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <p className="text-xs leading-relaxed" style={{ color: INK_MUTED }}>
                      <span style={{ color: ACCENT }} className="font-semibold">
                        Tip:{" "}
                      </span>
                      {roastData.oneTip}
                    </p>
                  </div>
                </div>
              )}

              {/* Branding */}
              <div className="px-6 pb-3 flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 32 32" fill={ACCENT}>
                  <rect x="4" y="4" width="24" height="24" rx="6" />
                  <text
                    x="16"
                    y="21"
                    textAnchor="middle"
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    N
                  </text>
                </svg>
                <span className="text-xs font-medium" style={{ color: INK_SUBTLE }}>
                  Built with NoiceResume
                </span>
              </div>

              {/* Download card button */}
              <div className="px-6 pb-2">
                <button
                  onClick={handleDownloadCard}
                  disabled={downloadLoading}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
                  style={{
                    backgroundColor: ACCENT,
                    color: "white",
                    border: "none",
                  }}
                >
                  {downloadLoading ? (
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.216A8 8 0 0112 20v0C5.373 20 0 14.627 0 8h2zm2-5.216A8 8 0 0112 4v0c5.523 0 10 4.477 10 10h-2zm2 5.216a8 8 0 01-4 1.932v0c-2.514 0-4.728-.962-6.356-2.509l1.356 1.509A6 6 0 0012 16v0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  )}
                  {downloadLoading ? "Generating card..." : "Download as image"}
                </button>
              </div>

              {/* Share buttons */}
              <div className="px-6 pb-3 flex flex-col gap-2">
                <button
                  onClick={handleShareX}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: "#F5F5F7",
                    border: "1px solid rgba(0,0,0,0.06)",
                    color: INK,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </button>
                <button
                  onClick={handleShareLinkedIn}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: "#F5F5F7",
                    border: "1px solid rgba(0,0,0,0.06)",
                    color: INK,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Share on LinkedIn
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: "#F5F5F7",
                    border: "1px solid rgba(0,0,0,0.06)",
                    color: INK,
                  }}
                >
                  {copied ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#27A644"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  {copied ? "Link copied!" : "Copy link to builder"}
                </button>
              </div>

              {/* Build your own CTA */}
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT, color: "white" }}
              >
                Build your own free resume →
              </a>
            </>
          )
        )}
      </div>

      {/* Hidden share card for image generation */}
      {roastData && (
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: 1200,
            height: 630,
          }}
        >
          {cardReady && <AIRoastShareCard ref={shareCardRef} roastData={roastData} />}
        </div>
      )}
    </div>
  );
}
