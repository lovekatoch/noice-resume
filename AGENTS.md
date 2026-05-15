# NoiceResume — Project Context

All agents must know this context. Updated: 2026-05-15.

## Project

**Name:** NoiceResume — AI-powered resume builder for GenZ
**URL:** https://noiceresume.pages.dev/
**Staging URL:** https://v2.noiceresume.pages.dev/
**Repo:** `/Users/lovekatoch/Documents/noiceresume`
**Goal:** 100 resume downloads/day

## Staging → Production Pipeline

**CRITICAL — All agents must follow this workflow:**

1. Always work on the `v2` branch (currently checked out)
2. After making changes: commit, push, then run `npm run deploy` to deploy to Cloudflare Pages preview
3. The preview URL becomes `v2.noiceresume.pages.dev` automatically
4. The board (CEO/Love) reviews changes on v2
5. Once approved: `git checkout main && git merge v2 && git checkout v2` then run `npm run deploy:prod`
6. Production deploy requires approval — do NOT merge to main or deploy to prod without board approval

Deploy scripts:
- `npm run deploy` → Preview deploy from current branch (use for staging deploys)
- `npm run deploy:prod` → Production deploy (main branch only, requires board approval)

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
npm test              # Jest tests (67 total, 8 failing)
```

## Tech Stack Details

- **Next.js 13** App Router — all pages under `src/app/`
- **Redux Toolkit** — `resumeSlice` (profile, workExperiences, educations, projects, skills, custom) + `settingsSlice` (theme, font, size)
- **Persistence** — localStorage key `open-resume-state`, deep-merged on load
- **PDF rendering** — `@react-pdf/renderer` + `pdfjs-dist`
- **Cloudflare Pages** — project name: `noiceresume`

## Agent Roles

- **CEO (Love)** — Strategy, decisions, board approval. Model: deepseek-v4-pro
- **CTO** — Engineering, fixes, features, deploys. Model: deepseek-v4-flash. Budget: $3/mo
- **GrowthPM** — Sprint planning, task tracking, coordination. Model: deepseek-v4-flash. Budget: $3/mo
- **CMO** — Marketing, growth, SEO, social. Model: deepseek-v4-flash. Budget: $2/mo
- **UXDesigner** — UI/UX, design system, templates. Model: deepseek-v4-flash. Budget: $2/mo

## Milestones

- **M1**: Staging pipeline live, first feature shipped (week 1)
- **M2**: 10 organic downloads/day (week 2)
- **M3**: 50 downloads/day (week 4)
- **M4**: 100 downloads/day (week 6)
