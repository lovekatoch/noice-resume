"use client";

const DEVICE_ID_KEY = "noiceresume_device_id";
let _sessionStarted = false;

function getDeviceId(): string {
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

export function captureLandingCtaClick(_opts: {
  ctaLabel: string;
  ctaLocation: string;
}) {
}

export function captureTemplateView(_opts: {
  templateSlug: string;
  templateName: string;
}) {
}

export function captureImportEvent(_event: string, _opts?: Record<string, unknown>) {
}

export function captureBuilderSession(_opts: {
  resumed: boolean;
  fromTemplate?: string;
  sessionAgeDays?: number;
}) {
}

export function captureFirstSectionAdded(_opts: { sectionType: string }) {
}

export function captureTemplateSelected(_opts: { template: string }) {
}

export function captureAiEnhancementUsed(_opts: {
  sectionType: string;
  fieldCount: number;
}) {
}

export function capturePdfGenerationStarted(_opts: {
  template: string;
  sectionCount: number;
}) {
}

export function captureDownload(_opts: {
  template: string;
  fileName: string;
  fileType: string;
}) {
}

export function captureShareUrlGenerated(_opts: { url: string }) {
}

export function captureShareEvent(_event: string, _opts?: Record<string, unknown>) {
}

export function captureCheckoutStarted(_opts: {
  priceId: string;
  planName: string;
  amount: number;
  currency: string;
}) {
}

export function captureCheckoutCompleted(_opts: {
  sessionId: string;
  customerId?: string;
  amount: number;
  currency: string;
  planName: string;
}) {
}

export function captureCheckoutCancelled(_opts: {
  priceId?: string;
  planName?: string;
  step: string;
}) {
}

export function captureCheckoutError(_opts: {
  error: string;
  priceId?: string;
  planName?: string;
  step: string;
}) {
}

export function capturePremiumActivated(_opts: {
  sessionId?: string;
  customerId?: string;
}) {
}

export function captureCheckoutEvent(
  _event: string,
  _opts?: Record<string, unknown>
) {
}

export function captureReferralConversion() {
}

export function captureReferralLinkGenerated(_opts: { referralLink: string }) {
}

export function captureReferralShare(_opts: {
  medium: string;
  referralLink: string;
}) {
}

export function captureReferralAttributedVisit(_opts: {
  referrerToken: string;
}) {
}


export function captureShareAttributedVisit(_opts: {
  shareId: string;
  referrer?: string;
}) {
}

export function captureShareFlowDownloaded(_opts: {
  shareId: string | null;
}) {
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

export function captureAiTokenUsage(_opts: {
  sectionType: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
}) {
}

export function captureAiEnhanceRequested(_opts: {
  sectionType: string;
  isRegenerate: boolean;
  globalEnhanceCount: number;
}) {
}

export function captureAiEnhanceSuccess(_opts: {
  sectionType: string;
  isRegenerate: boolean;
  responseTimeMs: number;
  globalEnhanceCount: number;
}) {
}

export function captureAiEnhanceError(_opts: {
  sectionType: string;
  isRegenerate: boolean;
  errorMessage: string;
  globalEnhanceCount: number;
}) {
}

export function captureAiEnhanceAccepted(_opts: {
  sectionType: string;
  globalEnhanceCount: number;
}) {
}

export function captureFormFieldEdited(_opts: {
  sectionType: string;
  fieldName: string;
  action: "add" | "edit" | "delete";
}) {
}

export function captureTemplateBrowsed(_opts: {
  searchTerm?: string;
  templateCount: number;
}) {
}

export function captureContentPageViewed(_opts: {
  pageType: string;
  slug?: string;
}) {
}

export function capturePwaInstalled() {
}

export function captureError(_opts: {
  errorMessage: string;
  componentStack?: string;
  errorType?: string;
}) {
}

export function captureRoastGenerated(_opts: {
  overallScore: number;
}) {
}

export function captureRoastShared(_opts: {
  platform: string;
  overallScore: number;
}) {
}

export function captureRoastCardDownloaded(_opts: {
  overallScore: number;
}) {
}

export function captureFirstRunPreFill() {
}

export function captureQuickStartSelected(_opts: { role: string }) {
}

export function captureOnboardingHintDismissed() {
}

export function captureSectionAutoShown(_opts: { section: string }) {
}


export function captureCampaignAttribution(opts: {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  referrer?: string;
}) {
}
