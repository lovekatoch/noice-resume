"use client";

import { useMemo } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";

function computeProgress(resume: ReturnType<typeof selectResume>): number {
  let filled = 0;
  let total = 0;

  const { name, email, summary } = resume.profile;
  if (name) filled++;
  if (email) filled++;
  if (summary) filled++;
  total += 3;

  const hasWork = resume.workExperiences.some((w) => w.company || w.jobTitle);
  if (hasWork) filled++;
  total++;

  const hasEducation = resume.educations.some((e) => e.school || e.degree);
  if (hasEducation) filled++;
  total++;

  if (resume.skills.descriptions.some((d) => d)) filled++;
  total++;

  return Math.round((filled / total) * 100);
}

export function BuilderProgressIndicator() {
  const resume = useAppSelector(selectResume);
  const progress = useMemo(() => computeProgress(resume), [resume]);

  if (progress >= 100) return null;

  return (
    <div className="px-4 pt-3 pb-1">
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[11px] font-medium tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          Resume completeness
        </span>
        <span
          className="text-[11px] font-semibold tabular-nums"
          style={{ color: "var(--accent)" }}
        >
          {progress}%
        </span>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: progress > 60 ? "var(--success)" : "var(--accent)",
          }}
        />
      </div>
    </div>
  );
}
