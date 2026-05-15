# Contributing to NoiceResume

First off, thank you for considering contributing! NoiceResume is a free, AI-powered resume builder built entirely through AI agent workflows. We welcome contributions from developers, designers, and resume enthusiasts alike.

## Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainer.

## How to Set Up the Dev Environment

```bash
git clone https://github.com/lovekatoch/noice-resume.git
cd noice-resume
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app supports hot reload — changes to `src/` are reflected immediately.

### Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build (must pass before PR) |
| `pnpm test` | Run Jest tests |
| `pnpm lint` | Run ESLint |

## How to Pick an Issue

Look for issues labeled [`good-first-issue`](https://github.com/lovekatoch/noice-resume/labels/good-first-issue) — they are beginner-friendly, scoped, and documented. If you're new to the project, start there.

Other labels:

| Label | Meaning |
|-------|---------|
| `help-wanted` | Needs a contributor, not actively worked by core |
| `bug` | Something broken |
| `enhancement` | Feature request |
| `template` | Template design contribution |
| `discussion` | RFC or design discussion |

## PR Workflow

1. **Fork** the repository.
2. **Create a branch** from `main` with a descriptive name:
   ```
   git checkout -b fix/description-of-change
   ```
3. **Make your changes** following the code style guidelines below.
4. **Run tests** to verify nothing is broken:
   ```bash
   pnpm test
   pnpm lint
   pnpm build
   ```
5. **Commit** with a clear message:
   ```
   git commit -m "fix: description of the fix"
   ```
6. **Push** to your fork and open a Pull Request against `main`.
7. **Wait for review** — a maintainer will review your PR. Address any feedback by pushing additional commits to the same branch.

### PR Guidelines

- Keep PRs focused — one change per PR.
- Include a clear description of what and why.
- If your PR fixes an issue, reference it: `Closes #123`.
- For UI changes, include before/after screenshots if possible.

## Code Style

- **Language:** TypeScript (strict mode)
- **Framework:** Next.js 13 App Router
- **Styling:** Tailwind CSS (utility-first, no CSS modules unless necessary)
- **State:** Redux Toolkit (`resumeSlice`, `settingsSlice`)
- **Components:** Prefer function components with hooks
- **Formatting:** Prettier (config in `prettier.config.js`)
- **Imports:** Group: 3rd party → absolute (`@/`) → relative

## Template Contribution Guide

Non-code contributors can submit resume templates. A template is a JSON-based theme configuration plus a preview screenshot.

### Template Submission Checklist

1. Create a template config file in `src/app/templates/` following the existing format.
2. Add a preview screenshot to `public/templates/previews/`.
3. Include ATS compatibility notes in the PR description.
4. Open a PR with the `template` label.

See existing templates for reference on structure and format.

## How to Report Bugs / Request Features

- **Bug reports:** Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md).
- **Feature requests:** Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).

## Testing

Run the full test suite before submitting a PR:

```bash
pnpm test
```

If you're adding a new feature, please add tests alongside it. If you're fixing a bug, consider adding a test that would have caught it.

## Need Help?

- Open a [Discussion](https://github.com/lovekatoch/noice-resume/discussions)
- Join the [Discord](https://discord.gg/XXXXXXXXXX) community
- Check existing issues and PRs for similar work

---

*NoiceResume is built with AI agents. The commit history shows a human directing autonomous coding agents — not a traditional dev workflow. You're welcome to contribute regardless of how you build software.*
