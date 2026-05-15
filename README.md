# NoiceResume — Free Resume Builder with AI Enhancement

> I found an abandoned open-source resume project and turned it into a free, AI-powered tool. No sign-up. No paywall. Just a better resume in minutes.

[![Live](https://img.shields.io/badge/Live-noiceresume.pages.dev-2563EB?style=flat-square&logo=cloudflare)](https://noiceresume.pages.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/lovekatoch/noice-resume/blob/main/CONTRIBUTING.md)
[![License](https://img.shields.io/github/license/lovekatoch/noice-resume?style=flat-square)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/XXXXXXXXXX)

---

## The Backstory

I'm a Product Manager with zero intent to become a software engineer. But I got tired of paying for resume tools that put my data behind a paywall, force account creation, or watermark my PDFs.

So when I stumbled on this open-source project, I decided to take it over and rebuild it — with AI enhancement features that actually make your resume *better*, not just prettier.

The catch? I don't write code. I work with AI agents.

This project is built entirely through conversations with coding agents — a Telegram bot that routes tasks to autonomous coding and design agents, which write, review, and deploy code on their own. I'm essentially the product manager for a team of AI agents.

---

## What It Does

- **Resume Builder** — Fill in your details, see a live PDF preview updating in real-time
- **Import Existing Resume** — Drop a PDF, it auto-fills the form fields using OCR parsing
- **AI Enhancement** — Select any section, pick a tone (Confident / Casual / Professional), and get AI suggestions to strengthen your impact statements, add ATS keywords, and improve clarity
- **Export** — Download as PDF, no watermarks, no sign-up
- **Templates** — Choose from Classic, Modern, and StackOverflow themes with different color palettes

---

## Demo

*GIF coming soon — try it live at [noiceresume.pages.dev](https://noiceresume.pages.dev)*

---

## The Stack

Built and deployed entirely with modern AI tooling:

| Layer | Tool | Why |
|---|---|---|
| **AI Coding Agent** | [OpenCode](https://opencode.ai) | Autonomous coding — writes, refactors, and reviews code from natural language prompts |
| **AI Design Agent** | [OpenDesign](https://github.com/lovekatoch/open-design) | Generates UI prototypes and screens from design descriptions; 130+ design systems |
| **Frontend Framework** | Next.js 13 (TypeScript) | React-based, handles routing, API routes, and static generation |
| **UI Library** | React 18 + TypeScript | Type-safe, component-based architecture |
| **Styling** | Tailwind CSS | Utility-first; fast iteration without context switching |
| **State Management** | Redux Toolkit | Centralized state for the complex resume data model |
| **PDF Rendering** | @react-pdf/renderer + pdfjs-dist | Client-side PDF generation in the browser |
| **AI Proxy** | Cloudflare Workers | Secure serverless layer; keeps API keys out of the browser |
| **AI Model** | DeepSeek v4 (via OpenCode Go API) | Powers all AI enhancement suggestions |
| **Hosting** | Cloudflare Pages | Edge-deployed, fast globally, zero-config CI from GitHub |
| **Design System** | Linear x Stripe hybrid | Clean, minimal, professional — modern SaaS aesthetic |
| **Command Center** | Hermes Agent (Telegram) | Human-in-the-loop interface — routes tasks to OpenCode and OpenDesign |

---

## How I Built This Without Writing Code

Traditional development: write code, test, deploy, repeat.

My development loop: describe what I want, AI agent writes the code, AI agent reviews it, AI agent deploys it, I test and give feedback.

A typical feature session looks like this:

1. **Telegram message to Hermes** — "Add a dark mode toggle to the resume builder"
2. **Hermes routes to OpenCode** — OpenCode reads the codebase, writes the implementation, opens a PR
3. **Hermes reviews the PR** — checks for regressions, verifies the build passes
4. **PR merged, Cloudflare Pages deploys** — live in under 2 minutes

The design workflow is similar — I describe a screen to OpenDesign, it generates prototype HTML files, I review visually, and we iterate until it matches what I had in mind.

---

## Development

```bash
# Clone
git clone https://github.com/lovekatoch/noice-resume.git
cd noice-resume

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test
```

---

## Tech Philosophy

- **No backend to manage** — Cloudflare handles deployment, AI routing, and edge logic
- **No database** — resume data stays in the browser, nothing leaves the user's machine until they export
- **Client-side PDF** — @react-pdf/renderer generates PDFs in-browser, no server round-trip
- **API keys are server-side only** — Cloudflare Worker proxy means the AI API key is never exposed to the browser
- **Design with constraints** — Linear x Stripe design system keeps the UI minimal and professional without needing hundreds of micro-decisions

---

## Contributor Program

NoiceResume is open-source and community-driven. Whether you're a developer, designer, or resume enthusiast, there's a place for you.

| Tier | Who | Reward |
|---|---|---|
| **Bug Fixer** | Anyone fixing a verified bug | Listed in [CONTRIBUTORS.md](CONTRIBUTORS.md) |
| **Template Designer** | Anyone submitting a production-quality template | Featured on the template showcase + creator credit |
| **Feature Contributor** | Anyone adding a major feature or improvement | Free lifetime premium access + maintainer role |

👉 **[See all contributors](CONTRIBUTORS.md)** · **[Read contribution guidelines](CONTRIBUTING.md)**

---

## Join the Community

- **Discord** — Get help, share your resume, discuss templates, and connect with other users. [Join here](https://discord.gg/XXXXXXXXXX).
- **GitHub Discussions** — Feature requests, Q&A, and ideas. [Open a discussion](https://github.com/lovekatoch/noice-resume/discussions).
- **Issues** — Report bugs or request features. [Open an issue](https://github.com/lovekatoch/noice-resume/issues).

---

## Built With NoiceResume

Using NoiceResume for your resume? Add the badge to your exported PDF or fork:

[![Built with NoiceResume](public/built-with-noiceresume.svg)](https://noiceresume.pages.dev)

```markdown
[![Built with NoiceResume](https://noiceresume.pages.dev/built-with-noiceresume.svg)](https://noiceresume.pages.dev)
```

---

*Built with AI agents. Deployed to the edge. No code written by hand.*
