"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImportButton } from "components/ImportButton";

export const TopNavBar = () => {
  const pathname = usePathname();
  const isEditor = pathname === "/resume-builder";

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
        <Link href="/">
          <img
            src="/noiceresume-logo.svg"
            alt="NoiceResume"
            style={{ width: 180, height: "auto" }}
            className="block"
          />
        </Link>

        {isEditor && (
          <div className="flex-shrink-0">
            <ImportButton compact />
          </div>
        )}
      </div>
    </header>
  );
};
