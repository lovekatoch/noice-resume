"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";

export default function Create() {
  return (
    <Provider store={store}>
      <main className="relative flex h-screen w-full max-w-full flex-col bg-[var(--notion-warm-white)]">
        {/* Mobile: Single scrollable column | Desktop: Side-by-side */}
        <div className="flex flex-col flex-1 overflow-y-auto md:grid md:grid-cols-12 md:h-full md:overflow-hidden">
          {/* Form Section - mobile: auto height | desktop: 45% with independent scroll */}
          <div className="md:col-span-5 md:h-full md:overflow-y-auto">
            <ResumeForm />
          </div>
          {/* Preview Section - mobile: auto height | desktop: 55% */}
          <div className="md:col-span-7 md:h-full md:overflow-hidden">
            <Resume />
          </div>
        </div>
      </main>
    </Provider>
  );
}
