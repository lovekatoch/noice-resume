"use client";

import posthog from "posthog-js";

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
  const deviceId = getDeviceId();
  posthog.register({
    device_id: deviceId,
    first_visit: localStorage.getItem("noiceresume_first_visit") || Date.now(),
  });
  if (!localStorage.getItem("noiceresume_first_visit")) {
    localStorage.setItem("noiceresume_first_visit", String(Date.now()));
  }
  if (!_sessionStarted) {
    _sessionStarted = true;
    capture("session_start", {
      device_id: deviceId,
      referrer: document.referrer || null,
      url: window.location.href,
      user_agent: navigator.userAgent,
    });
  }
}

export function capture(event: string, properties?: Record<string, unknown>) {
  posthog.capture(event, properties);
}

export function captureLandingCtaClick(opts: {
  ctaLabel: string;
  ctaLocation: string;
}) {
  capture("landing_cta_clicked", {
    cta_label: opts.ctaLabel,
    cta_location: opts.ctaLocation,
    $current_url: window.location.href,
  });
}

export function captureTemplateView(opts: {
  templateSlug: string;
  templateName: string;
}) {
  capture("template_viewed", {
    template_slug: opts.templateSlug,
    template_name: opts.templateName,
    $current_url: window.location.href,
  });
}

export function captureImportEvent(event: string, opts?: Record<string, unknown>) {
  capture(event, {
    ...opts,
    $current_url: window.location.href,
  });
}

export function captureBuilderSession(opts: {
  resumed: boolean;
  fromTemplate?: string;
  sessionAgeDays?: number;
}) {
  if (opts.resumed) {
    capture("builder_session_resumed", {
      session_age_days: opts.sessionAgeDays ?? 0,
      $current_url: window.location.href,
    });
  } else {
    capture("builder_session_started", {
      from_template: opts.fromTemplate ?? null,
      $current_url: window.location.href,
    });
  }
}

export function captureFirstSectionAdded(opts: { sectionType: string }) {
  capture("first_section_added", {
    section_type: opts.sectionType,
  });
}

export function captureTemplateSelected(opts: { template: string }) {
  capture("template_selected", {
    template: opts.template,
  });
}

export function captureAiEnhancementUsed(opts: {
  sectionType: string;
  fieldCount: number;
}) {
  capture("ai_enhancement_used", {
    section_type: opts.sectionType,
    field_count: opts.fieldCount,
  });
}

export function capturePdfGenerationStarted(opts: {
  template: string;
  sectionCount: number;
}) {
  capture("pdf_generation_started", {
    template: opts.template,
    section_count: opts.sectionCount,
  });
}

export function captureDownload(opts: {
  template: string;
  fileName: string;
  fileType: string;
}) {
  capture("resume_downloaded", {
    template: opts.template,
    fileName: opts.fileName,
    fileType: opts.fileType,
    $current_url: window.location.href,
  });
}

export function captureShareEvent(event: string, opts?: Record<string, unknown>) {
  capture(event, {
    ...opts,
    $current_url: window.location.href,
  });
}

export function captureCheckoutStarted(opts: {
  priceId: string;
  planName: string;
  amount: number;
  currency: string;
}) {
  capture("checkout_started", {
    price_id: opts.priceId,
    plan_name: opts.planName,
    amount: opts.amount,
    currency: opts.currency,
    $current_url: window.location.href,
  });
}

export function captureCheckoutCompleted(opts: {
  sessionId: string;
  customerId?: string;
  amount: number;
  currency: string;
  planName: string;
}) {
  capture("checkout_completed", {
    session_id: opts.sessionId,
    customer_id: opts.customerId,
    amount: opts.amount,
    currency: opts.currency,
    plan_name: opts.planName,
    $revenue: opts.amount,
    $currency: opts.currency,
    $current_url: window.location.href,
  });
}

export function captureCheckoutCancelled(opts: {
  priceId?: string;
  planName?: string;
  step: string;
}) {
  capture("checkout_cancelled", {
    price_id: opts.priceId,
    plan_name: opts.planName,
    step: opts.step,
    $current_url: window.location.href,
  });
}

export function captureCheckoutError(opts: {
  error: string;
  priceId?: string;
  planName?: string;
  step: string;
}) {
  capture("checkout_error", {
    error: opts.error,
    price_id: opts.priceId,
    plan_name: opts.planName,
    step: opts.step,
    $current_url: window.location.href,
  });
}

export function capturePremiumActivated(opts: {
  sessionId?: string;
  customerId?: string;
}) {
  capture("premium_activated", {
    session_id: opts.sessionId,
    customer_id: opts.customerId,
  });
}

export function captureCheckoutEvent(
  event: string,
  opts?: Record<string, unknown>
) {
  capture(event, {
    ...opts,
    $current_url: window.location.href,
  });
}

export function captureReferralConversion() {
  capture("referral_conversion", {
    $current_url: window.location.href,
  });
}

// ─────────────────────────────────────────────
// DeepSeek cost tracking
// ─────────────────────────────────────────────
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
  capture("ai_token_usage", {
    section_type: opts.sectionType,
    prompt_tokens: opts.promptTokens,
    completion_tokens: opts.completionTokens,
    total_tokens: opts.totalTokens,
    model: opts.model,
    estimated_cost_usd: calculateCost(
      opts.promptTokens,
      opts.completionTokens
    ),
  });
}

export function captureAiEnhanceRequested(opts: {
  sectionType: string;
  isRegenerate: boolean;
  globalEnhanceCount: number;
}) {
  capture("ai_enhance_requested", {
    section_type: opts.sectionType,
    is_regenerate: opts.isRegenerate,
    global_enhance_count: opts.globalEnhanceCount,
  });
}

export function captureAiEnhanceSuccess(opts: {
  sectionType: string;
  isRegenerate: boolean;
  responseTimeMs: number;
  globalEnhanceCount: number;
}) {
  capture("ai_enhance_success", {
    section_type: opts.sectionType,
    is_regenerate: opts.isRegenerate,
    response_time_ms: opts.responseTimeMs,
    global_enhance_count: opts.globalEnhanceCount,
  });
}

export function captureAiEnhanceError(opts: {
  sectionType: string;
  isRegenerate: boolean;
  errorMessage: string;
  globalEnhanceCount: number;
}) {
  capture("ai_enhance_error", {
    section_type: opts.sectionType,
    is_regenerate: opts.isRegenerate,
    error_message: opts.errorMessage,
    global_enhance_count: opts.globalEnhanceCount,
  });
}

export function captureAiEnhanceAccepted(opts: {
  sectionType: string;
  globalEnhanceCount: number;
}) {
  capture("ai_enhance_accepted", {
    section_type: opts.sectionType,
    global_enhance_count: opts.globalEnhanceCount,
  });
}

export function captureError(opts: {
  errorMessage: string;
  componentStack?: string;
  errorType?: string;
}) {
  capture("error_caught", {
    error_message: opts.errorMessage,
    component_stack: opts.componentStack ?? null,
    error_type: opts.errorType ?? null,
    $current_url: typeof window !== "undefined" ? window.location.href : null,
  });
}

export function captureRoastGenerated(opts: {
  overallScore: number;
}) {
  capture("roast_generated", {
    overall_score: opts.overallScore,
  });
}

export function captureRoastShared(opts: {
  platform: string;
  overallScore: number;
}) {
  capture("roast_shared", {
    platform: opts.platform,
    overall_score: opts.overallScore,
  });
}
