import { Metadata } from "next";
import { COMPARISONS, COMPARE_SITE_URL } from "lib/compare-data";
import { ComparePageClient } from "./client";

export const metadata: Metadata = {
  title: "NoiceResume vs Other Resume Builders — Honest Comparisons",
  description:
    "See how NoiceResume stacks up against Rezi, Teal, Novoresume, Zety, and other resume builders. Honest, detailed comparisons to help you choose.",
  metadataBase: new URL(COMPARE_SITE_URL),
  openGraph: {
    title: "NoiceResume vs Other Resume Builders — Honest Comparisons",
    description:
      "See how NoiceResume stacks up against Rezi, Teal, Novoresume, and more.",
    type: "website",
    url: `${COMPARE_SITE_URL}/compare`,
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "Resume Builder Comparisons" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoiceResume vs Other Resume Builders — Honest Comparisons",
    description:
      "See how NoiceResume stacks up against Rezi, Teal, Novoresume, and more.",
    images: ["/og-default.svg"],
  },
  alternates: {
    canonical: `${COMPARE_SITE_URL}/compare`,
  },
};

export default function ComparePage() {
  return <ComparePageClient comparisons={COMPARISONS} />;
}
