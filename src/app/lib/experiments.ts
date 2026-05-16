"use client";

import { useFeatureFlagVariantKey, usePostHog } from "posthog-js/react";

export const EXPERIMENTS = {
  HERO_CTA: "landing-hero-cta",
  SOCIAL_PROOF: "landing-social-proof",
  TEMPLATE_LAYOUT: "landing-template-layout",
} as const;

export type ExperimentKey = (typeof EXPERIMENTS)[keyof typeof EXPERIMENTS];

export function useExperiment(
  key: ExperimentKey,
  fallback = "control"
): string {
  const variant = useFeatureFlagVariantKey(key);
  if (typeof variant === "string") return variant;
  return fallback;
}

export function useExperimentGoal() {
  const posthog = usePostHog();
  return (goalName: string, properties?: Record<string, unknown>) => {
    posthog?.capture(goalName, properties);
  };
}
