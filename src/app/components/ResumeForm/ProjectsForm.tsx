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
  selectProjects,
  changeProjects,
  deleteSectionInFormByIdx,
} from "lib/redux/resumeSlice";
import { selectThemeColor } from "lib/redux/settingsSlice";
import type { ResumeProject } from "lib/redux/types";
import { useAIPanel } from "lib/hooks/useAIPanel";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const themeColor = useAppSelector(selectThemeColor) || "#0075de";

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
        dispatch(changeProjects({ idx: aiTargetIdx, field: "descriptions", value: [text] }));
      }
    },
    generateMock: (isRegenerate) =>
      isRegenerate
        ? "Implemented OAuth 2.0 authentication and real-time features using WebSocket, reducing login time by 40%."
        : "Developed a full-stack web application using React and Node.js, serving 10K+ monthly active users with 99.9% uptime.",
  });

  return (
    <Form form="projects" addButtonText="Add Project">
      {projects.map(({ project, date, descriptions }, idx) => {
        const handleProjectChange = (
          ...args: CreateHandleChangeArgsWithDescriptions<ResumeProject>
        ) => {
          if (args[0] === "descriptions") {
            dispatch(changeProjects({ idx, field: args[0], value: args[1] }));
          } else {
            dispatch(changeProjects({ idx, field: args[0], value: args[1] }));
          }
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        const handleDelete = () => {
          if (idx === projects.length - 1) {
            dispatch(changeProjects({ idx, field: "project", value: "" }));
            dispatch(changeProjects({ idx, field: "date", value: "" }));
            dispatch(changeProjects({ idx, field: "descriptions", value: [] }));
          } else {
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
            <div className="col-span-full relative">
              <BulletListTextarea
                name="descriptions"
                label="Description"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleProjectChange}
                labelClassName="col-span-full"
              />
              {descriptions.length > 0 && (
                <div className="absolute right-2 top-8">
                  <PremiumGate>
                    <SparkleIconButton onClick={() => openPanel(idx)} color={themeColor} size="small" />
                  </PremiumGate>
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
