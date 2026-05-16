"use client";

const DEVICE_ID_KEY = "noiceresume_device_id";
let _sessionStarted = false;

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function initAnalytics() {
  if (typeof window === "undefined") return;
  getDeviceId();
  if (!localStorage.getItem("noiceresume_first_visit")) {
    localStorage.setItem("noiceresume_first_visit", String(Date.now()));
  }
  if (!_sessionStarted) {
    _sessionStarted = true;
  }
}

export function capture(_event: string, _properties?: Record<string, unknown>) {
}

export function captureLandingCtaClick(opts: {
  ctaLabel: string;
  ctaLocation: string;
}) {
  capture("landing_cta_clicked", opts);
}

export function captureTemplateView(opts: {
  templateSlug: string;
  templateName: string;
}) {
  capture("template_viewed", opts);
}

export function captureImportEvent(event: string, opts?: Record<string, unknown>) {
  capture("import_event", { event, ...opts });
}

export function captureBuilderSession(opts: {
  resumed: boolean;
  fromTemplate?: string;
  sessionAgeDays?: number;
}) {
  capture("builder_session_started", opts);
}

export function captureFirstSectionAdded(opts: { sectionType: string }) {
  capture("first_section_added", opts);
}

export function captureTemplateSelected(opts: { template: string }) {
  capture("template_selected", opts);
}

export function captureAiEnhancementUsed(opts: {
  sectionType: string;
  fieldCount: number;
}) {
  capture("ai_enhancement_used", opts);
}

export function capturePdfGenerationStarted(opts: {
  template: string;
  sectionCount: number;
}) {
  capture("pdf_generation_started", opts);
}

export function captureDownload(opts: {
  template: string;
  fileName: string;
  fileType: string;
}) {
  capture("resume_downloaded", opts);
  const url = process.env.NEXT_PUBLIC_DOWNLOAD_COUNTER_WORKER_URL;
  if (!url) return;
  void fetch(`${url}/increment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      template: opts.template,
      fileType: opts.fileType,
    }),
  }).catch(() => {});
}

export interface DownloadStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  templates: Record<string, number>;
}

export async function fetchDownloadStats(): Promise<DownloadStats | null> {
  const url = process.env.NEXT_PUBLIC_DOWNLOAD_COUNTER_WORKER_URL;
  if (!url) return null;
  try {
    const resp = await fetch(`${url}/stats`);
    if (!resp.ok) return null;
    return (await resp.json()) as DownloadStats;
  } catch {
    return null;
  }
}

export function captureShareUrlGenerated(opts: { url: string }) {
  capture("share_url_generated", opts);
}

export function captureShareEvent(event: string, opts?: Record<string, unknown>) {
  capture(event, opts);
}

export function captureCheckoutStarted(opts: {
  priceId: string;
  planName: string;
  amount: number;
  currency: string;
}) {
  capture("checkout_started", opts);
}

export function captureCheckoutCompleted(opts: {
  sessionId: string;
  customerId?: string;
  amount: number;
  currency: string;
  planName: string;
}) {
  capture("checkout_completed", opts);
}

export function captureCheckoutCancelled(opts: {
  priceId?: string;
  planName?: string;
  step: string;
}) {
  capture("checkout_cancelled", opts);
}

export function captureCheckoutError(opts: {
  error: string;
  priceId?: string;
  planName?: string;
  step: string;
}) {
  capture("checkout_error", opts);
}

export function capturePremiumActivated(opts: {
  sessionId?: string;
  customerId?: string;
}) {
  capture("premium_activated", opts);
}

export function captureCheckoutEvent(
  event: string,
  opts?: Record<string, unknown>
) {
  capture(event, opts);
}

export function captureReferralConversion() {
  capture("referral_conversion");
}

export function captureReferralLinkGenerated(opts: { referralLink: string }) {
  capture("referral_link_generated", opts);
}

export function captureReferralShare(opts: {
  medium: string;
  referralLink: string;
}) {
  capture("referral_share", opts);
}

export function captureReferralAttributedVisit(opts: {
  referrerToken: string;
}) {
  capture("referral_attributed_visit", opts);
}


export function captureShareAttributedVisit(opts: {
  shareId: string;
  referrer?: string;
}) {
  capture("share_attributed_visit", opts);
}

export function captureShareFlowDownloaded(opts: {
  shareId: string | null;
}) {
  capture("share_flow_downloaded", opts);
}

const DEEPSEEK_INPUT_COST_PER_1M = 0.27;
const DEEPSEEK_OUTPUT_COST_PER_1M = 1.10;

function calculateCost(
  promptTokens: number,
  completionTokens: number
): number {
  const inputCost =
    (promptTokens / 1_000_000) * DEEPSEEK_INPUT_COST_PER_1M;
  const outputCost =
    (completionTokens / 1_000_000) * DEEPSEEK_OUTPUT_COST_PER_1M;
  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
}

export function captureAiTokenUsage(opts: {
  sectionType: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
}) {
  capture("ai_token_usage", { ...opts, cost: calculateCost(opts.promptTokens, opts.completionTokens) });
}

export function captureAiEnhanceRequested(opts: {
  sectionType: string;
  isRegenerate: boolean;
  globalEnhanceCount: number;
}) {
  capture("ai_enhance_requested", opts);
}

export function captureAiEnhanceSuccess(opts: {
  sectionType: string;
  isRegenerate: boolean;
  responseTimeMs: number;
  globalEnhanceCount: number;
}) {
  capture("ai_enhance_success", opts);
}

export function captureAiEnhanceError(opts: {
  sectionType: string;
  isRegenerate: boolean;
  errorMessage: string;
  globalEnhanceCount: number;
}) {
  capture("ai_enhance_error", opts);
}

export function captureAiEnhanceAccepted(opts: {
  sectionType: string;
  globalEnhanceCount: number;
}) {
  capture("ai_enhance_accepted", opts);
}

export function captureFormFieldEdited(opts: {
  sectionType: string;
  fieldName: string;
  action: "add" | "edit" | "delete";
}) {
  capture("form_field_edited", opts);
}

export function captureTemplateBrowsed(opts: {
  searchTerm?: string;
  templateCount: number;
}) {
  capture("template_browsed", opts);
}

export function captureContentPageViewed(opts: {
  pageType: string;
  slug?: string;
}) {
  capture("content_page_viewed", opts);
}

export function capturePwaInstalled() {
  capture("pwa_installed");
}

export function captureError(opts: {
  errorMessage: string;
  componentStack?: string;
  errorType?: string;
}) {
  capture("error", opts);
}

export function captureRoastGenerated(opts: {
  overallScore: number;
}) {
  capture("roast_generated", opts);
}

export function captureRoastShared(opts: {
  platform: string;
  overallScore: number;
}) {
  capture("roast_shared", opts);
}

export function captureRoastCardDownloaded(opts: {
  overallScore: number;
}) {
  capture("roast_card_downloaded", opts);
}

export function captureFirstRunPreFill() {
  capture("first_run_prefill");
}

export function captureQuickStartSelected(opts: { role: string }) {
  capture("quick_start_selected", opts);
}

export function captureOnboardingHintDismissed() {
  capture("onboarding_hint_dismissed");
}

export function captureSectionAutoShown(opts: { section: string }) {
  capture("section_auto_shown", opts);
}


export function captureCampaignAttribution(opts: {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  referrer?: string;
}) {
  capture("campaign_attribution", {
    utm_source: opts.utmSource,
    utm_medium: opts.utmMedium,
    utm_campaign: opts.utmCampaign,
    utm_term: opts.utmTerm,
    utm_content: opts.utmContent,
    referrer: opts.referrer,
  });
}
