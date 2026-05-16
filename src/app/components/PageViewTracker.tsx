"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { captureShareAttributedVisit } from "lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();
  const hasTrackedAttribution = useRef(false);

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

  return null;
}
