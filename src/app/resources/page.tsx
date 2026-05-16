import { Metadata } from "next";
import { RESOURCES, SITE_URL } from "lib/resource-data";
import { ResourcesPageClient } from "./client";

export const metadata: Metadata = {
  title: "Resume Resources & Guides — NoiceResume",
  description:
    "Expert guides on resume writing, ATS optimization, and career advice. Learn how to write a resume that gets interviews.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Resume Resources & Guides — NoiceResume",
    description:
      "Expert guides on resume writing, ATS optimization, and career advice.",
    type: "website",
    url: `${SITE_URL}/resources`,
    images: [{ url: "/og-resources.svg", width: 1200, height: 630, alt: "Resume Resources & Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Resources & Guides — NoiceResume",
    description:
      "Expert guides on resume writing, ATS optimization, and career advice.",
    images: ["/og-resources.svg"],
  },
  alternates: {
    canonical: `${SITE_URL}/resources`,
  },
};

export default function ResourcesPage() {
  return <ResourcesPageClient resources={RESOURCES} />;
}
