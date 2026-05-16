import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import { ErrorBoundary } from "components/ErrorBoundary";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  deleteSectionInFormByIdx,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import { selectThemeColor } from "lib/redux/settingsSlice";
import { captureFormFieldEdited } from "lib/analytics";
import type { ResumeWorkExperience } from "lib/redux/types";
import { useAIPanel } from "lib/hooks/useAIPanel";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();
  const themeColor = useAppSelector(selectThemeColor) || "#1E3A5F";

  const {
    aiPanelOpen,
    streamingText,
    isLoading,
    aiTargetIdx,
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
      if (aiTargetIdx !== null) {
        // Split by newlines to preserve bullet structure
        const bulletItems = text.split("\n").map((line) => line.replace(/^•\s*/, "").trim()).filter(Boolean);
        dispatch(changeWorkExperiences({ idx: aiTargetIdx, field: "descriptions", value: bulletItems }));
      }
    },
  });

  const handleSparkleClick = (idx: number) => {
    const section = workExperiences[idx];
    const prompt = `[description]\n${(section.descriptions || []).join("\n") || "(no existing content)"}`;
    openPanel(prompt, idx, undefined, "work_experience", section.descriptions.length);
  };

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...args: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          dispatch(changeWorkExperiences({ idx, field: args[0], value: args[1] }));
          captureFormFieldEdited({ sectionType: "workExperiences", fieldName: args[0], action: "edit" });
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        const handleDelete = () => {
          if (idx === workExperiences.length - 1) {
            dispatch(changeWorkExperiences({ idx, field: "company", value: "" }));
            dispatch(changeWorkExperiences({ idx, field: "jobTitle", value: "" }));
            dispatch(changeWorkExperiences({ idx, field: "date", value: "" }));
            dispatch(changeWorkExperiences({ idx, field: "descriptions", value: [] }));
          } else {
            dispatch(deleteSectionInFormByIdx({ form: "workExperiences", idx }));
          }
        };

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={true}
            deleteButtonTooltipText="Delete job"
            onDelete={handleDelete}
          >
            <Input
              label="Company"
              labelClassName="col-span-full"
              name="company"
              placeholder="Khan Academy"
              value={company}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="Job Title"
              labelClassName="col-span-full"
              name="jobTitle"
              placeholder="Software Engineer"
              value={jobTitle}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-full"
              name="date"
              placeholder="Jun 2022 - Present"
              value={date}
              onChange={handleWorkExperienceChange}
            />
            <div className="col-span-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-medium" style={{ color: "var(--muted)" }}>Description</span>
                {descriptions.length > 0 && (
                  <SparkleIconButton onClick={() => handleSparkleClick(idx)} color={themeColor} size="small" />
                )}
              </div>
              <BulletListTextarea
                label=""
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleWorkExperienceChange}
              />
            </div>
          </FormSection>
        );
      })}
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
    </Form>
  );
};
