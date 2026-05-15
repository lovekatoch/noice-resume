import "globals.css";
import { Inter, EB_Garamond } from "next/font/google";
import { TopNavBar } from "components/TopNavBar";
import { PostHogProvider } from "components/PostHogProvider";
import { PageViewTracker } from "components/PageViewTracker";
import { ReduxProvider } from "components/ReduxProvider";
import { SoundProvider } from "lib/sound/provider";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${ebGaramond.variable}`}>
      <body>
        <ReduxProvider>
          <PostHogProvider>
            <SoundProvider>
              <TopNavBar />
              {children}
              <PageViewTracker />
            </SoundProvider>
          </PostHogProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
