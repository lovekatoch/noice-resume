export interface ComparisonSection {
  heading: string;
  body: string;
}

export interface ComparisonMeta {
  slug: string;
  title: string;
  competitor: string;
  headline: string;
  subheadline: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  winner: "noiceresume" | "competitor" | "depends";
  winnerReason: string;
  sections: ComparisonSection[];
}

export const COMPARISONS: ComparisonMeta[] = [
  {
    slug: "noiceresume-vs-rezi",
    title: "NoiceResume vs Rezi",
    competitor: "Rezi",
    headline: "NoiceResume vs Rezi: Which Free Resume Builder Is Better?",
    subheadline: "Both are free AI resume builders. But one respects your privacy and doesn't push you toward a paid plan.",
    description: "Compare NoiceResume vs Rezi head-to-head. Both offer AI-powered resume building for free, but NoiceResume requires no sign-up, keeps your data on your device, and has zero paid tiers. See which one fits your workflow.",
    keywords: [
      "NoiceResume vs Rezi",
      "Rezi alternative",
      "free resume builder comparison",
      "Rezi vs NoiceResume",
      "best free resume builder",
      "AI resume builder comparison",
    ],
    ogTitle: "NoiceResume vs Rezi (2025): Which Free Resume Builder Wins?",
    ogDescription: "NoiceResume vs Rezi comparison. Both are free AI resume builders, but NoiceResume requires zero sign-up and keeps your data on your device. See the full breakdown.",
    winner: "noiceresume",
    winnerReason: "NoiceResume is truly free with no sign-up, no paid tiers, and your data never leaves your browser. Rezi also has a free tier but limits exports and pushes upgrades.",
    sections: [
      {
        heading: "Pricing: Both are free, but one is truly free",
        body: "Rezi offers a free tier that lets you build a resume, but limits PDF exports and AI suggestions unless you upgrade to Rezi Pro ($29/mo or $49 lifetime). NoiceResume is completely free with no paid tiers — every feature, every template, every AI suggestion, unlimited PDF exports. There is no upgrade path because there's nothing to upgrade to.",
      },
      {
        heading: "Privacy: Your data stays on your device",
        body: "NoiceResume processes everything in your browser. Your resume data never touches a server — it's stored in localStorage on your own machine. Rezi requires account creation and stores your resumes on their servers. If privacy matters to you, NoiceResume is the clear choice.",
      },
      {
        heading: "AI quality: Real suggestions, not generic templates",
        body: "Both tools offer AI-powered bullet rewrites. NoiceResume's AI suggests contextually relevant improvements based on your specific experience and industry. Rezi's AI is solid but can be generic. In practice, both produce usable suggestions — the difference comes down to the privacy model and pricing.",
      },
      {
        heading: "ATS compatibility: Both pass the bots",
        body: "Both NoiceResume and Rezi produce ATS-friendly resumes. NoiceResume uses clean single-column layouts with standard section headings. Rezi also focuses on ATS optimization. This category is a tie — both tools will get your resume past automated filters.",
      },
      {
        heading: "Templates and customization",
        body: "NoiceResume offers fewer templates (3 core layouts with variants) but each is meticulously designed for ATS parsing. Rezi offers more template variety but some lean toward complex layouts that can confuse parsers. If you want quality over quantity, NoiceResume wins.",
      },
      {
        heading: "The bottom line",
        body: "If you want a truly free, privacy-first resume builder that doesn't nag you to upgrade, NoiceResume is the better choice. If you need more template variety and don't mind account creation, Rezi is a solid alternative. But for most job seekers, NoiceResume's combination of free, private, and capable is hard to beat.",
      },
    ],
  },
  {
    slug: "noiceresume-vs-teal",
    title: "NoiceResume vs Teal",
    competitor: "Teal",
    headline: "NoiceResume vs Teal: Is a Free Resume Builder Better Than a Career Platform?",
    subheadline: "Teal is more than a resume builder — it's a full career OS. But most people just need a great resume. Fast.",
    description: "NoiceResume vs Teal comparison. Teal offers a comprehensive career platform with job tracking and resume builder ($29/mo Pro). NoiceResume is a focused, free resume builder with zero sign-up. See which fits your needs.",
    keywords: [
      "NoiceResume vs Teal",
      "Teal alternative",
      "Teal resume builder review",
      "best free resume builder",
      "Teal vs NoiceResume",
      "free resume builder 2025",
    ],
    ogTitle: "NoiceResume vs Teal (2025): Free Builder vs Career Platform",
    ogDescription: "NoiceResume vs Teal: focused free resume builder vs full career platform. If you just need a resume, NoiceResume is faster and free. Full comparison inside.",
    winner: "depends",
    winnerReason: "Teal is better if you want job tracking, salary insights, and a full career toolkit. NoiceResume wins if you want a fast, free resume with no commitment.",
    sections: [
      {
        heading: "Pricing: Free forever vs $29/mo",
        body: "NoiceResume is 100% free with no paid plans. Every feature is available from the start. Teal's resume builder is included in their free tier, but many advanced features (AI rewriting, unlimited resumes, job tracker) require Teal Pro at $29/month. For budget-conscious job seekers, NoiceResume is the clear winner.",
      },
      {
        heading: "Feature depth: Teal offers more, NoiceResume is focused",
        body: "Teal is a full career platform — resume builder, job application tracker, salary insights, cover letter generator, and more. NoiceResume is a focused resume builder that does one thing well: help you create a professional resume quickly. If you need a career operating system, Teal is compelling. If you just need a great resume, NoiceResume is simpler and faster.",
      },
      {
        heading: "Privacy: No account required",
        body: "NoiceResume doesn't require any sign-up. Your data stays in your browser's localStorage. Teal requires account creation and stores your data on their servers. If privacy is important, NoiceResume wins.",
      },
      {
        heading: "AI features: Both strong, different approaches",
        body: "Teal's AI analyzes your resume against job descriptions and suggests targeted improvements. NoiceResume's AI provides contextual bullet rewrites based on your experience. Teal's approach is more strategic (optimize for specific jobs), while NoiceResume's is more tactical (write better bullets). Both are useful in different ways.",
      },
      {
        heading: "Ease of use: NoiceResume is simpler",
        body: "NoiceResume has a clean, minimal interface — open the builder and start typing. No account, no onboarding, no paywalls. Teal has more features but also more complexity. For a quick resume, NoiceResume is faster to get started.",
      },
      {
        heading: "The bottom line",
        body: "If you want a full career platform with job tracking and salary data and don't mind paying $29/mo, Teal is excellent. If you want to build a professional resume in minutes without signing up or paying anything, NoiceResume is the right choice. Most job seekers only need the latter.",
      },
    ],
  },
  {
    slug: "noiceresume-vs-novoresume",
    title: "NoiceResume vs Novoresume",
    competitor: "Novoresume",
    headline: "NoiceResume vs Novoresume: Premium Design vs Privacy-First Free",
    subheadline: "Novoresume set the standard for beautiful resumes. But can it compete with a free, modern alternative?",
    description: "NoiceResume vs Novoresume comparison. Novoresume is known for premium templates starting at $24. NoiceResume offers ATS-optimized designs for free with no sign-up. See which resume builder wins.",
    keywords: [
      "NoiceResume vs Novoresume",
      "Novoresume alternative",
      "free resume builder comparison",
      "Novoresume pricing vs NoiceResume",
      "best resume template builder",
      "Novoresume vs NoiceResume",
    ],
    ogTitle: "NoiceResume vs Novoresume (2025): Free vs Premium Resume Builder",
    ogDescription: "NoiceResume vs Novoresume: Can a free resume builder compete with the design leader? NoiceResume offers ATS-friendly templates without sign-up. Full comparison.",
    winner: "noiceresume",
    winnerReason: "Novoresume has beautiful templates but charges $24+ and some designs struggle with ATS. NoiceResume is free, privacy-first, and every template is ATS-tested.",
    sections: [
      {
        heading: "Pricing: Free vs $24+",
        body: "Novoresume offers a free tier with basic templates but charges $24 for full access to their template library, and $48 for the complete package including AI features. NoiceResume is completely free — all templates, all AI features, unlimited PDF exports, no upgrades available because none are needed.",
      },
      {
        heading: "Template design: Novoresume is pretty, NoiceResume is practical",
        body: "Novoresume built its reputation on beautiful, design-forward templates. They genuinely look great. However, some of those designs (two-column layouts, creative sections) can struggle with ATS parsing. NoiceResume's templates are more minimal but every one is ATS-tested. You don't have to choose between beautiful and functional — NoiceResume's modern templates prove they can be both.",
      },
      {
        heading: "Privacy and sign-up",
        body: "NoiceResume requires no account and keeps your data in your browser. Novoresume requires account creation and stores your resumes on their servers. For privacy-conscious users, NoiceResume is the better option.",
      },
      {
        heading: "AI features: Both offer intelligent help",
        body: "Novoresume includes AI-powered writing suggestions in their premium tier. NoiceResume offers similar AI bullet rewrites for free, with no paywall. Both provide contextual suggestions, but NoiceResume's are available to everyone immediately.",
      },
      {
        heading: "ATS compatibility",
        body: "Novoresume templates vary in ATS compatibility — their legacy designs can cause parsing issues. NoiceResume builds every template with ATS parsing as a non-negotiable requirement. For job seekers who want to pass automated filters, NoiceResume is the safer choice.",
      },
      {
        heading: "The bottom line",
        body: "Novoresume is a legitimate option if you want design-forward templates and are willing to pay. But NoiceResume delivers comparable quality for free, with better ATS compatibility and stronger privacy. For most job seekers, NoiceResume is the smarter choice.",
      },
    ],
  },
  {
    slug: "noiceresume-vs-zety",
    title: "NoiceResume vs Zety",
    competitor: "Zety",
    headline: "NoiceResume vs Zety: Is a $3 Trial Worth It?",
    subheadline: "Zety is one of the most popular resume builders. But after the trial ends, the real cost begins.",
    description: "NoiceResume vs Zety comparison. Zety starts with a $3 trial then auto-converts to $24/month. NoiceResume is completely free with no sign-up. See which resume builder gives you more value.",
    keywords: [
      "NoiceResume vs Zety",
      "Zety alternative",
      "Zety free trial",
      "best resume builder free",
      "Zety vs NoiceResume",
      "resume builder comparison 2025",
    ],
    ogTitle: "NoiceResume vs Zety (2025): Free vs Subscription Resume Builder",
    ogDescription: "NoiceResume vs Zety: Zety's $3 trial auto-converts to $24/month. NoiceResume is free forever. See the full comparison and save your money.",
    winner: "noiceresume",
    winnerReason: "Zety's $3 trial auto-renews at $24/month and templates aren't always ATS-safe. NoiceResume is completely free with better ATS compatibility.",
    sections: [
      {
        heading: "Pricing: NoiceResume is free, Zety is not",
        body: "Zety hooks you with a $3 trial, but it auto-converts to $23.88/month unless you cancel within 14 days. Their resume builder is subscription-only after the trial. NoiceResume is completely free — no trial, no credit card, no subscriptions. You get every feature from the moment you open the page.",
      },
      {
        heading: "Template quality: Both offer good designs",
        body: "Zety has a large library of templates with professional designs. They cover many industries and styles. NoiceResume has fewer templates (3 core layouts plus role-specific variants), but each is meticulously designed and all are ATS-tested. Quality over quantity.",
      },
      {
        heading: "Privacy and sign-up",
        body: "Zety requires account creation and stores your data on their servers. NoiceResume doesn't require any account — your data stays in your browser's localStorage. If you care about where your personal information lives, NoiceResume is the clear winner.",
      },
      {
        heading: "ATS compatibility",
        body: "Zety's templates are generally ATS-friendly but some of their more creative layouts can cause parsing issues. NoiceResume templates are all built with ATS parsing as a core requirement — clean single-column layouts, standard headings, no tables or graphics.",
      },
      {
        heading: "AI and editing features",
        body: "Zety offers content suggestions and pre-written phrases for common resume sections. NoiceResume provides AI-powered bullet rewrites that analyze your experience and suggest improvements. Both are useful, but NoiceResume's is free and available immediately.",
      },
      {
        heading: "The bottom line",
        body: "Zety is a capable resume builder trapped behind a subscription model. If you forget to cancel your trial, you're paying $24/month for something you might use once. NoiceResume gives you the same core functionality — templates, editing, AI help, PDF export — completely free, with better privacy and ATS compatibility.",
      },
    ],
  },
  {
    slug: "noiceresume-vs-resumeio",
    title: "NoiceResume vs Resume.io",
    competitor: "Resume.io",
    headline: "NoiceResume vs Resume.io: Features vs Freedom",
    subheadline: "Resume.io offers more features but locks them behind a paywall. NoiceResume keeps it simple and free.",
    description: "NoiceResume vs Resume.io comparison. Resume.io has extensive templates and career resources but requires a subscription at $30+/month. NoiceResume is free with no sign-up. See which resume builder wins.",
    keywords: [
      "NoiceResume vs Resume.io",
      "Resume.io alternative",
      "Resume.io pricing",
      "free resume builder",
      "Resume.io vs NoiceResume",
      "best online resume builder",
    ],
    ogTitle: "NoiceResume vs Resume.io (2025): Free vs Premium Resume Builder",
    ogDescription: "NoiceResume vs Resume.io: Resume.io charges $30+/month for premium features. NoiceResume is completely free with no sign-up. Full comparison.",
    winner: "noiceresume",
    winnerReason: "Resume.io charges $30+/month and your data lives on their servers. NoiceResume is free, private, and requires zero commitment.",
    sections: [
      {
        heading: "Pricing: Free vs $30+/month",
        body: "Resume.io offers a free preview but charges $30+/month to download your resume as PDF. That's a steep price for something you may need only a few times a year. NoiceResume offers unlimited free PDF exports — no paywall, no trial, no subscription. Your resume is always downloadable.",
      },
      {
        heading: "Templates: Resume.io has quantity, NoiceResume has quality",
        body: "Resume.io boasts a large template library with many design options. NoiceResume focuses on fewer, better templates that are all ATS-optimized. Resume.io's designs are good but some suffer from the same ATS issues as other design-forward builders.",
      },
      {
        heading: "Privacy: NoiceResume is local-first",
        body: "Resume.io requires account creation and stores your resumes on their cloud servers. NoiceResume processes everything in your browser — your data never leaves your machine. For privacy-conscious job seekers, this is a significant advantage.",
      },
      {
        heading: "Additional features",
        body: "Resume.io includes cover letter builder, career resources, and a larger template selection. NoiceResume focuses on doing one thing well — creating a professional resume. If you need a full career suite, Resume.io offers more breadth. If you just need a resume, NoiceResume is faster and free.",
      },
      {
        heading: "Ease of use",
        body: "Both tools are user-friendly with intuitive interfaces. NoiceResume gets you started faster since there's no account creation. Resume.io has a slightly more feature-rich editor that can be overwhelming for simple resume creation.",
      },
      {
        heading: "The bottom line",
        body: "Resume.io is a solid but expensive option for creating a resume. The $30+/month subscription is hard to justify when NoiceResume offers comparable quality for free. Unless you specifically need Resume.io's cover letter builder or larger template library, NoiceResume is the better value.",
      },
    ],
  },
  {
    slug: "noiceresume-vs-canva",
    title: "NoiceResume vs Canva",
    competitor: "Canva",
    headline: "NoiceResume vs Canva: Design Tool vs Resume Builder",
    subheadline: "Canva is great for design. But is it the right tool for a resume that needs to pass ATS?",
    description: "NoiceResume vs Canva comparison. Canva offers beautiful design templates but struggles with ATS parsing. NoiceResume prioritizes ATS compatibility while maintaining clean design. See which is better for your job search.",
    keywords: [
      "NoiceResume vs Canva",
      "Canva resume template",
      "Canva resume ATS",
      "free resume builder",
      "Canva vs NoiceResume",
      "best way to make a resume",
    ],
    ogTitle: "NoiceResume vs Canva (2025): Resume Builder vs Design Tool",
    ogDescription: "NoiceResume vs Canva for resumes. Canva has beautiful designs but most struggle with ATS. NoiceResume offers ATS-safe templates for free.",
    winner: "noiceresume",
    winnerReason: "Canva is a design tool, not a resume builder. Most Canva resume templates fail ATS parsing. NoiceResume is purpose-built for job seekers who need their resume to actually get read.",
    sections: [
      {
        heading: "ATS compatibility: This is the big one",
        body: "Canva resume templates look stunning — and that's precisely the problem. Most Canva templates use multi-column layouts, text boxes, and graphics that completely break ATS parsing. Recruiters may never see your beautifully designed resume because the bots couldn't read it. NoiceResume templates are purpose-built for ATS — clean single-column layouts that parsers handle perfectly. A pretty resume that gets filtered is worthless.",
      },
      {
        heading: "Pricing: Canva Pro vs NoiceResume free",
        body: "Canva's free tier includes resume templates, but the best designs require Canva Pro ($13/month). NoiceResume is completely free with no paid tiers. You get every template, every feature, unlimited exports — all at no cost.",
      },
      {
        heading: "Ease of use: Purpose-built vs general design tool",
        body: "Canva is a general-purpose design tool. Making a resume in Canva means adjusting text boxes, aligning elements, choosing fonts, and manually formatting. NoiceResume is purpose-built for resumes — you fill in your information and it handles the layout automatically. Change your template with one click. NoiceResume is dramatically faster.",
      },
      {
        heading: "Design quality",
        body: "Canva has thousands of beautiful templates created by professional designers. NoiceResume has fewer options but each is polished and ATS-optimized. If you wanted to use your resume as a design portfolio, Canva makes sense. For actual job applications, NoiceResume's balance of design and functionality is more effective.",
      },
      {
        heading: "The bottom line",
        body: "Canva is an excellent design tool, but it's not a resume builder. The ATS issues with Canva templates are a real problem that can cost you interviews. NoiceResume is designed specifically for job seekers who need a resume that looks good AND gets read. For any serious job application, NoiceResume is the better choice.",
      },
    ],
  },
];

export const COMPARE_SITE_URL = "https://noiceresume.pages.dev";

export function getComparisonBySlug(slug: string): ComparisonMeta | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
