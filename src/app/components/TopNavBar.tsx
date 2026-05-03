"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const scrollToTop = () => {
  const container = document.querySelector(".md\\:overflow-y-scroll");
  if (container) {
    container.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const scrollToPreview = () => {
  document
    .getElementById("resume-preview")
    ?.scrollIntoView({ behavior: "smooth" });
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
        style={{ padding: "14px 48px", maxWidth: 1200 }}
      >
        <Link href="/">
          <svg
            width="32"
            height="32"
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
        {isBuilderPage && (
          <div
            className="flex rounded-lg p-0.5 gap-0.5"
            style={{ backgroundColor: "var(--border)" }}
          >
            <button
              type="button"
              onClick={scrollToTop}
              className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--fg)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              Content
            </button>
            <button
              type="button"
              onClick={scrollToPreview}
              className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              style={{
                backgroundColor: "transparent",
                color: "var(--muted)",
              }}
            >
              Preview
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
