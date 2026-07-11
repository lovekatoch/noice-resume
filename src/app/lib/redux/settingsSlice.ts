import type { RootState } from "lib/redux/store";

export interface Settings {
  themeColor: string;
  fontFamily: string;
  fontSize: string;
  documentSize: string;
  template: string;
  formToShow: {
    workExperiences: boolean;
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  formToHeading: {
    workExperiences: string;
    educations: string;
    projects: string;
    skills: string;
    custom: string;
  };
  formsOrder: ShowForm[];
  showBulletPoints: {
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
}

export type ShowForm = keyof Settings["formToShow"];
export type FormWithBulletPoints = keyof Settings["showBulletPoints"];
export type GeneralSetting = Exclude<
  keyof Settings,
  "formToShow" | "formToHeading" | "formsOrder" | "showBulletPoints"
>;

export const DEFAULT_THEME_COLOR = "#4338CA";
export const DEFAULT_FONT_FAMILY = "Inter";
export const DEFAULT_FONT_SIZE = "11";
export const DEFAULT_FONT_COLOR = "#171717";

export const initialSettings: Settings = {
  themeColor: DEFAULT_THEME_COLOR,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  documentSize: "Letter",
  template: "executive-simple",
  formToShow: {
    workExperiences: false,
    educations: false,
    projects: false,
    skills: false,
    custom: false,
  },
  formToHeading: {
    workExperiences: "WORK EXPERIENCE",
    educations: "EDUCATION",
    projects: "PROJECT",
    skills: "SKILLS",
    custom: "CUSTOM SECTION",
  },
  formsOrder: ["workExperiences", "educations", "projects", "skills", "custom"],
  showBulletPoints: {
    educations: true,
    projects: true,
    skills: true,
    custom: true,
  },
};

// ─── Action types ───

export type SettingsAction =
  | { type: "settings/changeSettings"; payload: { field: GeneralSetting; value: string } }
  | { type: "settings/changeShowForm"; payload: { field: ShowForm; value: boolean } }
  | { type: "settings/changeFormHeading"; payload: { field: ShowForm; value: string } }
  | { type: "settings/changeFormOrder"; payload: { form: ShowForm; type: "up" | "down" } }
  | { type: "settings/changeShowBulletPoints"; payload: { field: FormWithBulletPoints; value: boolean } }
  | { type: "settings/setSettings"; payload: Settings };

// ─── Action creators ───

export const changeSettings = (payload: { field: GeneralSetting; value: string }): SettingsAction => ({
  type: "settings/changeSettings", payload,
});
export const changeShowForm = (payload: { field: ShowForm; value: boolean }): SettingsAction => ({
  type: "settings/changeShowForm", payload,
});
export const changeFormHeading = (payload: { field: ShowForm; value: string }): SettingsAction => ({
  type: "settings/changeFormHeading", payload,
});
export const changeFormOrder = (payload: { form: ShowForm; type: "up" | "down" }): SettingsAction => ({
  type: "settings/changeFormOrder", payload,
});
export const changeShowBulletPoints = (payload: { field: FormWithBulletPoints; value: boolean }): SettingsAction => ({
  type: "settings/changeShowBulletPoints", payload,
});
export const setSettings = (payload: Settings): SettingsAction => ({
  type: "settings/setSettings", payload,
});

// ─── Reducer ───

export function settingsReducer(state: Settings = initialSettings, action: SettingsAction): Settings {
  switch (action.type) {
    case "settings/changeSettings": {
      const { field, value } = action.payload;
      return { ...state, [field]: value };
    }
    case "settings/changeShowForm": {
      const { field, value } = action.payload;
      return { ...state, formToShow: { ...state.formToShow, [field]: value } };
    }
    case "settings/changeFormHeading": {
      const { field, value } = action.payload;
      return { ...state, formToHeading: { ...state.formToHeading, [field]: value } };
    }
    case "settings/changeFormOrder": {
      const { form, type } = action.payload;
      const lastIdx = state.formsOrder.length - 1;
      const pos = state.formsOrder.indexOf(form);
      const newPos = type === "up" ? pos - 1 : pos + 1;
      if (newPos < 0 || newPos > lastIdx) return state;
      const order = [...state.formsOrder];
      [order[pos], order[newPos]] = [order[newPos], order[pos]];
      return { ...state, formsOrder: order };
    }
    case "settings/changeShowBulletPoints": {
      const { field, value } = action.payload;
      return { ...state, showBulletPoints: { ...state.showBulletPoints, [field]: value } };
    }
    case "settings/setSettings":
      return action.payload;
    default:
      return state;
  }
}

// ─── Selectors ───

export const selectSettings = (state: RootState) => state.settings;
export const selectThemeColor = (state: RootState) => state.settings.themeColor;
export const selectFormToShow = (state: RootState) => state.settings.formToShow;
export const selectShowByForm = (form: ShowForm) => (state: RootState) => state.settings.formToShow[form];
export const selectFormToHeading = (state: RootState) => state.settings.formToHeading;
export const selectHeadingByForm = (form: ShowForm) => (state: RootState) => state.settings.formToHeading[form];
export const selectFormsOrder = (state: RootState) => state.settings.formsOrder;
export const selectIsFirstForm = (form: ShowForm) => (state: RootState) => state.settings.formsOrder[0] === form;
export const selectIsLastForm = (form: ShowForm) => (state: RootState) => state.settings.formsOrder[state.settings.formsOrder.length - 1] === form;
export const selectShowBulletPoints = (form: FormWithBulletPoints) => (state: RootState) => state.settings.showBulletPoints[form];
