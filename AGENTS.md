# NoiceResume — Project Context

All agents must know this context. Updated: 2026-05-01.

## Project

**Name:** NoiceResume — A Notion-inspired resume builder
**URL:** https://noiceresume.pages.dev/
**Repo:** `/Users/lovekatoch/Documents/noiceresume`

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
npm run dev        # Dev server
npm run build      # Production build (CTO must run before deploy)
npm run deploy     # Cloudflare Pages preview deploy
npm run deploy:prod # Cloudflare Pages production deploy
npm test           # Jest tests (67 total, 8 failing)
```

## Tech Stack Details

- **Next.js 13** App Router — all pages under `src/app/`
- **Redux Toolkit** — `resumeSlice` (profile, workExperiences, educations, projects, skills, custom) + `settingsSlice` (theme, font, size)
- **Persistence** — localStorage key `open-resume-state`, deep-merged on load
- **PDF rendering** — `@react-pdf/renderer` + `pdfjs-dist`
- **Cloudflare Pages** — deploy via `npx wrangler pages deploy out --project-name=noiceresume`

## Form Sections (`src/app/components/ResumeForm/`)

| Form | File | AI-Enhanced? |
|------|------|-------------|
| ProfileForm | ProfileForm.tsx | ✅ Objective |
| WorkExperiencesForm | WorkExperiencesForm.tsx | ✅ Description bullets |
| EducationsForm | EducationsForm.tsx | ✅ Descriptions |
| ProjectsForm | ProjectsForm.tsx | ✅ Descriptions |
| SkillsForm | SkillsForm.tsx | ✅ AISuggestButton |
| CustomForm | CustomForm.tsx | ❌ |
| ThemeForm | ThemeForm/index.tsx | ❌ Color/font/size |

## AI Feature (Phase 1 UI — backend TBD)

- **SparkleIconButton** — blue sparkle, size="small"|"medium"
- **AIPanel** — modal overlay, Accept/Regenerate/Cancel, Escape-to-close, backdrop-click-to-close
- **AISuggestButton** — Replace all / Append to existing dropdown
- All AI calls currently use `setTimeout` mock (1.5s delay) — Phase 2 will add real backend

## Current State

- **Build**: ✅ Passes `npm run build`
- **Tests**: 67 total — 59 passed (88.1%), 8 failed, 2 skipped
- **Failing tests**: Font selector (uses `div` not `button`), bulk click (buttons hidden in collapsed sections)
- **Phase 2 pending**: Real AI backend integration (model, prompts, API)

## Architecture

```
src/app/
├── components/
│   ├── ResumeForm/        # All form sections
│   ├── SparkleIconButton.tsx
│   ├── AIPanel.tsx        # AI modal
│   ├── AISuggestButton.tsx
│   └── Resume/            # Preview + PDF rendering
├── lib/redux/
│   ├── resumeSlice.ts     # Resume data
│   ├── settingsSlice.ts   # Theme/settings
│   └── local-storage.ts  # Persistence
└── lib/parse-resume-from-pdf/
```

## Deployment

- **Preview**: `npm run deploy` (builds + `wrangler pages deploy out --project-name=noiceresume`)
- **Production**: `npm run deploy:prod`
- **Wrangler node path**: `~/.nvm/versions/node/v25.8.0/bin` (set in `scripts/deploy.sh`)

## Important Notes

- `npm run build` must pass before any deploy
- PDF import navigates to builder but data flow is unclear — needs verification
- Never commit secrets or credentials to the repo
- Use `git commit` with message ending in `Co-Authored-By: Paperclip <noreply@paperclip.ing>` for all commits
