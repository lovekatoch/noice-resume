import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
} from "components/ResumeForm/Form/InputGroup";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeEducations,
  deleteSectionInFormByIdx,
  selectEducations,
} from "lib/redux/resumeSlice";
import type { ResumeEducation } from "lib/redux/types";
import {
  selectThemeColor,
} from "lib/redux/settingsSlice";
import { useAIPanel } from "lib/hooks/useAIPanel";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const dispatch = useAppDispatch();
  const form = "educations";
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
  } = useAIPanel({
    onAccept: (text) => {
      if (aiTargetIdx !== null) {
        dispatch(changeEducations({ idx: aiTargetIdx, field: "descriptions", value: [text] }));
      }
    },
  });

  const handleSparkleClick = (idx: number) => {
    const section = educations[idx];
    const prompt = `[education]
Institution: ${section.school}\nDegree: ${section.degree}\n${section.gpa ? `GPA: ${section.gpa}` : 'GPA: N/A'}\nDuration: ${section.date || 'N/A'}\n${(section.descriptions || []).length > 0 ? `\nNotes:\n${section.descriptions.join('\n')}` : ''}`;
    openPanel(prompt, idx, undefined, "education", section.descriptions.length);
  };

  return (
    <Form form={form} addButtonText="Add School">
      {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
        const handleEducationChange = (
          ...args: CreateHandleChangeArgsWithDescriptions<ResumeEducation>
        ) => {
          if (args[0] === "descriptions") {
            dispatch(changeEducations({ idx, field: args[0], value: args[1] }));
          } else {
            dispatch(changeEducations({ idx, field: args[0], value: args[1] }));
          }
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
            <div className="col-span-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-medium" style={{ color: "var(--muted)" }}>Additional Information (Optional)</span>
                {descriptions.length > 0 && (
                  <SparkleIconButton onClick={() => handleSparkleClick(idx)} color={themeColor} size="small" />
                )}
              </div>
              <BulletListTextarea
                label=""
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Free paragraph space to list out additional activities, courses, awards etc"
                value={descriptions}
                onChange={handleEducationChange}
              />
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
        error={error}
        regenerateCount={regenerateCount}
        isCooldown={isCooldown}
        cooldownRemaining={cooldownRemaining}
      />
    </Form>
  );
};
