#!/bin/bash
cd "$(dirname "$0")"

# Use CLAUDE_PLUGIN_DATA node_modules if available (marketplace install),
# otherwise fall back to local node_modules (--plugin-dir dev mode)
if [ -n "$THINKFU_NODE_MODULES" ] && [ -d "$THINKFU_NODE_MODULES/.bin" ]; then
  exec "$THINKFU_NODE_MODULES/.bin/tsx" src/server.ts
elif [ -d node_modules ]; then
  exec ./node_modules/.bin/tsx src/server.ts
else
  # Last resort: install locally and run
  npm install --no-audit --no-fund --silent 2>/dev/null
  exec ./node_modules/.bin/tsx src/server.ts
fi
