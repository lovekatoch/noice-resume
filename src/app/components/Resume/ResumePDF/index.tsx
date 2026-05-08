import { Page, View, Document, Text } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";
import { TEMPLATE_CONFIGS, getTemplateStyles } from "components/Resume/ResumePDF/templates";
import type { TemplateId } from "components/Resume/ResumePDF/templates";

/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */
export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } =
    resume;
  const { name } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;
  const templateId = (settings.template || "executive-simple") as TemplateId;
  const templateCfg = TEMPLATE_CONFIGS[templateId];
  const tplStyles = getTemplateStyles(templateId, themeColor, fontFamily, fontSize);

  // Map templateId to sectionVariant
  const sectionVariant =
    templateId === "sb2nov-modern"
      ? "border-bottom"
      : templateId === "jsonresume-class"
      ? "text-only"
      : templateId === "mcdowell"
      ? "minimal-heading"
      : templateId === "stackoverflow"
      ? "accent-bar"
      : "accent-bar";

  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor}
        sectionVariant={sectionVariant}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["educations"]}
        sectionVariant={sectionVariant}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading["projects"]}
        projects={projects}
        themeColor={themeColor}
        sectionVariant={sectionVariant}
      />
    ),
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading["skills"]}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["skills"]}
        sectionVariant={sectionVariant}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["custom"]}
        sectionVariant={sectionVariant}
      />
    ),
  };

  /* ── Two-column layout (StackOverflow) ── */
  if (templateId === "stackoverflow") {
    return (
      <>
        <Document
          title={`${name} Resume`}
          author={name}
          producer={"NoiceResume"}
        >
          <Page
            size={documentSize === "A4" ? "A4" : "LETTER"}
            style={{
              ...styles.flexRow,
              color: DEFAULT_FONT_COLOR,
              fontFamily,
              fontSize: fontSize + "pt",
            }}
          >
            {/* Left Sidebar */}
            <View
              style={{
                width: "30%",
                backgroundColor: "#f0f0f0",
                padding: `${spacing[12]} ${spacing[8]}`,
                ...styles.flexCol,
              }}
            >
              <ResumePDFProfile
                profile={profile}
                themeColor={themeColor}
                isPDF={isPDF}
                templateId={templateId}
                sectionVariant={sectionVariant}
                fontFamily={fontFamily}
                fontSize={fontSize}
              />
              <View style={{ marginTop: spacing["6"] }}>
                <ResumePDFSkills
                  heading={formToHeading["skills"]}
                  skills={skills}
                  themeColor={themeColor}
                  showBulletPoints={showBulletPoints["skills"]}
                  sectionVariant={sectionVariant}
                />
              </View>
            </View>

            {/* Right Main Content */}
            <View
              style={{
                width: "70%",
                padding: `${spacing[12]} ${spacing[8]} ${spacing[12]} ${spacing[6]}`,
                ...styles.flexCol,
              }}
            >
              {showFormsOrder
                .filter((form) => form !== "skills")
                .map((form) => {
                  const Component = formTypeToComponent[form];
                  return <Component key={form} />;
                })}
            </View>
          </Page>
        </Document>
        <SuppressResumePDFErrorMessage />
      </>
    );
  }

  return (
    <>
      <Document
        title={`${name} Resume`}
        author={name}
        producer={"NoiceResume"}
      >
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            ...styles.flexCol,
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + "pt",
          }}
        >
          {/* JSON Resume Class: banner header */}
          {templateId === "jsonresume-class" && (
            <View style={tplStyles.bannerHeader}>
              <View style={styles.flexCol}>
                <Text style={tplStyles.bannerName}>{profile.name}</Text>
              </View>
              {profile.summary && (
                <View style={styles.flexCol}>
                  <Text style={tplStyles.bannerTitle}>{profile.summary}</Text>
                </View>
              )}
            </View>
          )}

          {/* Executive Simple: colored top bar */}
          {templateCfg.showTopBar && Boolean(settings.themeColor) && (
            <View
              style={{
                width: spacing["full"],
                height: spacing[3.5],
                backgroundColor: themeColor,
              }}
            />
          )}

          <View
            style={{
              ...styles.flexCol,
              padding:
                templateId === "mcdowell"
                  ? `${spacing[12]} ${spacing[20]}`
                  : `${spacing[16]} ${spacing[20]}`,
            }}
          >
            <ResumePDFProfile
              profile={profile}
              themeColor={themeColor}
              isPDF={isPDF}
              templateId={templateId}
              sectionVariant={sectionVariant}
              fontFamily={fontFamily}
              fontSize={fontSize}
            />
            {showFormsOrder.map((form) => {
              const Component = formTypeToComponent[form];
              return <Component key={form} />;
            })}
          </View>
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
