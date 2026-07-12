import { useState, useEffect } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import {
  getHasUsedAppBefore,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { type ShowForm, initialSettings, setSettings } from "lib/redux/settingsSlice";
import { setResume } from "lib/redux/resumeSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "lib/redux/hooks";
import addPdfSrc from "public/assets/add-pdf.svg";
import Image from "next/image";
import { cx } from "lib/cx";
import { deepClone } from "lib/deep-clone";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
};

export const ResumeDropzone = ({
  onFileUrlChange,
  className,
  playgroundView = false,
}: {
  onFileUrlChange: (fileUrl: string) => void;
  className?: string;
  playgroundView?: boolean;
}) => {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasNonPdfFile, setHasNonPdfFile] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const hasFile = Boolean(file.name);

  useEffect(() => {
    const currentUrl = file.fileUrl;
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [file.fileUrl]);

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl });
    onFileUrlChange(fileUrl);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile.name.endsWith(".pdf")) {
      setHasNonPdfFile(false);
      setNewFile(newFile);
    } else {
      setHasNonPdfFile(true);
    }
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFile = files[0];
    setNewFile(newFile);
  };

  const onRemove = () => {
    setFile(defaultFileState);
    onFileUrlChange("");
  };

  const onImportClick = async () => {
    const result = await parseResumeFromPdf(file.fileUrl);

    if (!result.success) {
      throw new Error(result.error || "Failed to parse PDF");
    }

    const { resume } = result;
    const settings = deepClone(initialSettings);

    // Set formToShow settings based on uploaded resume if users have used the app before
    if (getHasUsedAppBefore()) {
      const sections = Object.keys(settings.formToShow) as ShowForm[];
      const sectionToFormToShow: Record<ShowForm, boolean> = {
        workExperiences: resume.workExperiences.length > 0,
        educations: resume.educations.length > 0,
        projects: resume.projects.length > 0,
        skills: resume.skills.descriptions.length > 0,
        custom: resume.custom.descriptions.length > 0,
      };
      for (const section of sections) {
        settings.formToShow[section] = sectionToFormToShow[section];
      }
    }

    saveStateToLocalStorage({ resume, settings, user: { isPremium: false, checkoutSessionId: null, customerId: null, checkoutError: null } });
    dispatch(setResume(resume));
    dispatch(setSettings(settings));
    router.push("/resume-builder");
  };

  return (
    <div
      className={cx(
        "flex justify-center rounded-xl border-2 border-dashed px-6 transition-colors",
        isHoveredOnDropzone ? "border-[rgba(139,92,246,0.5)]" : "border-[rgba(255,255,255,0.15)]",
        playgroundView ? "pb-6 pt-4" : "py-12",
        className
      )}
      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsHoveredOnDropzone(true);
      }}
      onDragLeave={() => setIsHoveredOnDropzone(false)}
      onDrop={onDrop}
    >
      <div
        className={cx(
          "text-center",
          playgroundView ? "space-y-2" : "space-y-3"
        )}
      >
        {!playgroundView && (
          <Image
            src={addPdfSrc}
            className="mx-auto h-14 w-14 opacity-60"
            alt="Add pdf"
            aria-hidden="true"
            priority
          />
        )}
        {!hasFile ? (
          <>
            <p
              className={cx(
                "pt-3",
                !playgroundView && "text-lg font-semibold"
              )}
              style={{ color: "var(--fg)" }}
            >
              Browse a pdf file or drop it here
            </p>
            <p className="flex justify-center text-sm" style={{ color: "var(--muted)" }}>
              <LockClosedIcon className="mr-1 mt-1 h-3 w-3" />
              File data is used locally and never leaves your browser
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="pl-7 font-semibold" style={{ color: "var(--fg)" }}>
              {file.name} - {getFileSizeString(file.size)}
            </div>
            <button
              type="button"
              className="rounded-md p-1 transition-colors"
              style={{ color: "var(--muted)" }}
              aria-label="Remove file"
              onClick={onRemove}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}
        <div className="pt-4">
          {!hasFile ? (
            <>
              <label
                className="inline-block cursor-pointer rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
              >
                Browse file
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf"
                  onChange={onInputChange}
                />
              </label>
              {hasNonPdfFile && (
                <p className="mt-6 text-sm" style={{ color: "#F87171" }}>Only pdf file is supported</p>
              )}
            </>
          ) : (
            <>
              {!playgroundView && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
                  onClick={onImportClick}
                  aria-label="Import and continue"
                >
                  Import and Continue <span aria-hidden="true">→</span>
                </button>
              )}
              <p className={cx("mt-6 text-sm")} style={{ color: "var(--muted)" }}>
                Note: {!playgroundView ? "Import" : "Parser"} works best on
                single column resume
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const getFileSizeString = (fileSizeB: number) => {
  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  if (fileSizeKB < 1000) {
    return fileSizeKB.toPrecision(3) + " KB";
  } else {
    return fileSizeMB.toPrecision(3) + " MB";
  }
};
