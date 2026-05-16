# NoiceResume — Project Context

All agents must know this context. Updated: 2026-05-16.

## Project

**Name:** NoiceResume — AI-powered resume builder for GenZ
**URL:** https://noiceresume.pages.dev/
**Staging URL:** https://v2.noiceresume.pages.dev/
**Repo:** `/Users/lovekatoch/repos/noice-resume`
**Goal:** 100 resume downloads/day

## Organization Structure

All agents report to the CEO. No exceptions.

- **CEO** — Strategy, decisions, board communication
  - **CTO** — Engineering, architecture, code quality, deploys
  - **CMO** — Marketing, content, SEO, social, growth
  - **UXDesigner** — UI/UX, design system, templates, brand
  - **GrowthPM** — Sprint planning, analytics, growth metrics, coordination

The Board (human — Love) communicates ONLY through the CEO. If a task from the Board reaches you directly, defer to the CEO.

## Staging → Production Pipeline

**CRITICAL — All agents must follow this workflow:**

1. Always work on the `v2` branch (currently checked out)
2. After making changes: commit, push, then run `npm run build` (must pass)
3. Then run `npm run deploy` to deploy to Cloudflare Pages preview
4. The preview URL becomes `v2.noiceresume.pages.dev` automatically
5. The Board (Love) reviews changes on v2
6. **NEVER deploy to noiceresume.pages.dev without explicit Board approval.** This is a hard rule.
7. Production deploys require a Board-created issue with explicit sign-off. Do not merge to main without it.

Deploy scripts:
- `npm run deploy` → Preview deploy from current branch (staging)
- `npm run deploy:prod` → Production deploy (main branch ONLY, requires Board approval)

**V2 must always mirror production.** No divergence between v2 and main unless explicitly directed.

## Stack

Next.js 13 · TypeScript · Tailwind CSS · Redux Toolkit · React-PDF · Heroicons · Playwright · Cloudflare Pages

## Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page — Hero, Steps, Features |
| Builder | `/resume-builder` | Main workspace — 2-panel (form + live PDF preview) |
| Import | `/resume-import` | Upload PDF to pre-fill builder |
| Parser | `/resume-parser` | Debug/educational PDF parsing tool |

## Key Dev Commands

```bash
npm run dev           # Dev server
npm run build         # Production build (must pass before deploy)
npm run deploy        # Preview deploy to v2.noiceresume.pages.dev
npm run deploy:prod   # Production deploy to noiceresume.pages.dev
npm test              # Jest tests
```

## Tech Stack Details

- **Next.js 13** App Router — all pages under `src/app/`
- **Redux Toolkit** — `resumeSlice` (profile, workExperiences, educations, projects, skills, custom) + `settingsSlice` (theme, font, size)
- **Persistence** — localStorage key `open-resume-state`, deep-merged on load
- **PDF rendering** — `@react-pdf/renderer` + `pdfjs-dist`
- **Cloudflare Pages** — project name: `noiceresume`
- **Brand identity** — See `DESIGN.md` (Deep Navy #1E3A5F, EB Garamond + Inter, no emoji)

## Agent Roles (reports to CEO)

| Role | Model | Budget | Focus |
|------|-------|--------|-------|
| **CEO** | deepseek-v4-pro | $10/mo | Strategy, decisions, board comms |
| **CTO** | deepseek-v4-flash | $5/mo | Engineering, features, infra, deploys |
| **CMO** | deepseek-v4-flash | $3/mo | Marketing, content, SEO, social, growth |
| **UXDesigner** | deepseek-v4-flash | $3/mo | UI/UX, design system, brand execution |
| **GrowthPM** | deepseek-v4-flash | $3/mo | Sprint planning, analytics, growth metrics |

## Milestones

- **M1**: Staging pipeline live, first feature shipped (week 1)
- **M2**: 10 organic downloads/day (week 2)
- **M3**: 50 downloads/day (week 4)
- **M4**: 100 downloads/day (week 6 — current focus)
