export const SITE_URL = "https://noiceresume.pages.dev";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NoiceResume",
    url: SITE_URL,
    logo: `${SITE_URL}/noiceresume-logo.svg`,
    description:
      "Free, modern resume builder with AI-powered suggestions, ATS-optimized templates, and privacy-first approach. No sign-up required.",
    foundingDate: "2024",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NoiceResume",
    url: SITE_URL,
    description:
      "Create a professional resume in minutes. Free, no sign-up required, ATS-optimized templates, and AI-powered suggestions.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(title: string, description: string, datePublished: string, authorName = "NoiceResume") {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "NoiceResume",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/noiceresume-logo.svg`,
      },
    },
    datePublished,
    dateModified: datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": SITE_URL,
    },
  };
}

export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function productSchema(template: {
  name: string;
  description: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: template.name,
    description: template.description,
    image: `${SITE_URL}${template.image}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

export function collectionPageSchema(title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
  };
}

export function webPageSchema(title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
  };
}

export function howToSchema(steps: { name: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Write a Resume That Gets Interviews",
    description:
      "A step-by-step guide to building a resume that passes ATS scans, impresses hiring managers, and lands you the interview.",
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
    totalTime: "PT15M",
  };
}
