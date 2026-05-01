import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import { PremiumGate } from "components/PremiumGate";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeEducations,
  deleteSectionInFormByIdx,
  selectEducations,
} from "lib/redux/resumeSlice";
import type { ResumeEducation } from "lib/redux/types";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
  selectThemeColor,
} from "lib/redux/settingsSlice";
import { useState } from "react";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const dispatch = useAppDispatch();
  const form = "educations";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
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
      setStreamingText("Dean's List recipient for 4 consecutive semesters. Led the student council as President, organizing events for 500+ students.");
      setIsLoading(false);
    }, 1500);
  };

  const handleAccept = (text: string) => {
    if (aiTargetIdx !== null) {
      dispatch(changeEducations({ idx: aiTargetIdx, field: "descriptions", value: [text] } as any));
    }
    setAiPanelOpen(false);
    setStreamingText("");
    setAiTargetIdx(null);
  };

  const handleRegenerate = () => {
    setIsLoading(true);
    setStreamingText("");
    setTimeout(() => {
      setStreamingText("Teaching Assistant for Data Structures and Algorithms. Mentored 30+ students weekly on coding best practices.");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Form form={form} addButtonText="Add School">
      {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
        const handleEducationChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeEducation>
        ) => {
          dispatch(changeEducations({ idx, field, value } as any));
        };

        const handleShowBulletPoints = (value: boolean) => {
          dispatch(changeShowBulletPoints({ field: form, value }));
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== educations.length - 1;

        const handleDelete = () => {
          if (idx === educations.length - 1) {
            dispatch(changeEducations({ idx, field: "school", value: "" }));
            dispatch(changeEducations({ idx, field: "degree", value: "" }));
            dispatch(changeEducations({ idx, field: "gpa", value: "" }));
            dispatch(changeEducations({ idx, field: "date", value: "" }));
            dispatch(changeEducations({ idx, field: "descriptions", value: [] }));
          } else {
            dispatch(deleteSectionInFormByIdx({ form: "educations", idx }));
          }
        };

        return (
          <FormSection
            key={idx}
            form="educations"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={true}
            deleteButtonTooltipText="Delete school"
            onDelete={handleDelete}
          >
            <Input
              label="School"
              labelClassName="col-span-full"
              name="school"
              placeholder="Cornell University"
              value={school}
              onChange={handleEducationChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-full"
              name="date"
              placeholder="May 2018"
              value={date}
              onChange={handleEducationChange}
            />
            <Input
              label="Degree & Major"
              labelClassName="col-span-full"
              name="degree"
              placeholder="Bachelor of Science in Computer Engineering"
              value={degree}
              onChange={handleEducationChange}
            />
            <Input
              label="GPA"
              labelClassName="col-span-full"
              name="gpa"
              placeholder="3.81"
              value={gpa}
              onChange={handleEducationChange}
            />
            <div className="relative col-span-full">
              <BulletListTextarea
                label="Additional Information (Optional)"
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Free paragraph space to list out additional activities, courses, awards etc"
                value={descriptions}
                onChange={handleEducationChange}
                showBulletPoints={showBulletPoints}
              />
              <div className="absolute left-[15.6rem] top-[0.07rem]">
                <BulletListIconButton
                  showBulletPoints={showBulletPoints}
                  onClick={handleShowBulletPoints}
                />
              </div>
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
