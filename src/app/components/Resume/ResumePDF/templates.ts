/* NoiceResume Template-specific configs */
import { spacing } from "components/Resume/ResumePDF/styles";

export type TemplateId =
  | "executive-simple"
  | "sb2nov-modern"
  | "jsonresume-class"
  | "stackoverflow"
  | "mcdowell";

export type SectionVariant =
  | "accent-bar"
  | "border-bottom"
  | "text-only"
  | "underline-heading"
  | "minimal-heading";

export type PageLayout = "standard" | "two-column" | "compact";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  desc: string;
  bannerHeader: boolean;
  headerLayout: "center" | "left-right";
  sectionStyle: SectionVariant;
  headingFont: string;
  showTopBar: boolean;
  sectionSpacing: string;
  pageLayout: PageLayout;
}

export const TEMPLATE_CONFIGS: Record<TemplateId, TemplateConfig> = {
  "executive-simple": {
    id: "executive-simple",
    name: "Classic",
    desc: "",
    bannerHeader: false,
    headerLayout: "center",
    sectionStyle: "accent-bar",
    headingFont: "Helvetica",
    showTopBar: true,
    sectionSpacing: spacing[5],
    pageLayout: "standard",
  },
  "sb2nov-modern": {
    id: "sb2nov-modern",
    name: "Modern",
    desc: "",
    bannerHeader: false,
    headerLayout: "left-right",
    sectionStyle: "border-bottom",
    headingFont: "Times-Roman",
    showTopBar: false,
    sectionSpacing: spacing[5],
    pageLayout: "standard",
  },
  "jsonresume-class": {
    id: "jsonresume-class",
    name: "Bold",
    desc: "",
    bannerHeader: true,
    headerLayout: "center",
    sectionStyle: "text-only",
    headingFont: "Helvetica",
    showTopBar: false,
    sectionSpacing: spacing[4],
    pageLayout: "standard",
  },
  stackoverflow: {
    id: "stackoverflow",
    name: "StackOverflow",
    desc: "",
    bannerHeader: false,
    headerLayout: "center",
    sectionStyle: "accent-bar",
    headingFont: "Helvetica",
    showTopBar: false,
    sectionSpacing: spacing[4],
    pageLayout: "two-column",
  },
  mcdowell: {
    id: "mcdowell",
    name: "McDowell",
    desc: "",
    bannerHeader: false,
    headerLayout: "center",
    sectionStyle: "minimal-heading",
    headingFont: "Helvetica",
    showTopBar: false,
    sectionSpacing: spacing[3],
    pageLayout: "compact",
  },
};

/* Template-specific dynamic styles (computed from themeColor) */
export const getTemplateStyles = (
  templateId: TemplateId,
  themeColor: string,
  fontFamily: string = "Helvetica",
  fontSize: string = "11"
) => {
  const { StyleSheet } = require("@react-pdf/renderer");
  const base = StyleSheet.create({
    bannerHeader: {
      backgroundColor:
        templateId === "jsonresume-class" || templateId === "stackoverflow"
          ? "#2d2d2d"
          : "#13509b",
      padding: "40pt 50pt",
      marginBottom: "30pt",
      display: "flex",
      flexDirection: "column",
      gap: "16pt",
    },
    bannerName: {
      color: "#ffffff",
      fontSize: `${parseInt(fontSize) + 11}pt`,
      fontWeight: 700,
      fontFamily,
    },
    bannerTitle: {
      color: "#f2f2f2",
      fontSize: `${parseInt(fontSize) + 1}pt`,
    },
    sectionBorder: {
      borderBottomWidth: 1,
      borderBottomColor:
        templateId === "executive-simple" ? "#000000" : "#d1d5db",
      borderBottomStyle: "solid",
      paddingBottom: "3pt",
      marginBottom: "8pt",
    },
  });
  return base;
};
