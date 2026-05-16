import { Metadata } from "next";
import { ROLE_GUIDES, ROLE_GUIDE_SITE_URL } from "lib/role-guide-data";
import { RoleGuidesPageClient } from "./client";

export const metadata: Metadata = {
  title: "Role-Specific Resume Guides — NoiceResume",
  description:
    "Expert resume guides tailored to your profession. Software engineer, product manager, data scientist, marketer, designer, and more.",
  metadataBase: new URL(ROLE_GUIDE_SITE_URL),
  openGraph: {
    title: "Role-Specific Resume Guides — NoiceResume",
    description:
      "Expert resume guides tailored to your profession. Software engineer, product manager, data scientist, and more.",
    type: "website",
    url: `${ROLE_GUIDE_SITE_URL}/guides/role`,
    images: [{ url: "/sample-resumes/resume-classic-1.png", width: 1200, height: 900, alt: "Role-Specific Resume Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Role-Specific Resume Guides — NoiceResume",
    description:
      "Expert resume guides tailored to your profession.",
    images: ["/sample-resumes/resume-classic-1.png"],
  },
  alternates: {
    canonical: `${ROLE_GUIDE_SITE_URL}/guides/role`,
  },
};

export default function RoleGuidesPage() {
  return <RoleGuidesPageClient guides={ROLE_GUIDES} />;
}
