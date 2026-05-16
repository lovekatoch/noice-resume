import type { Metadata } from "next";

const SITE_URL = "https://noiceresume.pages.dev";

export const metadata: Metadata = {
  title: "Import Resume — Upload PDF to Edit | NoiceResume",
  description:
    "Upload your existing PDF resume and edit it with our free builder. Import your resume, update it with AI suggestions, and download a polished version — no sign-up needed.",
  openGraph: {
    title: "Import & Edit Your Resume — Free PDF Import | NoiceResume",
    description:
      "Upload your PDF resume, edit it with AI-powered suggestions, and download a professional update. Free, no sign-up.",
    url: `${SITE_URL}/resume-import`,
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
    title: "Import & Edit Your Resume — Free | NoiceResume",
    description:
      "Upload your PDF, edit with AI, download a polished resume. Free, no sign-up.",
    images: ["/og-default.svg"],
  },
  alternates: {
    canonical: `${SITE_URL}/resume-import`,
  },
};

export default function ResumeImportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
