# Discord Server Setup Guide

This document covers the server structure, roles, moderation guidelines, and onboarding flow for the NoiceResume Discord community.

Status: **Setup required** (execute steps below to create the server)

---

## 1. Server Creation

1. Create a new Discord server at https://discord.com/guild-discovery
2. Name: **NoiceResume**
3. Server icon: use `/public/noiceresume-icon.svg` (or generate a 512×512 PNG from it)
4. Set server to **Community** (Server Settings → Enable Community) — required for announcements, rules channel, and moderation tools

## 2. Channel Structure

### Text Channels

| Channel | Purpose | Slowmode | Visibility |
|---|---|---|---|
| `#welcome` | Rules, auto-roles, onboarding info | Off | Public |
| `#announcements` | Releases, campaigns, events | Off | Public (read-only for members) |
| `#resume-review` | Community resume feedback — post your draft for peer review | 30s | Public |
| `#show-your-resume` | Share your NoiceResume build | 30s | Public |
| `#templates` | Template discussions, requests, sharing | Off | Public |
| `#career-talk` | General career advice, interview prep, job search chat | Off | Public |
| `#contributors` | Open-source dev discussion, PR coordination | Off | Public |
| `#feature-requests` | Product feedback, upvote ideas | Off | Public |
| `#contributor-log` | GitHub webhook feed (new issues, PRs, discussions) | Off | Public (read-only) |

### Voice Channels

| Channel | Purpose |
|---|---|
| `General VC` | Casual chat |
| `Resume Review VC` | Live resume review sessions |

### Category Structure

```
📌 INFO
  #welcome
  #announcements

💬 COMMUNITY
  #resume-review
  #show-your-resume
  #career-talk
  General VC

🎨 TEMPLATES & FEATURES
  #templates
  #feature-requests

🔧 CONTRIBUTORS
  #contributors
  #contributor-log
  Resume Review VC
```

## 3. Roles

| Role | Color | Permissions | Who Gets It |
|---|---|---|---|
| `@Admin` | `#FF0000` | Full admin | CMO + CEO |
| `@Moderator` | `#00FF00` | Kick, ban, mute, manage messages, manage channels | CMO + community volunteers |
| `@Maintainer` | `#5865F2` | Manage threads, moderate contributors channel | Feature Contributors (T3) |
| `@Contributor` | `#9B59B6` | Distinguishes from general members | Anyone listed in CONTRIBUTORS.md (T1/T2) |
| `@Member` | Default | Base permissions | Everyone who accepts rules |

### Role Assignment Flow

- **Auto**: `@Member` on accept rules
- **Manual (moderator)**: `@Contributor`, `@Moderator`
- **Manual (admin)**: `@Maintainer`, `@Admin`
- **Integration**: GitHub webhook could auto-assign `@Contributor` on merged PR (future enhancement)

## 4. Moderation Guidelines

### Rules (post in #welcome)

1. **Be respectful** — No harassment, hate speech, or personal attacks.
2. **No spam** — No self-promotion, paid service ads, or crypto/NFT shilling.
3. **Keep it relevant** — Off-topic conversation belongs in #career-talk or DMs.
4. **No paid resume services** — No offering or soliciting paid resume writing. This is a free community.
5. **Respect privacy** — Don't share others' resumes or personal information without consent.
6. **No AI-generated spam** — Don't flood channels with AI-generated content.

### Enforcement

| Violation | First Offense | Second Offense | Third Offense |
|---|---|---|---|
| Spam / self-promotion | Warning (DM) | 24h mute | Ban |
| Harassment / hate speech | Immediate 7-day ban | Permanent ban | — |
| Paid resume solicitation | Warning + message delete | 48h mute | Ban |
| Off-topic in wrong channel | Gentle redirect | Warning | — |

### Moderation Team

- **CMO** — Lead moderator, server owner
- **2 Community Volunteers** — Recruited from active contributors (T1+), trained on moderation guidelines

## 5. GitHub Webhook

Once the server is live:

1. Go to `#contributor-log` channel → Edit Channel → Integrations → Webhooks → Create Webhook
2. Name: `GitHub`
3. Copy webhook URL
4. Go to GitHub repo → Settings → Webhooks → Add webhook
5. Paste URL, select application/json
6. Events: Issues (opened, closed), Pull requests (opened, closed, merged), Discussions (new)

## 6. Onboarding Flow

New member journey:

1. User clicks Discord invite link → lands in `#welcome`
2. Reads rules and accepts → `@Member` role auto-assigned
3. Pinned message in `#welcome`:
   - Link to NoiceResume: https://noiceresume.pages.dev
   - Link to GitHub: https://github.com/lovekatoch/noice-resume
   - Prompt: "Introduce yourself in #career-talk and tell us what you're working on"
   - Link to CONTRIBUTING.md for contributor interest

## 7. README Badge

After creating the server, replace the placeholder in README.md:

```
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/XXXXXXXXXX)
```

Replace the `XXXXXXXXXX` with the actual Discord widget ID and `discord.gg/XXXXXXXXXX` with the actual invite link.

---

## Post-Setup Checklist

- [ ] Server created with Community enabled
- [ ] All channels created under correct categories
- [ ] Roles created with correct colors and permissions
- [ ] `#welcome` rules posted
- [ ] Invite link generated (never-expiring)
- [ ] Invite link added to GitHub repo About section
- [ ] README.md Discord badge updated with real invite link
- [ ] GitHub webhook configured for `#contributor-log`
- [ ] CMO + 2 mods assigned as moderators
- [ ] Test: new user flow from invite → rules → #career-talk
