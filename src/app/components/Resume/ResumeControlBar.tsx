"use client";
import { useEffect, useRef } from "react";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { Tooltip } from "components/Tooltip";

const ACCENT_GRADIENT = "linear-gradient(135deg, #8B5CF6, #06B6D4)";

const TEMPLATES = [
  { id: "executive-simple", name: "Classic" },
  { id: "sb2nov-modern", name: "Modern" },
  { id: "stackoverflow", name: "StackOverflow" },
];

const ResumeControlBar = ({
  document: pdfDocument,
  fileName,
  scale,
  zoomLevel,
  onZoomChange,
  template,
  onTemplateChange,
}: {
  document: JSX.Element;
  fileName: string;
  scale: number;
  zoomLevel: number;
  onZoomChange: (percentage: number) => void;
  template: string;
  onTemplateChange: (templateId: string) => void;
}) => {
  const [instance, update] = usePDF({ document: pdfDocument });
  const lastZoomRef = useRef(zoomLevel);

  useEffect(() => {
    update();
  }, [update, pdfDocument]);

  const handleDownloadClick = () => {
    if (instance.url) {
      const link = globalThis.document.createElement("a");
      link.href = instance.url;
      link.download = fileName;
      link.click();
    }
  };

  const handleZoomSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onZoomChange(value);
    if (Math.abs(value - lastZoomRef.current) >= 10) {
      lastZoomRef.current = value;
    }
  };

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b px-4 py-2"
      style={{
        backgroundColor: "rgba(18,18,26,0.95)",
        borderColor: "var(--border)",
        color: "var(--fg)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Zoom Slider */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoomChange(Math.max(100, zoomLevel - 10))}
          className="flex h-6 w-6 items-center justify-center rounded transition-colors"
          style={{ color: "var(--muted)" }}
          aria-label="Zoom out"
        >
          <MinusIcon className="h-3.5 w-3.5" />
        </button>
        <input
          type="range"
          min="100"
          max="150"
          value={zoomLevel}
          onChange={handleZoomSliderChange}
          className="h-1 w-24 cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, #8B5CF6 0%, #06B6D4 ${((zoomLevel - 100) / 50) * 100}%, rgba(255,255,255,0.1) ${((zoomLevel - 100) / 50) * 100}%)`,
          }}
        />
        <MagnifyingGlassPlusIcon className="h-4 w-4" style={{ color: "var(--muted)" }} />
        <span className="min-w-[2.5rem] text-sm font-medium" style={{ color: "var(--fg)" }}>
          {zoomLevel}%
        </span>
      </div>

      {/* Template Dropdown + Download Button */}
      <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
        <select
          value={template}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition-all cursor-pointer"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            borderColor: "var(--border)",
            color: "var(--fg)",
          }}
          aria-label="Select template"
        >
          {TEMPLATES.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name}
            </option>
          ))}
        </select>
        <Tooltip text="Download Resume">
          <button
            aria-label="Download Resume"
            onClick={handleDownloadClick}
            className="flex items-center justify-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            style={{ background: ACCENT_GRADIENT }}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  { ssr: false }
);
