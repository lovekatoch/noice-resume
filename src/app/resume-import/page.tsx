"use client";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { ResumeDropzone } from "components/ResumeDropzone";
import { useState, useEffect } from "react";
import Link from "next/link";
import { captureImportEvent } from "lib/analytics";
import StructuredData from "components/StructuredData";
import { breadcrumbSchema, SITE_URL } from "lib/structured-data";

export default function ImportResume() {
  const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false);
  const [hasAddedResume, setHasAddedResume] = useState(false);
  const onFileUrlChange = (fileUrl: string) => {
    if (fileUrl) {
      captureImportEvent("resume_uploaded", {});
    }
    setHasAddedResume(Boolean(fileUrl));
  };

  useEffect(() => {
    setHasUsedAppBefore(getHasUsedAppBefore());
  }, []);

  return (
    <main>
      <StructuredData
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Import Resume", url: `${SITE_URL}/resume-import` },
          ]),
        ]}
      />
      <div className="mx-auto mt-14 max-w-3xl rounded-lg border border-[var(--notion-border)] px-10 py-10 text-center"
        style={{ backgroundColor: "var(--surface)" }}>
        {!hasUsedAppBefore ? (
          <>
            <h1 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
              Import data from an existing resume
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
              className="mt-5"
            />
            {!hasAddedResume && (
              <>
                <OrDivider />
                <SectionWithHeadingAndCreateButton
                  heading="Don't have a resume yet?"
                  buttonText="Create from scratch"
                />
              </>
            )}
          </>
        ) : (
          <>
            {!hasAddedResume && (
              <>
                <SectionWithHeadingAndCreateButton
                  heading="You have data saved in browser from prior session"
                  buttonText="Continue where I left off"
                />
                <OrDivider />
              </>
            )}
            <h1 className="font-semibold" style={{ color: "var(--fg)" }}>
              Override data with a new resume
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
              className="mt-5"
            />
          </>
        )}
      </div>
    </main>
  );
}

const OrDivider = () => (
  <div className="mx-[-2.5rem] flex items-center pb-6 pt-8" aria-hidden="true">
    <div className="flex-grow border-t border-[var(--notion-border)]" />
    <span className="mx-2 mt-[-2px] flex-shrink text-lg" style={{ color: "var(--muted-subtle)" }}>or</span>
    <div className="flex-grow border-t border-[var(--notion-border)]" />
  </div>
);

const SectionWithHeadingAndCreateButton = ({
  heading,
  buttonText,
}: {
  heading: string;
  buttonText: string;
}) => {
  const eventName =
    buttonText === "Create from scratch"
      ? "start_from_scratch"
      : "continue_session";
  return (
    <>
      <p className="font-semibold" style={{ color: "var(--fg)" }}>{heading}</p>
      <div className="mt-5">
        <Link
          href="/resume-builder"
          onClick={() => captureImportEvent(eventName)}
          className="outline-theme-blue rounded-full bg-[var(--notion-blue)] px-6 pb-2 pt-1.5 text-base font-semibold text-white"
        >
          {buttonText}
        </Link>
      </div>
    </>
  );
};
