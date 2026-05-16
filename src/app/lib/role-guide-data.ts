export interface RoleGuideSection {
  heading: string;
  body: string;
}

export interface RoleGuideMeta {
  slug: string;
  title: string;
  role: string;
  headline: string;
  subheadline: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  sections: RoleGuideSection[];
}

export const ROLE_GUIDES: RoleGuideMeta[] = [
  {
    slug: "software-engineer",
    title: "Software Engineer Resume Guide",
    role: "Software Engineer",
    headline: "How to Write a Software Engineer Resume That Gets Noticed",
    subheadline: "Tech hiring moves fast. Here's how to build a resume that survives the ATS and impresses engineering managers.",
    description: "Complete guide to writing a software engineer resume that lands interviews. Covering tech stack sections, impact-driven bullet points, project highlights, and ATS optimization for engineering roles.",
    keywords: [
      "software engineer resume",
      "how to write a software engineer resume",
      "SWE resume tips",
      "engineering resume guide",
      "tech resume examples",
      "developer resume advice",
    ],
    ogTitle: "Software Engineer Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a software engineer resume that passes ATS and impresses hiring managers. Tech stack, impact bullets, projects.",
    sections: [
      {
        heading: "Lead with your tech stack",
        body: "Engineering managers and recruiters scan for specific technologies. Create a prominent technical skills section at the top of your resume listing your languages (Python, TypeScript, Go), frameworks (React, Django, Spring), tools (Docker, Kubernetes, AWS), and databases (PostgreSQL, Redis, MongoDB). Group them by category and only list things you can speak to in an interview. Keep this to 8-12 items total — more looks like keyword stuffing.",
      },
      {
        heading: "Write impact-driven experience bullets",
        body: "Every bullet under your work experience should answer: what did you build, and what happened as a result? Use the format: action verb + what you did + measurable outcome. Examples: 'Redesigned the payment flow, reducing checkout time by 40% and increasing conversion by 12%.' 'Built a real-time notification system handling 50K events/minute with 99.9% uptime.' 'Migrated 200K users from a legacy monolith to microservices with zero downtime.' Avoid listing tasks — focus on outcomes.",
      },
      {
        heading: "Feature projects prominently",
        body: "For engineers, projects matter almost as much as experience. Include 2-3 significant projects with descriptions of the problem, your approach, the tech used, and the result. Link to live demos or GitHub repos. Even for senior engineers, recent side projects signal curiosity and modern skills. For each project, include 2-3 bullet points following the same impact format as your experience section.",
      },
      {
        heading: "Optimize for technical ATS scans",
        body: "Engineering resumes are heavily ATS-scanned for specific tech keywords. Include the exact technologies mentioned in job descriptions. Use standard section headings (Experience, Education, Skills, Projects). Save as PDF. NoiceResume's tech templates are built for this — they put your tech stack front and center while keeping everything machine-parseable.",
      },
      {
        heading: "Keep it to one page (two max)",
        body: "If you have under 10 years of experience, one page is the standard. For senior engineers (10+ years), two pages are acceptable but be ruthless about cutting old roles. Your most recent role should have 4-6 bullets, older roles get 2-3. Remove anything from before 2015 unless it's highly relevant to your target role.",
      },
      {
        heading: "Include open source and community work",
        body: "Contributions to open source projects, speaking at conferences, technical blog posts, and Stack Overflow activity all signal engaged engineering talent. Create a separate 'Community' or 'Open Source' section if you have meaningful contributions. This is especially valuable for mid-level engineers looking to stand out.",
      },
    ],
  },
  {
    slug: "product-manager",
    title: "Product Manager Resume Guide",
    role: "Product Manager",
    headline: "How to Write a Product Manager Resume That Tells a Story",
    subheadline: "PM hiring is about outcomes, not output. Your resume needs to show you can ship products that move metrics.",
    description: "Guide to writing a product manager resume that stands out. Covering outcome-driven bullets, product sense demonstration, cross-functional leadership, and quantitative impact for PM roles.",
    keywords: [
      "product manager resume",
      "PM resume guide",
      "how to write a product manager resume",
      "product management resume tips",
      "PM resume examples",
      "technical product manager resume",
    ],
    ogTitle: "Product Manager Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a product manager resume. Showcase shipped outcomes, cross-functional leadership, and product strategy that hiring teams look for.",
    sections: [
      {
        heading: "Lead with outcomes, not output",
        body: "Product management hiring is about what you achieved, not what you worked on. Every bullet should quantify the business impact of your work. Instead of 'Managed the checkout flow,' write 'Redesigned the checkout experience, reducing drop-off by 34% and increasing revenue by $2.4M annually.' Focus on metrics: user adoption, revenue, retention, NPS, time-to-market, engineering velocity.",
      },
      {
        heading: "Show your product sense",
        body: "Hiring managers want to see that you understand why products succeed. Include examples of product discovery — how you identified user problems, validated solutions, and made prioritization decisions. Describe a specific instance where you used data to make a tough product call. Mention your framework (RICE, ICE, opportunity scoring) and how it shaped the roadmap.",
      },
      {
        heading: "Demonstrate cross-functional leadership",
        body: "PMs don't build products alone. Highlight your ability to lead engineering, design, marketing, and executive stakeholders. Include examples of unblocking teams, resolving conflicting priorities, and building consensus. Specifics like 'Coordinated 3 engineering teams across 2 time zones to ship a cross-platform feature in 6 weeks' show real leadership.",
      },
      {
        heading: "Structure for the PM hiring process",
        body: "Your resume should follow a logical narrative: current role (most details) to past roles (fewer details). Include a 2-3 line summary at the top stating your PM philosophy and what you've shipped. List the types of products you've owned (consumer, B2B, platform) and company stages (early startup, growth stage, enterprise). This helps hiring managers quickly assess fit.",
      },
      {
        heading: "Include strategy and vision work",
        body: "Senior PM roles require strategic thinking. Include examples of product vision documents you've written, OKRs you've set, and 6-12 month roadmaps you've driven. Metrics like 'Grew MAU from 50K to 200K over 4 quarters' or 'Led strategy that resulted in $10M Series A' are powerful signals.",
      },
      {
        heading: "Don't forget domain expertise",
        body: "PM roles often require specific domain knowledge. If you're applying to fintech, highlight your experience with payments, compliance, or financial data. For B2B SaaS, emphasize your understanding of enterprise sales cycles and customer onboarding. Tailor your resume to emphasize domain-relevant achievements.",
      },
    ],
  },
  {
    slug: "data-scientist",
    title: "Data Scientist Resume Guide",
    role: "Data Scientist",
    headline: "How to Write a Data Scientist Resume That Proves Your Impact",
    subheadline: "Data science hiring is metric-obsessed. Your resume needs to show model performance, business outcomes, and technical depth.",
    description: "Guide to writing a data scientist resume with quantifiable impact. ML models deployed, experiments run, business lift generated. Tips for research publications, technical skills, and ATS optimization.",
    keywords: [
      "data scientist resume",
      "data science resume guide",
      "ML engineer resume",
      "how to write a data scientist resume",
      "machine learning resume tips",
      "AI resume builder",
    ],
    ogTitle: "Data Scientist Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a data scientist resume. Show model lift, business impact, and technical depth with quantifiable metrics.",
    sections: [
      {
        heading: "Quantify your model impact",
        body: "Data science is measured in metrics. Every project on your resume should include a quantifiable result: model accuracy, precision/recall, revenue lift, cost savings, or time reduction. Instead of 'Built a recommendation system,' write 'Developed a collaborative filtering model that increased click-through rate by 28% and drove $1.2M in incremental revenue.' ML hiring managers scan for numbers first.",
      },
      {
        heading: "Show the full data pipeline",
        body: "Companies want data scientists who can own the full pipeline — from data collection to deployment. Include examples of data engineering (ETL pipelines, data warehousing), analysis (statistical testing, A/B experiments), modeling (algorithm selection, hyperparameter tuning), and MLOps (deployment, monitoring, retraining). This signals you can operate independently.",
      },
      {
        heading: "Feature publications and open source work",
        body: "Research publications, conference papers, and open source contributions are powerful signals in data science. Create a dedicated 'Publications' or 'Research' section. For each publication, include the venue, title, and your contribution. Open source projects are equally valuable — link to repos and describe the problem your code solves.",
      },
      {
        heading: "List your technical stack strategically",
        body: "Organize your technical skills by category: Languages (Python, R, SQL), ML Frameworks (PyTorch, TensorFlow, scikit-learn), Data Tools (Spark, Airflow, dbt), Cloud (AWS SageMaker, GCP, Azure), and Visualization (Tableau, Streamlit, matplotlib). Focus on the tools most relevant to your target role and match keywords from the job description.",
      },
      {
        heading: "Structure for ATS and human readers",
        body: "Use clear section headings: Summary, Technical Skills, Experience, Projects, Publications, Education. Your summary should be 2-3 lines covering your years of experience, key techniques (NLP, computer vision, forecasting), and the industries you've applied them to. Keep formatting clean — no multi-column layouts that confuse parsers.",
      },
      {
        heading: "Include domain-specific achievements",
        body: "Tailor your resume to the industry. For healthcare DS roles, highlight work with patient data, clinical trials, or medical imaging. For fintech, emphasize fraud detection, risk modeling, or time-series forecasting. Domain expertise is a differentiator that can set you apart from other candidates with similar technical skills.",
      },
    ],
  },
  {
    slug: "marketing",
    title: "Marketing Resume Guide",
    role: "Marketer",
    headline: "How to Write a Marketing Resume That Shows Growth",
    subheadline: "Marketing hiring is about results. Your resume needs to show campaign performance, channel expertise, and revenue impact.",
    description: "Guide to writing a marketing resume that lands interviews. Metric-driven bullets, channel expertise, campaign results, and brand impact for growth marketing, digital marketing, and brand management roles.",
    keywords: [
      "marketing resume",
      "marketing resume guide",
      "how to write a marketing resume",
      "growth marketing resume",
      "digital marketing resume tips",
      "brand manager resume",
    ],
    ogTitle: "Marketing Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a marketing resume. Show campaigns, conversions, channel growth, and revenue impact with data-driven bullets.",
    sections: [
      {
        heading: "Lead with metrics",
        body: "Marketing is one of the most metric-driven fields. Every bullet should include a number: conversion rates, pipeline generated, cost per acquisition, email open rates, social engagement, or revenue influenced. Instead of 'Managed Facebook ad campaigns,' write 'Managed $500K monthly Facebook ad spend, achieving 3.2x ROAS and reducing CPA by 24% quarter-over-quarter.' Hiring managers want to see you understand the business impact of your work.",
      },
      {
        heading: "Showcase your channel expertise",
        body: "Modern marketing spans multiple channels. Create a clear picture of where you excel: paid search (Google Ads, Bing), paid social (Meta, LinkedIn, TikTok), SEO/content, email marketing, affiliate, or traditional channels. For each role, specify which channels you owned and the results. If you're a full-funnel marketer, show how you connect top-of-funnel awareness to bottom-of-funnel conversion.",
      },
      {
        heading: "Demonstrate strategic thinking",
        body: "Senior marketing roles require strategy, not just execution. Include examples of campaign strategy, budget allocation decisions, audience segmentation approaches, and testing frameworks you've designed. Phrases like 'Developed a 3-channel acquisition strategy that reduced blended CPA by 35%' signal strategic capability beyond day-to-day execution.",
      },
      {
        heading: "Include tools and platforms",
        body: "Marketing tech stacks are complex. List your proficiency with key tools: analytics (Google Analytics, Mixpanel, Amplitude), CRM (HubSpot, Salesforce), advertising platforms (Google Ads, Meta Business Suite), email (Klaviyo, Mailchimp), and SEO (Ahrefs, SEMrush). Group them by category and be honest about your proficiency level.",
      },
      {
        heading: "Structure for quick scanning",
        body: "Recruiters spend seconds on marketing resumes. Use a clean format with your summary, key metrics highlighted, and achievements formatted for quick scanning. Your experience section should lead each role with 2-3 overarching impact metrics, then dive into specific campaigns and channel results.",
      },
      {
        heading: "Tailor to the marketing discipline",
        body: "Marketing is broad. Tailor your resume to the specific discipline: growth marketing (emphasize experiments and CAC/LTV), brand marketing (campaign creative and brand lift studies), demand gen (pipeline and MQLs), or product marketing (launches and messaging). Generic marketing resumes get lost — specific ones get interviews.",
      },
    ],
  },
  {
    slug: "ux-designer",
    title: "UX/UI Designer Resume Guide",
    role: "UX/UI Designer",
    headline: "How to Write a UX Designer Resume That Opens Doors",
    subheadline: "Your resume is the first product you ship to a design team. Make it count — while keeping it ATS-friendly.",
    description: "Guide to writing a UX/UI designer resume that balances visual polish with ATS readability. Portfolio strategy, design process storytelling, and impact-driven case studies for design roles.",
    keywords: [
      "UX designer resume",
      "UI designer resume guide",
      "how to write a UX designer resume",
      "product designer resume",
      "design portfolio tips",
      "UX resume examples",
    ],
    ogTitle: "UX Designer Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a UX designer resume. Balance visual polish with ATS readability, showcase your design process, and land interviews.",
    sections: [
      {
        heading: "Balance visual design with ATS compatibility",
        body: "UX designers face a unique challenge: your resume should look good, but it also needs to pass ATS scans. Avoid the trap of elaborate Canva-style resumes that bots can't parse. Instead, use clean typography, intentional whitespace, and subtle visual hierarchy — all within a single-column, machine-readable layout. NoiceResume's UX designer template achieves this balance: it looks polished without breaking parsers.",
      },
      {
        heading: "Frame design decisions as business impact",
        body: "Great designers don't just make things look good — they drive business outcomes. Every project on your resume should connect design decisions to measurable results. Instead of 'Redesigned the onboarding flow,' write 'Redesigned the onboarding flow, reducing time-to-completion by 40% and increasing day-1 activation by 25%.' Metrics like conversion lift, NPS improvement, task success rate, and user satisfaction scores belong on your resume.",
      },
      {
        heading: "Showcase your design process",
        body: "Hiring managers want to see how you think. Include examples that show your end-to-end design process: research (user interviews, usability testing), ideation (sketches, wireframes, prototyping), visual design (design systems, components), and delivery (engineering handoff, QA). For each major project, briefly describe your process and the outcome. This signals you're a mature designer who can operate independently.",
      },
      {
        heading: "Include portfolio links prominently",
        body: "Your resume gets you the interview; your portfolio gets you the job. Include links to your portfolio website, Dribbble, Behance, or GitHub with design repos. Make sure the links are clickable and the portfolio is up to date. If you have case studies, mention the most relevant 2-3 on your resume with a brief callout of the problem and result.",
      },
      {
        heading: "List your tools and skills",
        body: "Create a skills section with your design tools (Figma, Sketch, Adobe CC, Framer), prototyping (Principle, Protopie, Origami), research tools (UserTesting, Hotjar, Dovetail), and adjacent skills (HTML/CSS, motion design, illustration). This helps recruiters and ATS match you to role requirements.",
      },
      {
        heading: "Tailor to the role type",
        body: "Product design roles emphasize systems thinking and cross-functional collaboration. UX research roles prioritize methodology and insight synthesis. Visual/UI roles focus on pixel-perfect execution and design systems. Tailor your resume language and featured projects to the specific type of design role you're targeting.",
      },
    ],
  },
  {
    slug: "project-manager",
    title: "Project Manager Resume Guide",
    role: "Project Manager",
    headline: "How to Write a Project Manager Resume That Proves You Deliver",
    subheadline: "PM hiring is about proven delivery. Your resume needs to show scope, budget, timeline, and team leadership.",
    description: "Guide to writing a project manager resume. Highlight certifications, delivery track record, budget ownership, and cross-functional team leadership with quantifiable project outcomes.",
    keywords: [
      "project manager resume",
      "project manager resume guide",
      "how to write a project manager resume",
      "PMP resume tips",
      "PMP certification resume",
      "program manager resume",
    ],
    ogTitle: "Project Manager Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a project manager resume. Show certifications, delivery metrics, and team leadership with quantifiable results.",
    sections: [
      {
        heading: "Quantify your delivery track record",
        body: "Project management is about getting things done. Every role should include the scope of what you delivered. Instead of 'Managed software projects,' write 'Led 5 cross-functional teams to deliver a $2M SaaS platform on time and 8% under budget.' Include project size (budget, team size, duration), methodology (Agile, Waterfall, hybrid), and outcome (on time, under budget, specific deliverables).",
      },
      {
        heading: "Lead with certifications",
        body: "Certifications matter in project management. PMP, PRINCE2, Scrum Master (CSM), SAFe, and PMI-ACP are valuable signals. Create a dedicated certifications section near the top of your resume. Include the certifying body and year obtained. If you're actively pursuing a certification, note it — many employers value the commitment even before you've passed.",
      },
      {
        heading: "Show stakeholder and team leadership",
        body: "PMs succeed through others. Highlight examples of stakeholder management — aligning executives, resolving conflicts, communicating status across levels. Show how you led teams you didn't manage: coordinating contractors, aligning vendors, motivating cross-functional teams. 'Managed 3 internal teams and 2 external agencies to deliver a unified platform launch' shows real PM capability.",
      },
      {
        heading: "Feature methodology expertise",
        body: "Include your methodology experience prominently. Have you implemented Scrum or Kanban from scratch? Managed a SAFe transformation? Run Waterfall projects with phase gates? The range of methodologies you've used signals adaptability. For each role, note the methodology and your specific role within it (Scrum Master, Product Owner, Program Manager).",
      },
      {
        heading: "Include risk management examples",
        body: "Senior PM roles value risk management. Include examples of how you identified, mitigated, and managed risks. 'Identified a critical path risk 6 weeks before launch, implemented a mitigation plan that saved $500K and maintained the timeline' is a powerful bullet that shows proactive thinking.",
      },
      {
        heading: "Structure your resume for keywords",
        body: "PM resumes are scanned for specific terms: methodology (Agile, Waterfall), tools (JIRA, MS Project, Asana, Trello), frameworks (PMBOK, Scrum, Kanban), and certifications (PMP, CSM). Ensure these keywords appear naturally throughout your resume. Use NoiceResume's PM template which organizes these sections cleanly.",
      },
    ],
  },
  {
    slug: "nurse",
    title: "Nurse Resume Guide",
    role: "Nurse",
    headline: "How to Write a Nursing Resume That Gets You Hired",
    subheadline: "Healthcare hiring is competitive and credential-driven. Your resume needs to show clinical skills, patient outcomes, and license certifications up front.",
    description: "Complete guide to writing a nursing resume for RNs, LPNs, and NPs. Covering clinical skills, patient care metrics, certifications, and ATS optimization for healthcare roles.",
    keywords: [
      "nursing resume",
      "RN resume guide",
      "how to write a nursing resume",
      "registered nurse resume tips",
      "healthcare resume examples",
      "nurse practitioner resume",
    ],
    ogTitle: "Nurse Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a nursing resume. Show clinical expertise, patient outcomes, and certifications that healthcare recruiters look for.",
    sections: [
      {
        heading: "Lead with your license and certifications",
        body: "Healthcare employers scan for credentials first. Place your license (RN, LPN, NP) and certifications (BLS, ACLS, PALS, CCRN, CEN) at the top of your resume. Include your license number and state. If you have specialty certifications like oncology, critical care, or pediatrics, list them prominently — they're often required and differentiate you immediately.",
      },
      {
        heading: "Quantify patient care and outcomes",
        body: "Nursing is outcome-driven. Every role should include the scope of your clinical work. Instead of 'Provided patient care,' write 'Managed a 6-bed ICU unit, achieving a 15% reduction in central line infections through standardized protocols.' Include patient ratios, unit size, caseload, quality metrics, and specific improvements you drove. Numbers prove your impact beyond your job description.",
      },
      {
        heading: "Showcase your clinical skills and specialties",
        body: "Create a dedicated clinical skills section listing your technical competencies: IV therapy, wound care, ventilator management, telemetry, EMR systems (Epic, Cerner, Meditech), and unit-specific skills. Group them by category — critical care, pediatrics, emergency, med-surg, oncology — to make your resume scannable for both ATS and nurse recruiters.",
      },
      {
        heading: "Document your clinical experience by unit type",
        body: "Nurse managers want to know exactly where you've worked. For each role, specify: unit type (ICU, ER, Med-Surg, OR, PACU, L&D), bed count, patient population, shift type, and whether you precepted students or served as charge nurse. Include float pool or travel experience — adaptability across units signals a versatile clinician.",
      },
      {
        heading: "Include continuing education and professional involvement",
        body: "Nursing values lifelong learning. List recent CEUs, specialty courses, conferences attended, and committee participation. Involvement in shared governance, quality improvement initiatives, or magnet designation efforts signals leadership potential. If you've presented at conferences or published in nursing journals, create a dedicated section.",
      },
      {
        heading: "Structure for healthcare ATS systems",
        body: "Hospital ATS systems scan for specific credentials, unit types, and EMR experience. Use standard section headings: License & Certifications, Clinical Experience, Education, Clinical Skills. Include exact job titles from target postings. Save as PDF. NoiceResume's templates are built for this — they keep your credentials front and center.",
      },
    ],
  },
  {
    slug: "sales",
    title: "Sales Resume Guide",
    role: "Sales Professional",
    headline: "How to Write a Sales Resume That Proves You Close",
    subheadline: "Sales hiring is about numbers. If your resume doesn't show quota attainment, deal size, and pipeline metrics, you're invisible to recruiters.",
    description: "Complete guide to writing a sales resume for SDR, AE, and sales leadership roles. Quota achievement, deal metrics, pipeline management, and revenue impact that sales recruiters demand.",
    keywords: [
      "sales resume",
      "sales resume guide",
      "how to write a sales resume",
      "account executive resume",
      "SDR resume tips",
      "sales manager resume",
    ],
    ogTitle: "Sales Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a sales resume. Show quota attainment, revenue closed, and pipeline metrics with data-driven bullets sales recruiters demand.",
    sections: [
      {
        heading: "Lead with quota attainment",
        body: "Sales is the most numbers-driven profession. Your resume must lead with quota achievement in every role. Instead of 'Responsible for enterprise sales,' write 'Closed $2.4M in new ARR against a $2M quota (120% attainment), ranking #2 of 24 reps.' Include: quota vs. attainment, ACV/deal size, win rate, sales cycle length, and pipeline generated. If you've won President's Club or rep of the quarter, put it at the top.",
      },
      {
        heading: "Show your sales methodology",
        body: "Hiring managers want to know how you sell. Mention your methodology: MEDDIC/MEDDPICC, Challenger, Sandler, SPIN, Value Selling, Command of the Message. Describe how you build pipeline (outbound, inbound, partner-sourced, SDR-supported), run discovery, manage multi-stakeholder deals, and close. Specific examples like 'Ran MEDDIC qualification on 60+ opportunities, improving forecast accuracy by 35%' show real skill.",
      },
      {
        heading: "Detail your deal scope and customer profile",
        body: "Specify what you sold: product type (SaaS, hardware, services), deal size (SMB $10K ACV, mid-market $50K, enterprise $200K+), customer persona (CTO, CHRO, CMO), industry vertical (fintech, healthcare, manufacturing), and sales motion (transactional, consultative, land-and-expand). This helps recruiters instantly match your experience to their opening.",
      },
      {
        heading: "Feature CRM and sales stack proficiency",
        body: "Modern sales runs on tools. List your stack: CRM (Salesforce, HubSpot), prospecting (Outreach, SalesLoft, LinkedIn Sales Navigator), data (Zoominfo, Lusha, 6sense), and enablement platforms (Gong, Clari, Highspot). Group by category and note your proficiency. Specific workflows — 'Built Outreach sequences that generated $1.2M in pipeline' — show you're a power user.",
      },
      {
        heading: "Highlight cross-functional collaboration",
        body: "Top reps work across functions. Include examples of partnering with SEs on technical evaluations, working with marketing on campaigns, collaborating with product on roadmap feedback, and managing handoffs with customer success. Bullets like 'Partnered with 3 SEs to close a $600K deal involving a bespoke POC and executive alignment' show enterprise selling maturity.",
      },
      {
        heading: "Tailor to the sales role level",
        body: "SDR/BDR roles should emphasize outreach volume, meeting conversion, and pipeline generation. AE roles need quota attainment, deal complexity, and closing metrics. Sales leadership roles require team quota, hiring and ramp metrics, and go-to-market strategy. Tailor your bullets to the level you're targeting — and don't oversell junior numbers for senior roles.",
      },
    ],
  },
  {
    slug: "teacher",
    title: "Teacher Resume Guide",
    role: "Teacher",
    headline: "How to Write a Teaching Resume That Stands Out",
    subheadline: "School hiring is mission-driven and credential-heavy. Your resume needs to show your teaching philosophy, student outcomes, and classroom impact.",
    description: "Complete guide to writing a teacher resume for K-12 and higher education roles. Covering teaching philosophy, student achievement data, classroom management, certifications, and curriculum development.",
    keywords: [
      "teacher resume",
      "teaching resume guide",
      "how to write a teacher resume",
      "education resume tips",
      "K-12 teacher resume",
      "elementary teacher resume",
    ],
    ogTitle: "Teacher Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a teacher resume. Show student outcomes, teaching philosophy, and classroom impact that school districts look for.",
    sections: [
      {
        heading: "Lead with your teaching philosophy and credentials",
        body: "Schools hire for mission fit as much as skill. Start with a 2-3 line summary stating your teaching philosophy, grade-level expertise, and subject areas. Follow immediately with your credentials: state teaching license, endorsements, certifications (ESL, Special Ed, Reading Specialist, National Board Certification). School ATS systems scan for specific endorsements, so list them clearly.",
      },
      {
        heading: "Show student achievement data",
        body: "Teaching is about student outcomes. Instead of 'Taught 5th grade math,' write 'Improved 5th grade math proficiency scores from 62% to 84% on state assessments over two academic years, exceeding the district average by 12%.' Include: test score growth, reading level advancement, graduation rates, and specific interventions that moved the needle. Even qualitative wins — student projects, competitions — belong on your resume.",
      },
      {
        heading: "Showcase curriculum and instructional strategies",
        body: "Describe your instructional approach: project-based learning, differentiated instruction, blended learning, UDL, SEL integration. Include examples of curriculum you've developed, units you've designed, and technology you've integrated (Google Classroom, Nearpod, Kahoot, Seesaw). Mention specific programs: Lucy Calkins, Eureka Math, NGSS, IB, AP — these are search keywords for principals.",
      },
      {
        heading: "Include classroom management and culture",
        body: "Classroom management is non-negotiable. Describe your approach and results. 'Implemented a PBIS classroom management system that reduced disciplinary referrals by 40%' or 'Built strong parent partnerships through weekly newsletters and biannual conferences with 95% attendance' show you can create a productive learning environment.",
      },
      {
        heading: "Highlight leadership and extracurricular contributions",
        body: "Schools value teachers who contribute beyond the classroom. List: committee leadership (curriculum review, hiring, accreditation), extracurricular roles (coaching, club advising, drama, robotics), professional development you've led, and mentorship of new teachers. These signal you're a contributor to school culture, not just a classroom teacher.",
      },
      {
        heading: "Structure for education hiring systems",
        body: "School districts use specialized ATS systems that scan for: certifications, endorsements, grade-level experience, and subject areas. Use standard section headings: Teaching Philosophy, Certifications, Professional Experience, Education, Professional Development. Include student teaching and practicum experience if you're early career. Save as PDF — NoiceResume's templates present all this cleanly.",
      },
    ],
  },
  {
    slug: "consultant",
    title: "Consulting Resume Guide",
    role: "Consultant",
    headline: "How to Write a Consulting Resume That Opens Doors at Top Firms",
    subheadline: "Consulting hiring is about problem-solving, structure, and impact. Your resume needs to prove all three, fast.",
    description: "Guide to writing a consulting resume for MBB (McKinsey, BCG, Bain) and other top firms. Action-impact bullets, structured problem-solving, and leadership examples that consulting recruiters look for.",
    keywords: [
      "consulting resume",
      "consulting resume guide",
      "MBB resume tips",
      "how to write a consulting resume",
      "management consulting resume",
      "consulting cover letter",
    ],
    ogTitle: "Consulting Resume Guide — NoiceResume",
    ogDescription: "Complete guide to writing a consulting resume. Action-impact framework, structured problem-solving, and leadership that MBB and top firms look for.",
    sections: [
      {
        heading: "Use the action-impact framework",
        body: "Consulting resumes live and die by the action-impact format. Every bullet must follow: action verb + what you did + the quantifiable result. Consulting partners scan for this pattern. Instead of 'Analyzed market data for client,' write 'Conducted market sizing analysis for a Fortune 500 client, identifying a $200M revenue opportunity that became the core of their 3-year strategy.' Every bullet needs a number.",
      },
      {
        heading: "Demonstrate structured problem-solving",
        body: "Consulting firms hire for how you think. Include examples that show structured analysis: building financial models, creating market segmentation frameworks, designing operational analyses, or developing strategic recommendations. Mention specific frameworks you've used (MECE, Porter's Five Forces, BCG Matrix, SWOT) and how they shaped your recommendations.",
      },
      {
        heading: "Show leadership and impact",
        body: "Consultants need to lead teams and client relationships. Highlight examples of leading project workstreams, managing analysts, presenting to C-suite executives, and driving client decisions. Include the scope of your responsibility: team size, client budget, project duration. 'Led a 4-person team on a 12-week due diligence project for a $50M acquisition' signals readiness for consulting work.",
      },
      {
        heading: "Format for the 30-second scan",
        body: "Consulting recruiters spend 30 seconds on your resume. Use a clean, dense format that maximizes signal-to-noise. Your education goes first (school, GPA, major), followed by experience. Include your GPA if it's 3.5+. Use consistent formatting — bold for company names, italics for titles, clean bullet points. No creative layouts, no graphics, no columns.",
      },
      {
        heading: "Include extracurricular leadership",
        body: "Consulting firms care about well-rounded candidates. Include significant extracurriculars: leadership in student organizations, case competition results, community involvement, varsity athletics, or entrepreneurial ventures. These signal the drive and leadership that consulting firms value beyond academic performance.",
      },
      {
        heading: "Tailor to the firm type",
        body: "MBB firms (McKinsey, BCG, Bain) prioritize raw intellect, structured thinking, and leadership. Big 4 (Deloitte, PwC, EY, KPMG) value industry expertise and implementation experience. Boutique firms look for specialized knowledge. Tailor your resume language and featured achievements to match the firm's culture and client types.",
      },
    ],
  },
];

export const ROLE_GUIDE_SITE_URL = "https://noiceresume.pages.dev";

export function getRoleGuideBySlug(slug: string): RoleGuideMeta | undefined {
  return ROLE_GUIDES.find((g) => g.slug === slug);
}
