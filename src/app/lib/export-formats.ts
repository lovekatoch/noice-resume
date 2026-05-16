export type ExportFormat = "pdf" | "docx" | "txt" | "json";

export interface ExportOption {
  format: ExportFormat;
  label: string;
  description: string;
  extension: string;
}

export const EXPORT_OPTIONS: ExportOption[] = [
  {
    format: "pdf",
    label: "PDF Document",
    description: "Best for sharing and printing",
    extension: ".pdf",
  },
  {
    format: "docx",
    label: "Word Document",
    description: "Editable in Microsoft Word",
    extension: ".docx",
  },
  {
    format: "txt",
    label: "Plain Text",
    description: "Simple text format",
    extension: ".txt",
  },
  {
    format: "json",
    label: "JSON Data",
    description: "Structured data format",
    extension: ".json",
  },
];

import type { Resume } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";

export function generateTxtBlob(resume: Resume): Blob {
  const lines: string[] = [];
  const { profile, workExperiences, educations, projects, skills, custom } =
    resume;

  if (profile.name) {
    lines.push(profile.name.toUpperCase());
    lines.push("");
  }

  const contactParts = [
    profile.email,
    profile.phone,
    profile.location,
  ].filter(Boolean);
  if (contactParts.length > 0) {
    lines.push(contactParts.join(" | "));
  }
  if (profile.url) {
    lines.push(profile.url);
  }
  if (profile.summary) {
    lines.push("");
    lines.push("SUMMARY");
    lines.push(profile.summary);
  }

  for (const exp of workExperiences) {
    const header = [exp.jobTitle, exp.company].filter(Boolean).join(" at ");
    if (header) {
      lines.push("");
      lines.push(header);
    }
    if (exp.date) {
      lines.push(exp.date);
    }
    for (const desc of exp.descriptions) {
      if (desc) lines.push(`- ${desc}`);
    }
  }

  for (const edu of educations) {
    const header = [edu.degree, edu.school].filter(Boolean).join(" at ");
    if (header) {
      lines.push("");
      lines.push(header);
    }
    if (edu.date) lines.push(edu.date);
    if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
    for (const desc of edu.descriptions) {
      if (desc) lines.push(`- ${desc}`);
    }
  }

  for (const proj of projects) {
    if (proj.project) {
      lines.push("");
      lines.push(proj.project);
    }
    if (proj.date) lines.push(proj.date);
    for (const desc of proj.descriptions) {
      if (desc) lines.push(`- ${desc}`);
    }
  }

  if (skills.descriptions.length > 0) {
    lines.push("");
    lines.push("SKILLS");
    for (const desc of skills.descriptions) {
      if (desc) lines.push(`- ${desc}`);
    }
  }

  if (custom.descriptions.length > 0) {
    lines.push("");
    lines.push("CUSTOM");
    for (const desc of custom.descriptions) {
      if (desc) lines.push(`- ${desc}`);
    }
  }

  return new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
}

export function generateJsonBlob(
  resume: Resume,
  settings: Settings
): Blob {
  const data = {
    resume,
    settings,
    exportedAt: new Date().toISOString(),
  };
  return new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
}

export async function generateDocxBlob(
  resume: Resume
): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } =
    await import("docx");
  const { profile, workExperiences, educations, projects, skills, custom } =
    resume;

  const children: InstanceType<typeof Paragraph>[] = [];

  if (profile.name) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: profile.name,
            bold: true,
            size: 28,
            font: "Calibri",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      })
    );
  }

  const contactParts = [
    profile.email,
    profile.phone,
    profile.location,
  ].filter(Boolean);
  if (contactParts.length > 0 || profile.url) {
    const contactLine = [...contactParts, profile.url]
      .filter(Boolean)
      .join("  |  ");
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactLine,
            size: 20,
            font: "Calibri",
            color: "555555",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  if (profile.summary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: profile.summary,
            size: 20,
            font: "Calibri",
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  const addSectionHeading = (text: string) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            size: 24,
            font: "Calibri",
            color: "1E3A5F",
          }),
        ],
        spacing: { before: 240, after: 120 },
      })
    );
  };

  const addEntry = (
    title: string,
    subtitle: string,
    date: string,
    descriptions: string[]
  ) => {
    const titleParts = [];
    if (title) {
      titleParts.push(
        new TextRun({ text: title, bold: true, size: 22, font: "Calibri" })
      );
    }
    if (subtitle) {
      titleParts.push(
        new TextRun({
          text: `  —  ${subtitle}`,
          size: 22,
          font: "Calibri",
          italics: true,
          color: "555555",
        })
      );
    }
    children.push(new Paragraph({ children: titleParts, spacing: { after: 40 } }));

    if (date) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: date,
              size: 18,
              font: "Calibri",
              color: "777777",
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }

    for (const desc of descriptions) {
      if (desc) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `•  ${desc}`,
                size: 20,
                font: "Calibri",
              }),
            ],
            spacing: { after: 40 },
            indent: { left: 400 },
          })
        );
      }
    }
  };

  for (const exp of workExperiences) {
    addSectionHeading("EXPERIENCE");
    addEntry(
      exp.jobTitle,
      exp.company,
      exp.date,
      exp.descriptions
    );
  }

  for (const edu of educations) {
    addSectionHeading("EDUCATION");
    addEntry(edu.degree, edu.school, edu.date, edu.descriptions);
    if (edu.gpa) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `GPA: ${edu.gpa}`,
              size: 20,
              font: "Calibri",
              color: "555555",
            }),
          ],
          indent: { left: 400 },
          spacing: { after: 120 },
        })
      );
    }
  }

  for (const proj of projects) {
    addSectionHeading("PROJECTS");
    addEntry(proj.project, "", proj.date, proj.descriptions);
  }

  if (skills.descriptions.length > 0) {
    addSectionHeading("SKILLS");
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: skills.descriptions.join("  |  "),
            size: 20,
            font: "Calibri",
          }),
        ],
        spacing: { after: 120 },
        indent: { left: 400 },
      })
    );
  }

  if (custom.descriptions.length > 0) {
    addSectionHeading("ADDITIONAL");
    for (const desc of custom.descriptions) {
      if (desc) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `•  ${desc}`,
                size: 20,
                font: "Calibri",
              }),
            ],
            spacing: { after: 40 },
            indent: { left: 400 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBlob(doc);
}
