import type { RootState } from "lib/redux/store";
import type {
  Resume,
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
} from "lib/redux/types";
import type { ShowForm } from "lib/redux/settingsSlice";

export const initialProfile: ResumeProfile = {
  name: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  url: "",
};

export const initialWorkExperience: ResumeWorkExperience = {
  company: "",
  jobTitle: "",
  date: "",
  descriptions: [],
};

export const initialEducation: ResumeEducation = {
  school: "",
  degree: "",
  gpa: "",
  date: "",
  descriptions: [],
};

export const initialProject: ResumeProject = {
  project: "",
  date: "",
  descriptions: [],
};

export const initialSkills: ResumeSkills = {
  descriptions: [],
};

export const initialCustom = {
  descriptions: [],
};

export const initialResumeState: Resume = {
  profile: initialProfile,
  workExperiences: [initialWorkExperience],
  educations: [initialEducation],
  projects: [initialProject],
  skills: initialSkills,
  custom: initialCustom,
};

// ─── Action types ───

type ChangeDescriptionsAction<T extends { descriptions: string[] }> =
  | { [K in keyof T]: { field: K; value: T[K] } }[keyof T]
  | { field: Exclude<keyof T, "descriptions">; value: string };

export type ResumeAction =
  | { type: "resume/changeProfile"; payload: { field: keyof ResumeProfile; value: string } }
  | { type: "resume/changeWorkExperiences"; payload: { idx: number } & ChangeDescriptionsAction<ResumeWorkExperience> }
  | { type: "resume/changeEducations"; payload: { idx: number } & ChangeDescriptionsAction<ResumeEducation> }
  | { type: "resume/changeProjects"; payload: { idx: number } & ChangeDescriptionsAction<ResumeProject> }
  | { type: "resume/changeSkills"; payload: { field: "descriptions"; value: string[] } }
  | { type: "resume/changeCustom"; payload: { field: "descriptions"; value: string[] } }
  | { type: "resume/addSectionInForm"; payload: { form: ShowForm } }
  | { type: "resume/moveSectionInForm"; payload: { form: ShowForm; idx: number; direction: "up" | "down" } }
  | { type: "resume/deleteSectionInFormByIdx"; payload: { form: ShowForm; idx: number } }
  | { type: "resume/setResume"; payload: Resume };

// ─── Action creators ───

export const changeProfile = (payload: { field: keyof ResumeProfile; value: string }): ResumeAction => ({
  type: "resume/changeProfile", payload,
});
export const changeWorkExperiences = (payload: { idx: number } & ChangeDescriptionsAction<ResumeWorkExperience>): ResumeAction => ({
  type: "resume/changeWorkExperiences", payload,
});
export const changeEducations = (payload: { idx: number } & ChangeDescriptionsAction<ResumeEducation>): ResumeAction => ({
  type: "resume/changeEducations", payload,
});
export const changeProjects = (payload: { idx: number } & ChangeDescriptionsAction<ResumeProject>): ResumeAction => ({
  type: "resume/changeProjects", payload,
});
export const changeSkills = (payload: { field: "descriptions"; value: string[] }): ResumeAction => ({
  type: "resume/changeSkills", payload,
});
export const changeCustom = (payload: { field: "descriptions"; value: string[] }): ResumeAction => ({
  type: "resume/changeCustom", payload,
});
export const addSectionInForm = (payload: { form: ShowForm }): ResumeAction => ({
  type: "resume/addSectionInForm", payload,
});
export const moveSectionInForm = (payload: { form: ShowForm; idx: number; direction: "up" | "down" }): ResumeAction => ({
  type: "resume/moveSectionInForm", payload,
});
export const deleteSectionInFormByIdx = (payload: { form: ShowForm; idx: number }): ResumeAction => ({
  type: "resume/deleteSectionInFormByIdx", payload,
});
export const setResume = (payload: Resume): ResumeAction => ({
  type: "resume/setResume", payload,
});

// ─── Reducer ───

export function resumeReducer(state: Resume = initialResumeState, action: ResumeAction): Resume {
  switch (action.type) {
    case "resume/changeProfile": {
      const { field, value } = action.payload;
      return { ...state, profile: { ...state.profile, [field]: value } };
    }
    case "resume/changeWorkExperiences": {
      const { idx, field, value } = action.payload as any;
      const items = [...state.workExperiences];
      items[idx] = { ...items[idx], [field]: value };
      return { ...state, workExperiences: items };
    }
    case "resume/changeEducations": {
      const { idx, field, value } = action.payload as any;
      const items = [...state.educations];
      items[idx] = { ...items[idx], [field]: value };
      return { ...state, educations: items };
    }
    case "resume/changeProjects": {
      const { idx, field, value } = action.payload as any;
      const items = [...state.projects];
      items[idx] = { ...items[idx], [field]: value };
      return { ...state, projects: items };
    }
    case "resume/changeSkills": {
      return { ...state, skills: { ...state.skills, descriptions: action.payload.value } };
    }
    case "resume/changeCustom": {
      return { ...state, custom: { ...state.custom, descriptions: action.payload.value } };
    }
    case "resume/addSectionInForm": {
      const { form } = action.payload;
      switch (form) {
        case "workExperiences":
          return { ...state, workExperiences: [...state.workExperiences, structuredClone(initialWorkExperience)] };
        case "educations":
          return { ...state, educations: [...state.educations, structuredClone(initialEducation)] };
        case "projects":
          return { ...state, projects: [...state.projects, structuredClone(initialProject)] };
        default:
          return state;
      }
    }
    case "resume/moveSectionInForm": {
      const { form, idx, direction } = action.payload;
      if (form === "skills" || form === "custom") return state;
      const items = [...(state as any)[form]];
      if (
        (idx === 0 && direction === "up") ||
        (idx === items.length - 1 && direction === "down")
      ) return state;
      const [moved] = items.splice(idx, 1);
      items.splice(direction === "up" ? idx - 1 : idx + 1, 0, moved);
      return { ...state, [form]: items };
    }
    case "resume/deleteSectionInFormByIdx": {
      const { form, idx } = action.payload;
      if (form === "skills" || form === "custom") return state;
      const items = [...(state as any)[form]];
      items.splice(idx, 1);
      return { ...state, [form]: items };
    }
    case "resume/setResume": {
      return action.payload;
    }
    default:
      return state;
  }
}

// ─── Selectors ───

export const selectResume = (state: RootState) => state.resume;
export const selectProfile = (state: RootState) => state.resume.profile;
export const selectWorkExperiences = (state: RootState) => state.resume.workExperiences;
export const selectEducations = (state: RootState) => state.resume.educations;
export const selectProjects = (state: RootState) => state.resume.projects;
export const selectSkills = (state: RootState) => state.resume.skills;
export const selectCustom = (state: RootState) => state.resume.custom;
