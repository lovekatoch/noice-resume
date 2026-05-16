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
        const bulletItems = text.split("\n").map((line) => line.replace(/^•\s*/, "").trim()).filter(Boolean);
        dispatch(changeProjects({ idx: aiTargetIdx, field: "descriptions", value: bulletItems }));
      }
    },
  });

  const handleSparkleClick = (idx: number) => {
    const section = projects[idx];
    const prompt = `[project]
Project: ${section.project}\n${section.date ? `Duration: ${section.date}` : ''}\n${(section.descriptions || []).length > 0 ? `\nExisting bullets:\n${section.descriptions.join('\n')}` : ''}`;
    openPanel(prompt, idx, undefined, "project", section.descriptions.length);
  };

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
                onChange={handleProjectChange}
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
