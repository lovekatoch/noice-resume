import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  selectProjects,
  changeProjects,
  deleteSectionInFormByIdx,
} from "lib/redux/resumeSlice";
import type { ResumeProject } from "lib/redux/types";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();

  return (
    <Form form="projects" addButtonText="Add Project">
      {projects.map(({ project, date, descriptions }, idx) => {
        const handleProjectChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeProject>
        ) => {
          dispatch(changeProjects({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        const handleDelete = () => {
          if (idx === projects.length - 1) {
            // Last item: reset all fields to empty
            dispatch(changeProjects({ idx, field: "project", value: "" }));
            dispatch(changeProjects({ idx, field: "date", value: "" }));
            dispatch(changeProjects({ idx, field: "descriptions", value: [] }));
          } else {
            // Not last item: delete the entry
            dispatch(deleteSectionInFormByIdx({ form: "projects", idx }));
          }
        };

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={true}
            deleteButtonTooltipText={"Delete project"}
            onDelete={handleDelete}
          >
            <Input
              name="project"
              label="Project Name"
              placeholder="My Project"
              value={project}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
            <Input
              name="date"
              label="Date"
              placeholder="Winter 2022"
              value={date}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
            <BulletListTextarea
              name="descriptions"
              label="Description"
              placeholder="Bullet points"
              value={descriptions}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
