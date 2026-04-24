# Noiceresume Deployment Plan

## Deployment Strategy: Direct Cloudflare Pages (No GitHub Actions)

### Overview
We use **direct deployment** via Wrangler CLI instead of GitHub Actions for faster, more transparent deployments.

---

## Deploy Commands

### Preview Deployment (Default)
```bash
# Using npm script
npm run deploy

# Or directly
export PATH=~/.nvm/versions/node/v25.8.0/bin:$PATH
npx wrangler pages deploy out --project-name=noiceresume
```

### Production Deployment
```bash
# Using npm script
npm run deploy:prod

# Or directly
export PATH=~/.nvm/versions/node/v25.8.0/bin:$PATH
npx wrangler pages deploy out --project-name=noiceresume --branch=production
```

---

## Workflow

1. **Build**: `npm run build` (outputs to `out/`)
2. **Deploy**: `npm run deploy` (deploys `out/` to Cloudflare Pages)
3. **Verify**: Check preview URL returned by Wrangler

---

## Deploy Guard Rules

- **Default**: Deploy to Cloudflare Preview URL
- **Production**: Only when user explicitly says "deploy to production" or "deploy to main"
- **CI Mode**: Skip deploy if `CI=true`
- **Node Env**: Ask for confirmation if `NODE_ENV=production`

---

## Project Details

- **Cloudflare Project**: noiceresume
- **Build Output**: `out/` (Next.js static export)
- **Node Version**: v25.8.0 (update PATH accordingly)
- **Wrangler Config**: Not needed (using CLI flags)

---

## Troubleshooting

### "command not found: npx"
```bash
export PATH=~/.nvm/versions/node/v25.8.0/bin:$PATH
```

### Build fails
```bash
rm -rf out node_modules && npm install && npm run build
```

### Deploy fails
- Check Cloudflare API token is set: `echo $CLOUDFLARE_API_TOKEN`
- Verify project name: `npx wrangler pages project list`
