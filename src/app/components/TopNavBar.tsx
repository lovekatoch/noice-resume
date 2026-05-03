"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { cx } from "lib/cx";
import { EyeIcon } from "@heroicons/react/24/outline";

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

        </nav>
      </div>
    </header>
  );
};
