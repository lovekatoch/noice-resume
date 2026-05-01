"use client";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  convertInchesToTwip,
  SectionType,
  BorderStyle,
} from "docx";
import type { Resume, ResumeProfile } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";

const FONT_SIZES = {
  xs: 16,
  sm: 20,
  base: 22,
  lg: 24,
  xl: 28,
  "2xl": 32,
};

function twip(pts: string): number {
  return convertInchesToTwip(parseFloat(pts) / 72);
}

function profileToDocx(profile: ResumeProfile) {
  const runs: TextRun[] = [];

  if (profile.name) {
    runs.push(
      new TextRun({
        text: profile.name,
        bold: true,
        size: FONT_SIZES["2xl"],
      })
    );
    runs.push(new TextRun({ text: "\n", size: FONT_SIZES.xs }));
  }

  if (profile.summary) {
    runs.push(new TextRun({ text: profile.summary, size: FONT_SIZES.base }));
    runs.push(new TextRun({ text: "\n", size: FONT_SIZES.xs }));
  }

  const contactParts: string[] = [];
  if (profile.email) contactParts.push(profile.email);
  if (profile.phone) contactParts.push(profile.phone);
  if (profile.location) contactParts.push(profile.location);
  if (profile.url) contactParts.push(profile.url);

  if (contactParts.length > 0) {
    runs.push(
      new TextRun({
        text: contactParts.join("  |  "),
        size: FONT_SIZES.sm,
        color: "666666",
      })
    );
  }

  return runs.length > 0
    ? [
        new Paragraph({
          children: runs,
          spacing: { after: 120 },
        }),
      ]
    : [];
}

function sectionHeading(text: string, themeColor?: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `  ${text}`,
        bold: true,
        size: FONT_SIZES.lg,
        color: themeColor || "003366",
      }),
    ],
    spacing: { before: 280, after: 120 },
    border: {
      bottom: {
        color: themeColor || "003366",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
  });
}

function workExperienceToDocx(
  workExperiences: Resume["workExperiences"],
  themeColor?: string
) {
  const paragraphs: Paragraph[] = [];

  for (let idx = 0; idx < workExperiences.length; idx++) {
    const exp = workExperiences[idx];
    if (!exp.company && !exp.jobTitle) continue;

    const hideCompanyName =
      idx > 0 && exp.company === workExperiences[idx - 1].company;

    if (!hideCompanyName && exp.company) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: exp.company, bold: true })],
          spacing: { before: 160, after: 0 },
        })
      );
    }

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: exp.jobTitle || "" }),
          new TextRun({
            text: exp.date ? `   ${exp.date}` : "",
            color: "666666",
          }),
        ],
        spacing: { before: 40, after: 80 },
      })
    );

    for (const desc of exp.descriptions) {
      if (desc.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: "\t• ", bold: true }),
              new TextRun({ text: desc }),
            ],
            spacing: { after: 40 },
          })
        );
      }
    }
  }

  return paragraphs;
}

function educationToDocx(
  educations: Resume["educations"],
  showBulletPoints: boolean
) {
  const paragraphs: Paragraph[] = [];

  for (const edu of educations) {
    if (!edu.school && !edu.degree) continue;

    if (edu.school) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: edu.school, bold: true })],
          spacing: { before: 160, after: 0 },
        })
      );
    }

    const degreeParts: string[] = [];
    if (edu.degree) degreeParts.push(edu.degree);
    if (edu.gpa) degreeParts.push(`GPA: ${edu.gpa}`);
    if (edu.date) degreeParts.push(edu.date);

    if (degreeParts.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: degreeParts.join("  |  ") })],
          spacing: { before: 40, after: 80 },
        })
      );
    }

    for (const desc of edu.descriptions) {
      if (desc.trim()) {
        const bullet = showBulletPoints ? "\t• " : "";
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: bullet + desc }),
            ],
            spacing: { after: 40 },
          })
        );
      }
    }
  }

  return paragraphs;
}

function projectToDocx(projects: Resume["projects"]) {
  const paragraphs: Paragraph[] = [];

  for (const proj of projects) {
    if (!proj.project) continue;

    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: proj.project, bold: true })],
        spacing: { before: 160, after: 0 },
      })
    );

    if (proj.date) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: proj.date, color: "666666" })],
          spacing: { before: 40, after: 80 },
        })
      );
    }

    for (const desc of proj.descriptions) {
      if (desc.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: "\t• ", bold: true }),
              new TextRun({ text: desc }),
            ],
            spacing: { after: 40 },
          })
        );
      }
    }
  }

  return paragraphs;
}

function skillsToDocx(
  skills: Resume["skills"],
  showBulletPoints: boolean
) {
  const paragraphs: Paragraph[] = [];

  if (skills.featuredSkills && skills.featuredSkills.length > 0) {
    const validSkills = skills.featuredSkills.filter((s) => s.skill.trim());
    if (validSkills.length > 0) {
      const skillText = validSkills.map((s) => s.skill).join(", ");
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: skillText })],
          spacing: { before: 120, after: 80 },
        })
      );
    }
  }

  for (const desc of skills.descriptions) {
    if (desc.trim()) {
      const bullet = showBulletPoints ? "\t• " : "";
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: bullet + desc })],
          spacing: { after: 40 },
        })
      );
    }
  }

  return paragraphs;
}

function customToDocx(custom: Resume["custom"], showBulletPoints: boolean) {
  const paragraphs: Paragraph[] = [];

  for (const desc of custom.descriptions) {
    if (desc.trim()) {
      const bullet = showBulletPoints ? "\t• " : "";
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: bullet + desc })],
          spacing: { after: 40 },
        })
      );
    }
  }

  return paragraphs;
}

export interface ResumeDOCXOptions {
  resume: Resume;
  settings: Settings;
}

export async function generateResumeDOCX({
  resume,
  settings,
}: ResumeDOCXOptions): Promise<Blob> {
  const {
    profile,
    workExperiences,
    educations,
    projects,
    skills,
    custom,
  } = resume;

  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
    themeColor,
  } = settings;

  const resolvedThemeColor = themeColor || "#003366";
  const resolvedFontFamily = fontFamily || "Arial";

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: profile.name || "Resume",
          bold: true,
          size: FONT_SIZES["2xl"],
          font: resolvedFontFamily,
        }),
      ],
      spacing: { after: 60 },
    })
  );

  children.push(...profileToDocx(profile));

  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  for (const form of showFormsOrder) {
    const heading = formToHeading[form] || form;

    switch (form) {
      case "workExperiences": {
        children.push(sectionHeading(heading, resolvedThemeColor));
        children.push(
          ...workExperienceToDocx(workExperiences, resolvedThemeColor)
        );
        break;
      }
      case "educations": {
        children.push(sectionHeading(heading, resolvedThemeColor));
        children.push(...educationToDocx(educations, showBulletPoints.educations));
        break;
      }
      case "projects": {
        children.push(sectionHeading(heading, resolvedThemeColor));
        children.push(...projectToDocx(projects));
        break;
      }
      case "skills": {
        children.push(sectionHeading(heading, resolvedThemeColor));
        children.push(...skillsToDocx(skills, showBulletPoints.skills));
        break;
      }
      case "custom": {
        children.push(sectionHeading(heading, resolvedThemeColor));
        children.push(...customToDocx(custom, showBulletPoints.custom));
        break;
      }
    }
  }

  const doc = new Document({
    creator: "NoiceResume",
    title: `${profile.name || "Resume"} - Resume`,
    description: "Generated by NoiceResume",
    styles: {
      default: {
        document: {
          run: {
            font: resolvedFontFamily,
            size: parseInt(fontSize || "11") / 2,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation:
                documentSize === "A4"
                  ? SectionType.A4
                  : SectionType.LETTER,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}