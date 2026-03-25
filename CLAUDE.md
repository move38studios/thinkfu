# ThinkFu

Metacognition as a service — a catalog of thinking moves for AI agents and humans.

## Project structure

- `catalog/moves/` — move files organized by category (planning, exploration, unsticking, evaluation, meta)
- `catalog/pools/` — variable pools (domains, personas, random-words, etc.)
- `lib/src/` — shared library (types, parser, resolver, helpers) — portable, works in Workers + Node
- `api/` — Cloudflare Worker (Hono + D1 + Workers AI + Vectorize) — REST API + website at thinkfu.org
- `plugin/` — Claude Code plugin (MCP server + catalog + SKILL.md). Also used for local dev in this project.
- `scripts/` — build scripts (catalog bundler, embeddings, validator)
- `docs/` — development plan
- `SKILL.md` — agent instructions for using ThinkFu

## Commands

- `pnpm validate` — check all moves for YAML, required fields, pool refs, mermaid syntax
- `pnpm build:catalog` — rebuild the JSON catalog bundle for the API
- `pnpm build:embeddings` — re-embed all moves via the live API, outputs NDJSON
- `pnpm upload:embeddings` — upload embeddings to Cloudflare Vectorize
- `pnpm rebuild` — validate + build catalog + embed + upload (full rebuild)
- `pnpm run deploy` — rebuild + deploy the Cloudflare Worker (must use `run` — pnpm reserves `deploy`) Embeddings require the API to be live (they call the embed endpoint).

## Working on this project

- Use `pnpm` for everything (not npm)
- Move files are YAML frontmatter + markdown body
- Mermaid diagrams: single-line labels, no `&` joins
- Moves must be **mechanical procedures**, not aspirations. If a move says "try harder" it's broken.
- All move variables use `{{name.N}}` syntax (1-indexed)
- Shared code lives in `lib/` — `lib/src/catalog.ts` is Node-only (uses fs), everything else is portable

## ThinkFu MCP server

The ThinkFu MCP server is connected to this project. See SKILL.md for full usage instructions.

@SKILL.md
