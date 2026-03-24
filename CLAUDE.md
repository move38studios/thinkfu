# ThinkFu

Metacognition as a service — a catalog of thinking moves for AI agents and humans.

## Project structure

- `catalog/moves/` — card files organized by category (planning, exploration, unsticking, evaluation, meta)
- `catalog/pools/` — variable pools (domains, personas, random-words, etc.)
- `mcp/` — local MCP server (FastMCP + TypeScript)
- `docs/` — development plan
- `SKILL.md` — agent instructions for using ThinkFu

## Working on this project

- Use `pnpm` for everything (not npm)
- Card files are YAML frontmatter + markdown body
- Mermaid diagrams: single-line labels, no `&` joins
- Moves must be **mechanical procedures**, not aspirations. If a card says "try harder" it's broken.
- All card variables use `{{name.N}}` syntax (1-indexed)

## ThinkFu MCP server

The ThinkFu MCP server is connected to this project. See SKILL.md for full usage instructions.

@SKILL.md
