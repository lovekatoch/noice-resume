import settingsReducer, {
  changeSettings,
  changeShowForm,
  changeFormHeading,
  changeFormOrder,
  changeShowBulletPoints,
  setSettings,
  selectIsFirstForm,
  selectIsLastForm,
  initialSettings,
} from "lib/redux/settingsSlice";
import type { RootState } from "lib/redux/store";

const createRootState = (settings: typeof initialSettings): RootState => ({
  resume: {} as any,
  settings,
  user: {} as any,
});

describe("settingsSlice", () => {
  describe("changeSettings", () => {
    it("should update a general setting", () => {
      const state = settingsReducer(
        initialSettings,
        changeSettings({ field: "themeColor", value: "#ff0000" })
      );
      expect(state.themeColor).toBe("#ff0000");
    });

    it("should update fontFamily", () => {
      const state = settingsReducer(
        initialSettings,
        changeSettings({ field: "fontFamily", value: "Arial" })
      );
      expect(state.fontFamily).toBe("Arial");
    });

    it("should update fontSize", () => {
      const state = settingsReducer(
        initialSettings,
        changeSettings({ field: "fontSize", value: "12" })
      );
      expect(state.fontSize).toBe("12");
    });
  });

  describe("changeShowForm", () => {
    it("should toggle a form visibility", () => {
      const state = settingsReducer(
        initialSettings,
        changeShowForm({ field: "workExperiences", value: true })
      );
      expect(state.formToShow.workExperiences).toBe(true);
    });
  });

  describe("changeFormHeading", () => {
    it("should update a form heading", () => {
      const state = settingsReducer(
        initialSettings,
        changeFormHeading({ field: "educations", value: "MY EDUCATION" })
      );
      expect(state.formToHeading.educations).toBe("MY EDUCATION");
    });
  });

  describe("changeFormOrder", () => {
    it("should move a form up", () => {
      const state = settingsReducer(
        initialSettings,
        changeFormOrder({ form: "educations", type: "up" })
      );
      expect(state.formsOrder[0]).toBe("educations");
      expect(state.formsOrder[1]).toBe("workExperiences");
    });

    it("should move a form down", () => {
      const state = settingsReducer(
        initialSettings,
        changeFormOrder({ form: "workExperiences", type: "down" })
      );
      expect(state.formsOrder[1]).toBe("workExperiences");
      expect(state.formsOrder[0]).toBe("educations");
    });

    it("should not move first form up", () => {
      const state = settingsReducer(
        initialSettings,
        changeFormOrder({ form: "workExperiences", type: "up" })
      );
      expect(state.formsOrder[0]).toBe("workExperiences");
    });

    it("should not move last form down", () => {
      const state = settingsReducer(
        initialSettings,
        changeFormOrder({ form: "custom", type: "down" })
      );
      expect(state.formsOrder[4]).toBe("custom");
    });
  });

  describe("changeShowBulletPoints", () => {
    it("should toggle bullet points", () => {
      const state = settingsReducer(
        initialSettings,
        changeShowBulletPoints({ field: "educations", value: false })
      );
      expect(state.showBulletPoints.educations).toBe(false);
    });
  });

  describe("setSettings", () => {
    it("should replace entire settings state", () => {
      const newSettings = { ...initialSettings, themeColor: "#000" };
      const state = settingsReducer(
        initialSettings,
        setSettings(newSettings)
      );
      expect(state.themeColor).toBe("#000");
    });
  });

  describe("selectors", () => {
    it("selectIsFirstForm should return true for first form", () => {
      const state = createRootState(initialSettings);
      expect(selectIsFirstForm("workExperiences")(state)).toBe(true);
      expect(selectIsFirstForm("educations")(state)).toBe(false);
    });

    it("selectIsLastForm should return true for last form", () => {
      const state = createRootState(initialSettings);
      expect(selectIsLastForm("custom")(state)).toBe(true);
      expect(selectIsLastForm("workExperiences")(state)).toBe(false);
    });
  });
});
