"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";

export default function Create() {
  return (
    <Provider store={store}>
      <main className="relative min-h-screen w-full bg-gray-50">
        {/* Desktop: Side-by-side layout | Mobile: Form and Preview each 50vh */}
        <div className="flex flex-col md:grid md:grid-cols-6 h-screen">
          {/* Form Section - narrower on desktop, 50vh on mobile */}
          <div className="h-[50vh] md:h-[calc(100vh-var(--top-nav-bar-height))] md:col-span-2 overflow-y-auto">
            <ResumeForm />
          </div>
          {/* Preview Section - wider on desktop, 50vh on mobile */}
          <div className="h-[50vh] md:h-[calc(100vh-var(--top-nav-bar-height))] md:col-span-4">
            <Resume />
          </div>
        </div>
      </main>
    </Provider>
  );
}
