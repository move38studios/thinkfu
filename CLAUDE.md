# ThinkFu

Metacognition as a service — a catalog of thinking moves for AI agents and humans.

## Project structure

- `catalog/moves/` — move files organized by category (planning, exploration, unsticking, evaluation, meta)
- `catalog/pools/` — variable pools (domains, personas, random-words, etc.)
- `lib/src/` — shared library (types, parser, resolver, helpers) — portable, works in Workers + Node
- `api/` — Cloudflare Worker (Hono + D1) — REST API at api.think-fu.org
- `mcp/` — local MCP server (FastMCP) — for dev/testing in this project
- `plugin/` — Claude Code plugin (for distribution)
- `scripts/` — build scripts (catalog bundler, validators)
- `docs/` — development plan
- `SKILL.md` — agent instructions for using ThinkFu

## Working on this project

- Use `pnpm` for everything (not npm)
- Move files are YAML frontmatter + markdown body
- Mermaid diagrams: single-line labels, no `&` joins
- Moves must be **mechanical procedures**, not aspirations. If a move says "try harder" it's broken.
- All move variables use `{{name.N}}` syntax (1-indexed)
- Shared code lives in `lib/` — `lib/src/catalog.ts` is Node-only (uses fs), everything else is portable
- API catalog is bundled at build time: `node --experimental-strip-types scripts/build-catalog-bundle.ts`

## ThinkFu MCP server

The ThinkFu MCP server is connected to this project. See SKILL.md for full usage instructions.

@SKILL.md
