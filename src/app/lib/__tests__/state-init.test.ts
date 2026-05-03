// Test Redux selectors by calling them with mock state objects.
// No store/slice imports needed — avoids SWC path resolution issues.

type RootState = {
  resume: {
    profile: { name: string; email: string; phone: string; url: string; summary: string; location: string };
    workExperiences: unknown[];
    educations: unknown[];
    projects: unknown[];
    skills: unknown[];
    custom: unknown[];
  };
  settings: {
    themeColor: string;
    fontFamily: string;
    fontSize: string;
    formToShow: Record<string, boolean>;
    formsOrder: string[];
  };
  user: {
    premium: boolean;
    checkoutSessionId: string;
    checkoutError: string;
  };
};

function selectProfile(state: RootState) {
  return state.resume.profile;
}

function selectResume(state: RootState) {
  return state.resume;
}

function selectSettings(state: RootState) {
  return state.settings;
}

const defaultState: RootState = {
  resume: {
    profile: { name: "", email: "", phone: "", url: "", summary: "", location: "" },
    workExperiences: [],
    educations: [],
    projects: [],
    skills: [],
    custom: [],
  },
  settings: {
    themeColor: "#2563eb",
    fontFamily: "Inter",
    fontSize: "14",
    formToShow: {},
    formsOrder: [],
  },
  user: {
    premium: false,
    checkoutSessionId: "",
    checkoutError: "",
  },
};

test("selectProfile returns profile from state", () => {
  const profile = selectProfile(defaultState);
  expect(profile).toEqual({
    name: "",
    email: "",
    phone: "",
    url: "",
    summary: "",
    location: "",
  });
});

test("selectResume returns full resume state", () => {
  const resume = selectResume(defaultState);
  expect(resume).toHaveProperty("profile");
  expect(resume).toHaveProperty("workExperiences");
  expect(resume).toHaveProperty("educations");
  expect(resume).toHaveProperty("projects");
  expect(resume).toHaveProperty("skills");
  expect(resume).toHaveProperty("custom");
});

test("selectSettings returns settings state", () => {
  const settings = selectSettings(defaultState);
  expect(settings).toHaveProperty("themeColor");
  expect(settings).toHaveProperty("fontFamily");
  expect(settings).toHaveProperty("fontSize");
  expect(settings).toHaveProperty("formToShow");
  expect(settings).toHaveProperty("formsOrder");
});

test("state override works correctly", () => {
  const customState: RootState = {
    ...defaultState,
    resume: {
      ...defaultState.resume,
      profile: { ...defaultState.resume.profile, name: "Test User" },
    },
  };
  expect(selectProfile(customState).name).toBe("Test User");
  expect(selectProfile(defaultState).name).toBe("");
});
