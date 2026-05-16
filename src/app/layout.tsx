import "globals.css";
import { Inter, EB_Garamond } from "next/font/google";
import { TopNavBar } from "components/TopNavBar";
import { PageViewTracker } from "components/PageViewTracker";
import { CheckoutAnalyticsTracker } from "components/CheckoutAnalyticsTracker";
import { ReduxProvider } from "components/ReduxProvider";
import { SoundProvider } from "lib/sound/provider";
import JsonLd from "components/JsonLd";
import { organizationSchema, websiteSchema } from "lib/structured-data";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-garamond",
});

export const metadata = {
  title: "NoiceResume - Free Resume Builder",
  description:
    "NoiceResume is a free, modern resume builder that allows anyone to create a professional resume with ease.",
  icons: {
    icon: "/noiceresume-icon.svg",
  },
  metadataBase: new URL("https://noiceresume.pages.dev"),
  openGraph: {
    title: "NoiceResume - Free AI Resume Builder",
    description:
      "Create a professional resume in minutes with NoiceResume. Free, no sign-up required, ATS-optimized templates, and AI-powered suggestions.",
    url: "https://noiceresume.pages.dev",
    type: "website",
    siteName: "NoiceResume",
    locale: "en_US",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "NoiceResume - Free AI Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoiceResume - Free AI Resume Builder",
    description:
      "Create a professional resume in minutes. Free, no sign-up, ATS-optimized templates with AI-powered suggestions.",
    images: ["/og-default.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://noiceresume.pages.dev",
  },
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/svg+xml",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${ebGaramond.variable}`}>
      <body>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <ReduxProvider>
          <SoundProvider>
            <TopNavBar />
            {children}
            <PageViewTracker />
            <CheckoutAnalyticsTracker />
          </SoundProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
