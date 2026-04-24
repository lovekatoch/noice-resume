"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import { ResumeControlBarCSR } from "components/Resume/ResumeControlBar";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG, LETTER_WIDTH_PX } from "lib/constants";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  // Auto-calculate scale based on container width
  useEffect(() => {
    if (!previewRef.current) return;
    
    const updateScale = () => {
      if (previewRef.current) {
        const containerWidth = previewRef.current.clientWidth;
        // Subtract padding (p-2 = 8px on mobile, p-4 = 16px on desktop, doubled for both sides)
        const style = window.getComputedStyle(previewRef.current);
        const paddingLeft = parseFloat(style.paddingLeft);
        const paddingRight = parseFloat(style.paddingRight);
        const availableWidth = containerWidth - paddingLeft - paddingRight;
        
        if (availableWidth > 0) {
          if (availableWidth < LETTER_WIDTH_PX) {
            // Scale down to fit
            setScale(availableWidth / LETTER_WIDTH_PX);
          } else {
            // Document is narrower than container, use 1:1 scale
            setScale(1.0);
          }
        }
      }
    };
    
    // Initial calculation
    updateScale();
    
    // Use ResizeObserver for dynamic updates
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(previewRef.current);
    
    window.addEventListener('resize', updateScale);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    setShowBackToTop(scrollTop > 200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div id="resume-preview" className="relative flex w-full flex-col overflow-hidden">
        <section
          ref={previewRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-2 md:p-4"
        >
          <div className="flex justify-center">
            <ResumeIframeCSR
              documentSize={settings.documentSize}
              scale={scale}
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
        <ResumeControlBarCSR
          scale={scale}
          setScale={setScale}
          documentSize={settings.documentSize}
          document={document}
          fileName={resume.profile.name + " - Resume"}
        />
      </div>
    </>
  );
};
