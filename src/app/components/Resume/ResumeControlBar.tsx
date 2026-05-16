"use client";
import { useEffect, useRef } from "react";
import {
  MagnifyingGlassPlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { ExportButton } from "components/Resume/ExportButton";
import { ShareButton } from "components/Resume/ShareButton";
import { useSound } from "lib/sound/provider";
import type { Resume } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";

const TEMPLATES = [
  { id: "executive-simple", name: "Classic" },
  { id: "sb2nov-modern", name: "Modern" },
  { id: "stackoverflow", name: "StackOverflow" },
];

const ResumeControlBar = ({
  document: pdfDocument,
  baseFileName,
  scale,
  zoomLevel,
  onZoomChange,
  template,
  onTemplateChange,
  resume,
  settings,
}: {
  document: JSX.Element;
  baseFileName: string;
  scale: number;
  zoomLevel: number;
  onZoomChange: (percentage: number) => void;
  template: string;
  onTemplateChange: (templateId: string) => void;
  resume: Resume;
  settings: Settings;
}) => {
  const [instance, update] = usePDF({ document: pdfDocument });
  const { play } = useSound();
  const lastZoomRef = useRef(zoomLevel);

  useEffect(() => {
    update();
  }, [update, pdfDocument]);

  const handleZoomSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onZoomChange(value);
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

      {/* Template Dropdown + Export Button — same row on mobile */}
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
        <ShareButton
          resume={resume}
          settings={settings}
        />
        <ExportButton
          pdfUrl={instance.url}
          baseFileName={baseFileName}
          resume={resume}
          settings={settings}
          template={template}
        />
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
