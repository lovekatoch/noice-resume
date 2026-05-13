import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeSkills } from "lib/redux/types";

export const ResumePDFSkills = ({
  heading,
  skills,
  themeColor,
  showBulletPoints,
  sectionVariant = "accent-bar",
  templateId,
}: {
  heading: string;
  skills: ResumeSkills;
  themeColor: string;
  showBulletPoints: boolean;
  sectionVariant?: "accent-bar" | "border-bottom" | "text-only" | "underline-heading" | "minimal-heading";
  templateId?: string;
}) => {
  const { descriptions } = skills;

  // StackOverflow template: descriptions as one-line compact
  if (templateId === "stackoverflow") {
    return (
      <ResumePDFSection themeColor={themeColor} heading={heading} sectionVariant={sectionVariant}>
        {descriptions.length > 0 && (
          <ResumePDFText
            style={{
              marginTop: spacing["0.5"],
              lineHeight: "1.3",
              flexGrow: 1,
              flexBasis: 0,
              fontSize: "9pt",
              color: "#555555",
            }}
          >
            {descriptions.join(" · ")}
          </ResumePDFText>
        )}
      </ResumePDFSection>
    );
  }

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading} sectionVariant={sectionVariant}>
      <View style={{ ...styles.flexCol }}>
        <ResumePDFBulletList
          items={descriptions}
          showBulletPoints={showBulletPoints}
        />
      </View>
    </ResumePDFSection>
  );
};
