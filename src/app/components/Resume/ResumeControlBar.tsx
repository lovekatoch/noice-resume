"use client";
import { useEffect, useState } from "react";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { DownloadConfirmModal } from "./DownloadConfirmModal";
import { Tooltip } from "components/Tooltip";

const ResumeControlBar = ({
  document: pdfDocument,
  fileName,
  scale,
  zoomLevel,
  onZoomChange,
}: {
  document: JSX.Element;
  fileName: string;
  scale: number;
  zoomLevel: number;
  onZoomChange: (percentage: number) => void;
}) => {
  const [instance, update] = usePDF({ document: pdfDocument });
  const [showModal, setShowModal] = useState(false);
  const [actualDownload, setActualDownload] = useState(false);

  // Hook to update pdf when document changes
  useEffect(() => {
    update();
  }, [update, pdfDocument]);

  // Trigger actual download when modal confirms
  useEffect(() => {
    if (actualDownload && instance.url) {
      const link = globalThis.document.createElement("a");
      link.href = instance.url;
      link.download = fileName;
      link.click();
      setActualDownload(false);
    }
  }, [actualDownload, instance.url, fileName]);

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

  return (
    <>
      <div className="flex h-[var(--resume-control-bar-height)] items-center justify-between px-[var(--resume-padding)] text-gray-600">
        {/* Zoom Slider */}
        <div className="flex items-center gap-2">
          <MagnifyingGlassMinusIcon className="h-4 w-4 text-gray-400" />
          <input
            type="range"
            min="50"
            max="150"
            value={zoomLevel}
            onChange={handleZoomSliderChange}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--notion-blue)]"
          />
          <MagnifyingGlassPlusIcon className="h-4 w-4 text-gray-400" />
          <span className="min-w-[3rem] text-sm font-medium text-gray-600">
            {zoomLevel}%
          </span>
        </div>

        {/* Download Button */}
        <Tooltip text="Download Resume">
          <button
            onClick={handleDownloadClick}
            className="notion-btn notion-btn-secondary !px-3"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>

      <DownloadConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModalConfirm}
        fileName={fileName}
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
