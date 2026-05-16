import { Metadata } from "next";
import { ROLE_GUIDES, getRoleGuideBySlug, ROLE_GUIDE_SITE_URL } from "lib/role-guide-data";
import { RoleGuidePageClient } from "./client";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ROLE_GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = getRoleGuideBySlug(params.slug);
  if (!guide) return { title: "Not Found — NoiceResume" };

  return {
    title: guide.ogTitle,
    description: guide.ogDescription,
    keywords: guide.keywords.join(", "),
    metadataBase: new URL(ROLE_GUIDE_SITE_URL),
    openGraph: {
      title: guide.ogTitle,
      description: guide.ogDescription,
      url: `${ROLE_GUIDE_SITE_URL}/guides/role/${guide.slug}`,
      type: "article",
      images: [{ url: "/og-resources.svg", width: 1200, height: 630, alt: guide.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.ogTitle,
      description: guide.ogDescription,
      images: ["/og-resources.svg"],
    },
    alternates: {
      canonical: `${ROLE_GUIDE_SITE_URL}/guides/role/${guide.slug}`,
    },
  };
}

export default function RoleGuidePage({ params }: PageProps) {
  const guide = getRoleGuideBySlug(params.slug);

  return <RoleGuidePageClient guide={guide} />;
}
