import { Metadata } from "next";
import { SITE_URL } from "lib/structured-data";
import { ResumeParserClient } from "./client";

export const metadata: Metadata = {
  title: "Resume Parser — AI Resume Analysis | NoiceResume",
  description:
    "Upload your resume to see how well it parses through ATS systems. Test your resume formatting, extract structured data, and optimize for applicant tracking systems.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Resume Parser — AI Resume Analysis | NoiceResume",
    description:
      "Upload your resume to see how well it parses through ATS systems. Test your resume formatting and optimize for applicant tracking systems.",
    type: "website",
    url: `${SITE_URL}/resume-parser`,
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "Resume Parser — AI Resume Analysis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Parser — AI Resume Analysis | NoiceResume",
    description:
      "Upload your resume to see how well it parses through ATS systems.",
    images: ["/og-default.svg"],
  },
  alternates: {
    canonical: `${SITE_URL}/resume-parser`,
  },
};

export default function ResumeParserPage() {
  return <ResumeParserClient />;
}
