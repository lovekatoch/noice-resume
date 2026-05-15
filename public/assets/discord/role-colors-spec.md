# NoiceResume Discord — Role Color Scheme

## Roles & Hex Codes

| Role | Hex | Preview | Purpose |
|------|-----|---------|---------|
| @Admin | `#FEE75C` | 🟡 Gold/yellow | Server administration & configuration |
| @Mod | `#ED4245` | 🔴 Red | Moderation & channel management |
| @Contributor | `#5865F2` | 🔵 Discord blurple | Code/template/documentation contributors |
| @Resume-Reviewer | `#57F287` | 🟢 Discord green | Trusted resume reviewers & feedback givers |
| @Member | `#80848E` | ⚪ Gray (default) | Default role — all new members |

## Color Rationale

- **Admin (#FEE75C)** — High-visibility gold signals authority. Warm tone matches brand palette.
- **Mod (#ED4245)** — Standard red for moderation across Discord communities. Instantly recognizable as staff-with-authority.
- **Contributor (#5865F2)** — Discord's native blurple. Connects to open-source/developer identity. Distinct from brand terracotta to avoid role confusion.
- **Resume-Reviewer (#57F287)** — Discord native green. Positive/supportive connotation. Signals "safe to ask for help."
- **Member (#80848E)** — Neutral gray. Low visual noise. Default should never compete with earned roles.

## Application Notes

- Set role colors in Server Settings → Roles. Apply hex values under "Role Color."
- Display roles separately (not stacked) in the member sidebar for readability — per Discord's UI, only the highest-priority colored role shows by default.
- Assign @Member as the default role on join (via server onboarding settings).
- @Admin and @Mod should be hoisted above other roles in the role hierarchy.
- @Contributor and @Resume-Reviewer are earned roles — document the criteria in #roles-info channel.

## Related

- Server setup guide: [NOI-13](/NOI/issues/NOI-13#document-discord-setup-guide)
- Icon: `server-icon.svg` (this directory)
- Banner: `server-banner.svg` (this directory)
- Welcome graphic: `welcome-splash.svg` (this directory)
