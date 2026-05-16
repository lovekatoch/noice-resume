"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { FloatingDownloadButton } from "components/Resume/FloatingDownloadButton";
import { changeSettings } from "lib/redux/settingsSlice";
import { captureReferralToken } from "lib/referral";
import { captureBuilderSession, captureReferralConversion, captureTemplateSelected } from "lib/analytics";
import StructuredData from "components/StructuredData";
import { breadcrumbSchema, SITE_URL } from "lib/structured-data";

export default function Create() {
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

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
    }
  }, []);

  useEffect(() => {
    const fromTemplate = searchParams.get("template");
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
    captureBuilderSession({
      resumed: false,
      fromTemplate: fromTemplate ?? undefined,
    });
  }, [searchParams]);

  return (
    <main className="relative w-full max-w-full bg-[var(--canvas)] md:max-h-screen md:overflow-hidden">
      <StructuredData
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Resume Builder", url: `${SITE_URL}/resume-builder` },
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
          <Resume />
        </div>
      </div>
      <FloatingDownloadButton />
    </main>
  );
}
