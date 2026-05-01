import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import { PremiumGate } from "components/PremiumGate";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  deleteSectionInFormByIdx,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import { selectThemeColor } from "lib/redux/settingsSlice";
import type { ResumeWorkExperience } from "lib/redux/types";
import { useState } from "react";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();
  const themeColor = useAppSelector(selectThemeColor) || "#0075de";

  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiTargetIdx, setAiTargetIdx] = useState<number | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAIOpen = (idx: number) => {
    setAiTargetIdx(idx);
    setAiPanelOpen(true);
    setIsLoading(true);
    setTimeout(() => {
      setStreamingText("Led cross-functional team of 5 engineers to deliver feature ahead of schedule, resulting in 25% improvement in user engagement.");
      setIsLoading(false);
    }, 1500);
  };

  const handleAccept = (text: string) => {
    if (aiTargetIdx !== null) {
      const experience = workExperiences[aiTargetIdx];
      dispatch(changeWorkExperiences({ idx: aiTargetIdx, field: "descriptions", value: [text] } as any));
    }
    setAiPanelOpen(false);
    setStreamingText("");
    setAiTargetIdx(null);
  };

  const handleRegenerate = () => {
    setIsLoading(true);
    setStreamingText("");
    setTimeout(() => {
      setStreamingText("Spearheaded initiatives that streamlined processes, reducing operational costs by 15% while maintaining quality standards.");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          dispatch(changeWorkExperiences({ idx, field, value } as any));
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
                  <PremiumGate>
                    <SparkleIconButton onClick={() => handleAIOpen(idx)} color={themeColor} size="small" />
                  </PremiumGate>
                </div>
              )}
            </div>
          </FormSection>
        );
      })}
      <AIPanel
        isOpen={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        onAccept={handleAccept}
        onRegenerate={handleRegenerate}
        streamingText={streamingText}
        isLoading={isLoading}
      />
    </Form>
  );
};
