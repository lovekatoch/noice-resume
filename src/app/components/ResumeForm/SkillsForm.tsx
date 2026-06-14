import { Form } from "components/ResumeForm/Form";
import {
  Textarea,
  InputGroupWrapper,
} from "components/ResumeForm/Form/InputGroup";
import { AISuggestButton } from "components/AISuggestButton";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectSkills, changeSkills } from "lib/redux/resumeSlice";
import { selectThemeColor } from "lib/redux/settingsSlice";
import { useState } from "react";
import { useAIPanel } from "lib/hooks/useAIPanel";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const { descriptions } = skills;
  const form = "skills";
  const themeColor = useAppSelector(selectThemeColor) || "#4338CA";

  // Skills stored as comma-separated string for plain textarea display
  const skillsTextValue = descriptions.join(", ");

  const handleSkillsTextChange = (_name: string, value: string) => {
    // Parse comma-separated text back into array for storage
    const newDescriptions = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    dispatch(changeSkills({ field: "descriptions", value: newDescriptions }));
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
    error,
    regenerateCount,
    globalEnhanceCount,
  } = useAIPanel({
    onAccept: (text) => {
      const newSkills = text
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (aiMode === "replace") {
        dispatch(changeSkills({ field: "descriptions", value: newSkills }));
      } else {
        const combined = [...descriptions, ...newSkills];
        dispatch(changeSkills({ field: "descriptions", value: combined }));
      }
    },
  });

  const buildPrompt = () =>
    `[skills]\n${descriptions.length > 0 ? descriptions.join(", ") : "(none)"}`;

  const handleSuggestSkills = (mode: "replace" | "append") => {
    setAiMode(mode);
    openPanel(buildPrompt());
  };

  const handleSparkleClick = () => {
    openPanel(buildPrompt());
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-medium text-gray-700">Skills List</span>
            {descriptions.length > 0 && (
              <SparkleIconButton onClick={handleSparkleClick} color={themeColor} size="small" />
            )}
          </div>
          <Textarea
            label=""
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="React, Node.js, Python"
            value={skillsTextValue}
            onChange={handleSkillsTextChange}
          />
        </div>

        {descriptions.length > 0 && (
          <div className="col-span-full flex justify-end">
            <AISuggestButton onSuggest={handleSuggestSkills} />
          </div>
        )}
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
