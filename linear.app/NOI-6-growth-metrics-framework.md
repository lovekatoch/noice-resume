# Growth Metrics Framework & Analytics Implementation Plan

**Issue:** NOI-6 · **Author:** GrowthPM · **Date:** 2026-05-16

---

## 1. Current State

PostHog is initialized and wired into the app root. Only **one custom event** is tracked: `resume_downloaded`. Pageviews are captured passively. PostHog's `person_profiles` is set to `identified_only`, meaning anonymous sessions are not persisted as persons — a gap for our no-signup product.

**Files:**
- `src/app/lib/analytics.ts` — single `captureDownload` function
- `src/app/components/PostHogProvider.tsx` — init, opt-out in dev
- `src/app/components/PageViewTracker.tsx` — $pageview on route change
- `src/app/lib/experiments.ts` — A/B test framework, 3 experiments
- `src/app/lib/referral.ts` — referral token capture (ref param)

---

## 2. Growth Metrics Framework (AARRR)

### Acquisition

| Metric | Event | Where |
|--------|-------|-------|
| Landing page views | `$pageview` → `/` | PageViewTracker (exists) |
| Landing CTA clicks | `landing_cta_clicked` | Hero.tsx buttons |
| Template detail views | `template_viewed` | Templates page |
| Import page visits | `import_page_viewed` | Import page |
| Import: upload resume | `resume_uploaded` | ResumeDropzone |
| Import: start from scratch | `start_from_scratch` | Import page CTA |
| Import: continue session | `continue_session` | Import page CTA |
| Traffic source | `$referrer` / `utm_*` | PostHog auto (verify) |

### Activation

| Metric | Event | Where |
|--------|-------|-------|
| Builder started | `builder_session_started` | resume-builder/page.tsx |
| Section added (first) | `first_section_added` | ResumeForm section add |
| First field filled | `first_field_filled` | Debounced form field |
| Template selected | `template_selected` | Builder template switcher |
| AI enhancement used | `ai_enhancement_used` | AIPanel / AISuggestButton |
| PDF generation started | `pdf_generation_started` | FloatingDownloadButton |
| PDF downloaded | `resume_downloaded` | FloatingDownloadButton (exists) |
| Time to first download | computed | session start → download |

### Retention

| Metric | Event | Where |
|--------|-------|-------|
| Return visit (7d) | `$pageview` with cookie | PostHog session (gap) |
| Edit session resumed | `builder_session_resumed` | Builder page check |
| Session duration | PostHog session analytics | PostHog autocapture |
| Bounce rate | computed | PostHog funnel |

**Gap:** `person_profiles: "identified_only"` prevents anonymous return-visit tracking. No signup required = no persistent identity. Need device/device_id-based anonymous identity.

### Revenue

| Metric | Event | Where |
|--------|-------|-------|
| Premium checkout started | `checkout_started` | Stripe checkout button |
| Premium purchase completed | `checkout_completed` | Stripe success webhook |
| Checkout error | `checkout_error` | Checkout error state |
| Revenue (LTV) | computed | Stripe ↔ PostHog groups |

### Referral

| Metric | Event | Where |
|--------|-------|-------|
| Share URL generated | `share_url_generated` | PostDownloadShare |
| Share URL copied | `share_url_copied` | PostDownloadShare |
| Share clicked (social) | `share_clicked` | PostDownloadShare |
| Referral landing | `ref_param_captured` | referral.ts (exists) |
| Referral conversion | `referral_conversion` | builder after ref param |

---

## 3. Implementation Plan

### Phase 1: Core Tracking (This Sprint)

**P1 — Expand analytics.ts with typed event catalog**

Replace the single `captureDownload` with a full typed events module:
- Strongly typed event names and payloads
- Anonymouse device ID generation (UUID in localStorage)
- Session metadata (template, section count, time on page)

**P2 — Wire landing page events** (Hero.tsx, Features.tsx)
- Track all CTA clicks with context (button position/label)
- Track template interest

**P3 — Wire builder events** (resume-builder/page.tsx, FloatingDownloadButton.tsx)
- Track builder session start/resume
- Track download flow (generation → download)
- Track template switches
- Track form section additions

**P4 — Wire import page events** (resume-import/page.tsx)
- Track import visits, uploads, continue, start from scratch

**P5 — Wire share/referral events** (PostDownloadShare.tsx)
- Track share generation, copy, social clicks
- Track referral → conversion path

### Phase 2: Identity & Retention (Next Sprint)

**P6 — Anonymous device identity**
- Generate `device_id` in localStorage on first visit
- Set `posthog.register()` with device_id and first_visit timestamp
- Enables return-visit and session-duration tracking without signup

**P7 — Session-aware pageview tracking**
- Enhance PageViewTracker with session metadata (referrer, device_id, session count)
- Track `session_start` on first pageview of a session

### Phase 3: Revenue & Experiments (Backlog)

**P8 — Stripe checkout events**
- Wire `checkout_started`, `checkout_completed`, `checkout_error` from Stripe flows
- Link to user's device_id for funnel analysis

**P9 — Experiment success metrics**
- Define goal events for each experiment in experiments.ts
- Wire experiment variants to conversion events

---

## 4. Event Catalog (Typed)

```typescript
// src/app/lib/analytics.ts — full catalog

type EventPayloads = {
  // Acquisition
  landing_cta_clicked: { cta_label: string; cta_location: string };
  template_viewed: { template_slug: string; template_name: string };
  resume_uploaded: { file_size: number };
  start_from_scratch: {};
  continue_session: { session_age_days: number };
  
  // Activation
  builder_session_started: { from_template?: string };
  builder_session_resumed: { session_age_days: number };
  first_section_added: { section_type: string };
  first_field_filled: { section_type: string; field_name: string };
  template_selected: { template: string };
  ai_enhancement_used: { section_type: string; field_count: number };
  pdf_generation_started: { template: string; section_count: number };
  resume_downloaded: { template: string; fileName: string; fileType: string };
  
  // Retention
  // (inferred from session + pageview analytics)
  
  // Revenue
  checkout_started: { plan: string };
  checkout_completed: { plan: string; value: number };
  checkout_error: { error: string };
  
  // Referral
  share_url_generated: { share_medium: string };
  share_url_copied: {};
  share_clicked: { share_medium: string };
  referral_conversion: {};
};
```

---

## 5. Key Metrics & Targets

| KPI | Current | Target (M2) | Target (M4) |
|-----|---------|-------------|-------------|
| Resume downloads/day | ~0 (v2 fresh) | 10 | 100 |
| Landing → Builder CVR | — | 25% | 30% |
| Builder → Download CVR | — | 15% | 20% |
| AI feature usage rate | — | 10% of builder users | 20% |
| Return visitor rate (7d) | — | 5% | 10% |
| Share rate (downloads shared) | — | 5% | 10% |

---

## 6. PostHog Configuration Changes

1. Set `person_profiles: "always"` in PostHogProvider.tsx to capture anonymous users
2. Add device_id generation + registration on init
3. Configure dashboard with funnels:
   - Landing → Builder → Section filled → Download → Share
   - Landing → Import → Builder → Download
4. Configure weekly cohort retention report

---

## 7. Child Issues

- NOI-7: Implement anonymous device identity tracking
- NOI-8: Wire landing page conversion events
- NOI-9: Wire builder funnels (sections, AI, download)
- NOI-10: Wire import page events
- NOI-11: Wire share/referral tracking
- NOI-12: Wire checkout flow analytics
