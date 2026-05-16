import { Form } from "components/ResumeForm/Form";
import { BulletListTextarea } from "components/ResumeForm/Form/InputGroup";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeCustom, selectCustom, selectResume } from "lib/redux/resumeSlice";
import { selectThemeColor } from "lib/redux/settingsSlice";
import { changeShowForm } from "lib/redux/settingsSlice";
import { useAIPanel } from "lib/hooks/useAIPanel";

export const CustomForm = () => {
  const custom = useAppSelector(selectCustom);
  const fullResume = useAppSelector(selectResume);
  const dispatch = useAppDispatch();
  const themeColor = useAppSelector(selectThemeColor) || "#1E3A5F";
  const { descriptions } = custom;

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
      dispatch(changeCustom({ field: "descriptions", value: text.split("\n").filter(Boolean) }));
    },
  });

  const handleCustomChange = (field: "descriptions", value: string[]) => {
    dispatch(changeCustom({ field, value }));
  };

  const handleAddSection = () => {
    dispatch(changeCustom({ field: "descriptions", value: [""] }));
    dispatch(changeShowForm({ field: "custom", value: true }));
  };

  const handleDeleteSection = () => {
    dispatch(changeCustom({ field: "descriptions", value: [] }));
    dispatch(changeShowForm({ field: "custom", value: false }));
  };

  const handleSparkleClick = () => {
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

    const currentBullets = descriptions.filter(d => d).join("; ");

    const prompt = `RESUME DATA

PROFILE: ${fullResume.profile.name} | ${fullResume.profile.email}

WORK EXPERIENCE:
${workText || "(none provided)"}

EDUCATION:
${eduText || "(none provided)"}

SKILLS: ${skillsText || "(none provided)"}

PROJECTS:
${projectText || "(none provided)"}

CUSTOM SECTION BULLETS:
${currentBullets || "(none provided — write new bullet points for a custom section)"}

---

Rewrite the custom section bullet points to be more impactful. Use • prefix. Max 6 bullets. Keep relevant to the candidate's overall profile.`;
    openPanel(prompt, undefined, "description");
  };

  if (descriptions.length === 0) {
    return (
      <div className="flex justify-center py-2">
        <button
          type="button"
          onClick={handleAddSection}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]"
        >
          <PlusSmallIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Add Section
        </button>
      </div>
    );
  }

  return (
    <Form form="custom" showDelete onDelete={handleDeleteSection}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Custom Textbox"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={descriptions}
            onChange={handleCustomChange}
            action={descriptions.some(d => d) ? <SparkleIconButton onClick={handleSparkleClick} color={themeColor} size="small" /> : undefined}
          />
        </div>
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
    </Form>
  );
};
