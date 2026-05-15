import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface AISuggestButtonProps {
  onSuggest: (mode: "replace" | "append") => void;
  disabled?: boolean;
  color?: string;
}

export const AISuggestButton = ({
  onSuggest,
  disabled = false,
  color,
}: AISuggestButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (mode: "replace" | "append") => {
    setIsOpen(false);
    onSuggest(mode);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          style={color ? { color } : undefined}
        >
          <path
            fillRule="evenodd"
            d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
            clipRule="evenodd"
          />
        </svg>
        Suggest Skills
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-[var(--border)] py-1 shadow-lg"
          style={{ backgroundColor: "var(--surface)" }}>
          <button
            onClick={() => handleOptionClick("replace")}
            className="flex w-full items-center px-4 py-2 text-sm"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--surface-2)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <span className="mr-2" style={{ color: "var(--muted-subtle)" }}>→</span>
            Replace all skills
          </button>
          <button
            onClick={() => handleOptionClick("append")}
            className="flex w-full items-center px-4 py-2 text-sm"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--surface-2)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <span className="mr-2" style={{ color: "var(--muted-subtle)" }}>+</span>
            Append to existing
          </button>
        </div>
      )}
    </div>
  );
};