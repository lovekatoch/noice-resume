"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";

const scrollToPreview = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
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
          <span className="sr-only">NoiceResume</span>
          <Image
            src={logoSrc}
            alt="NoiceResume Logo"
            className="h-8 w-full"
            priority
          />
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-2 text-sm font-medium"
        >
          {/* Builder and Parser links - hidden on builder page */}
          {!isBuilderPage && [
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
          {/* Scroll to Preview button - only on builder page on mobile */}
          {isBuilderPage && (
            <button
              onClick={scrollToPreview}
              className="flex items-center gap-1 rounded-md bg-blue-500 px-3 py-1.5 text-white hover:bg-blue-600 md:hidden"
            >
              <span>Preview</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V13.5" />
              </svg>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
