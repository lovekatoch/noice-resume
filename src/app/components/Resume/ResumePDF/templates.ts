/* NoiceResume Template-specific configs */
import { spacing } from "components/Resume/ResumePDF/styles";

export type TemplateId =
  | "executive-simple"
  | "sb2nov-modern"
  | "stackoverflow";

export type SectionVariant =
  | "accent-bar"
  | "border-bottom"
  | "text-only"
  | "underline-heading"
  | "minimal-heading";

export type PageLayout = "standard" | "two-column";

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
};
