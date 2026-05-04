import "globals.css";
import { Inter } from "next/font/google";
import { TopNavBar } from "components/TopNavBar";
import { PostHogProvider } from "components/PostHogProvider";
import { PageViewTracker } from "components/PageViewTracker";
import { ReduxProvider } from "components/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body>
        <ReduxProvider>
          <PostHogProvider>
            <TopNavBar />
            {children}
            <PageViewTracker />
          </PostHogProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
