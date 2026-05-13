import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "lib/redux/resumeSlice";
import settingsReducer, { initialSettings } from "lib/redux/settingsSlice";
import userReducer from "lib/redux/userSlice";
import { SkillsForm } from "components/ResumeForm/SkillsForm";

const renderWithStore = (resumeOverrides?: any) => {
  const store = configureStore({
    reducer: { resume: resumeReducer, settings: settingsReducer, user: userReducer },
    preloadedState: {
      settings: { ...initialSettings, formToShow: { ...initialSettings.formToShow, skills: true } },
      user: { isPremium: true, checkoutSessionId: null, customerId: null, checkoutError: null },
      resume: resumeOverrides ?? resumeReducer(undefined, { type: "__init" }),
    },
  });
  return render(<Provider store={store}><SkillsForm /></Provider>);
};

describe("SkillsForm", () => {
  it("renders without crashing", () => {
    renderWithStore();
    expect(screen.getByText("Skills List")).toBeTruthy();
  });

  it("renders suggest button when descriptions exist", () => {
    renderWithStore({
      ...resumeReducer(undefined, { type: "__init" }),
      skills: {
        descriptions: ["JavaScript", "Python"],
      },
    });
    expect(screen.getByText("Suggest Skills")).toBeTruthy();
  });
});
