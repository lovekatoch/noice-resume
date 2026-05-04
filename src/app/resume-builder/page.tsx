"use client";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";

export default function Create() {
  return (
    <main className="relative w-full max-w-full bg-[var(--bg)]">
      <div className="flex flex-col md:grid md:grid-cols-12">
        <div className="md:col-span-5">
          <ResumeForm />
        </div>
        <div className="md:col-span-7 md:sticky md:top-0 md:h-screen md:overflow-hidden">
          <Resume />
        </div>
      </div>
    </main>
  );
}
