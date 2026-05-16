"use client";

export const EXPERIMENTS = {
  HERO_CTA: "landing-hero-cta",
  SOCIAL_PROOF: "landing-social-proof",
  TEMPLATE_LAYOUT: "landing-template-layout",
  HEADLINE: "landing-headline-variant",
} as const;

export type ExperimentKey = (typeof EXPERIMENTS)[keyof typeof EXPERIMENTS];

export function useExperiment(
  _key: ExperimentKey,
  fallback = "control"
): string {
  return fallback;
}

export function useExperimentGoal() {
  return (_goalName: string, _properties?: Record<string, unknown>) => {};
}
