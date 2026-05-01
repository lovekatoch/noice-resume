export const metadata = {
  title: "NoiceResume Blog - Resume Tips & Free Resources",
  description:
    "Expert advice on building professional resumes, ATS optimization, and job search tips. Free resources from the NoiceResume team.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
