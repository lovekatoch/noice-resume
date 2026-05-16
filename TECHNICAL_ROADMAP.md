# Technical Roadmap — First 100 Downloads

**Author:** CTO
**Date:** 2026-05-16
**Status:** Proposed

## Goal

Deliver the technical foundation and features needed to acquire and support the first 100 organic resume downloads (conversions). Every item maps to a real gap identified through codebase audit.

---

## Phase 0: Foundation (Pre-requisite, ~1 week)

### P0.1 — Fix Failing Tests
**8 tests failing** (font selector `div` vs `button`, collapsed sections). Blocking CI confidence.
- **Effort:** 2h
- **Risk:** Low
- **Owner:** CTO

### P0.2 — Build Real Template Architecture
Current "3 templates" share one layout with CSS tweaks. Need template registry per PLAN.md §4.
- **Key file:** `src/app/components/Resume/ResumePDF/templates.ts` (exists, but no multi-template support)
- **Effort:** 8h
- **Dependency:** Unblocks all template work
- **Owner:** CTO

### P0.3 — Template Screenshot Pipeline
Scripts exist (`scripts/screenshot-*.cjs`) but no integrated pipeline. Need automated thumbnail generation for template gallery.
- **Effort:** 4h
- **Risk:** Medium (Puppeteer/Playwright + react-pdf rendering can be brittle)

---

## Phase 1: Conversion Infrastructure (~2 weeks)

### P1.1 — Analytics Funnel
PostHog configured but only 1 event (`resume_downloaded`). Need full funnel:
- Page views → Builder started → Section completed → Resume downloaded → Shared
- **Effort:** 4h
- **Files:** `src/app/lib/analytics.ts` (extend), `src/app/lib/experiments.ts` (already exists)

### P1.2 — Shareable Resume URLs (`/r/{slug}`)
No public share functionality exists. This is the highest-leverage PLG mechanic for viral loops.
- **Implementation:** JSON storage (can be localStorage-key-based for v1, no backend needed)
- **Route:** `src/app/templates/[slug]/` already exists — repurpose or create `src/app/r/[slug]/`
- **Effort:** 8h
- **Risk:** Low (static export → need Cloudflare Pages + rewrites or KV)

### P1.3 — Multi-Format Export Polish
Export exists but PDF quality is unverified. Need:
- PDF download reliability testing across browsers
- "Built with NoiceResume" watermark option
- **Effort:** 4h
- **Files:** `src/app/components/Resume/ExportButton.tsx`, `src/app/lib/export-formats.ts`

### P1.4 — Landing Page Dynamic Template Gallery
Currently hardcoded: 3 images, 3 labels. Need to drive from `TEMPLATE_REGISTRY`.
- **Effort:** 3h
- **File:** `src/app/page.tsx` (TemplatePreviews section)

---

## Phase 2: AI Features (~2 weeks)

### P2.1 — Real AI Backend
Current AI is `setTimeout` mock (1.5s). Need:
- API route or external service for resume enhancement
- Prompt engineering for bullet point rewriting, summary generation
- Streaming response UI
- **Effort:** 16h
- **Risk:** High — model cost, latency, prompt quality
- **Options:** Vercel AI SDK, OpenAI API, or self-hosted

### P2.2 — AI Enhancement UX
- AIPanel (exists) → wire to real backend
- AISuggestButton (exists) → wire to real backend
- SparkleIconButton (exists) → wire to real backend
- **Effort:** 6h
- **Dependency:** P2.1

---

## Phase 3: Growth & PLG Features (~2 weeks)

### P3.1 — Social Sharing (LinkedIn/Twitter + OG Cards)
- OG image generation for shared resume URLs
- One-click LinkedIn share with pre-formatted text
- **Effort:** 6h
- **Dependency:** P1.2

### P3.2 — Template Variety (Phase 1: 10 templates)
Per PLAN.md §6, add 10 real templates from JSON Resume ecosystem.
- **Effort:** 23h
- **Dependency:** P0.2 (template architecture)

### P3.3 — ATS Verification Suite
Programmatic text extraction from generated PDFs. Verify all templates are ATS-friendly.
- **Effort:** 4h
- **Risk:** Low

---

## Phase 4: Infrastructure & Risk Mitigation (~1 week)

### P4.1 — Build & CI Reliability
- `npm run build` currently passes
- Need GitHub Actions CI (workflow exists on v2: `.github/workflows/ci.yml`)
- **Effort:** 3h

### P4.2 — Error Monitoring
- PostHog for analytics only, no error tracking
- Add client-side error capture (Sentry or PostHog exceptions)
- **Effort:** 2h

### P4.3 — Performance Budget
- Landing page load time, builder interactivity, PDF render latency
- Lighthouse CI or manual profiling
- **Effort:** 2h

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI backend costs exceed budget | Medium | High | Start with free-tier APIs, cap per-user usage |
| PDF rendering differs across browsers | Low | Medium | Test matrix with Playwright |
| Template screenshots quality varies | Medium | Medium | Manual review gate per template |
| Shareable URLs without backend are fragile | Medium | Medium | localStorage-based v1, KV for v2 |
| Build breaks from dependency changes | Low | High | CI gating, lockfile, Dependabot |

---

## Effort Summary

| Phase | Hours | Calendar (solo) | Dependencies |
|-------|-------|-----------------|--------------|
| P0: Foundation | 14 | ~4 days | None |
| P1: Conversion | 19 | ~5 days | P0 |
| P2: AI | 22 | ~5 days | None (parallel with P1) |
| P3: Growth | 33 | ~8 days | P0, P1 |
| P4: Infra | 7 | ~2 days | None |
| **Total** | **95h** | **~3-4 weeks** | |

---

## Recommended Sequencing (Parallel Tracks)

```
Week 1: P0 (all) + P4 (infra)
Week 2: P1 (conversion funnel) + P2 (AI backend exploration)
Week 3: P2 (AI integration) + P3.2 (templates)
Week 4: P3.1 + P3.3 (growth features, completion)
```

## Success Metrics

- 100 resume downloads (primary)
- Build passes 100% of CI runs
- ≤3s Time to Interactive on landing page
- AI feature used in ≥20% of completed resumes
- Shareable URL used in ≥10% of completed resumes
