"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { FloatingDownloadButton } from "components/Resume/FloatingDownloadButton";
import { CelebrationOverlay } from "components/CelebrationOverlay";
import { ReferralLandingBadge } from "components/ReferralLandingBadge";
import { changeSettings, changeShowForm } from "lib/redux/settingsSlice";
import { setResume } from "lib/redux/resumeSlice";
import { END_HOME_RESUME } from "home/constants";
import { captureReferralToken, notifyReferralCompleted } from "lib/referral";
import { captureBuilderSession, captureReferralConversion, captureTemplateSelected, captureFirstRunPreFill, captureQuickStartSelected, captureOnboardingHintDismissed, captureSectionAutoShown } from "lib/analytics";
import StructuredData from "components/StructuredData";
import { breadcrumbSchema, howToSchema, SITE_URL } from "lib/structured-data";

export default function Create() {
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [isMobile, setIsMobile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const hasTrackedPreFill = useRef(false);

  const handleMilestone = useCallback(() => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  }, []);

  useEffect(() => {
    const template = searchParams.get("template");
    if (template) {
      dispatch(changeSettings({ field: "template", value: template }));
      captureTemplateSelected({ template });
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const token = captureReferralToken();
    if (token) {
      captureReferralConversion();
      notifyReferralCompleted(token);
    }
  }, []);

  useEffect(() => {
    const fromTemplate = searchParams.get("template");
    const quickStart = searchParams.get("quickStart");
    const hasSavedState =
      typeof window !== "undefined" &&
      !!localStorage.getItem("open-resume-state");

    if (hasSavedState) {
      try {
        const saved = JSON.parse(
          localStorage.getItem("open-resume-state") || "{}"
        );
        const hasData =
          saved?.resume?.profile?.name ||
          saved?.resume?.workExperiences?.length > 0;
        if (hasData) {
          captureBuilderSession({ resumed: true });
          return;
        }
      } catch {}
    }

    const isFirstRun = !hasSavedState;

    if (isFirstRun && !quickStart && !hasTrackedPreFill.current) {
      hasTrackedPreFill.current = true;
      dispatch(setResume(END_HOME_RESUME));
      dispatch(changeShowForm({ field: "workExperiences", value: true }));
      dispatch(changeShowForm({ field: "educations", value: true }));
      dispatch(changeShowForm({ field: "skills", value: true }));
      captureFirstRunPreFill();
      captureSectionAutoShown({ section: "workExperiences" });
      captureSectionAutoShown({ section: "educations" });
      captureSectionAutoShown({ section: "skills" });
      setShowOnboarding(true);
    }

    if (isFirstRun && quickStart) {
      captureQuickStartSelected({ role: quickStart });
    }

    captureBuilderSession({
      resumed: !isFirstRun,
      fromTemplate: fromTemplate ?? undefined,
    });
  }, [searchParams, dispatch]);

  return (
    <main className="relative w-full max-w-full bg-[var(--canvas)] md:max-h-screen md:overflow-hidden">
      <CelebrationOverlay show={showCelebration} />
      <StructuredData
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Resume Builder", url: `${SITE_URL}/resume-builder` },
          ]),
          howToSchema([
            {
              name: "Fill in your details",
              text: "Enter your contact information, work experience, education, skills, and other relevant sections. Use the form panel to add, remove, or reorder entries.",
            },
            {
              name: "Choose a template and style",
              text: "Select from professionally designed templates and customize fonts, colors, and layout to match your industry and personal brand.",
            },
            {
              name: "Polish with AI suggestions",
              text: "Use the AI enhancement feature to improve your bullet points, fix grammar, and make your experience sound more impactful.",
            },
            {
              name: "Download your resume",
              text: "Preview your resume in real-time and download a clean PDF that's ATS-friendly and ready to submit to job applications.",
            },
          ]),
        ]}
      />
      {/* Mobile tab bar */}
      {isMobile && (
        <div
          className="flex border-b sticky top-0 z-30"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <button
            onClick={() => setMobileTab("form")}
            className="flex-1 py-3 text-sm font-semibold text-center transition-colors relative"
            style={{
              color: mobileTab === "form" ? "var(--accent)" : "var(--muted)",
            }}
          >
            Form
            {mobileTab === "form" && (
              <div
                className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
            )}
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className="flex-1 py-3 text-sm font-semibold text-center transition-colors relative"
            style={{
              color: mobileTab === "preview" ? "var(--accent)" : "var(--muted)",
            }}
          >
            Preview
            {mobileTab === "preview" && (
              <div
                className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
            )}
          </button>
        </div>
      )}

      {showOnboarding && (
        <div
          className="flex items-start gap-3 px-4 py-3 text-sm border-b"
          style={{
            backgroundColor: "rgba(30,58,95,0.04)",
            borderColor: "var(--border)",
          }}
        >
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            i
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium" style={{ color: "var(--fg)" }}>
              Get started in seconds
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              We&rsquo;ve filled in sample content so you can preview the format. Edit any field or download as-is.
            </p>
          </div>
          <button
            onClick={() => {
              setShowOnboarding(false);
              captureOnboardingHintDismissed();
            }}
            className="shrink-0 rounded-full p-1 transition-opacity hover:opacity-60"
            style={{ color: "var(--muted-subtle)" }}
            aria-label="Dismiss"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex flex-col md:grid md:grid-cols-12">
        {/* Left panel — Form */}
        <div
          className="md:col-span-5"
          style={{
            display: isMobile && mobileTab !== "form" ? "none" : undefined,
          }}
        >
          <ResumeForm />
        </div>

        {/* Right panel — Preview */}
        <div
          className="md:col-span-7 md:sticky md:top-0 md:h-screen md:overflow-hidden"
          style={{
            display: isMobile && mobileTab !== "preview" ? "none" : undefined,
          }}
        >
          <div className="flex items-center justify-end px-4 pt-2 pb-0">
            <ReferralLandingBadge />
          </div>
          <Resume onMilestone={handleMilestone} />
        </div>
      </div>
      <FloatingDownloadButton onMilestone={handleMilestone} />
    </main>
  );
}
