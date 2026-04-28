import Image from "next/image";
import featureFreeSrc from "public/assets/feature-free.svg";
import featureUSSrc from "public/assets/feature-us.svg";
import featurePrivacySrc from "public/assets/feature-privacy.svg";
import featureOpenSourceSrc from "public/assets/feature-open-source.svg";
import { Link } from "components/documentation";

const FEATURES = [
  {
    src: featureFreeSrc,
    title: "Completely Free",
    text: "No hidden fees, no premium tiers. A professional resume builder that respects your wallet.",
  },
  {
    src: featureUSSrc,
    title: "Built for Global Job Market",
    text: "Built for the U.S. job market. Your resume will pass through Applicant Tracking Systems.",
  },
  {
    src: featurePrivacySrc,
    title: "Your Data Stays Local",
    text: "Nothing leaves your browser. Your resume, your privacy, completely under your control.",
  },
  {
    src: featureOpenSourceSrc,
    title: "Built on OpenResume",
    text: (
      <>
        Powered by{" "}
        <Link href="https://github.com/xitanggg/open-resume">
          OpenResume
        </Link>
        , an open-source project.
      </>
    ),
  },
];

export const Features = () => {
  return (
    <section className="bg-[var(--notion-white)] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2
          className="mb-12 text-center font-serif text-2xl font-semibold tracking-tight text-[var(--notion-black)]"
        >
          Why NoiceResume?
        </h2>
        <dl className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {FEATURES.map(({ src, title, text }) => (
            <div
              key={title}
              className="notion-card flex items-start gap-4 p-6"
            >
              <Image
                src={src}
                alt=""
                className="h-10 w-10 flex-shrink-0"
              />
              <div>
                <dt className="mb-1 font-semibold text-[var(--notion-black)]">
                  {title}
                </dt>
                <dd className="text-sm text-[var(--notion-warm-gray-500)]">
                  {text}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
