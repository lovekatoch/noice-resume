import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import { ErrorBoundary } from "components/ErrorBoundary";
import { AIRoastCard } from "components/AIRoastCard";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectResume, selectProfile } from "lib/redux/resumeSlice";
import { captureFormFieldEdited } from "lib/analytics";
import { selectThemeColor } from "lib/redux/settingsSlice";
import { ResumeProfile } from "lib/redux/types";
import { useAIPanel } from "lib/hooks/useAIPanel";
import { useState } from "react";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const fullResume = useAppSelector(selectResume);
  const dispatch = useAppDispatch();
  const { name, email, phone, url, summary, location } = profile;
  const themeColor = useAppSelector(selectThemeColor) || "#1E3A5F";
  const [showRoastPrompt, setShowRoastPrompt] = useState(false);
  const [showRoastCard, setShowRoastCard] = useState(false);

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
    captureFormFieldEdited({ sectionType: "profile", fieldName: field, action: "edit" });
  };

  const {
    aiPanelOpen,
    streamingText,
    isLoading,
    openPanel,
    closePanel,
    handleAccept,
    handleRegenerate,
    error,
    regenerateCount,
    isCooldown,
    cooldownRemaining,
    handleRetry,
    isOffline,
    cachedSuggestion,
  } = useAIPanel({
    onAccept: (text) => {
      dispatch(changeProfile({ field: "summary", value: text }));
    },
    onClose: () => {
      setShowRoastPrompt(true);
    },
  });

  const handleSparkleClick = () => {
    // Build full resume context for the AI
    const { workExperiences, educations, projects, skills } = fullResume;

    const workText = workExperiences
      .filter(w => w.company || w.jobTitle)
      .map(w => {
        const descs = w.descriptions.filter(d => d).join("; ");
        return `${w.jobTitle} at ${w.company} (${w.date})${descs ? ` — ${descs}` : ""}`;
      })
      .join("\n");

    const eduText = educations
      .filter(e => e.school || e.degree)
      .map(e => `${e.degree} at ${e.school}${e.date ? ` (${e.date})` : ""}`)
      .join("\n");

    const skillsText = skills.descriptions.filter(d => d).join(", ");

    const projectText = projects
      .filter(p => p.project)
      .map(p => {
        const descs = p.descriptions.filter(d => d).join("; ");
        return `${p.project}${descs ? ` — ${descs}` : ""}`;
      })
      .join("\n");

    const prompt = `RESUME DATA

PROFILE: ${name} | ${email} | ${phone} | ${location}

WORK EXPERIENCE:
${workText || "(none provided)"}

EDUCATION:
${eduText || "(none provided)"}

SKILLS: ${skillsText || "(none provided)"}

PROJECTS:
${projectText || "(none provided)"}

---

Write a compelling professional summary / sales pitch for this candidate based on their full resume.`;
    openPanel(prompt, undefined, "objective", "profile", undefined);
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleProfileChange}
        />
        <div className="col-span-full">
          <Textarea
            label="Objective"
            labelClassName="col-span-full"
            name="summary"
            placeholder="Entrepreneur and educator obsessed with making education free for anyone"
            value={summary}
            onChange={handleProfileChange}
            action={summary.length > 0 ? <SparkleIconButton onClick={handleSparkleClick} color={themeColor} size="small" /> : undefined}
          />
        </div>
        <Input
          label="Email"
          labelClassName="col-span-full"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label="Phone"
          labelClassName="col-span-full"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label="Website"
          labelClassName="col-span-full"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label="Location"
          labelClassName="col-span-full"
          name="location"
          placeholder="NYC, NY"
          value={location}
          onChange={handleProfileChange}
        />
      </div>
      <ErrorBoundary>
        <AIPanel
          isOpen={aiPanelOpen}
          onClose={closePanel}
          onAccept={handleAccept}
          onRegenerate={handleRegenerate}
          onRetry={handleRetry}
          streamingText={streamingText}
          isLoading={isLoading}
          error={error}
          regenerateCount={regenerateCount}
          isCooldown={isCooldown}
          cooldownRemaining={cooldownRemaining}
          isOffline={isOffline}
          cachedSuggestion={cachedSuggestion}
        />
      </ErrorBoundary>

      {showRoastPrompt && !showRoastCard && (
        <div
          className="rounded-lg p-3 flex items-center justify-between gap-2"
          style={{
            backgroundColor: "rgba(30,58,95,0.06)",
            border: "1px solid rgba(30,58,95,0.12)",
          }}
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#1E3A5F" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-xs" style={{ color: "#4A4A52" }}>
              Want to see your resume score?
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                setShowRoastPrompt(false);
                setShowRoastCard(true);
              }}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#1E3A5F", color: "white" }}
            >
              Roast my resume
            </button>
            <button
              onClick={() => setShowRoastPrompt(false)}
              className="rounded-md px-2 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
              style={{ color: "#86868B" }}
            >
              No thanks
            </button>
          </div>
        </div>
      )}

      {showRoastCard && (
        <AIRoastCard
          onClose={() => {
            setShowRoastCard(false);
            setShowRoastPrompt(false);
          }}
        />
      )}
    </BaseForm>
  );
};
