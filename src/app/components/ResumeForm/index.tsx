"use client";
import {
  useAppSelector,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import { ShowForm, selectFormsOrder } from "lib/redux/settingsSlice";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "components/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "components/ResumeForm/EducationsForm";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { AutoSaveIndicator } from "components/AutoSaveIndicator";
import { ErrorBoundary } from "components/ErrorBoundary";
import { AIErrorFallback } from "components/AIErrorFallback";

const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

function AIErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error: Error, reset: () => void) => (
        <AIErrorFallback error={error} reset={reset} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);

  return (
    <div className="w-full md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll scrollbar-thin scrollbar-track-gray-100">
      <section className="flex w-full flex-col gap-3 p-4">
        <AIErrorBoundaryWrapper>
          <ProfileForm />
        </AIErrorBoundaryWrapper>
        {formsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return (
            <AIErrorBoundaryWrapper key={form}>
              <Component />
            </AIErrorBoundaryWrapper>
          );
        })}
      </section>
      <AutoSaveIndicator />
    </div>
  );
};
