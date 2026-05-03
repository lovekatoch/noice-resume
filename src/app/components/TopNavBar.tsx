"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { cx } from "lib/cx";
import { EyeIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { initialSettings } from "lib/redux/settingsSlice";
import { deepClone } from "lib/deep-clone";
import type { ShowForm } from "lib/redux/settingsSlice";

const scrollToPreview = () => {
  const previewSection = document.getElementById("resume-preview");
  if (previewSection) {
    previewSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
};

export const TopNavBar = () => {
  const pathName = usePathname();
  const isBuilderPage = pathName === "/resume-builder";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const fileUrl = URL.createObjectURL(file);
      const result = await parseResumeFromPdf(fileUrl);
      if (result.success) {
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
      }
    } catch (err) {
      console.error("Failed to parse PDF:", err);
    }
  };

  return (
    <header
      aria-label="Site Header"
      className="border-b bg-[var(--surface)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{ padding: "20px 48px", maxWidth: 1200 }}
      >
        <Link href="/">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-lg"
          >
            <rect width="36" height="36" rx="8" fill="#5E6AD2" />
            <text
              x="18"
              y="22"
              textAnchor="middle"
              fill="white"
              fontFamily="Inter, sans-serif"
              fontWeight="700"
              fontSize="14"
              letterSpacing="-0.5"
            >
              NR
            </text>
          </svg>
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-4"
        >
          {isBuilderPage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[var(--border)]"
                aria-label="Import PDF"
              >
                <ArrowUpTrayIcon className="h-4 w-4" style={{ color: "var(--muted)" }} />
              </button>
              <button
                onClick={scrollToPreview}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors md:hidden"
                style={{ color: "var(--accent)" }}
                aria-label="Preview resume"
              >
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
