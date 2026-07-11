import "globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { TopNavBar } from "components/TopNavBar";
import { ReduxProvider } from "components/ReduxProvider";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex",
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
    <html lang="en" className={`${ibmPlexSans.variable} dark`}>
      <body>
        <ReduxProvider>
          <TopNavBar />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
