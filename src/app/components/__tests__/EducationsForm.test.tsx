import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "lib/redux/resumeSlice";
import settingsReducer, { initialSettings } from "lib/redux/settingsSlice";
import userReducer from "lib/redux/userSlice";
import { SoundProvider } from "lib/sound/provider";
import { EducationsForm } from "components/ResumeForm/EducationsForm";

const renderWithStore = (resumeOverrides?: any) => {
  const store = configureStore({
    reducer: { resume: resumeReducer, settings: settingsReducer, user: userReducer },
    preloadedState: {
      settings: { ...initialSettings, formToShow: { ...initialSettings.formToShow, educations: true } },
      user: { isPremium: true, checkoutSessionId: null, customerId: null, checkoutError: null },
      resume: resumeOverrides ?? resumeReducer(undefined, { type: "__init" }),
    },
  });
  return render(
    <Provider store={store}>
      <SoundProvider>
        <EducationsForm />
      </SoundProvider>
    </Provider>
  );
};

describe("EducationsForm", () => {
  it("renders without crashing", () => {
    renderWithStore();
    expect(screen.getByText("Add School")).toBeTruthy();
  });

  it("renders sparkle button when descriptions exist", () => {
    renderWithStore({
      ...resumeReducer(undefined, { type: "__init" }),
      educations: [{ school: "MIT", degree: "BS", gpa: "4.0", date: "2024", descriptions: ["Did stuff"] }],
    });
    const buttons = screen.getAllByLabelText("Enhance with AI");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
