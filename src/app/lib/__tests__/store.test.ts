import { store } from "lib/redux/store";
import { selectProfile, selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";

test("store boots with initial state", () => {
  const state = store.getState();
  expect(state.resume).toBeDefined();
  expect(state.settings).toBeDefined();
  expect(state.user).toBeDefined();
});

test("selectProfile returns initial profile values", () => {
  const profile = selectProfile(store.getState());
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
  const resume = selectResume(store.getState());
  expect(resume).toHaveProperty("profile");
  expect(resume).toHaveProperty("workExperiences");
  expect(resume).toHaveProperty("educations");
  expect(resume).toHaveProperty("projects");
  expect(resume).toHaveProperty("skills");
  expect(resume).toHaveProperty("custom");
});

test("selectSettings returns initial settings", () => {
  const settings = selectSettings(store.getState());
  expect(settings).toHaveProperty("themeColor");
  expect(settings).toHaveProperty("fontFamily");
  expect(settings).toHaveProperty("fontSize");
  expect(settings).toHaveProperty("formToShow");
  expect(settings).toHaveProperty("formsOrder");
});
