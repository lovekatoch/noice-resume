#!/bin/bash
# Direct Cloudflare Pages Deployment Script
# Usage: ./scripts/deploy.sh [preview|production]

set -e

# Add Node.js to PATH
export PATH=~/.nvm/versions/node/v25.8.0/bin:$PATH

# Default to preview
DEPLOY_TYPE=${1:-preview}

echo "🔨 Building project..."
npm run build

echo "🚀 Deploying to Cloudflare Pages..."

if [ "$DEPLOY_TYPE" = "production" ]; then
    echo "📦 Deploying to PRODUCTION..."
    npx wrangler pages deploy out --project-name=noiceresume --branch=main
else
    echo "📦 Deploying to PREVIEW..."
    npx wrangler pages deploy out --project-name=noiceresume
fi

echo "✅ Deployment complete!"
