"use client";

import { useCheckoutAnalytics } from "lib/hooks/useCheckoutAnalytics";

export function CheckoutAnalyticsTracker() {
  useCheckoutAnalytics();
  return null;
}
