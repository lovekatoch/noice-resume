import { Metadata } from "next";
import Link from "next/link";

export function generateStaticParams() {
  return [{ id: "preview" }];
}

export const metadata: Metadata = {
  title: "AI Roasted My Resume | NoiceResume",
  description:
    "See what AI thinks of your resume. Get roasted, get better. Free AI resume builder — no sign-up needed.",
  openGraph: {
    title: "AI Roasted This Resume on NoiceResume",
    description:
      "Get your own resume roasted by AI. Free resume builder, no sign-up required.",
    url: "https://noiceresume.pages.dev/roast/preview",
    type: "website",
    siteName: "NoiceResume",
    locale: "en_US",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "NoiceResume — Free AI Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Roasted This Resume on NoiceResume",
    description:
      "Get your own resume roasted by AI. Free resume builder, no sign-up required.",
    images: ["/og-default.svg"],
  },
  alternates: {
    canonical: "https://noiceresume.pages.dev/roast/preview",
  },
};

export default function RoastLandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: "#F5F5F7" }}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
        }}
      >
        {/* Logo header */}
        <div className="flex items-center justify-center pt-8 pb-4 gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="#1E3A5F">
            <rect x="4" y="4" width="24" height="24" rx="6" />
            <text x="16" y="21" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">N</text>
          </svg>
          <span className="text-lg font-semibold" style={{ color: "#1D1D1F" }}>NoiceResume</span>
        </div>

        {/* Roast card preview placeholder */}
        <div className="px-6 pb-4">
          <div
            className="rounded-xl p-6 text-center"
            style={{ backgroundColor: "#F5F5F7" }}
          >
            <div className="flex justify-center mb-4">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#1E3A5F" strokeWidth="4" strokeLinecap="round" strokeDasharray="213.6" strokeDashoffset="42.7" transform="rotate(-90 40 40)" />
                <text x="40" y="45" textAnchor="middle" fill="#1D1D1F" fontSize="28" fontFamily="Inter, sans-serif" fontWeight="700">?</text>
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2" style={{ color: "#1D1D1F" }}>
              Someone roasted their resume
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#4A4A52" }}>
              See what AI thinks of your resume. Get a personalized score, a hilarious roast, and actionable tips to improve.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-8">
          <Link
            href="/resume-builder"
            className="block w-full text-center py-3.5 rounded-xl text-base font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1E3A5F", color: "white" }}
          >
            Build your free resume →
          </Link>
          <p className="text-xs text-center mt-3" style={{ color: "#86868B" }}>
            No sign-up required · AI-powered · Free forever
          </p>
        </div>
      </div>
    </main>
  );
}
