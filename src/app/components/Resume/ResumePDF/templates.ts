/* NoiceResume Template-specific React-PDF styles */
/* Each template exports styling configuration objects */

import { StyleSheet } from "@react-pdf/renderer";
import { spacing } from "components/Resume/ResumePDF/styles";

export type TemplateId = "executive-simple" | "sb2nov-modern" | "jsonresume-class";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  desc: string;
  /* If true, render a full-width banner header */
  bannerHeader: boolean;
  /* Header layout: "center" | "left-right" | "banner" */
  headerLayout: "center" | "left-right";
  /* Section heading style */
  sectionStyle: "accent-bar" | "border-bottom" | "text-only";
  /* Font family fallback for headings */
  headingFont: string;
  /* Whether to show a colored bar at the very top of page */
  showTopBar: boolean;
  /* Additional spacing above sections */
  sectionSpacing: string;
}

export const TEMPLATE_CONFIGS: Record<TemplateId, TemplateConfig> = {
  "executive-simple": {
    id: "executive-simple",
    name: "Classic",
    desc: "",
    bannerHeader: false,
    headerLayout: "center",
    sectionStyle: "border-bottom",
    headingFont: "Helvetica",
    showTopBar: true,
    sectionSpacing: spacing[5],
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
  },
};

/* Template-specific dynamic styles (computed from themeColor) */
export const getTemplateStyles = (templateId: TemplateId, themeColor: string) => {
  const base = StyleSheet.create({
    bannerHeader: {
      backgroundColor: templateId === "jsonresume-class" ? themeColor : "#13509b",
      padding: "40pt 50pt",
      marginBottom: "30pt",
      display: "flex",
      flexDirection: "column",
      gap: "16pt",
    },
    bannerName: {
      color: "#ffffff",
      fontSize: "22pt",
      fontWeight: 700,
      fontFamily: "Helvetica",
    },
    bannerTitle: {
      color: "#f2f2f2",
      fontSize: "12pt",
    },
    sectionBorder: {
      borderBottomWidth: 1,
      borderBottomColor: templateId === "executive-simple" ? "#000000" : "#d1d5db",
      borderBottomStyle: "solid",
      paddingBottom: "3pt",
      marginBottom: "8pt",
    },
  });

  return base;
};
