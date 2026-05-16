"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { captureCampaignAttribution, captureShareAttributedVisit } from "lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();
  const hasTrackedAttribution = useRef(false);
  const hasTrackedCampaign = useRef(false);

  useEffect(() => {
    if (pathname) {
      posthog.capture("$pageview", { $current_url: pathname });
    }
  }, [pathname]);

  useEffect(() => {
    if (hasTrackedAttribution.current) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get("share_id");
    const utmSource = params.get("utm_source");
    if (shareId && utmSource === "share") {
      hasTrackedAttribution.current = true;
      captureShareAttributedVisit({
        shareId,
        referrer: document.referrer || undefined,
      });
    }
  }, [pathname]);

  useEffect(() => {
    if (hasTrackedCampaign.current) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    if (utmSource && utmSource !== "share") {
      hasTrackedCampaign.current = true;
      captureCampaignAttribution({
        utmSource,
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
        utmTerm: params.get("utm_term"),
        utmContent: params.get("utm_content"),
        referrer: document.referrer,
      });
    }
  }, [pathname]);

  return null;
}
