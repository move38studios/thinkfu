#!/bin/bash
cd "$(dirname "$0")"
exec npx tsx src/server.ts
