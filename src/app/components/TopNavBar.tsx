"use client";
import { useState } from "react";
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

const ActiveToggle = () => {
  const [activeTab, setActiveTab] = useState<"content" | "preview">("content");

  return (
    <div
      className="relative flex rounded-lg p-0.5"
      style={{ backgroundColor: "var(--border)" }}
    >
      <div
        className="absolute rounded-md"
        style={{
          backgroundColor: "var(--surface)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          width: "50%",
          height: "calc(100% - 4px)",
          top: 2,
          left: activeTab === "content" ? 2 : "calc(50% + 2px)",
          transition: "left 250ms cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 0,
        }}
      />
      <button
        type="button"
        onClick={() => { setActiveTab("content"); scrollToTop(); }}
        className="relative z-10 px-3 py-1 text-sm font-medium rounded-md"
        style={{ color: activeTab === "content" ? "var(--fg)" : "var(--muted)", background: "transparent" }}
      >
        Content
      </button>
      <button
        type="button"
        onClick={() => { setActiveTab("preview"); scrollToPreview(); }}
        className="relative z-10 px-3 py-1 text-sm font-medium rounded-md"
        style={{ color: activeTab === "preview" ? "var(--fg)" : "var(--muted)", background: "transparent" }}
      >
        Preview
      </button>
    </div>
  );
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
        className="mx-auto flex items-center justify-between px-4 md:px-12"
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
        {isBuilderPage && (
          <ActiveToggle />
        )}
      </div>
    </header>
  );
};
