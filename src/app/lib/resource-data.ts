export interface ResourceMeta {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  sections: ResourceSection[];
}

export interface ResourceSection {
  heading: string;
  body: string;
}

export const RESOURCES: ResourceMeta[] = [
  {
    slug: "how-to-write-resume",
    title: "How to Write a Resume in 2025 — Complete Guide",
    headline: "How to Write a Resume That Gets Interviews",
    subheadline:
      "A step-by-step guide to building a resume that passes ATS scans, impresses hiring managers, and lands you the interview.",
    description:
      "Learn how to write a resume that actually works in 2025. This comprehensive guide covers formatting, content strategy, ATS optimization, and expert tips — with a free builder to create yours in minutes.",
    keywords: [
      "how to write a resume",
      "resume writing guide",
      "how to make a resume",
      "resume tips 2025",
      "resume writing tips",
      "professional resume guide",
      "free resume builder",
      "resume format guide",
    ],
    ogTitle: "How to Write a Resume That Gets Interviews — Complete Guide 2025",
    ogDescription:
      "Step-by-step guide to writing a resume that passes ATS and impresses hiring managers. Free builder included.",
    sections: [
      {
        heading: "Choose the right format",
        body: "There are three standard resume formats: chronological (lists experience by date, most recent first), functional (focused on skills), and hybrid/combination (mixing both). For most job seekers in 2025, the chronological format is preferred — recruiters and ATS systems are trained to scan for date-ordered experience. Use a functional format only if you have significant employment gaps or are changing industries. Whichever you choose, keep it to one page if you have fewer than 10 years of experience, and never exceed two pages.",
      },
      {
        heading: "Write a strong summary or objective",
        body: "Your resume summary is the first thing a recruiter reads. For experienced professionals, write 2-3 sentences that state your title, years of experience, key skills, and a notable achievement. For students or career changers, write an objective that explains your goal and what you bring. Avoid generic phrases like 'hardworking team player' — be specific. Example: 'Full-stack engineer with 5 years of React and Node.js experience. Led a team of 4 to ship a product that drove $2M in revenue.'",
      },
      {
        heading: "List your experience with impact-driven bullets",
        body: "Each bullet under your experience should follow the STAR method: Situation, Task, Action, Result. Focus on what you accomplished, not just what you did. Use numbers wherever possible — percentages, dollar amounts, time saved, users impacted. Start every bullet with a strong action verb (built, led, designed, optimized, launched). Example: 'Redesigned the onboarding flow, reducing drop-off by 34% and increasing activation by 1,200 users per month.'",
      },
      {
        heading: "Optimize for ATS (Applicant Tracking Systems)",
        body: "Over 75% of resumes are rejected by ATS before a human sees them. To pass ATS scans: use standard section headings (Experience, Education, Skills); include keywords from the job description naturally in your bullets; avoid tables, columns, and graphics; save and submit as PDF (unless the job posting asks for .docx); and use a clean, single-column layout. NoiceResume's templates are built ATS-first so your resume never gets filtered out.",
      },
      {
        heading: "Showcase your skills strategically",
        body: "Create a dedicated skills section with 6-12 relevant skills. Group them into categories like Technical Skills, Soft Skills, and Languages if applicable. Only list skills you can genuinely speak to in an interview. For tech roles, include your specific tools, frameworks, and languages (e.g., React, Python, AWS, SQL). For non-tech roles, include relevant software (e.g., Salesforce, Tableau, HubSpot). Check the job description and match your skills to what they're asking for.",
      },
      {
        heading: "Include education and certifications",
        body: "List your highest degree first, including the institution name, degree type, field of study, and graduation date. Include your GPA if it's 3.5 or above. For recent graduates, education can go above experience. Add relevant certifications (e.g., PMP, AWS Certified, Google Analytics) in a separate section. Include expected graduation dates if you're still in school.",
      },
      {
        heading: "Proofread and get feedback",
        body: "A single typo can cost you the interview. Read your resume aloud to catch awkward phrasing. Use a tool like Grammarly for a second pass. Ask a friend or mentor in your industry to review it. Check that your contact info (email, phone, LinkedIn, portfolio) is correct and professional. Then save as a clean PDF with a professional filename (e.g., 'Jane_Doe_Resume_2025.pdf').",
      },
      {
        heading: "Use a resume builder for speed and quality",
        body: "Instead of wrestling with Word or Google Docs formatting, use a dedicated resume builder. NoiceResume is free, requires no sign-up, and handles formatting, ATS optimization, and PDF export automatically. You can start fresh or import an existing resume. AI-powered suggestions help you write stronger bullets. Build your resume in minutes, not hours.",
      },
    ],
  },
];

export function getResourceBySlug(slug: string): ResourceMeta | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

export const SITE_URL = "https://noiceresume.pages.dev";
