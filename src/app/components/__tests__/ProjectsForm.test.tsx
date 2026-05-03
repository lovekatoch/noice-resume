import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "lib/redux/resumeSlice";
import settingsReducer, { initialSettings } from "lib/redux/settingsSlice";
import userReducer from "lib/redux/userSlice";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";

const renderWithStore = (resumeOverrides?: any) => {
  const store = configureStore({
    reducer: { resume: resumeReducer, settings: settingsReducer, user: userReducer },
    preloadedState: {
      settings: { ...initialSettings, formToShow: { ...initialSettings.formToShow, projects: true } },
      user: { isPremium: true, checkoutSessionId: null, customerId: null, checkoutError: null },
      resume: resumeOverrides ?? resumeReducer(undefined, { type: "__init" }),
    },
  });
  return render(<Provider store={store}><ProjectsForm /></Provider>);
};

describe("ProjectsForm", () => {
  it("renders without crashing", () => {
    renderWithStore();
    expect(screen.getByText("Add Project")).toBeTruthy();
  });

  it("renders sparkle button when descriptions exist", () => {
    renderWithStore({
      ...resumeReducer(undefined, { type: "__init" }),
      projects: [{ project: "My App", date: "2024", descriptions: ["Built stuff"] }],
    });
    const buttons = screen.getAllByLabelText("Enhance with AI");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
