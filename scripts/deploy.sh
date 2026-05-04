#!/bin/bash
# Cloudflare Pages Deployment Script
# Usage:
#   ./scripts/deploy.sh            # Preview deploy (from any branch)
#   ./scripts/deploy.sh production  # Production deploy (WARNING: only from main!)
#
# Safety: production deploy is blocked unless:
#   - You're on the 'main' branch
#   - You explicitly confirm with 'yes'

set -e

# Add Node.js to PATH
export PATH=~/.nvm/versions/node/v25.8.0/bin:$PATH

DEPLOY_TYPE=${1:-preview}
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
HAS_UNCOMMITTED=$(git status --porcelain | wc -l | tr -d ' ')

# ─── Safety checks ───────────────────────────────────────────────

if [ "$DEPLOY_TYPE" = "production" ]; then
    echo "═══════════════════════════════════════════════"
    echo "  PRODUCTION DEPLOY"
    echo "  Branch: $CURRENT_BRANCH"
    echo "═══════════════════════════════════════════════"

    # Safety 1: Must be on main branch
    if [ "$CURRENT_BRANCH" != "main" ]; then
        echo "❌ ERROR: Production deploys only allowed from 'main' branch."
        echo "   Current branch: $CURRENT_BRANCH"
        echo "   Switch to main first: git checkout main"
        exit 1
    fi

    # Safety 2: Check for uncommitted changes
    if [ "$HAS_UNCOMMITTED" -gt 0 ]; then
        echo "⚠️  You have $HAS_UNCOMMITTED uncommitted file(s)."
        echo "   Commit or stash them before deploying to production."
        echo "   (For quick preview deploys, omit the 'production' argument.)"
        exit 1
    fi

    # Safety 3: Require explicit manual confirmation
    echo ""
    echo "🚨 This will deploy to PRODUCTION (noiceresume.pages.dev)."
    echo "   Last commit: $(git log -1 --pretty=format:'%h %s')"
    echo ""
    read -p "Type 'yes' to confirm production deploy: " CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        echo "❌ Production deploy cancelled."
        exit 1
    fi
fi

# ─── Build ───────────────────────────────────────────────────────

echo "🔨 Building project..."
npm run build

# ─── Deploy ──────────────────────────────────────────────────────

echo "🚀 Deploying to Cloudflare Pages..."

if [ "$DEPLOY_TYPE" = "production" ]; then
    echo "📦 Deploying to PRODUCTION (branch=main)..."
    npx wrangler pages deploy out --project-name=noiceresume --branch=main
else
    echo "📦 Deploying to PREVIEW (branch=$CURRENT_BRANCH)..."
    npx wrangler pages deploy out --project-name=noiceresume --branch="$CURRENT_BRANCH"
fi

echo "✅ Deployment complete!"
