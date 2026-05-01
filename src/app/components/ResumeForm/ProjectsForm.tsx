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
import { useState } from "react";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
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
      setStreamingText("Developed a full-stack web application using React and Node.js, serving 10K+ monthly active users with 99.9% uptime.");
      setIsLoading(false);
    }, 1500);
  };

  const handleAccept = (text: string) => {
    if (aiTargetIdx !== null) {
      dispatch(changeProjects({ idx: aiTargetIdx, field: "descriptions", value: [text] } as any));
    }
    setAiPanelOpen(false);
    setStreamingText("");
    setAiTargetIdx(null);
  };

  const handleRegenerate = () => {
    setIsLoading(true);
    setStreamingText("");
    setTimeout(() => {
      setStreamingText("Implemented OAuth 2.0 authentication and real-time features using WebSocket, reducing login time by 40%.");
      setIsLoading(false);
    }, 1500);
  };

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
