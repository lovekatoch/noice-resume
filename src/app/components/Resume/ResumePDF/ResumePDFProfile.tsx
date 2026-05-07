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
import type { TemplateId } from "components/Resume/ResumePDF/templates";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
  templateId = "executive-simple",
  sectionVariant = "accent-bar",
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
  templateId?: TemplateId;
  sectionVariant?: "accent-bar" | "border-bottom" | "text-only";
}) => {
  const { name, email, phone, url, summary, location } = profile;
  const iconProps = { email, phone, location, url };
  const cfg = TEMPLATE_CONFIGS[templateId];

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
              fontSize: "22pt",
              fontFamily: cfg.headingFont,
              fontWeight: 700,
            }}
          >
            {name}
          </Text>
          <View style={{ ...styles.flexCol, alignItems: "flex-end", gap: spacing[0.5] }}>
            {email && (
              <ResumePDFLink src={`mailto:${email}`} isPDF={isPDF}>
                <Text style={{ fontSize: "10pt" }}>{email}</Text>
              </ResumePDFLink>
            )}
            {phone && (
              <ResumePDFLink src={`tel:${phone.replace(/[^\d+]/g, "")}`} isPDF={isPDF}>
                <Text style={{ fontSize: "10pt" }}>{phone}</Text>
              </ResumePDFLink>
            )}
            {url && (
              <ResumePDFLink src={url.startsWith("http") ? url : `https://${url}`} isPDF={isPDF}>
                <Text style={{ fontSize: "10pt" }}>{url}</Text>
              </ResumePDFLink>
            )}
          </View>
        </View>
        {summary && (
          <ResumePDFSection themeColor={themeColor} heading="SUMMARY" sectionVariant={sectionVariant}>
            <Text style={{ fontSize: "10pt", lineHeight: 1.4 }}>
              {summary}
            </Text>
          </ResumePDFSection>
        )}
      </>
    );
  }

  /* ── JSON Resume Class: banner has name + summary, just show contact ── */
  if (templateId === "jsonresume-class") {
    return (
      <View style={{ marginTop: spacing[2], marginBottom: spacing[3] }}>
        {/* Contact grid */}
        <View style={{ ...styles.flexRow, flexWrap: "wrap", gap: spacing[2] }}>
          {email && (
            <View style={{ ...styles.flexCol, width: "48%" }}>
              <View>
                <Text style={{ fontSize: "9pt", fontWeight: 600 }}>Email</Text>
              </View>
              <View>
                <ResumePDFLink src={`mailto:${email}`} isPDF={isPDF}>
                  <Text style={{ fontSize: "10pt", color: "#2c5999" }}>{email}</Text>
                </ResumePDFLink>
              </View>
            </View>
          )}
          {phone && (
            <View style={{ ...styles.flexCol, width: "48%" }}>
              <View>
                <Text style={{ fontSize: "9pt", fontWeight: 600 }}>Phone</Text>
              </View>
              <View>
                <Text style={{ fontSize: "10pt" }}>{phone}</Text>
              </View>
            </View>
          )}
          {url && (
            <View style={{ ...styles.flexCol, width: "48%" }}>
              <View>
                <Text style={{ fontSize: "9pt", fontWeight: 600 }}>Website</Text>
              </View>
              <View>
                <ResumePDFLink src={url.startsWith("http") ? url : `https://${url}`} isPDF={isPDF}>
                  <Text style={{ fontSize: "10pt", color: "#2c5999" }}>{url}</Text>
                </ResumePDFLink>
              </View>
            </View>
          )}
          {location && (
            <View style={{ ...styles.flexCol, width: "48%" }}>
              <View>
                <Text style={{ fontSize: "9pt", fontWeight: 600 }}>Location</Text>
              </View>
              <View>
                <Text style={{ fontSize: "10pt" }}>{location}</Text>
              </View>
            </View>
          )}
        </View>
        {/* About section is in banner header — not duplicated here */}
      </View>
    );
  }

  /* ── Executive Simple (default): centered name, icons, summary ── */
  return (
    <ResumePDFSection style={{ marginTop: spacing["4"] }}>
      <ResumePDFText
        bold={true}
        themeColor={themeColor}
        style={{ fontSize: "20pt", textAlign: "center" }}
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
