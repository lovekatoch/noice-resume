import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  deleteSectionInFormByIdx,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          // TS doesn't support passing union type to single call signature
          // https://github.com/microsoft/TypeScript/issues/54027
          // any is used here as a workaround
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        const handleDelete = () => {
          if (idx === workExperiences.length - 1) {
            // Last item: reset all fields to empty
            dispatch(changeWorkExperiences({ idx, field: "company", value: "" }));
            dispatch(changeWorkExperiences({ idx, field: "jobTitle", value: "" }));
            dispatch(changeWorkExperiences({ idx, field: "date", value: "" }));
            dispatch(changeWorkExperiences({ idx, field: "descriptions", value: [] }));
          } else {
            // Not last item: delete the entry
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
            <BulletListTextarea
              label="Description"
              labelClassName="col-span-full"
              name="descriptions"
              placeholder="Bullet points"
              value={descriptions}
              onChange={handleWorkExperienceChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
