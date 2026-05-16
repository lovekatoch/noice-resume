"use client";

import { getDeviceId } from "lib/analytics";

const REFERRAL_TOKEN_KEY = "noiceresume_referral_token";
const REFERRAL_SHARES_KEY = "noiceresume_referral_shares";
const REFERRAL_CONVERSIONS_KEY = "noiceresume_referral_conversions";
const REFERRED_BY_KEY = "noiceresume_referred_by";
const INCENTIVE_UNLOCKED_KEY = "noiceresume_incentive_unlocked";

export const SHARE_MILESTONE = 3;
const REFERRAL_WEBHOOK_URL = "https://referral-webhook.your-worker.workers.dev/verify";

export function captureReferralToken(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const token = params.get("ref");
  if (token) {
    localStorage.setItem(REFERRAL_TOKEN_KEY, token);
    localStorage.setItem(REFERRED_BY_KEY, token);
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);
    return token;
  }
  return localStorage.getItem(REFERRAL_TOKEN_KEY);
}

export function clearReferralToken(): void {
  localStorage.removeItem(REFERRAL_TOKEN_KEY);
}

export function getReferralLink(): string {
  if (typeof window === "undefined") return "";
  const id = getDeviceId();
  return `${window.location.origin}/resume-builder?ref=${id}`;
}

export function recordShare(): void {
  if (typeof window === "undefined") return;
  const shares = getShareTimestamps();
  shares.push(Date.now());
  localStorage.setItem(REFERRAL_SHARES_KEY, JSON.stringify(shares));
  if (shares.length >= SHARE_MILESTONE) {
    localStorage.setItem(INCENTIVE_UNLOCKED_KEY, "true");
  }
}

export function getShareTimestamps(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(REFERRAL_SHARES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getShareCount(): number {
  return getShareTimestamps().length;
}

export function getReferredBy(): string | null {
  return localStorage.getItem(REFERRED_BY_KEY);
}

export function recordConversion(): void {
  if (typeof window === "undefined") return;
  const conversions = getConversionTimestamps();
  conversions.push(Date.now());
  localStorage.setItem(REFERRAL_CONVERSIONS_KEY, JSON.stringify(conversions));
}

export function getConversionTimestamps(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(REFERRAL_CONVERSIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getConversionCount(): number {
  return getConversionTimestamps().length;
}

export function isIncentiveUnlocked(): boolean {
  return localStorage.getItem(INCENTIVE_UNLOCKED_KEY) === "true";
}

export function getMilestoneProgress(): { current: number; target: number; unlocked: boolean } {
  const current = getShareCount();
  const unlocked = current >= SHARE_MILESTONE || isIncentiveUnlocked();
  return { current, target: SHARE_MILESTONE, unlocked };
}

export async function notifyReferralCompleted(token: string): Promise<void> {
  recordConversion();
  try {
    const resp = await fetch(REFERRAL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, referrerDeviceId: getDeviceId() }),
    });
    if (resp.ok) {
      clearReferralToken();
    }
  } catch (err) {
    console.warn("Failed to notify referral webhook (non-blocking):", err);
  }
}
