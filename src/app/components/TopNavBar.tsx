"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";

const scrollToPreview = () => {
  const previewSection = document.getElementById("resume-preview");
  if (previewSection) {
    previewSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const isBuilderPage = pathName === "/resume-builder";

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12",
        isHomePage && "bg-dot"
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/">
          <span className="sr-only">OpenResume</span>
          <Image
            src={logoSrc}
            alt="OpenResume Logo"
            className="h-8 w-full"
            priority
          />
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-2 text-sm font-medium"
        >
          {[
            ["/resume-builder", "Builder"],
            ["/resume-parser", "Parser"],
          ].map(([href, text]) => (
            <Link
              key={text}
              className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
              href={href}
            >
              {text}
            </Link>
          ))}
          {/* GitHub button - hidden on mobile */}
          <div className="ml-1 mt-1 hidden md:block">
            <iframe
              src="https://ghbtns.com/github-btn.html?user=xitanggg&repo=open-resume&type=star&count=true"
              width="100"
              height="20"
              className="overflow-hidden border-none"
              title="GitHub"
            />
          </div>
          {/* Scroll to Preview button - only on builder page on mobile */}
          {isBuilderPage && (
            <button
              onClick={scrollToPreview}
              className="flex items-center gap-1 rounded-md bg-blue-500 px-3 py-1.5 text-white hover:bg-blue-600 md:hidden"
            >
              <span>Preview</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m4.125 4.125V19.5m0 0a2.25 2.25 0 013.75 2.25m-3.75-2.25h3.75m0 0a2.25 2.25 0 01-2.25 2.25m2.25 0h-3.75m0 0a2.25 2.25 0 01-2.25-2.25m0 0h3.75" />
              </svg>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
