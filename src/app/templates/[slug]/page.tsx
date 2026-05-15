import { Metadata } from "next";
import { ALL_TEMPLATES, getTemplateBySlug, SITE_URL } from "lib/template-data";
import { TemplatePageClient } from "./client";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const template = getTemplateBySlug(params.slug);
  if (!template) return { title: "Template Not Found — NoiceResume" };

  return {
    title: template.ogTitle,
    description: template.ogDescription,
    keywords: template.keywords.join(", "),
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: template.ogTitle,
      description: template.ogDescription,
      url: `${SITE_URL}/templates/${template.slug}`,
      type: "website",
      images: [{ url: template.sampleResumeImage, width: 1200, height: 900, alt: template.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: template.ogTitle,
      description: template.ogDescription,
      images: [template.sampleResumeImage],
    },
    alternates: {
      canonical: `${SITE_URL}/templates/${template.slug}`,
    },
  };
}

export default function TemplatePage({ params }: PageProps) {
  const template = getTemplateBySlug(params.slug);

  return <TemplatePageClient template={template} />;
}
