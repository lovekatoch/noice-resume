"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ResumePDF } from "components/Resume/ResumePDF";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { initialSettings } from "lib/redux/settingsSlice";
import { useRegisterReactPDFFont } from "components/fonts/hooks";
import type { Resume } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";

const INITIAL_RESUME: Resume = {
  profile: {
    name: "Alex Chen",
    summary:
      "Full-stack engineer with 5+ years of experience building scalable web applications. Passionate about developer tools and user experience.",
    email: "alex.chen@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    url: "linkedin.com/in/alexchen",
  },
  workExperiences: [
    {
      company: "TechCorp",
      jobTitle: "Senior Software Engineer",
      date: "Jan 2022 - Present",
      descriptions: [
        "Led a team of 4 engineers building a real-time analytics dashboard serving 500K+ daily active users",
        "Reduced API response times by 40% through query optimization and caching strategy redesign",
        "Architected microservices migration that improved deployment frequency by 3x",
      ],
    },
  ],
  educations: [
    {
      school: "UC Berkeley",
      degree: "B.S. Computer Science",
      date: "2015 - 2019",
      gpa: "3.8",
      descriptions: [],
    },
  ],
  projects: [],
  skills: { descriptions: ["JavaScript/TypeScript", "React/Next.js", "Node.js", "Python", "AWS", "PostgreSQL"] },
  custom: { descriptions: [] },
};

const DEMO_TEMPLATES = [
  { id: "executive-simple", name: "Classic" },
  { id: "sb2nov-modern", name: "Modern" },
  { id: "stackoverflow", name: "Compact" },
];

const DEMO_SETTINGS: Settings = {
  ...initialSettings,
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
};

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function LiveDemo() {
  const router = useRouter();
  const [template, setTemplate] = useState("executive-simple");
  const [name, setName] = useState(INITIAL_RESUME.profile.name);
  const [jobTitle, setJobTitle] = useState(INITIAL_RESUME.workExperiences[0].jobTitle);
  const [company, setCompany] = useState(INITIAL_RESUME.workExperiences[0].company);
  const [summary, setSummary] = useState(INITIAL_RESUME.profile.summary);

  useRegisterReactPDFFont();

  const liveResume: Resume = useMemo(() => ({
    ...INITIAL_RESUME,
    profile: {
      ...INITIAL_RESUME.profile,
      name,
      summary,
    },
    workExperiences: [
      {
        ...INITIAL_RESUME.workExperiences[0],
        jobTitle,
        company,
      },
    ],
  }), [name, summary, jobTitle, company]);

  const demoSettings: Settings = useMemo(
    () => ({ ...DEMO_SETTINGS, template }),
    [template]
  );

  const handleStartBuilder = useCallback(() => {
    localStorage.removeItem("open-resume-state");
    router.push("/resume-builder");
  }, [router]);

  return (
    <section
      id="live-demo"
      className="px-6 py-20 md:py-28 scroll-mt-20"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 text-center font-display text-3xl font-light tracking-tight" style={{ color: "var(--fg)" }}>
          Try it yourself
        </h2>
        <p className="mb-10 text-center text-base" style={{ color: "var(--muted)" }}>
          Edit your details and see the resume update instantly.
        </p>

        {/* Template switcher */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {DEMO_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all"
              style={{
                backgroundColor: template === t.id ? "var(--accent)" : "var(--surface)",
                color: template === t.id ? "#fff" : "var(--fg)",
                border: "1px solid",
                borderColor: template === t.id ? "var(--accent)" : "var(--border)",
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Form + Preview grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          {/* Form panel */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h3 className="mb-5 font-semibold" style={{ color: "var(--fg)" }}>
              Your Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--fg)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Senior Software Engineer"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--fg)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="TechCorp"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--fg)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
                  Professional Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Full-stack engineer with..."
                  rows={3}
                  className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--fg)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div>
            <div
              className="mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl shadow-lg md:max-w-[520px]"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
            >
              <ResumeIframeCSR documentSize="Letter" scale={1} enablePDFViewer={false}>
                <ResumePDF resume={liveResume} settings={demoSettings} isPDF={false} />
              </ResumeIframeCSR>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={handleStartBuilder}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: "rgba(30,58,95,0.3) 0px 8px 24px -4px",
            }}
          >
            Build Yours Free
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
