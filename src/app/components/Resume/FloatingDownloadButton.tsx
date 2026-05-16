"use client";
import { usePDF } from "@react-pdf/renderer";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { ResumePDF } from "components/Resume/ResumePDF";

function getResumeBaseName(name: string): string {
  if (!name || name.trim() === "") {
    return `Resume_${new Date().getFullYear()}`;
  }
  const normalized = name.trim().replace(/\s+/g, "_");
  return `${normalized}_Resume_${new Date().getFullYear()}`;
}

function FloatingButton() {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const [isOpen, setIsOpen] = useState(false);

  const pdfDocument = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  const [instance] = usePDF({ document: pdfDocument });

  const baseFileName = getResumeBaseName(resume.profile.name);

  const handleDownload = () => {
    if (instance.url) {
      const link = document.createElement("a");
      link.href = instance.url;
      link.download = `${baseFileName}.pdf`;
      link.click();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div
          className="rounded-lg border p-3 shadow-lg"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--muted-subtle)" }}>
            Download PDF
          </p>
          <button
            onClick={handleDownload}
            disabled={!instance.url}
            className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {instance.url ? (
              <ArrowDownTrayIcon className="h-4 w-4" />
            ) : (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {instance.url ? `Download ${baseFileName}.pdf` : "Generating..."}
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: "var(--accent)",
          boxShadow: "rgba(122,90,68,0.4) 0px 4px 20px",
        }}
        aria-label={isOpen ? "Close download menu" : "Download resume"}
      >
        {isOpen ? (
          <XMarkIcon className="h-5 w-5" />
        ) : (
          <ArrowDownTrayIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

export const FloatingDownloadButton = dynamic(
  () => Promise.resolve(FloatingButton),
  { ssr: false }
);
