import Link from "next/link";

const POSTS = [
  {
    slug: "how-to-write-a-resume-that-stands-out",
    title: "How to Write a Resume That Stands Out in 2026",
    excerpt:
      "Learn how to write a resume that gets noticed by recruiters and passes ATS filters. Expert tips on formatting, keywords, and content strategies for 2026.",
    date: "May 1, 2026",
    readTime: "7 min read",
    tags: ["Resume Tips", "ATS", "Career Advice"],
  },
  {
    slug: "free-vs-paid-resume-builders",
    title: "Free vs Paid Resume Builders: Which One Is Right for You?",
    excerpt:
      "Comparing free and paid resume builders head-to-head. See what you actually get with each option and decide which is best for your career stage and budget.",
    date: "May 1, 2026",
    readTime: "8 min read",
    tags: ["Comparisons", "Free Tools"],
  },
  {
    slug: "how-to-import-pdf-resume",
    title: "How to Import Your Existing PDF Resume and Edit It Online",
    excerpt:
      "Learn how to import your existing PDF resume into an online editor, edit it without starting from scratch, and export a polished PDF. No sign-up required.",
    date: "May 1, 2026",
    readTime: "6 min read",
    tags: ["PDF Import", "Resume Tips"],
  },
  {
    slug: "free-resume-builder-no-watermark",
    title: "Best Free Resume Builder with No Watermark (2025)",
    excerpt:
      "Tired of resume builders that watermark your PDF unless you pay? Here are the best truly free options — including one that doesn't even require a sign-up.",
    date: "May 1, 2025",
    readTime: "5 min read",
    tags: ["Free Tools", "Resume Builder"],
  },
  {
    slug: "ats-friendly-resume-template-free",
    title: "ATS Friendly Resume Template Free: How to Beat the Bots",
    excerpt:
      "Applicant Tracking Systems reject 75% of resumes. Learn how to build an ATS-friendly resume that gets past the bots and into human hands.",
    date: "May 1, 2025",
    readTime: "6 min read",
    tags: ["ATS", "Resume Tips"],
  },
  {
    slug: "best-free-resume-builder",
    title: "Best Free Resume Builder: 7 Options Compared for 2025",
    excerpt:
      "We compared the top free resume builders head-to-head. Find out which one is right for your career stage, budget, and design preferences.",
    date: "May 1, 2025",
    readTime: "7 min read",
    tags: ["Comparisons", "Free Tools"],
  },
];

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-4xl bg-[var(--notion-warm-white)] px-6 py-16 text-[var(--notion-black)]">
      <h1 className="mb-2 text-center font-display text-4xl font-bold tracking-tight">
        NoiceResume Blog
      </h1>
      <p className="mb-12 text-center text-lg text-[var(--notion-warm-gray-500)]">
        Resume tips, job search advice, and free resources
      </p>
      <div className="space-y-8">
        {POSTS.map((post) => (
          <article
            key={post.slug}
            className="notion-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--notion-blue)]/10 px-3 py-1 text-xs font-medium text-[var(--notion-blue)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="mb-2 font-display text-xl font-semibold text-[var(--notion-black)] hover:text-[var(--notion-blue)]">
                {post.title}
              </h2>
            </Link>
            <p className="mb-3 text-sm text-[var(--notion-warm-gray-500)]">
              {post.excerpt}
            </p>
            <div className="text-xs text-[var(--notion-warm-gray-300)]">
              {post.date} · {post.readTime}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
