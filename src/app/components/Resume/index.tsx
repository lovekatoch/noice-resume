"use client";
import { useState, useMemo, useCallback } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import { ResumeControlBarCSR } from "components/Resume/ResumeControlBar";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings, changeSettings } from "lib/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";

function getResumeBaseName(name: string): string {
  if (!name || name.trim() === "") {
    return `Resume_${new Date().getFullYear()}`;
  }
  const normalized = name.trim().replace(/\s+/g, "_");
  return `${normalized}_Resume_${new Date().getFullYear()}`;
}

export const Resume = ({ onMilestone }: { onMilestone?: () => void }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
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

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      dispatch(changeSettings({ field: "template", value: templateId }));
    },
    [dispatch]
  );

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div id="resume-preview" className="relative flex h-full w-full flex-col bg-[var(--canvas)]">
        <ResumeControlBarCSR
          document={document}
          baseFileName={getResumeBaseName(resume.profile.name)}
          scale={effectiveScale}
          zoomLevel={zoomLevel}
          onZoomChange={handleZoomChange}
          template={settings.template}
          onTemplateChange={handleTemplateChange}
          resume={resume}
          settings={settings}
          onMilestone={onMilestone}
        />
        <ThemeForm />
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
