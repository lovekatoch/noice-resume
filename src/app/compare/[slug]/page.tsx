import { Metadata } from "next";
import { COMPARISONS, getComparisonBySlug, COMPARE_SITE_URL } from "lib/compare-data";
import { ComparisonPageClient } from "./client";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const comparison = getComparisonBySlug(params.slug);
  if (!comparison) return { title: "Not Found — NoiceResume" };

  return {
    title: comparison.ogTitle,
    description: comparison.ogDescription,
    keywords: comparison.keywords.join(", "),
    metadataBase: new URL(COMPARE_SITE_URL),
    openGraph: {
      title: comparison.ogTitle,
      description: comparison.ogDescription,
      url: `${COMPARE_SITE_URL}/compare/${comparison.slug}`,
      type: "article",
      images: [{ url: "/sample-resumes/resume-classic-1.png", width: 1200, height: 900, alt: comparison.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.ogTitle,
      description: comparison.ogDescription,
      images: ["/sample-resumes/resume-classic-1.png"],
    },
    alternates: {
      canonical: `${COMPARE_SITE_URL}/compare/${comparison.slug}`,
    },
  };
}

export default function ComparisonPage({ params }: PageProps) {
  const comparison = getComparisonBySlug(params.slug);

  return <ComparisonPageClient comparison={comparison} />;
}
