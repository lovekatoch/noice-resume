"use client";
import { useRef } from "react";
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
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { CustomForm } from "components/ResumeForm/CustomForm";

const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);

  const scrollToTop = () => {
    const container = document.querySelector(".md\\:overflow-y-scroll");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToPreview = () => {
    document
      .getElementById("resume-preview")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll scrollbar-thin scrollbar-track-gray-100">
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
          Edit Resume
        </h1>
        <div
          className="flex rounded-lg p-0.5 gap-0.5"
          style={{ backgroundColor: "var(--border)" }}
        >
          <button
            type="button"
            onClick={scrollToTop}
            className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--fg)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            Content
          </button>
          <button
            type="button"
            onClick={scrollToPreview}
            className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            style={{
              backgroundColor: "transparent",
              color: "var(--muted)",
            }}
          >
            Preview
          </button>
        </div>
      </div>
      <section className="flex w-full flex-col gap-3 p-4">
        <ProfileForm />
        {formsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return <Component key={form} />;
        })}
        <ThemeForm />
      </section>
    </div>
  );
};
