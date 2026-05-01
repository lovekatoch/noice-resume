import { readPdf, PdfParseError } from "lib/parse-resume-from-pdf/read-pdf";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";

export interface ParseResult {
  success: boolean;
  resume: ReturnType<typeof extractResumeFromSections>;
  textItems: import("lib/parse-resume-from-pdf/types").TextItems;
  error?: string;
  parseQuality: number;
}

const computeParseQuality = (
  textItems: import("lib/parse-resume-from-pdf/types").TextItems,
  resume: ReturnType<typeof extractResumeFromSections>
): number => {
  let score = 0;
  const maxPossible = 100;

  if (textItems.length === 0) return 0;

  const hasProfile = resume.profile.name || resume.profile.email;
  const hasExperience = resume.workExperiences.length > 0;
  const hasEducation = resume.educations.length > 0;
  const hasSkills = resume.skills.descriptions.length > 0;

  if (hasProfile) score += 20;
  if (hasExperience) score += 25;
  if (hasEducation) score += 20;
  if (hasSkills) score += 20;

  const contentDensity = textItems.filter(
    (t) => t.text.trim().length > 1
  ).length;
  const normalizedDensity = Math.min(contentDensity / 20, 1) * 15;
  score += normalizedDensity;

  return Math.min(score, maxPossible);
};

/**
 * Resume parser util that parses a resume from a resume pdf file
 *
 * Note: The parser algorithm only works for single column resume in English language
 */
export const parseResumeFromPdf = async (
  fileUrl: string
): Promise<ParseResult> => {
  let textItems: import("lib/parse-resume-from-pdf/types").TextItems = [];

  try {
    textItems = await readPdf(fileUrl);
  } catch (err) {
    const message =
      err instanceof PdfParseError
        ? err.message
        : "Failed to read PDF file. Please try a different file.";

    return {
      success: false,
      resume: {
        profile: { name: "", email: "", phone: "", location: "", url: "", summary: "" },
        educations: [],
        workExperiences: [],
        projects: [],
        skills: { featuredSkills: [], descriptions: [] },
        custom: { descriptions: [] },
      },
      textItems: [],
      error: message,
      parseQuality: 0,
    };
  }

  const lines = groupTextItemsIntoLines(textItems);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);
  const parseQuality = computeParseQuality(textItems, resume);

  if (parseQuality < 30) {
    return {
      success: false,
      resume,
      textItems,
      error:
        "Low parse quality detected. The PDF may be a multi-column layout, contain mostly images, or use an unsupported format. For best results, try a single-column text-based resume.",
      parseQuality,
    };
  }

  return {
    success: true,
    resume,
    textItems,
    parseQuality,
  };
};
