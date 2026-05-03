"use client";
import { useEffect, useState } from "react";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { DownloadConfirmModal } from "./DownloadConfirmModal";
import { Tooltip } from "components/Tooltip";
import { generateResumeDOCX } from "./ResumeDOCX";
import type { Resume } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";
import type { ExportFormat } from "./index";

const ResumeControlBar = ({
  document: pdfDocument,
  fileName,
  scale,
  zoomLevel,
  onZoomChange,
  format,
  resume,
  settings,
  onFormatChange,
}: {
  document: JSX.Element;
  fileName: string;
  scale: number;
  zoomLevel: number;
  onZoomChange: (percentage: number) => void;
  format: ExportFormat;
  resume: Resume;
  settings: Settings;
  onFormatChange: (format: ExportFormat) => void;
}) => {
  const [instance, update] = usePDF({ document: pdfDocument });
  const [showModal, setShowModal] = useState(false);
  const [actualDownload, setActualDownload] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<ExportFormat>(format);

  useEffect(() => {
    update();
  }, [update, pdfDocument]);

  useEffect(() => {
    setDownloadFormat(format);
  }, [format]);

  useEffect(() => {
    if (!actualDownload) return;

    if (downloadFormat === "docx") {
      generateResumeDOCX({ resume, settings })
        .then((blob) => {
          if (!blob) {
            setActualDownload(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = globalThis.document.createElement("a");
          link.href = url;
          link.download = fileName.replace(/\.pdf$/, ".docx");
          link.click();
          URL.revokeObjectURL(url);
          setActualDownload(false);
        })
        .catch(() => {
          setActualDownload(false);
        });
    } else {
      if (instance.url) {
        const link = globalThis.document.createElement("a");
        link.href = instance.url;
        link.download = fileName;
        link.click();
        setActualDownload(false);
      }
    }
  }, [actualDownload, instance.url, fileName, downloadFormat, resume, settings]);

  const handleDownloadClick = () => {
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setActualDownload(true);
  };

  const handleZoomSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onZoomChange(value);
  };

  const currentFileName = fileName.replace(/\.pdf$/, "." + downloadFormat);

  return (
    <>
      <div
        className="flex items-center justify-between border-b px-4 py-2"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--fg)" }}
      >
        {/* Zoom Slider — shifted left */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onZoomChange(Math.max(100, zoomLevel - 10))}
            className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[var(--border)]"
            aria-label="Zoom out"
          >
            <MinusIcon className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
          </button>
          <input
            type="range"
            min="100"
            max="150"
            value={zoomLevel}
            onChange={handleZoomSliderChange}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full"
            style={{ backgroundColor: "var(--border)", accentColor: "var(--accent)" }}
          />
          <MagnifyingGlassPlusIcon className="h-4 w-4" style={{ color: "var(--muted)" }} />
          <span className="min-w-[2.5rem] text-sm font-medium" style={{ color: "var(--fg)" }}>
            {zoomLevel}%
          </span>
        </div>

        {/* Download Button */}
        <Tooltip text="Download Resume">
          <button
            aria-label="Download Resume"
            onClick={handleDownloadClick}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download
          </button>
        </Tooltip>
      </div>

      <DownloadConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModalConfirm}
        fileName={currentFileName}
        format={downloadFormat}
        onFormatChange={(f) => {
          setDownloadFormat(f);
          onFormatChange(f);
        }}
      />
    </>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);