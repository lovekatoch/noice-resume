"use client";
import { usePDF } from "@react-pdf/renderer";
import { useMemo, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { XMarkIcon, ShareIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { ResumePDF } from "components/Resume/ResumePDF";
import { PostDownloadShare } from "components/PostDownloadShare";
import { ReferralDashboard } from "components/ReferralDashboard";
import { captureReferralToken, notifyReferralCompleted } from "lib/referral";
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

function FloatingButton({ onMilestone }: { onMilestone?: () => void }) {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReferralDashboard, setShowReferralDashboard] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGlow(true), 1500);
    return () => clearTimeout(timer);
  }, []);

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
        setShareId(data.id);
        captureShareUrlGenerated({ url });
        captureShareEvent("share_link_created", { share_id: data.id });
      } else {
        setShareUrl("https://noiceresume.pages.dev");
      }
    } catch {
      setShareUrl("https://noiceresume.pages.dev");
    }
  }, [resume, settings]);

  const triggerDownload = useCallback(() => {
    if (instance.url) {
      captureDownload({
        template,
        fileName: baseFileName,
        fileType: "pdf",
      });
      captureShareEvent("share_flow_downloaded", {
        share_id: shareId,
        download_after_share: true,
      });
      const link = document.createElement("a");
      link.href = instance.url;
      link.download = `${baseFileName}.pdf`;
      link.click();
      onMilestone?.();
    }
  }, [instance.url, template, baseFileName, shareId, onMilestone]);

  const handleFabClick = useCallback(async () => {
    if (showShareModal) {
      setShowShareModal(false);
      return;
    }
    if (!shareUrl) {
      await createShareLink();
    }
    setShowShareModal(true);
  }, [showShareModal, shareUrl, createShareLink]);

  return (
    <>
      {showShareModal && (
        <PostDownloadShare
          onClose={() => setShowShareModal(false)}
          shareUrl={shareUrl || undefined}
          shareId={shareId || undefined}
          profileName={resume.profile.name || undefined}
          headline={resume.workExperiences?.[0]?.jobTitle || undefined}
          onDownload={triggerDownload}
          downloadLabel={instance.url ? `Download ${baseFileName}.pdf` : "Generating PDF..."}
          onReferralDashboard={() => setShowReferralDashboard(true)}
        />
      )}
      {showReferralDashboard && (
        <ReferralDashboard
          onClose={() => setShowReferralDashboard(false)}
          shareUrl={shareUrl || undefined}
          profileName={resume.profile.name || undefined}
        />
      )}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <button
          onClick={handleFabClick}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 ${showGlow ? "animate-fab-glow" : "animate-fab-entrance"}`}
          style={{
            backgroundColor: "var(--accent)",
            boxShadow: showGlow ? undefined : "rgba(30,58,95,0.4) 0px 4px 20px",
          }}
          aria-label="Share & download resume"
        >
          {showShareModal ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <ShareIcon className="h-5 w-5" />
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
