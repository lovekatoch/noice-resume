const REFERRAL_TOKEN_KEY = "noiceresume_referral_token";
const REFERRAL_WEBHOOK_URL = "https://referral-webhook.your-worker.workers.dev/verify";

export function captureReferralToken(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const token = params.get("ref");
  if (token) {
    localStorage.setItem(REFERRAL_TOKEN_KEY, token);
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);
    return token;
  }
  return localStorage.getItem(REFERRAL_TOKEN_KEY);
}

export function clearReferralToken(): void {
  localStorage.removeItem(REFERRAL_TOKEN_KEY);
}

export async function notifyReferralCompleted(token: string): Promise<void> {
  try {
    const resp = await fetch(REFERRAL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (resp.ok) {
      clearReferralToken();
    }
  } catch (err) {
    console.warn("Failed to notify referral webhook (non-blocking):", err);
  }
}
