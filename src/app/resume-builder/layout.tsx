import type { Metadata } from "next";

const SITE_URL = "https://noiceresume.pages.dev";

export const metadata: Metadata = {
  title: "Resume Builder — Create Professional Resumes Free | NoiceResume",
  description:
    "Build a professional, ATS-optimized resume in minutes. Choose from modern templates, import your existing PDF, and get AI-powered suggestions — no sign-up required.",
  openGraph: {
    title: "Free Resume Builder — No Sign-Up | NoiceResume",
    description:
      "Create a professional resume with ATS-optimized templates, PDF import, and AI-powered suggestions. Free forever.",
    url: `${SITE_URL}/resume-builder`,
    type: "website",
    siteName: "NoiceResume",
    locale: "en_US",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "NoiceResume — Free Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Builder — No Sign-Up | NoiceResume",
    description:
      "Create a professional resume with ATS-optimized templates, PDF import, and AI-powered suggestions.",
    images: ["/og-default.svg"],
  },
  alternates: {
    canonical: `${SITE_URL}/resume-builder`,
  },
};

export default function ResumeBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
