import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";

export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  sectionVariant = "accent-bar",
  children,
}: {
  themeColor?: string;
  heading?: string;
  style?: Style;
  sectionVariant?: "accent-bar" | "border-bottom" | "text-only" | "underline-heading" | "minimal-heading";
  children: React.ReactNode;
}) => (
  <View
    style={{
      ...styles.flexCol,
      gap: spacing["2"],
      marginTop: spacing["5"],
      ...style,
    }}
  >
    {heading && (
      <>
        {sectionVariant === "border-bottom" && (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: themeColor || "#000000",
              borderBottomStyle: "solid",
              paddingBottom: "2pt",
              marginBottom: "6pt",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                letterSpacing: "0.3pt",
                textTransform: "uppercase",
              }}
              debug={DEBUG_RESUME_PDF_FLAG}
            >
              {heading}
            </Text>
          </View>
        )}
        {sectionVariant === "text-only" && (
          <Text
            style={{
              fontWeight: 600,
              marginBottom: "4pt",
            }}
            debug={DEBUG_RESUME_PDF_FLAG}
          >
            {heading}
          </Text>
        )}
        {sectionVariant === "underline-heading" && (
          <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
            <Text
              style={{
                fontWeight: "bold",
                color: "#DD3D2A",
                fontSize: "11pt",
                letterSpacing: "0.3pt",
                textTransform: "uppercase",
              }}
              debug={DEBUG_RESUME_PDF_FLAG}
            >
              {heading}
            </Text>
            <View
              style={{
                flex: 1,
                borderBottomWidth: 2,
                borderBottomColor: "#999999",
                borderBottomStyle: "solid",
                marginLeft: "4pt",
                marginBottom: "2pt",
              }}
            />
          </View>
        )}
        {sectionVariant === "minimal-heading" && (
          <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: "2pt" }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "9pt",
                letterSpacing: "0.5pt",
                color: "#666666",
              }}
              debug={DEBUG_RESUME_PDF_FLAG}
            >
              {heading}
            </Text>
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                borderBottomColor: "#cccccc",
                borderBottomStyle: "solid",
                marginLeft: "4pt",
                marginBottom: "2pt",
              }}
            />
          </View>
        )}
        {sectionVariant === "accent-bar" && (
          <View style={{ ...styles.flexRow, alignItems: "center" }}>
            {themeColor && (
              <View
                style={{
                  height: "3.75pt",
                  width: "30pt",
                  backgroundColor: themeColor,
                  marginRight: spacing["3.5"],
                }}
                debug={DEBUG_RESUME_PDF_FLAG}
              />
            )}
            <Text
              style={{
                fontWeight: "bold",
                letterSpacing: "0.3pt",
              }}
              debug={DEBUG_RESUME_PDF_FLAG}
            >
              {heading}
            </Text>
          </View>
        )}
      </>
    )}
    {children}
  </View>
);

export const ResumePDFSectionWithBorder = ({
  themeColor,
  heading,
  style = {},
  children,
}: {
  themeColor?: string;
  heading?: string;
  style?: Style;
  children: React.ReactNode;
}) => (
  <View
    style={{
      ...styles.flexCol,
      gap: spacing["2"],
      marginTop: spacing["5"],
      ...style,
    }}
  >
    {heading && (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: themeColor || "#000000",
          borderBottomStyle: "solid",
          paddingBottom: "3pt",
          marginBottom: "6pt",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            letterSpacing: "0.3pt",
            textTransform: "uppercase",
          }}
          debug={DEBUG_RESUME_PDF_FLAG}
        >
          {heading}
        </Text>
      </View>
    )}
    {children}
  </View>
);

export const ResumePDFText = ({
  bold = false,
  themeColor,
  style = {},
  children,
}: {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  children: React.ReactNode;
}) => {
  return (
    <Text
      style={{
        color: themeColor || DEFAULT_FONT_COLOR,
        fontWeight: bold ? "bold" : "normal",
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {children}
    </Text>
  );
};

export const ResumePDFBulletList = ({
  items,
  showBulletPoints = true,
}: {
  items: string[];
  showBulletPoints?: boolean;
}) => {
  return (
    <>
      {items.map((item, idx) => (
        <View style={{ ...styles.flexRow }} key={idx}>
          {showBulletPoints && (
            <ResumePDFText
              style={{
                paddingLeft: spacing["2"],
                paddingRight: spacing["2"],
                lineHeight: "1.3",
              }}
              bold={true}
            >
              {"•"}
            </ResumePDFText>
          )}
          {/* A breaking change was introduced causing text layout to be wider than node's width
              https://github.com/diegomura/react-pdf/issues/2182. flexGrow & flexBasis fixes it */}
          <ResumePDFText
            style={{ lineHeight: "1.3", flexGrow: 1, flexBasis: 0 }}
          >
            {item}
          </ResumePDFText>
        </View>
      ))}
    </>
  );
};

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <ResumePDFText style={{ marginRight: spacing[0.5] }}>
        {skill}
      </ResumePDFText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "9pt",
            width: "9pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
            borderRadius: "100%",
          }}
        />
      ))}
    </View>
  );
};
