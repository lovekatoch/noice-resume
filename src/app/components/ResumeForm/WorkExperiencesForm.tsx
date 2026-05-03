import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  deleteSectionInFormByIdx,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import { selectThemeColor } from "lib/redux/settingsSlice";
import type { ResumeWorkExperience } from "lib/redux/types";
import { useAIPanel } from "lib/hooks/useAIPanel";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();
  const themeColor = useAppSelector(selectThemeColor) || "#5E6AD2";

  const {
    aiPanelOpen,
    streamingText,
    isLoading,
    aiTargetIdx,
    openPanel,
    closePanel,
    handleAccept,
    handleRegenerate,
  } = useAIPanel({
    onAccept: (text) => {
      if (aiTargetIdx !== null) {
        dispatch(changeWorkExperiences({ idx: aiTargetIdx, field: "descriptions", value: [text] }));
      }
    },
    generateMock: (isRegenerate) =>
      isRegenerate
        ? "Spearheaded initiatives that streamlined processes, reducing operational costs by 15% while maintaining quality standards."
        : "Led cross-functional team of 5 engineers to deliver feature ahead of schedule, resulting in 25% improvement in user engagement.",
  });

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...args: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          if (args[0] === "descriptions") {
            dispatch(changeWorkExperiences({ idx, field: args[0], value: args[1] }));
          } else {
            dispatch(changeWorkExperiences({ idx, field: args[0], value: args[1] }));
          }
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
            <div className="col-span-full relative">
              <BulletListTextarea
                label="Description"
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleWorkExperienceChange}
              />
              {descriptions.length > 0 && (
                <div className="absolute right-2 top-8">
                    <SparkleIconButton onClick={() => openPanel(idx)} color={themeColor} size="small" />
                </div>
              )}
            </div>
          </FormSection>
        );
      })}
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
