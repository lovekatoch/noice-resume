"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { cx } from "lib/cx";
import { EyeIcon } from "@heroicons/react/24/outline";
import { selectIsPremium } from "lib/redux/userSlice";

const scrollToPreview = () => {
  const previewSection = document.getElementById("resume-preview");
  if (previewSection) {
    previewSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
};

export const TopNavBar = () => {
  const pathName = usePathname();
  const isBuilderPage = pathName === "/resume-builder";
  const isPremium = useSelector(selectIsPremium);

  return (
    <header
      aria-label="Site Header"
      className="border-b bg-[var(--surface)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{ padding: "20px 48px", maxWidth: 1200 }}
      >
        <Link href="/">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-lg"
          >
            <rect width="36" height="36" rx="8" fill="#5E6AD2" />
            <text
              x="18"
              y="22"
              textAnchor="middle"
              fill="white"
              fontFamily="Inter, sans-serif"
              fontWeight="700"
              fontSize="14"
              letterSpacing="-0.5"
            >
              NR
            </text>
          </svg>
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-6"
        >
          {!isBuilderPage && (
            <>
              <Link
                href="/blog"
                className="transition-colors duration-150"
                style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                Blog
              </Link>
              <Link
                href="/resume-builder"
                className="transition-colors duration-150"
                style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                Builder
              </Link>
            </>
          )}
          {isBuilderPage && (
            <button
              onClick={scrollToPreview}
              className="transition-colors duration-150 md:hidden"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--accent)",
              }}
              aria-label="Preview resume"
            >
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#5E6AD2] to-[#4a56b8] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3"
              >
                <path
                  fillRule="evenodd"
                  d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Premium
            </span>
          )}
        </nav>
      </div>
    </header>
  );
};
