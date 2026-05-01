import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { PostHogProvider } from "components/PostHogProvider";
import { PageViewTracker } from "components/PageViewTracker";
import { ReduxProvider } from "components/ReduxProvider";

export const metadata = {
  title: "NoiceResume - Free Resume Builder",
  description:
    "NoiceResume is a free, modern resume builder that allows anyone to create a professional resume with ease.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230075de'/><text x='16' y='22' font-family='Inter,sans-serif' font-size='14' font-weight='700' fill='white' text-anchor='middle'>NR</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
