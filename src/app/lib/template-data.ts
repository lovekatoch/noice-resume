export interface TemplateMeta {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  benefits: string[];
  sampleResumeImage: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    slug: "ats-friendly",
    title: "ATS-Friendly Resume Templates",
    headline: "ATS-Friendly Resume Templates",
    subheadline:
      "Beat the bots and get your resume in front of real humans. Clean, parseable templates built for every applicant tracking system.",
    description:
      "Most resumes never reach a hiring manager — they get filtered by an ATS before anyone reads them. NoiceResume's ATS-friendly templates are built with machine parsing in mind: clean hierarchy, standard section headings, no complex tables or graphics. Your skills, experience, and education get extracted correctly every time.",
    keywords: [
      "ATS friendly resume template",
      "ATS resume builder",
      "applicant tracking system resume",
      "resume that passes ATS",
      "ATS compliant resume template free",
      "parseable resume template",
    ],
    ogTitle: "ATS-Friendly Resume Templates — NoiceResume",
    ogDescription:
      "Beat the bots with ATS-friendly resume templates. Clean, machine-parseable layouts that get your skills seen by real recruiters.",
    benefits: [
      "Clean hierarchy that every ATS parses correctly — no tables, no graphics, no confusion",
      "Standard section headings (Experience, Education, Skills) that match ATS keyword scans",
      "AI-powered bullet rewrites that optimize your content for both ATS and human readers",
      "One-click PDF export — start free, no sign-up required",
    ],
    sampleResumeImage: "/sample-resumes/resume-classic-1.png",
  },
  {
    slug: "internship",
    title: "Resume Templates for First Internship",
    headline: "Resume for Your First Internship",
    subheadline:
      "No experience? No problem. Templates designed to highlight your coursework, projects, and potential.",
    description:
      "Landing your first internship is about potential, not pedigree. NoiceResume's internship templates help you frame coursework, side projects, leadership roles, and relevant skills into a compelling story — even with zero formal work experience. Built to pass ATS scans at every top company.",
    keywords: [
      "internship resume template",
      "first internship resume",
      "resume with no experience",
      "college internship resume builder",
      "entry level resume template",
      "resume for students with no work experience",
    ],
    ogTitle: "Internship Resume Templates — NoiceResume",
    ogDescription:
      "Land your first internship with a resume that highlights your potential. Free templates for students with no experience.",
    benefits: [
      "Structure that emphasizes coursework, projects, and leadership over formal experience",
      "AI-powered suggestions that reframe academic work into professional outcomes",
      "ATS-optimized parsing so you don't get filtered out before a human sees your potential",
      "Free PDF export — no sign-up, no credit card, no catch",
    ],
    sampleResumeImage: "/sample-resumes/resume-modern-1.png",
  },
  {
    slug: "tech",
    title: "Resume Templates for Tech Jobs",
    headline: "Resume Templates for Tech Jobs",
    subheadline:
      "Built for engineers, PMs, and designers. Your tech stack, projects, and impact — front and center.",
    description:
      "Tech hiring moves fast. Recruiters spend seconds scanning for the right keywords, the right companies, and the right impact. NoiceResume's tech templates give you a clean signal: put your tech stack at the top, quantify your impact, and let your projects speak. Optimized for every ATS and every hiring manager's eyeballs.",
    keywords: [
      "tech resume template",
      "software engineer resume template",
      "tech resume builder",
      "developer resume template",
      "programming resume template",
      "IT resume template free",
    ],
    ogTitle: "Tech Resume Templates — NoiceResume",
    ogDescription:
      "Fast, clean tech resume templates. Built for engineers, PMs, and designers who want their impact to speak first.",
    benefits: [
      "Tech-stack-first layout that puts your languages, frameworks, and tools front and center",
      "AI bullet rewrites that turn task lists into measurable engineering impact",
      "ATS-tested parsing so your React, Python, and AWS keywords survive the bots",
      "Free PDF export in one click — no account required",
    ],
    sampleResumeImage: "/sample-resumes/resume-stackoverflow-1.png",
  },
  {
    slug: "college",
    title: "College Student Resume Templates",
    headline: "College Student Resume Templates",
    subheadline:
      "Make your education, internships, and campus leadership work for you. Built for students entering the workforce.",
    description:
      "Your college resume needs to bridge academic life with professional expectations. NoiceResume's college templates give you dedicated space for your GPA, relevant coursework, campus leadership, part-time work, and internships — all in a format that hiring managers trust. Start from scratch or import what you have.",
    keywords: [
      "college student resume template",
      "student resume builder",
      "college resume template free",
      "undergraduate resume template",
      "resume for college students with no experience",
      "graduate resume template",
    ],
    ogTitle: "College Student Resume Templates — NoiceResume",
    ogDescription:
      "Free college student resume templates. Highlight your GPA, coursework, internships, and campus leadership.",
    benefits: [
      "Dedicated sections for GPA, coursework, campus leadership, and part-time work",
      "AI suggestions that help you frame academic projects as professional experience",
      "ATS-friendly formatting that keeps your resume in the running at every company",
      "Start fresh or import an existing PDF — free, no sign-up",
    ],
    sampleResumeImage: "/sample-resumes/resume-classic-2.png",
  },
  {
    slug: "modern",
    title: "Modern Resume Templates",
    headline: "Modern Resume Templates",
    subheadline:
      "Clean, contemporary designs that stand out without sacrificing ATS compatibility.",
    description:
      "Your resume should look current without breaking the parsers. NoiceResume's modern templates strike the perfect balance — thoughtful typography, generous whitespace, and subtle design touches that signal taste, all while keeping your content machine-parseable. Choose from multiple layout variants.",
    keywords: [
      "modern resume template",
      "modern resume builder free",
      "contemporary resume template",
      "clean resume template",
      "minimalist resume template",
      "professional resume template 2025",
    ],
    ogTitle: "Modern Resume Templates — NoiceResume",
    ogDescription:
      "Clean, contemporary resume templates that stand out without breaking ATS parsing. Free to use, no sign-up required.",
    benefits: [
      "Thoughtful typography and spacing that signals design taste without sacrificing parsability",
      "Multiple layout variants so you can choose the look that fits your industry",
      "AI-powered content suggestions that polish your bullet points",
      "Instant PDF export — completely free, no account needed",
    ],
    sampleResumeImage: "/sample-resumes/resume-modern-2.png",
  },
];

export const BONUS_TEMPLATES: TemplateMeta[] = [
  {
    slug: "software-engineer",
    title: "Software Engineer Resume Template",
    headline: "Software Engineer Resume",
    subheadline: "Built by engineers, for engineers. ATS-friendly templates that highlight your tech stack, projects, and impact.",
    description:
      "Land your next engineering role with a resume built for technical hiring. NoiceResume's software engineer template prioritizes your tech stack, work experience, and measurable impact.",
    keywords: [
      "software engineer resume",
      "software engineer resume template",
      "tech resume builder",
      "SWE resume",
      "engineering resume template",
      "developer resume",
    ],
    ogTitle: "Software Engineer Resume Template — NoiceResume",
    ogDescription:
      "ATS-friendly software engineer resume template. Built for engineers who want their tech stack and impact to speak first.",
    benefits: [
      "ATS-optimized parsing so your skills and experience aren't lost in translation",
      "AI-powered bullet suggestions that turn tasks into measurable outcomes",
      "Clean, minimal layout that puts your technical signal front and center",
      "Export to PDF in one click — no sign-up walls or paywalls",
    ],
    sampleResumeImage: "/sample-resumes/resume-classic-1.png",
  },
  {
    slug: "product-manager",
    title: "Product Manager Resume Template",
    headline: "Product Manager Resume",
    subheadline: "Showcase your product sense, cross-functional leadership, and shipped outcomes.",
    description:
      "Your PM resume needs to tell a story of impact. NoiceResume's product manager template gives you the structure to frame every bullet around the results you delivered.",
    keywords: [
      "product manager resume",
      "PM resume template",
      "product manager resume builder",
      "technical PM resume",
      "product lead resume",
    ],
    ogTitle: "Product Manager Resume Template — NoiceResume",
    ogDescription:
      "Story-driven product manager resume template. Frame every bullet around outcomes, not output.",
    benefits: [
      "Impact-first formatting that surfaces business outcomes over task lists",
      "AI rewrites that transform feature descriptions into product leadership stories",
      "Cross-functional experience section to highlight stakeholder collaboration",
      "Free PDF export — start in seconds, no account required",
    ],
    sampleResumeImage: "/sample-resumes/resume-modern-1.png",
  },
  {
    slug: "data-scientist",
    title: "Data Scientist Resume Template",
    headline: "Data Scientist Resume",
    subheadline: "Let your models and metrics do the talking.",
    description:
      "Data science hiring is signal-dense. NoiceResume's data scientist template organizes your publications, projects, and performance metrics into a clean hierarchy.",
    keywords: [
      "data scientist resume",
      "data scientist resume template",
      "ML engineer resume",
      "AI resume builder",
      "machine learning resume",
    ],
    ogTitle: "Data Scientist Resume Template — NoiceResume",
    ogDescription:
      "Metric-driven data scientist resume template. Optimized for ML roles and ATS parsing.",
    benefits: [
      "Structured sections for publications, projects, and performance benchmarks",
      "AI-powered descriptions that quantify your model lifts and business impact",
      "ATS-friendly parsing for keywords like TensorFlow, PyTorch, SQL, and Python",
      "Instant PDF download — no sign-up, no credit card",
    ],
    sampleResumeImage: "/sample-resumes/resume-modern-2.png",
  },
  {
    slug: "marketing",
    title: "Marketing Resume Template",
    headline: "Marketing Resume",
    subheadline: "Campaigns, conversions, and brand impact — organized into a resume that tells your growth story.",
    description:
      "Marketing hiring is about results. NoiceResume's marketing template puts your metrics front and center.",
    keywords: [
      "marketing resume template",
      "marketing resume builder",
      "digital marketing resume",
      "growth marketing resume",
      "brand manager resume",
    ],
    ogTitle: "Marketing Resume Template — NoiceResume",
    ogDescription:
      "Results-driven marketing resume template. Highlight campaign metrics, channel expertise, and brand impact.",
    benefits: [
      "Metric-first layout that lifts your CAC, LTV, pipeline, and conversion numbers",
      "AI suggestions that reframe tasks into growth outcomes",
      "Flexible sections for campaign work, brand strategy, and channel expertise",
      "Free, fast, no-account PDF export",
    ],
    sampleResumeImage: "/sample-resumes/resume-classic-2.png",
  },
  {
    slug: "ux-designer",
    title: "UX Designer Resume Template",
    headline: "UX Designer Resume",
    subheadline: "Design your resume like you design products — clean, intentional, and portfolio-ready.",
    description:
      "Your resume is the first product you ship to a design team. NoiceResume's UX designer template balances visual polish with ATS readability.",
    keywords: [
      "UX designer resume",
      "UX designer resume template",
      "product designer resume",
      "UI designer resume template",
      "design resume builder",
    ],
    ogTitle: "UX Designer Resume Template — NoiceResume",
    ogDescription:
      "Portfolio-ready UX designer resume template. Clean, visual, and ATS-friendly.",
    benefits: [
      "Elegant layout with room for portfolio links, tooling, and design process",
      "AI writing assistance that frames design decisions as business impact",
      "ATS-optimized so your Figma, Sketch, and prototyping chops get parsed correctly",
      "One-click PDF export — no sign-up required",
    ],
    sampleResumeImage: "/sample-resumes/resume-classic-1.png",
  },
  {
    slug: "business-analyst",
    title: "Business Analyst Resume Template",
    headline: "Business Analyst Resume",
    subheadline: "Bridge the gap between business and engineering with a resume that proves your analytical impact.",
    description:
      "Business analysts live at the intersection of data, process, and stakeholder management. NoiceResume's BA template gives you dedicated space for your skills.",
    keywords: [
      "business analyst resume",
      "business analyst resume template",
      "BA resume builder",
      "technical business analyst resume",
    ],
    ogTitle: "Business Analyst Resume Template — NoiceResume",
    ogDescription:
      "Structured business analyst resume template. Showcase your data analysis, requirements, and stakeholder work.",
    benefits: [
      "Organized sections for requirements, data analysis, and process improvement",
      "AI-powered rewrites that highlight your stakeholder impact",
      "Tool-agnostic formatting that works for SQL, JIRA, Tableau, and more",
      "Free instant PDF download — no account needed",
    ],
    sampleResumeImage: "/sample-resumes/resume-modern-1.png",
  },
  {
    slug: "project-manager",
    title: "Project Manager Resume Template",
    headline: "Project Manager Resume",
    subheadline: "Show them you can deliver. A resume built around scope, budget, timeline, and team leadership.",
    description:
      "Project management hiring is about proven delivery. NoiceResume's PM template structures your certifications and project outcomes.",
    keywords: [
      "project manager resume",
      "project manager resume template",
      "PMP resume",
      "technical project manager resume",
      "program manager resume template",
    ],
    ogTitle: "Project Manager Resume Template — NoiceResume",
    ogDescription:
      "Delivery-focused project manager resume template. PMP-friendly and ATS-optimized.",
    benefits: [
      "Clear hierarchy for certifications, methodologies, and project outcomes",
      "AI assistance that turns task lists into delivery narratives",
      "Sections for budget ownership, timeline management, and cross-team leadership",
      "Free PDF export — create and download in minutes",
    ],
    sampleResumeImage: "/sample-resumes/resume-classic-2.png",
  },
  {
    slug: "graphic-designer",
    title: "Graphic Designer Resume Template",
    headline: "Graphic Designer Resume",
    subheadline: "A visual resume that doesn't break ATS. Stand out without sacrificing parsability.",
    description:
      "Graphic designers face a unique challenge. NoiceResume's designer template strikes the balance — visual structure and ATS compatibility.",
    keywords: [
      "graphic designer resume",
      "graphic designer resume template",
      "creative resume builder",
      "visual designer resume",
    ],
    ogTitle: "Graphic Designer Resume Template — NoiceResume",
    ogDescription:
      "Visual yet ATS-friendly graphic designer resume template. Stand out without breaking parsers.",
    benefits: [
      "Polished layout that reflects design taste without sacrificing ATS parsing",
      "Sections for portfolio links, software proficiency, and creative process",
      "AI-powered descriptions that articulate the business impact of design work",
      "Instant PDF export — no sign-up, no friction",
    ],
    sampleResumeImage: "/sample-resumes/resume-stackoverflow-1.png",
  },
];

export const ALL_TEMPLATES = [...TEMPLATES, ...BONUS_TEMPLATES];

export function getTemplateBySlug(slug: string): TemplateMeta | undefined {
  return ALL_TEMPLATES.find((t) => t.slug === slug);
}

export const SITE_URL = "https://noiceresume.pages.dev";
