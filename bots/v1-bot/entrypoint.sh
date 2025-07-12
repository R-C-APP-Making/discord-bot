#!/usr/bin/env sh

# bots/v1-bot/entrypoint.sh

set -e

if [ "$DEPLOY_ON_STARTUP" = "true" ]; then
  echo "📡 Deploying slash commands…"
  npm run deploy
else
  echo "⏭️ Skipping deploy (DEPLOY_ON_STARTUP not set)"
fi

echo "▶️ Starting bot…"
exec npm run start