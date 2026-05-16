"use client";
import { usePDF } from "@react-pdf/renderer";
import { useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ArrowDownTrayIcon, XMarkIcon, ShareIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { ResumePDF } from "components/Resume/ResumePDF";
import { PostDownloadShare } from "components/PostDownloadShare";
import {
  capturePdfGenerationStarted,
  captureDownload,
  captureShareUrlGenerated,
  captureShareEvent,
} from "lib/analytics";

function getResumeBaseName(name: string): string {
  if (!name || name.trim() === "") {
    return `Resume_${new Date().getFullYear()}`;
  }
  const normalized = name.trim().replace(/\s+/g, "_");
  return `${normalized}_Resume_${new Date().getFullYear()}`;
}

const SHARE_WORKER_URL = process.env.NEXT_PUBLIC_RESUME_SHARE_WORKER_URL || "";

function FloatingButton() {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const pdfDocument = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  const [instance] = usePDF({ document: pdfDocument });

  const baseFileName = getResumeBaseName(resume.profile.name);

  const sectionCount = [
    resume.workExperiences?.length ?? 0,
    resume.educations?.length ?? 0,
    resume.projects?.length ?? 0,
    resume.skills?.descriptions?.length ?? 0,
    resume.custom?.descriptions?.length ?? 0,
  ].reduce((a, b) => a + b, 0);

  const template = settings.template;

  useMemo(() => {
    if (instance.error) return;
    if (instance.loading) {
      capturePdfGenerationStarted({ template, sectionCount });
    }
  }, [instance.loading, instance.error, template, sectionCount]);

  const createShareLink = useCallback(async () => {
    if (!SHARE_WORKER_URL) {
      setShareUrl("https://noiceresume.pages.dev");
      return;
    }
    try {
      const payload = {
        resume: {
          profile: resume.profile,
          workExperiences: resume.workExperiences,
          educations: resume.educations,
          projects: resume.projects,
          skills: resume.skills,
          custom: resume.custom,
        },
        settings: {
          themeColor: settings.themeColor,
          fontFamily: settings.fontFamily,
          fontSize: settings.fontSize,
          documentSize: settings.documentSize,
          template: settings.template,
        },
      };
      const resp = await fetch(`${SHARE_WORKER_URL}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        const data = await resp.json();
        const url = `${SHARE_WORKER_URL}/${data.id}`;
        setShareUrl(url);
        captureShareUrlGenerated({ url });
        captureShareEvent("share_link_created", { share_id: data.id });
        captureShareEvent("share_link_created", { share_id: data.id });
      } else {
        setShareUrl("https://noiceresume.pages.dev");
      }
    } catch {
      setShareUrl("https://noiceresume.pages.dev");
    }
  }, [resume, settings]);

  const handleDownload = () => {
    if (instance.url) {
      captureDownload({
        template,
        fileName: baseFileName,
        fileType: "pdf",
      });
      const link = document.createElement("a");
      link.href = instance.url;
      link.download = `${baseFileName}.pdf`;
      link.click();
      setIsOpen(false);
      void createShareLink().then(() => setShowShareModal(true));
    }
  };

  const handleShare = () => {
    if (shareUrl) {
      setShowShareModal(true);
    } else {
      void createShareLink().then(() => setShowShareModal(true));
    }
    setIsOpen(false);
  };

  return (
    <>
      {showShareModal && shareUrl && (
        <PostDownloadShare
          onClose={() => setShowShareModal(false)}
          shareUrl={shareUrl}
          profileName={resume.profile.name || undefined}
        />
      )}
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
              Resume Actions
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
            <button
              onClick={handleShare}
              className="flex w-full items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all hover:opacity-80 mt-2"
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--border)",
                color: "var(--fg)",
              }}
            >
              <ShareIcon className="h-4 w-4" />
              Share resume
            </button>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--accent)",
            boxShadow: "rgba(30,58,95,0.4) 0px 4px 20px",
          }}
          aria-label={isOpen ? "Close menu" : "Resume actions"}
        >
          {isOpen ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <ArrowDownTrayIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </>
  );
}

export const FloatingDownloadButton = dynamic(
  () => Promise.resolve(FloatingButton),
  { ssr: false }
);
