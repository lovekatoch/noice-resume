"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cx } from "lib/cx";
import { EyeIcon } from "@heroicons/react/24/outline";

const scrollToPreview = () => {
  const previewSection = document.getElementById("resume-preview-section");
  if (previewSection) {
    previewSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
};

export const TopNavBar = () => {
  const pathName = usePathname();
  const isBuilderPage = pathName === "/resume-builder";

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "flex h-[var(--top-nav-bar-height)] items-center border-b border-[var(--notion-border)] bg-[var(--notion-white)] px-4 lg:px-8"
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/">
          {/* NR Monogram SVG - Notion style */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-lg"
          >
            <rect width="36" height="36" rx="8" fill="#0075de" />
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
          className="flex items-center gap-2 text-sm font-medium"
        >
          {!isBuilderPage && (
            <Link
              href="/resume-builder"
              className="notion-btn notion-btn-secondary text-sm"
            >
              Builder
            </Link>
          )}
          {isBuilderPage && (
            <button
              onClick={scrollToPreview}
              className="notion-btn notion-btn-primary text-sm md:hidden"
            >
              <EyeIcon className="mr-1 h-4 w-4" />
              Preview
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
