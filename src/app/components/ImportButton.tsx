"use client";
import { useState, useRef } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { initialSettings } from "lib/redux/settingsSlice";
import { deepClone } from "lib/deep-clone";
import { useRouter } from "next/navigation";
import type { ShowForm } from "lib/redux/settingsSlice";

type Props = {
  compact?: boolean;
};

export const ImportButton = ({ compact }: Props) => {
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
      const result = await parseResumeFromPdf(fileUrl);

      if (!result.success) {
        throw new Error(result.error || "Failed to parse PDF");
      }

      const { resume } = result;
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

      saveStateToLocalStorage({ resume, settings, user: { isPremium: false, checkoutSessionId: null, customerId: null, checkoutError: null } });
      URL.revokeObjectURL(fileUrl);
      router.push("/resume-builder");
    } catch (err) {
      console.error("Failed to parse PDF:", err);
      const message = err instanceof Error ? err.message : "Failed to import PDF. Please try a different file.";
      setError(message);
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
        className={`inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 font-medium text-[var(--accent)] transition-all hover:border-[var(--accent)]/40 ${
          compact ? "px-3 py-1.5 text-xs" : "px-7 py-3 text-sm md:text-base"
        }`}
        style={{ backgroundColor: "var(--surface)" }}
        aria-label={isLoading ? "Importing PDF" : "Import PDF"}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
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
            <span>Importing...</span>
          </>
        ) : (
          <>
            <ArrowUpTrayIcon className="h-4 w-4" aria-hidden="true" />
            <span>Import PDF</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </>
  );
};