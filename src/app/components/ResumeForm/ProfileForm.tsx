import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectResume, selectProfile } from "lib/redux/resumeSlice";
import { selectThemeColor } from "lib/redux/settingsSlice";
import { ResumeProfile } from "lib/redux/types";
import { useAIPanel } from "lib/hooks/useAIPanel";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const fullResume = useAppSelector(selectResume);
  const dispatch = useAppDispatch();
  const { name, email, phone, url, summary, location } = profile;
  const themeColor = useAppSelector(selectThemeColor) || "#1E3A5F";

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
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
    globalEnhanceCount,
  } = useAIPanel({
    onAccept: (text) => {
      dispatch(changeProfile({ field: "summary", value: text }));
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
    openPanel(prompt, undefined, "objective");
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
      <AIPanel
        isOpen={aiPanelOpen}
        onClose={closePanel}
        onAccept={handleAccept}
        onRegenerate={handleRegenerate}
        streamingText={streamingText}
        isLoading={isLoading}
        error={error}
        regenerateCount={regenerateCount}
        globalEnhanceCount={globalEnhanceCount}
      />
    </BaseForm>
  );
};
