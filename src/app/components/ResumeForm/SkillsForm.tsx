import { Form } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  InputGroupWrapper,
} from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import { AISuggestButton } from "components/AISuggestButton";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectSkills, changeSkills } from "lib/redux/resumeSlice";
import {
  selectThemeColor,
} from "lib/redux/settingsSlice";
import { useState } from "react";
import { useAIPanel } from "lib/hooks/useAIPanel";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const { featuredSkills, descriptions } = skills;
  const form = "skills";
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";

  const handleSkillsChange = (field: "descriptions", value: string[]) => {
    dispatch(changeSkills({ field, value }));
  };
  const handleFeaturedSkillsChange = (
    idx: number,
    skill: string,
    rating: number
  ) => {
    dispatch(changeSkills({ field: "featuredSkills", idx, skill, rating }));
  };

  const [aiMode, setAiMode] = useState<"replace" | "append">("replace");

  const {
    aiPanelOpen,
    streamingText,
    isLoading,
    openPanel,
    closePanel,
    handleAccept,
    handleRegenerate,
  } = useAIPanel({
    onAccept: (text) => {
      const newSkills = text.split(",").map((s) => s.trim()).filter(Boolean);
      if (aiMode === "replace") {
        dispatch(changeSkills({ field: "descriptions", value: newSkills }));
      } else {
        const combined = [...descriptions, ...newSkills];
        dispatch(changeSkills({ field: "descriptions", value: combined }));
      }
    },
    generateMock: (isRegenerate) => {
      if (isRegenerate) {
        return "Next.js, Tailwind CSS, PostgreSQL, Redis, CI/CD, GitHub Actions";
      }
      return aiMode === "replace"
        ? "JavaScript, Python, React, Node.js, SQL, AWS, Docker"
        : "TypeScript, GraphQL, Kubernetes";
    },
  });

  const handleSuggestSkills = (mode: "replace" | "append") => {
    setAiMode(mode);
    openPanel();
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Skills List"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={descriptions}
            onChange={handleSkillsChange}
            action={descriptions.length > 0 ? <SparkleIconButton onClick={() => openPanel()} color={themeColor} size="small" /> : undefined}
          />
        </div>

        {descriptions.length > 0 && (
          <div className="col-span-full flex justify-end">
              <AISuggestButton onSuggest={handleSuggestSkills} />
          </div>
        )}
        <div className="col-span-full mb-4 mt-6 border-t" style={{ borderColor: "var(--border)" }} />
        <InputGroupWrapper
          label="Featured Skills (Optional)"
          className="col-span-full"
        >
          <p className="mt-2 text-sm font-normal text-gray-600">
            Featured skills is optional to highlight top skills, with more
            circles mean higher proficiency.
          </p>
        </InputGroupWrapper>

        {featuredSkills.map(({ skill, rating }, idx) => (
          <FeaturedSkillInput
            key={idx}
            className="col-span-full"
            skill={skill}
            rating={rating}
            setSkillRating={(newSkill, newRating) => {
              handleFeaturedSkillsChange(idx, newSkill, newRating);
            }}
            placeholder={`Featured Skill ${idx + 1}`}
            circleColor={themeColor}
          />
        ))}
      </div>
      <AIPanel
        isOpen={aiPanelOpen}
        onClose={closePanel}
        onAccept={handleAccept}
        onRegenerate={handleRegenerate}
        streamingText={streamingText}
        isLoading={isLoading}
      />
    </Form>
  );
};
