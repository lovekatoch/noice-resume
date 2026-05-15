"use client";
import { useMemo, useRef, useEffect, useState, type ReactElement } from "react";
import Frame from "react-frame-component";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  A4_WIDTH_PT,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
  LETTER_WIDTH_PT,
} from "lib/constants";
import dynamic from "next/dynamic";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";

const getIframeInitialContent = (isA4: boolean) => {
  const width = isA4 ? A4_WIDTH_PT : LETTER_WIDTH_PT;
  const allFontFamilies = getAllFontFamiliesToLoad();

  const allFontFamiliesPreloadLinks = allFontFamilies
    .map(
      (
        font
      ) => `<link rel="preload" as="font" href="/fonts/${font}-Regular.ttf" type="font/ttf" crossorigin="anonymous">
<link rel="preload" as="font" href="/fonts/${font}-Bold.ttf" type="font/ttf" crossorigin="anonymous">`
    )
    .join("");

  const allFontFamiliesFontFaces = allFontFamilies
    .map(
      (
        font
      ) => `@font-face {font-family: "${font}"; src: url("/fonts/${font}-Regular.ttf");}
@font-face {font-family: "${font}"; src: url("/fonts/${font}-Bold.ttf"); font-weight: bold;}`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.5, maximum-scale=3, user-scalable=yes">
    ${allFontFamiliesPreloadLinks}
    <style>
      ${allFontFamiliesFontFaces}
      body {
        overflow: visible !important;
        touch-action: pan-x pan-y pinch-zoom;
      }
    </style>
  </head>
  <body style='overflow: visible; width: ${width}pt; margin: 0; padding: 0; -webkit-text-size-adjust:none;'>
    <div></div>
  </body>
</html>`;
};

/**
 * Iframe is used here for style isolation, since react pdf uses pt unit.
 * It creates a sandbox document body that uses letter/A4 pt size as width.
 */
const ResumeIframe = ({
  documentSize,
  scale,
  children,
  enablePDFViewer = false,
}: {
  documentSize: string;
  scale: number;
  children: React.ReactNode;
  enablePDFViewer?: boolean;
}) => {
  const isA4 = documentSize === "A4";
  const iframeInitialContent = useMemo(
    () => getIframeInitialContent(isA4),
    [isA4]
  );

  const documentWidth = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
  const documentHeight = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoFitScale, setAutoFitScale] = useState(1);

  useEffect(() => {
    const updateAutoFit = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const fitScale = containerWidth / documentWidth;
        setAutoFitScale(fitScale);
      }
    };

    updateAutoFit();
    window.addEventListener("resize", updateAutoFit);
    return () => window.removeEventListener("resize", updateAutoFit);
  }, [documentWidth]);

  const effectiveScale = autoFitScale * scale;

  if (enablePDFViewer) {
    return (
      <DynamicPDFViewer className="h-full w-full">
        {children as ReactElement}
      </DynamicPDFViewer>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <div
        ref={containerRef}
        className="w-full border border-[var(--border)]"
        style={{
          backgroundColor: "var(--surface)",
          aspectRatio: `${documentWidth} / ${documentHeight}`,
        }}
      >
        <Frame
          style={{
            width: "100%",
            height: "100%",
          }}
          initialContent={iframeInitialContent}
          scrolling="auto"
          key={isA4 ? "A4" : "LETTER"}
        >
          <div
            style={{
              transform: `scale(${effectiveScale})`,
              transformOrigin: "top left",
              width: `${documentWidth}px`,
              height: `${documentHeight}px`,
            }}
          >
            {children}
          </div>
        </Frame>
      </div>
    </div>
  );
};

/**
 * Load iframe client side since iframe can't be SSR
 */
export const ResumeIframeCSR = dynamic(() => Promise.resolve(ResumeIframe), {
  ssr: false,
});

// PDFViewer is only used for debugging. Its size is quite large, so we make it dynamic import
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false,
  }
);
