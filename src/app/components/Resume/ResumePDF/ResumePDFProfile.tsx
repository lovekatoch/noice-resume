import { View, Text } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";
import { TEMPLATE_CONFIGS } from "components/Resume/ResumePDF/templates";
import type { TemplateId, SectionVariant } from "components/Resume/ResumePDF/templates";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
  templateId = "executive-simple",
  sectionVariant = "accent-bar",
  fontFamily,
  fontSize = "11",
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
  templateId?: TemplateId;
  sectionVariant?: SectionVariant;
  fontFamily?: string;
  fontSize?: string;
}) => {
  const { name, email, phone, url, summary, location } = profile;
  const iconProps = { email, phone, location, url };
  const cfg = TEMPLATE_CONFIGS[templateId];
  const nameSize = `${parseInt(fontSize) + 9}pt`;

  /* ── StackOverflow sidebar: name, summary, compact contact ── */
  if (templateId === "stackoverflow") {
    const contactItems = [
      location && { key: "location", label: location },
      email && { key: "email", label: email, href: `mailto:${email}` },
      phone && { key: "phone", label: phone },
      url && {
        key: "url",
        label: url,
        href: url.startsWith("http") ? url : `https://${url}`,
      },
    ].filter(Boolean) as {
      key: string;
      label: string;
      href?: string;
    }[];

    return (
      <View style={{ ...styles.flexCol, gap: spacing["1"] }}>
        <Text
          style={{
            fontSize: "16pt",
            fontWeight: "bold",
            fontFamily: "Helvetica",
            color: "#2d2d2d",
          }}
          wrap={true}
        >
          {name}
        </Text>
        {summary && (
          <Text
            style={{
              fontSize: "8pt",
              color: "#555555",
              fontFamily: "Helvetica",
              lineHeight: 1.4,
            }}
            wrap={true}
          >
            {summary}
          </Text>
        )}
        <View
          style={{
            ...styles.flexCol,
            gap: spacing["0.5"],
            marginTop: spacing["2"],
          }}
        >
          {contactItems.map((item) => (
            <View
              key={item.key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                gap: spacing["1"],
              }}
            >
              <Text style={{ fontSize: "8pt", color: "#666666", width: "14pt" }}>
                {item.key === "location"
                  ? "\u2302"
                  : item.key === "email"
                  ? "\u2709"
                  : item.key === "phone"
                  ? "\u260E"
                  : "\u2197"}
              </Text>
              {item.href ? (
                <ResumePDFLink src={item.href} isPDF={isPDF}>
                  <Text style={{ fontSize: "8pt", color: "#555555" }}>
                    {item.label}
                  </Text>
                </ResumePDFLink>
              ) : (
                <Text style={{ fontSize: "8pt", color: "#555555" }}>
                  {item.label}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }

  /* ── McDowell: compact name + inline contact ── */
  if (templateId === "mcdowell") {
    const contactParts = [
      email && email,
      phone && phone,
      location && location,
      url && url,
    ].filter(Boolean) as string[];

    return (
      <View style={{ ...styles.flexCol, marginBottom: spacing["1"] }}>
        <Text
          style={{
            fontSize: nameSize,
            fontWeight: "bold",
            fontFamily: "Helvetica",
          }}
          wrap={true}
        >
          {name}
        </Text>
        {summary && (
          <Text
            style={{
              fontSize: "9pt",
              marginTop: spacing["0.5"],
              color: "#444444",
              fontFamily: "Helvetica",
              lineHeight: 1.4,
            }}
            wrap={true}
          >
            {summary}
          </Text>
        )}
        {contactParts.length > 0 && (
          <View
            style={{
              ...styles.flexRow,
              flexWrap: "wrap",
              marginTop: spacing["0.5"],
              gap: spacing["0.5"],
            }}
          >
            {contactParts.map((part, idx) => {
              let content = null;
              if (idx === 0 && email) {
                content = (
                  <ResumePDFLink src={`mailto:${email}`} isPDF={isPDF}>
                    <Text style={{ fontSize: "9pt", color: "#333" }}>
                      {email}
                    </Text>
                  </ResumePDFLink>
                );
              } else if (idx === 1 && phone) {
                content = (
                  <Text style={{ fontSize: "9pt", color: "#333" }}>
                    {phone}
                  </Text>
                );
              } else if (idx === 2 && location) {
                content = (
                  <Text style={{ fontSize: "9pt", color: "#333" }}>
                    {location}
                  </Text>
                );
              } else if (idx === 3 && url) {
                content = (
                  <ResumePDFLink
                    src={url.startsWith("http") ? url : `https://${url}`}
                    isPDF={isPDF}
                  >
                    <Text style={{ fontSize: "9pt", color: "#333" }}>
                      {url}
                    </Text>
                  </ResumePDFLink>
                );
              }
              return (
                <View
                  key={idx}
                  style={{ ...styles.flexRow, alignItems: "center" }}
                >
                  <Text
                    style={{
                      marginHorizontal: spacing["0.5"],
                      color: "#999",
                      fontSize: "9pt",
                    }}
                  >
                    |
                  </Text>
                  {content}
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }

  /* ── SB2Nov Modern: name left, contact right, no icons ── */
  if (templateId === "sb2nov-modern") {
    return (
      <>
        <View
          style={{
            ...styles.flexRowBetween,
            alignItems: "baseline",
            flexWrap: "wrap",
            marginTop: spacing[4],
            marginBottom: spacing[2],
          }}
        >
          <Text
            style={{
              fontSize: nameSize,
              fontFamily: fontFamily || cfg.headingFont,
              fontWeight: 700,
            }}
          >
            {name}
          </Text>
          <View
            style={{
              ...styles.flexCol,
              alignItems: "flex-end",
              gap: spacing[0.5],
            }}
          >
            {email && (
              <ResumePDFLink src={`mailto:${email}`} isPDF={isPDF}>
                <Text style={{ color: themeColor }}>{email}</Text>
              </ResumePDFLink>
            )}
            {phone && (
              <ResumePDFLink
                src={`tel:${phone.replace(/[^\d+]/g, "")}`}
                isPDF={isPDF}
              >
                <Text style={{ color: themeColor }}>{phone}</Text>
              </ResumePDFLink>
            )}
            {url && (
              <ResumePDFLink
                src={url.startsWith("http") ? url : `https://${url}`}
                isPDF={isPDF}
              >
                <Text style={{ color: themeColor }}>{url}</Text>
              </ResumePDFLink>
            )}
          </View>
        </View>
        {summary && (
          <ResumePDFSection
            themeColor={themeColor}
            heading="SUMMARY"
            sectionVariant={sectionVariant}
          >
            <Text style={{ lineHeight: 1.4 }}>{summary}</Text>
          </ResumePDFSection>
        )}
      </>
    );
  }

  /* ── JSON Resume Class: banner has name + summary, just show contact ── */
  if (templateId === "jsonresume-class") {
    return (
      <View style={{ marginTop: spacing[2], marginBottom: spacing[3] }}>
        <View
          style={{ ...styles.flexRow, flexWrap: "wrap", gap: spacing[2] }}
        >
          {email && (
            <View style={{ ...styles.flexCol, width: "48%" }}>
              <View>
                <Text style={{ fontWeight: 600 }}>Email</Text>
              </View>
              <View>
                <ResumePDFLink src={`mailto:${email}`} isPDF={isPDF}>
                  <Text style={{ color: "#2c5999" }}>{email}</Text>
                </ResumePDFLink>
              </View>
            </View>
          )}
          {phone && (
            <View style={{ ...styles.flexCol, width: "48%" }}>
              <View>
                <Text style={{ fontWeight: 600 }}>Phone</Text>
              </View>
              <View>
                <Text>{phone}</Text>
              </View>
            </View>
          )}
          {url && (
            <View style={{ ...styles.flexCol, width: "48%" }}>
              <View>
                <Text style={{ fontWeight: 600 }}>Website</Text>
              </View>
              <View>
                <ResumePDFLink
                  src={url.startsWith("http") ? url : `https://${url}`}
                  isPDF={isPDF}
                >
                  <Text style={{ color: "#2c5999" }}>{url}</Text>
                </ResumePDFLink>
              </View>
            </View>
          )}
          {location && (
            <View style={{ ...styles.flexCol, width: "48%" }}>
              <View>
                <Text style={{ fontWeight: 600 }}>Location</Text>
              </View>
              <View>
                <Text>{location}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  /* ── Executive Simple (default): centered name, icons, summary ── */
  return (
    <ResumePDFSection style={{ marginTop: spacing["4"] }}>
      <ResumePDFText
        bold={true}
        themeColor={themeColor}
        style={{ fontSize: nameSize, textAlign: "center" }}
      >
        {name}
      </ResumePDFText>
      {summary && <ResumePDFText>{summary}</ResumePDFText>}
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: "wrap",
          marginTop: spacing["0.5"],
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType = key as IconType;
          if (key === "url") {
            if (value.includes("github")) {
              iconType = "url_github";
            } else if (value.includes("linkedin")) {
              iconType = "url_linkedin";
            }
          }

          const shouldUseLinkWrapper = ["email", "url", "phone"].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = "";
            switch (key) {
              case "email": {
                src = `mailto:${value}`;
                break;
              }
              case "phone": {
                src = `tel:${value.replace(/[^\d+]/g, "")}`;
                break;
              }
              default: {
                src = value.startsWith("http") ? value : `https://${value}`;
              }
            }

            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                gap: spacing["1"],
              }}
            >
              <ResumePDFIcon type={iconType} isPDF={isPDF} />
              <Wrapper>
                <ResumePDFText>{value}</ResumePDFText>
              </Wrapper>
            </View>
          );
        })}
      </View>
    </ResumePDFSection>
  );
};
