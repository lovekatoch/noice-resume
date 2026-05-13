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
import { useSound } from "lib/sound/provider";

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
  const { play } = useSound();
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
      void play("hero.complete");
    }
  };

  const handleZoomSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onZoomChange(value);
    // Play subtle sound on every 10% change to avoid spam
    if (Math.abs(value - lastZoomRef.current) >= 10) {
      lastZoomRef.current = value;
      void play("interaction.subtle");
    }
  };

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b px-4 py-2"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--fg)" }}
    >
      {/* Zoom Slider */}
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

      {/* Template Dropdown + Download Button — same row on mobile */}
      <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
        <select
          value={template}
          onChange={(e) => {
            onTemplateChange(e.target.value);
            void play("overlay.open");
          }}
          className="rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition-colors hover:border-[var(--accent)] cursor-pointer"
          style={{
            backgroundColor: "var(--surface)",
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
            className="flex items-center justify-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download
          </button>
        </Tooltip>
      </div>
    </div>
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
