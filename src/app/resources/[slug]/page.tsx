import { Metadata } from "next";
import { RESOURCES, getResourceBySlug, SITE_URL } from "lib/resource-data";
import { ResourcePageClient } from "./client";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const resource = getResourceBySlug(params.slug);
  if (!resource) return { title: "Not Found — NoiceResume" };

  return {
    title: resource.ogTitle,
    description: resource.ogDescription,
    keywords: resource.keywords.join(", "),
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: resource.ogTitle,
      description: resource.ogDescription,
      url: `${SITE_URL}/resources/${resource.slug}`,
      type: "article",
      images: [{ url: "/sample-resumes/resume-classic-1.png", width: 1200, height: 900, alt: resource.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: resource.ogTitle,
      description: resource.ogDescription,
      images: ["/sample-resumes/resume-classic-1.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/resources/${resource.slug}`,
    },
  };
}

export default function ResourcePage({ params }: PageProps) {
  const resource = getResourceBySlug(params.slug);

  return <ResourcePageClient resource={resource} />;
}
