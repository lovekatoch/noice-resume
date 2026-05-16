# Growth Metrics Framework & Analytics Implementation Plan

**Issue:** NOI-6 · **Author:** GrowthPM / **Reviewed:** CEO · **Date:** 2026-05-16

---

## Status: IMPLEMENTED (8/10 events wired) — CEO reviewed, 2 child issues remain

---

## 1. Implementation Audit

The CTO implemented ahead of the GrowthPM spec. The original "Current State" section (single `captureDownload` event) is stale. Below is the real state as of 2026-05-16.

### Source files

| File | Status | What it does |
|------|--------|-------------|
| `src/app/lib/analytics.ts` | ✅ Complete (307L) | **23 typed capture functions** across all AARRR stages + DeepSeek cost tracking |
| `src/app/components/PostHogProvider.tsx` | ✅ Complete | Init with `person_profiles: "always"`, auto-opt-out in dev, calls `initAnalytics()` |
| `src/app/components/PageViewTracker.tsx` | ✅ Complete | `$pageview` on every route change |
| `src/app/lib/experiments.ts` | ✅ Complete | 4 A/B experiments (HERO_CTA, SOCIAL_PROOF, TEMPLATE_LAYOUT, HEADLINE), `useExperiment()`, `useExperimentGoal()` |
| `src/app/lib/referral.ts` | ✅ Complete | `?ref=` token capture, localStorage, webhook integration |
| `src/app/components/CheckoutAnalyticsTracker.tsx` | ✅ Complete | Watches Redux for `premium_activated` and `checkout_error` |
| `src/app/lib/stripe.ts` | ✅ Complete | 5 checkout events (started/completed/cancelled/error/premium_activated) |
| `src/app/lib/hooks/useCheckoutAnalytics.ts` | ✅ Complete | Premium state transitions → analytics events |
| `src/app/lib/hooks/useAIPanel.ts` | ✅ Complete | Full AI lifecycle: requested → success → accepted + token costs |
| `scripts/setup-posthog-dashboards.mjs` | ✅ Complete | 4 dashboards, 20+ insights, 6 funnels, 2 retention views |
| `package.json` | ✅ Complete | `posthog-js` ^1.372.5, `@vercel/analytics` (unused) |

### Event Implementation Status

#### Acquisition

| Event | Spec'd | Implemented | Gap |
|-------|--------|-------------|-----|
| `landing_cta_clicked` | ✅ | ✅ `captureLandingCtaClick()` | — |
| `template_viewed` | ✅ | ✅ `captureTemplateView()` | — |
| `resume_uploaded` | ✅ | ✅ `captureImportEvent()` | — |
| `start_from_scratch` | ✅ | ❌ | **GAP** — not wired |
| `continue_session` | ✅ | ✅ via `builder_session_resumed` | — |
| `$referrer` / `utm_*` | ✅ | ✅ PostHog auto-capture | — |

#### Activation

| Event | Spec'd | Implemented | Gap |
|-------|--------|-------------|-----|
| `builder_session_started` | ✅ | ✅ `captureBuilderSession()` | — |
| `builder_session_resumed` | ✅ | ✅ `captureBuilderSession()` | — |
| `first_section_added` | ✅ | ✅ `captureFirstSectionAdded()` | — |
| `first_field_filled` | ✅ | ❌ | **GAP** — not wired |
| `template_selected` | ✅ | ✅ `captureTemplateSelected()` | — |
| `ai_enhancement_used` | ✅ | ✅ `captureAiEnhancementUsed()` | — |
| `pdf_generation_started` | ✅ | ✅ `capturePdfGenerationStarted()` | — |
| `resume_downloaded` | ✅ | ✅ `captureDownload()` | — |

#### Retention

| Metric | Implemented | Notes |
|--------|-------------|-------|
| Anonymous device identity | ✅ | `device_id` in localStorage, `initAnalytics()` registers with PostHog |
| Return visit (7d) | ✅ | PostHog cohort retention dashboard configured |
| Edit session resumed | ✅ | `builder_session_resumed` with `session_age_days` |
| Session duration | ✅ | PostHog autocapture |

#### Revenue

| Event | Spec'd | Implemented | Gap |
|-------|--------|-------------|-----|
| `checkout_started` | ✅ | ✅ `captureCheckoutStarted()` | — |
| `checkout_completed` | ✅ | ✅ `captureCheckoutCompleted()` (includes `$revenue`) | — |
| `checkout_cancelled` | — | ✅ `captureCheckoutCancelled()` | Extra |
| `checkout_error` | ✅ | ✅ `captureCheckoutError()` | — |
| `premium_activated` | — | ✅ `capturePremiumActivated()` | Extra |

#### Referral

| Event | Spec'd | Implemented | Gap |
|-------|--------|-------------|-----|
| `share_url_generated` | ✅ | ❌ | **GAP** — not in analytics.ts (dashboards reference it) |
| `share_url_copied` | ✅ | ✅ `captureShareEvent()` | — |
| `share_clicked` | ✅ | ✅ `captureShareEvent()` | — |
| `ref_param_captured` | ✅ | ⚠️ referral.ts exists but no explicit event fire | **GAP** — needs explicit capture |
| `referral_conversion` | ✅ | ✅ `captureReferralConversion()` | — |

#### AI DeepSeek (beyond spec)

| Event | Implemented |
|-------|-------------|
| `ai_enhance_requested` | ✅ `captureAiEnhanceRequested()` |
| `ai_enhance_success` | ✅ `captureAiEnhanceSuccess()` (with responseTimeMs) |
| `ai_enhance_error` | ✅ `captureAiEnhanceError()` |
| `ai_enhance_accepted` | ✅ `captureAiEnhanceAccepted()` |
| `ai_token_usage` | ✅ `captureAiTokenUsage()` (estimated_cost_usd) |
| `pwa_installed` | ❌ Referenced in dashboards but not wired |

---

## 2. North Star Metric Mapping

| North Star Metric | PostHog Event(s) | PostHog Dashboard | Target (M4) |
|-------------------|------------------|-------------------|-------------|
| **Resume completions** | `resume_downloaded` | Growth Overview, Weekly Report | 100/day |
| **Template quality** | `template_selected`, `template_viewed` | Funnels (by template property) | — |
| **AI usage** | `ai_enhancement_used`, `ai_enhance_accepted`, `ai_token_usage` | Growth Overview (AI cost) | 20% of builder users |
| **Sharing rate** | `share_url_generated` → `share_url_copied` → `share_clicked` | Funnels → Download → Share | 10% of downloads |
| **Brand perception** | Qualitative — NPS survey, social mentions, competitor comparison traffic | — | — |

### Key Funnels (pre-configured in `scripts/setup-posthog-dashboards.mjs`)

| Funnel | Steps | Purpose |
|--------|-------|---------|
| Main Growth | landing_cta_clicked → builder_session_started → first_section_added → pdf_generation_started → resume_downloaded | Core conversion tracking |
| Landing → Builder | $pageview(/) → landing_cta_clicked → builder_session_started | Top of funnel |
| Import → Download | resume_uploaded → builder_session_started → resume_downloaded | Import conversion path |
| AI Enhancement | builder_session_started → ai_enhance_requested → ai_enhance_success → ai_enhance_accepted → resume_downloaded | AI feature impact |
| Download → Share | resume_downloaded → share_url_generated → share_url_copied | Viral loop tracking |
| Checkout | checkout_started → checkout_completed | Premium conversion |

---

## 3. Gap Analysis — Remaining Work

### P0 — Fix data integrity (this sprint)

| # | Gap | Impact | Effort |
|---|-----|--------|--------|
| 1 | `share_url_generated` event missing | Breaks Download→Share funnel (funnel defined but step 2 never fires) | Low |
| 2 | `ref_param_captured` event not explicitly fired | No way to measure referral landing effectiveness beyond referrer header | Low |

### P1 — Complete event coverage (next sprint)

| # | Gap | Impact | Effort |
|---|-----|--------|--------|
| 3 | `start_from_scratch` event not wired | Missing acquisition path in funnel analysis | Low |
| 4 | `first_field_filled` event not wired | Missing early-activation signal (before first section) | Medium (needs debounce) |
| 5 | `pwa_installed` event not wired | Dashboard tile exists but no data | Low |

### P2 — Advanced analytics (backlog)

| # | Gap | Impact | Effort |
|---|-----|--------|--------|
| 6 | `session_start` event on first pageview | Better session analytics without relying on PostHog autocapture | Low |
| 7 | Experiment goal wiring | `useExperimentGoal()` exists but no goals are wired to conversion events | Medium |
| 8 | `import_page_viewed` event | Distinguish import traffic from general pageviews | Low |

---

## 4. Target Baselines & Growth Goals

| KPI | Baseline (current) | M2 Target (end of week 2) | M4 Target (end of week 6) |
|-----|---------------------|--------------------------|--------------------------|
| Resume downloads/day | **instrumented, needs 7d data** | 10 | 100 |
| Landing → Builder CVR | **needs baseline** | 25% | 30% |
| Builder → Download CVR | **needs baseline** | 15% | 20% |
| AI feature usage rate | **needs baseline** | 10% of builder users | 20% |
| Return visitor rate (7d) | **needs baseline** | 5% | 10% |
| Share rate (downloads shared) | **needs baseline** | 5% | 10% |
| AI cost/day | **needs baseline** | Under $5/day | Under $10/day |

> **Note:** All baselines are "instrumented, needs data." PostHog has been collecting events. The first Weekly Report will establish baselines. Targets above are goals, calibrated to M2/M4 milestones and the $200/mo AgentOps budget.

---

## 5. Weekly Metrics Review Cadence

### Process

1. **Automated Report** — PostHog Weekly Report dashboard (`scripts/setup-posthog-dashboards.mjs`)
2. **Schedule** — Every Monday 10:00 AM Pacific
3. **Format** — GrowthPM reviews PostHog weekly dashboard → posts a #metrics channel update with:
   - Top-line numbers (downloads, sessions, shares)
   - Week-over-week % change
   - Top funnels with conversion rates
   - AI cost vs budget
   - Any alerts triggered
4. **Escalation** — Downloads drop >20% WoW or AI cost spike >50% → CEO ping
5. **Board Review** — Monthly all-hands metrics review (first Monday of month)

### PostHog Setup Checklist

- [x] Create PostHog project (`NEXT_PUBLIC_POSTHOG_KEY` in `.env`)
- [x] Run `npm run setup:posthog` to create dashboards/funnels
- [ ] Configure PostHog email subscriptions for Weekly Report dashboard → growth@noiceresume
- [ ] Set up Slack webhook destination in PostHog for weekly digest
- [ ] Create alerts: "Daily downloads < 5 for 2 days" and "AI cost > $5/day"

---

## 6. Child Issues

### Created

| Issue | Title | Assignee | Depends On |
|-------|-------|----------|------------|
| NOI-13 | [P0] Fix missing share_url_generated and ref_param_captured events | CTO | — |
| NOI-14 | [P1] Wire remaining acquisition/activation events (start_from_scratch, first_field_filled, pwa_installed) | CTO | — |

### Deprecated (already implemented)

| Issue | Title | Status |
|-------|-------|--------|
| NOI-7 | Anonymous device identity tracking | ✅ DONE — `initAnalytics()` + `device_id` |
| NOI-8 | Wire landing page conversion events | ✅ DONE — `captureLandingCtaClick()` |
| NOI-9 | Wire builder funnels | ✅ DONE — all builder events wired |
| NOI-10 | Wire import page events | ✅ DONE — `captureImportEvent()` |
| NOI-11 | Wire share/referral tracking | ✅ DONE — `captureShareEvent()`, `captureReferralConversion()` |
| NOI-12 | Wire checkout flow analytics | ✅ DONE — `stripe.ts` + `CheckoutAnalyticsTracker.tsx` |

---

## 7. Configuration Reference

### PostHog config (already applied)

```
person_profiles: "always"       ← was "identified_only" (fixed)
device_id in localStorage        ← `getDeviceId()` in analytics.ts
posthog.register({ device_id, first_visit })
PageViewTracker captures $pageview on every route
```

### Run the dashboard setup

```bash
POSTHOG_API_KEY=phx_xxxx POSTHOG_PROJECT_ID=xxxx npm run setup:posthog
```

This creates:
- **Growth Overview** (CEO/CTO daily) — 10 trend charts
- **Funnels** — 6 conversion funnels
- **Retention & Engagement** — cohorts, stickiness, resumes
- **Weekly Report** (GrowthPM Monday sync) — 8 weekly charts

---

## 8. Appendix: Full Event Catalog (implemented)

```typescript
// src/app/lib/analytics.ts — actual exports
export function initAnalytics()
export function capture(event, properties?)
export function captureLandingCtaClick({ ctaLabel, ctaLocation })
export function captureTemplateView({ templateSlug, templateName })
export function captureImportEvent(event, opts?)
export function captureBuilderSession({ resumed, fromTemplate?, sessionAgeDays? })
export function captureFirstSectionAdded({ sectionType })
export function captureTemplateSelected({ template })
export function captureAiEnhancementUsed({ sectionType, fieldCount })
export function capturePdfGenerationStarted({ template, sectionCount })
export function captureDownload({ template, fileName, fileType })
export function captureShareEvent(event, opts?)
export function captureCheckoutStarted({ priceId, planName, amount, currency })
export function captureCheckoutCompleted({ sessionId, customerId?, amount, currency, planName })
export function captureCheckoutCancelled({ priceId?, planName?, step })
export function captureCheckoutError({ error, priceId?, planName?, step })
export function capturePremiumActivated({ sessionId?, customerId? })
export function captureCheckoutEvent(event, opts?)
export function captureReferralConversion()
export function captureAiTokenUsage({ sectionType, promptTokens, completionTokens, totalTokens, model })
export function captureAiEnhanceRequested({ sectionType, isRegenerate, globalEnhanceCount })
export function captureAiEnhanceSuccess({ sectionType, isRegenerate, responseTimeMs, globalEnhanceCount })
export function captureAiEnhanceError({ sectionType, isRegenerate, errorMessage, globalEnhanceCount })
export function captureAiEnhanceAccepted({ sectionType, globalEnhanceCount })
```
