"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImportButton } from "components/ImportButton";

export const TopNavBar = () => {
  const pathname = usePathname();

  // Hide nav on landing page — brand is part of hero content
  if (pathname === "/") return null;

  const isEditor = pathname === "/resume-builder";
  const isTemplates = pathname === "/templates" || pathname.startsWith("/templates/");
  const isCommunity = pathname === "/templates/community";

  return (
    <header
      aria-label="Site Header"
      className="border-b bg-[var(--surface)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center justify-between py-3 px-4 md:px-12 w-full"
        style={{ maxWidth: 1200 }}
      >
        <Link href="/" className="md:mx-0">
          <img
            src="/noiceresume-logo-white.svg"
            alt="NoiceResume"
            style={{ width: 180, height: "auto" }}
            className="block"
          />
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/templates"
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{
              color: isTemplates ? "var(--accent)" : "var(--muted)",
            }}
          >
            Templates
          </Link>
          <Link
            href="/templates/community"
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{
              color: isCommunity ? "var(--accent)" : "var(--muted)",
            }}
          >
            Community
          </Link>
          <Link
            href="/resume-builder"
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{
              color: isEditor ? "var(--accent)" : "var(--muted)",
            }}
          >
            Builder
          </Link>
          {isEditor && (
            <div className="flex-shrink-0">
              <ImportButton compact />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
