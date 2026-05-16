# NoiceResume — Viral Growth Marketing Strategy

> Last updated: 2026-05-16 | Owner: CMO

---

## North Star

Drive NoiceResume from 8,400 to **100 resume downloads/day** through shareable loops, SEO content, and competitive positioning.

---

## Competitor Positioning Analysis

### Landscape Overview

| Competitor | Positioning | Pricing | AI Features | Key Weakness |
|---|---|---|---|---|
| **Rezi** | "The #1 AI Resume Builder" — Forbes Top Pick. ATS keyword targeting. 4M users. | Free basic, $29/mo Pro, $149 lifetime | AI Keyword Targeting, AI Content Writer, Rezi Score, AI Interview Practice | Freemium limits (3 PDF downloads), generic templates |
| **Kickresume** | "Best Online Resume Builder" — 8M users. GPT-4.1 powered. Templates + AI Writer. | Free basic, paid plans | GPT-4.1 AI Writer, AI Cover Letter, Autopilot (20k pre-written phrases), ATS Checker, Website Builder | Requires sign-up, cluttered UI, many features behind paywall |
| **Enhancv** | "Modern resume builder" — 15M+ resumes. Focus on personality + ATS. | 7-day free trial, then paid | AI Content Generation, One-Click Tailoring, AI Translation (30+ languages), ATS Check, Resume Checker, Job Tracker | Free trial only (no permanent free tier), more expensive |
| **Teal** | "AI-powered job search" — CRM-style approach. | Free + $29/mo | AI Resume Builder, Job Search CRM, Email Templates | Not a dedicated resume builder — broader job search tool |

### NoiceResume Positioning

**Our unfair advantages:**
- **Truly free forever** — No sign-up, no credit card, no trial limits. Every other competitor restricts downloads or hides features behind paywalls.
- **Client-side privacy** — Nothing leaves the browser. A real differentiator vs cloud-only competitors.
- **AI enhancement without account** — DeepSeek-powered AI that works instantly.
- **Premium design sensibility** — Apple/Linear-level polish vs competitors' cluttered UIs.

**Recommended positioning statement:**
> "The only premium resume builder that's completely free — no sign-up, no limits, ever. AI-powered writing that stays on your device."

**Key messaging pillars:**
1. **Free is the hook** — "No paid plans, no trials, no credit card. Forever."
2. **Privacy is the moat** — "Your resume never leaves your browser."
3. **Premium is the vibe** — "Designed for the discerning. Built for everyone."
4. **AI is the accelerator** — "Real suggestions, not generic tips. Powered by DeepSeek."

---

## SEO Keyword Strategy

### Tiers

#### Tier 1 — High Intent, Medium Competition (Primary Targets)

| Keyword | Monthly Volume (est.) | Intent | Page Target |
|---|---|---|---|
| free resume builder | 135K/mo | Transactional | `/` (landing) |
| best free resume builder | 22K/mo | Commercial | `/resources/best-free-resume-builder` |
| AI resume builder | 18K/mo | Commercial | `/` (landing) |
| free resume template | 49K/mo | Transactional | `/templates/*` |
| resume builder online free | 27K/mo | Transactional | `/` (landing) |
| create resume free | 16K/mo | Transactional | `/` (landing) |

#### Tier 2 — Long-Tail Niche (Content Pages)

| Keyword | Page Target |
|---|---|
| how to write a resume for [role] | `/resources/resume-guides/[role]` |
| ATS-friendly resume template | `/templates/ats-friendly` |
| resume for tech jobs | `/templates/tech` |
| professional resume format 2025 | `/resources/resume-format-guide` |
| [role] resume examples | `/resources/resume-examples/[role]` |

#### Tier 3 — Comparison/Opportunistic (SEO Pages)

| Keyword | Page Target |
|---|---|
| Rezi vs [competitor] | `/resources/comparison/rezi-vs-noiceresume` |
| Kickresume alternative | `/resources/comparison/kickresume-alternative` |
| Enhancv free alternative | `/resources/comparison/enhancv-alternative` |
| best free resume builder reddit | `/resources/best-free-resume-builder` |

### Technical SEO Fixes (Urgent)

- [ ] Generate `sitemap.xml` covering all pages (landing, templates, resources)
- [ ] Add `robots.txt` 
- [ ] Add JSON-LD structured data (HowTo schema for builder pages, Article schema for guides)
- [ ] Add breadcrumb structured data
- [ ] Add open graph images per page type
- [ ] Add canonical URLs for all pages (currently only on root layout)

---

## Content Plan

### Phase 1: Foundation (Week 1-2)

- [x] Update existing resource guide with internal links to builder
- [ ] Create `/resources/resume-format-guide` page
- [ ] Create `/resources/resume-summary-guide` page
- [ ] Create `/resources/ats-friendly-resume-guide` page
- [ ] Create `/resources/best-free-resume-builder` page (high-intent comparison page)
- [ ] Add internal linking from landing page FAQ to resource guides

### Phase 2: Expansion (Week 3-4)

- [ ] Create role-specific guide pages (software engineer, product manager, data scientist, etc.)
- [ ] Create comparison pages: "NoiceResume vs [Competitor] — The Truly Free Alternative"
- [ ] Create social media hooks (X/Twitter threads, LinkedIn posts)
- [ ] Write "How We Built an AI Resume Builder That Respects Your Privacy" (dev blog)

### Phase 3: Scale (Week 5-6)

- [ ] Expand to 20+ role-specific guides
- [ ] Create video content (Loom demos, TikTok/Reels showing builder flow)
- [ ] Guest posts on career/tech blogs linking back to NoiceResume
- [ ] Build backlinks via "Built with NoiceResume" badges and directory listings

### Content Formats

| Format | Frequency | Channel |
|---|---|---|
| Long-form guides | 2/week | `/resources/*` |
| Social threads | 3/week | X, LinkedIn |
| Comparison pages | 1/week | `/resources/comparison/*` |
| Dev blog | 1/month | `/blog/*` |

---

## Viral Loop Design

### Loop 1: Share-to-Viral (Resume Sharing)

**Current state:** Backend ready (`workers/resume-share`), PostDownloadShare component built — neither wired in UI.

**Mechanism:**
1. User downloads resume → PostDownloadShare modal appears
2. Options: Share on X, Share on LinkedIn, Copy link
3. Shared URL → Public resume page with "Built with NoiceResume" footer
4. Anyone viewing the shared resume → CTA "Build your own free resume"
5. Viral coefficient > 1 if >1 new user per share

**Implementation priority:**
- [ ] Wire PostDownloadShare modal into PDF download flow
- [ ] Add OG image to shared resume pages (shows resume preview)
- [ ] Add "Built with NoiceResume" footer with link to builder
- [ ] Add share tracking in PostHog (`share_completed` event)
- [ ] Add copy-link button (now working but not prominent)

### Loop 2: AI Roast Share Cards

**New concept — high virality potential:**

1. User uses AI to enhance a resume section
2. Offer: "See what AI thinks of your resume" → generates a shareable card
3. Card shows: [Resume score / roast] + "Built with NoiceResume"
4. Card is designed to be shared on social (X, LinkedIn, Instagram)
5. Viewers scan QR or click link → arrive at builder

**Examples:**
- "Your resume has 3/10 buzzwords. Let's fix that."
- "Your summary could be 50% shorter. Here's how."
- "AI says: this bullet point needs numbers. Try again."

### Loop 3: Referral-to-Download

**Current state:** Backend ready (`workers/referral-webhook`, Discord bot, `src/app/lib/referral.ts`).

**Mechanism:**
1. Existing user gets unique referral link
2. Shares with friends
3. Friend downloads resume → Referrer gets credit
4. Leaderboard + Discord role rewards

**Implementation priority:**
- [ ] Add referral UI to share modal (shows ref link, social share buttons)
- [ ] Add leaderboard widget to landing page (gamification)
- [ ] Create referral landing page showing status

### Loop 4: Template Showcases

- [ ] Create "Resume of the Week" showcase (user-submitted, with permission)
- [ ] Share on social with template attribution
- [ ] Users share their resume → organic template advertising
- [ ] Category-specific showcase pages (best tech resumes, best design resumes)

---

## Landing Page Copy Audit

### Current State

| Element | Current Copy | Assessment |
|---|---|---|
| Headline | "Land interviews at top companies" | Strong emotional hook. Could be more specific. |
| Subheadline | "Recruiters spend seconds on each resume..." | Good, but wordy. Cut to 1 line. |
| Badge | "AI-Powered Resume Builder" | Good positioning signal. |
| CTA | "Build My Resume" | Solid. A/B testing variants. |
| Features | 4 cards: Free, ATS, AI, Privacy | Strong. Lead with free. |
| Social proof | "8,400+ job seekers this month" | Good, keep updating. |
| Problem bar | 6 sec / 75% / 8,400+ | Excellent stats section. |

### Recommendations

1. **Headline — A/B test:** 
   - Current: "Land interviews at top companies"
   - Variant: "The resume builder that's always free. No catch, no sign-up."
   - Variant: "Write your resume once. Get hired faster."

2. **Subheadline — Trim:**
   - Current: 35 words
   - Recommended: "AI that writes with you. ATS-friendly formatting. Zero sign-up. No paid plans. Ever."

3. **Features — Add a 5th card:**
   - "Share with one click" — "Turn your resume into a shareable link. Recruiters see it instantly."

4. **Template section — Add social proof below:**
   - "Join 8,400+ job seekers who built their resume this month"

5. **Final CTA — Add urgency:**
   - "Start building — it takes 5 minutes"
   - Below: "No account needed"

6. **Footer — Add more links:**
   - Current: Guides, Templates, Builder
   - Add: Comparison, Privacy, Resources

---

## Prioritized Growth Experiments List

### P0 — Must Do (This sprint)

| # | Experiment | Channel | Expected Impact | Effort | Notes |
|---|---|---|---|---|---|
| 1 | Wire up PostDownloadShare modal | Viral | High | Low | Component built, just needs connection |
| 2 | Add sitemap.xml + robots.txt | SEO | Medium | Low | Technical SEO basics |
| 3 | Wire resume share worker to UI | Viral | High | Medium | Backend ready, needs UI integration |
| 4 | Add OG image to shared resumes | Viral | Medium | Low | Improves share CTR |
| 5 | Create comparison pages | SEO | High | Medium | Target high-intent "alternative to" queries |

### P1 — High Impact

| # | Experiment | Channel | Expected Impact | Effort |
|---|---|---|---|---|
| 6 | AI Roast share cards | Viral | High | Medium |
| 7 | JSON-LD structured data (all pages) | SEO | Medium | Low |
| 8 | "Resume of the Week" social campaign | Brand/Social | Medium | Low |
| 9 | Role-specific resource guides (5 roles) | SEO | Medium | Medium |
| 10 | Referral UI in share modal | Viral | Medium | Medium |

### P2 — Growth Enablement

| # | Experiment | Channel | Expected Impact | Effort |
|---|---|---|---|---|
| 11 | Reddit engagement strategy | Social | Medium | Low |
| 12 | Guest posts on career blogs | SEO | Medium | Medium |
| 13 | "Built with NoiceResume" DevRel badge usage | Referral | Low | Low |
| 14 | TikTok/Reels demos | Social | Medium | Medium |
| 15 | LinkedIn thought leadership threads | Social | Medium | Low |

### Experiment Tracking

Each experiment will be:
- [ ] Created as a PostHog feature flag / experiment
- [ ] Tracked with `experiments.ts`
- [ ] Measured against: share rate, CTR, resume starts, downloads
- [ ] Evaluated after min 500 impressions or 2 weeks

---

## Key Metrics Dashboard

| Metric | Current | 2-Week Target | 6-Week Target |
|---|---|---|---|
| Resume downloads/day | ~? (needs tracking) | 50 | 100 |
| Share rate | 0% (not wired) | 10% | 15% |
| SEO organic visits | ~? (not tracked) | 1,000/wk | 5,000/wk |
| Referral conversions | 0 (not launched) | 5/wk | 20/wk |
| AI usage rate | ~? (when available) | 30% | 50% |
| Bounce rate | ~? | < 60% | < 50% |

---

## Brand Voice Guide

| Dimension | NoiceResume | Competitors |
|---|---|---|
| **Tone** | Confident, warm, premium — career coach who's also a designer | Transactional, feature-dump |
| **CTAs** | Benefit-directed ("Land interviews at top companies") | Feature-directed ("Create Resume") |
| **Social proof** | Numbers-driven, specific | Vague ("Trusted by millions") |
| **Differentiator** | Free + privacy-first + premium design | Freemium + cloud-only |
| **Design language** | Apple/Linear minimalism | Cluttered feature showcase |

---

## Implementation Roadmap

### Week 1 (Immediate)
- [ ] Wire PostDownloadShare → download flow
- [ ] Add sitemap.xml + robots.txt
- [ ] Wire resume share worker
- [ ] Add OG image to shared resume pages
- [ ] Create 3 comparison pages (Rezi, Kickresume, Enhancv alternatives)

### Week 2 (Growth foundations)
- [ ] Create 5 role-specific guide pages
- [ ] Add JSON-LD structured data
- [ ] Build AI Roast share cards (design + backend)
- [ ] Create referral UI for share modal
- [ ] Add breadcrumb structured data

### Week 3-4 (Scale)
- [ ] Expand guides to 20+ roles
- [ ] "Resume of the Week" social campaign
- [ ] Content distribution (Reddit, LinkedIn, X)
- [ ] Guest post outreach
- [ ] Backlink building

### Week 5-6 (Optimize)
- [ ] Analyze experiment data
- [ ] Double down on winning channels
- [ ] Revenue experiments (optional: donations, premium templates)
- [ ] Community building (Discord)
