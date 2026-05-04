"use client";
import { useState, useMemo } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import { ResumeControlBarCSR } from "components/Resume/ResumeControlBar";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";

function formatResumeFileName(name: string): string {
  if (!name || name.trim() === "") {
    return `Resume_${new Date().getFullYear()}.pdf`;
  }
  const normalized = name.trim().replace(/\s+/g, "_");
  return `${normalized}_Resume_${new Date().getFullYear()}.pdf`;
}

export const Resume = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  const effectiveScale = zoomLevel / 100;

  const handleZoomChange = (percentage: number) => {
    setZoomLevel(Math.max(100, percentage));
  };

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div id="resume-preview" className="relative flex w-full flex-col bg-[var(--bg)]">
        <ResumeControlBarCSR
          document={document}
          fileName={formatResumeFileName(resume.profile.name)}
          scale={effectiveScale}
          zoomLevel={zoomLevel}
          onZoomChange={handleZoomChange}
        />
        <section className="flex-1 overflow-y-auto p-2 pb-4 scroll-mt-16 md:p-4 md:pb-4">
          <div className="flex justify-center">
            <ResumeIframeCSR
              documentSize={settings.documentSize}
              scale={effectiveScale}
              enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
            >
              <ResumePDF
                resume={resume}
                settings={settings}
                isPDF={DEBUG_RESUME_PDF_FLAG}
              />
            </ResumeIframeCSR>
          </div>
        </section>
      </div>
    </>
  );
};
