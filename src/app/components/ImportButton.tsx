"use client";
import { useState, useRef } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { initialSettings } from "lib/redux/settingsSlice";
import { deepClone } from "lib/deep-clone";
import { useRouter } from "next/navigation";
import type { ShowForm } from "lib/redux/settingsSlice";

export const ImportButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const fileUrl = URL.createObjectURL(file);
      const resume = await parseResumeFromPdf(fileUrl);
      const settings = deepClone(initialSettings);

      const sections = Object.keys(settings.formToShow) as ShowForm[];
      const sectionToFormToShow: Record<ShowForm, boolean> = {
        workExperiences: resume.workExperiences.length > 0,
        educations: resume.educations.length > 0,
        projects: resume.projects.length > 0,
        skills: resume.skills.descriptions.length > 0,
        custom: resume.custom.descriptions.length > 0,
      };

      for (const section of sections) {
        settings.formToShow[section] = sectionToFormToShow[section];
      }

      saveStateToLocalStorage({ resume, settings });
      URL.revokeObjectURL(fileUrl);
      router.push("/resume-builder");
    } catch (err) {
      console.error("Failed to parse PDF:", err);
      setError("Failed to import PDF. Please try a different file.");
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="sr-only"
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="notion-btn notion-btn-secondary rounded-r-none border-r-0"
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="ml-2">Importing...</span>
          </>
        ) : (
          <>
            <ArrowUpTrayIcon className="h-4 w-4" />
            <span className="ml-2">Import pdf</span>
          </>
        )}
      </button>
      {error && (
        <p className="absolute -bottom-6 left-0 text-xs text-red-500">{error}</p>
      )}
    </>
  );
};