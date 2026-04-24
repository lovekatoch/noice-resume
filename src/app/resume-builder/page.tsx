"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";

export default function Create() {
  return (
    <Provider store={store}>
      <main className="relative min-h-screen w-full bg-gray-50">
        {/* Desktop: Side-by-side layout | Mobile: Form stacked above Preview */}
        <div className="flex flex-col md:grid md:grid-cols-6">
          {/* Form Section - narrower on desktop */}
          <div className="w-full overflow-y-auto md:col-span-2 md:h-screen md:overflow-y-auto" style={{ maxHeight: "calc(100vh - var(--top-nav-bar-height))" }}>
            <ResumeForm />
          </div>
          {/* Preview Section - wider on desktop, full height on mobile */}
          <div className="w-full md:col-span-4">
            <Resume />
          </div>
        </div>
      </main>
    </Provider>
  );
}
