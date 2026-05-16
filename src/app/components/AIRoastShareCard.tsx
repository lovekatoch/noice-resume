"use client";

import { forwardRef } from "react";

const ACCENT = "#1E3A5F";
const INK = "#1D1D1F";
const INK_MUTED = "#4A4A52";

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

function scoreColor(score: number): string {
  if (score >= 8) return "#27A644";
  if (score >= 5) return "#E8A317";
  return "#DC2626";
}

export const AIRoastShareCard = forwardRef<
  HTMLDivElement,
  { roastData: RoastData }
>(function AIRoastShareCard({ roastData }, ref) {
  return (
    <div
      ref={ref}
      style={{
        width: 1200,
        height: 630,
        background: "#FAFAF8",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(30,58,95,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(30,58,95,0.03) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, #1E3A5F, #2A5080, #1E3A5F)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "48px 64px",
          gap: 48,
        }}
      >
        {/* Left: Score */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: `conic-gradient(${scoreColor(roastData.overallScore)} ${roastData.overallScore * 10}%, rgba(0,0,0,0.06) ${roastData.overallScore * 10}%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: "#FAFAF8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  color: scoreColor(roastData.overallScore),
                  lineHeight: 1,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {roastData.overallScore}
              </span>
              <span
                style={{
                  fontSize: 18,
                  color: INK_MUTED,
                  fontWeight: 500,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                / 10
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quote + Branding */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.3,
              color: INK,
              fontWeight: 500,
              fontFamily:
                "'EB Garamond', 'Times New Roman', serif",
              fontStyle: "italic",
            }}
          >
            &ldquo;{roastData.summary}&rdquo;
          </div>

          <div
            style={{
              fontSize: 16,
              lineHeight: 1.5,
              color: INK_MUTED,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {roastData.roast}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 64px 24px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill={ACCENT}>
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
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: ACCENT,
              fontFamily: "'EB Garamond', serif",
              letterSpacing: "0.3px",
            }}
          >
            Built with NoiceResume
          </span>
        </div>
        <span
          style={{
            fontSize: 14,
            color: "#86868B",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
          }}
        >
          noiceresume.pages.dev
        </span>
      </div>
    </div>
  );
});
