# ThinkFu Development Plan

> The catalog is the product. Everything else is distribution.

---

## Phase 0 — Catalog & Local Tooling ✅

**Goal:** 200+ validated moves, complete pools, local MCP server, validation tooling.

**Status: DONE**

- [x] 200 moves across 5 categories (planning, exploration, unsticking, evaluation, meta)
- [x] 9 pool files (domains, personas, random-words, constraints, timeframes, genres, koans, languages, thinkers)
- [x] Local MCP server (FastMCP + stdio) — tested with Claude Code
- [x] Catalog validator (`pnpm validate`) — checks YAML, required fields, pool refs, mermaid syntax
- [x] Shared lib (`lib/src/`) — portable types, parser, resolver, helpers
- [x] Move quality checklist established

### Move Quality Checklist
Every move must pass:
- **Mechanical, not aspirational.** Could you follow this as a procedure without needing to "be creative"?
- **The Move section is 2-4 sentences.** Too complex → split it.
- **Problem signatures are situation-shaped**, not topic-shaped.
- **Example is concrete and specific.**
- **Mermaid diagram renders.** Single-line labels, no `&` joins.
- **Variables resolve correctly.** Pool references exist.
- **Watch Out For is honest.** Names real failure modes.

---

## Phase 1 — Validate with Real Agents 🔄

**Goal:** Evidence that ThinkFu changes output quality. Go/no-go gate.

**Status: IN PROGRESS**

### 1.1 Connect ThinkFu to Claude Code ✅
MCP server registered and working. SKILL.md loaded via CLAUDE.md include.

### 1.2 Early Testing ✅
Two test conversations completed:
- **Startup ideation** — 8 moves chained, seeds drove the core metaphor ("assumption rust"), produced a novel concept
- **Strategy framework** — 3 moves applied deeply, each produced concrete actionable output

**Key findings:**
- Seeds are doing real creative work — not just perturbation, but building metaphorical coherence across chains
- ThinkFu works better as a sharpening tool for existing thinking than as a generative engine from scratch
- Agent tends to card-hop (draw many, apply shallowly) rather than apply deeply — SKILL.md updated to address this
- Agent doesn't rate moves — SKILL.md updated to strengthen this
- `plan` and `stuck` modes underused — needs more testing

### 1.3 Remaining Validation
- [ ] Test with 5+ more diverse tasks
- [ ] Test seed perturbation effect (same move, different seeds)
- [ ] Test `plan` and `stuck` modes specifically
- [ ] Verify rating behavior after SKILL.md updates
- [ ] Iterate on moves that don't change behavior

---

## Phase 2 — Deploy API + Plugin 🔄

**Goal:** ThinkFu live on Cloudflare and installable as a Claude Code plugin.

**Status: BUILT, NOT YET DEPLOYED**

### 2.1 Cloudflare Worker API ✅ (built, not deployed)
Hono + D1, all endpoints working locally:
- `GET /random` — random resolved move
- `GET /move/:id` — specific move
- `GET /list` — move summaries, filterable by mode/category
- `GET /catalog` — full catalog
- `POST /suggest` — context-aware selection (v0: random, mode-filtered)
- `POST /rate` — submit feedback → D1

Catalog bundled at build time. Variable resolution + seed injection at serve time.

### 2.2 Deploy to Cloudflare
- [ ] `wrangler d1 create thinkfu-ratings`
- [ ] Update `wrangler.toml` with real database_id
- [ ] `wrangler d1 execute thinkfu-ratings --file=schema.sql`
- [ ] Configure think-fu.org domain route
- [ ] `pnpm wrangler deploy` from `api/`
- [ ] Verify all endpoints on production

### 2.3 Claude Code Plugin ✅ (built, not published)
Plugin structure complete:
- `.claude-plugin/plugin.json` — manifest
- `skills/thinkfu/SKILL.md` — auto-loaded agent skill (symlink)
- `catalog/` — symlink to repo root catalog (followed during install)
- `mcp/` — bundled MCP server
- `.mcp.json` — MCP config using `${CLAUDE_PLUGIN_ROOT}`

### 2.4 Rating Architecture
Three tiers:
1. **Local only** (default) — ratings log to `~/.thinkfu/ratings.jsonl`
2. **Anonymous opt-in** — ratings POST to `api.think-fu.org/rate` (plugin-generated UUID, no account)
3. **Identified** (future) — account-based, enables personalized routing

### 2.5 Publish Plugin
- [ ] Test with `claude --plugin-dir /path/to/plugin`
- [ ] Create marketplace repo (`move38/thinkfu` or separate)
- [ ] Submit to official Anthropic marketplace
- [ ] Write install instructions

### Phase 2 Deliverables
- [ ] API live at api.think-fu.org
- [ ] Plugin installable via marketplace
- [ ] Rating opt-in working (local default, remote opt-in)

---

## Phase 3 — Smart Router (LLM-based)

**Goal:** Replace random move selection in `/suggest?style=matched` with context-aware routing.

**When:** After we have ~100+ ratings to validate against. The router needs real usage data to tune, not just vibes.

### 3.1 Prompted Router
When `/suggest` is called with `style: matched`:
1. Send the agent's context (`goal`, `current_approach`, `stuck_on`, `mode`) + all move summaries (`id`, `name`, `one_liner`, `problem_signatures`) to an LLM
2. Prompt asks the LLM to select the 1-3 most relevant moves and explain why
3. Return the top pick, resolved with variables and seed

**Model choice:** Haiku for speed/cost. The routing prompt is small (move summaries are ~50 tokens each × 200 moves = ~10K tokens input). Sub-second response time is critical — the agent is mid-task.

**The prompt shape:**
```
You are a metacognitive advisor. Given the user's current situation,
select the most helpful thinking move from the catalog.

SITUATION:
- Mode: {{mode}}
- Goal: {{goal}}
- Current approach: {{current_approach}}
- Stuck on: {{stuck_on}}

AVAILABLE MOVES:
{{for each move: id, name, one_liner, problem_signatures}}

Select the single best move. Return just its ID and a one-sentence reason.
```

### 3.2 Rating-Informed Tuning
- Analyze ratings: which moves work for which problem shapes?
- Build a lookup table: problem_signature → move performance
- Weight routing toward moves with higher ratings for similar contexts
- Update problem_signatures on moves based on real usage patterns

### 3.3 Oblique Router ✅ (already built)
`style: oblique` deliberately selects from a different mode. Already implemented in v0.

### 3.4 Fine-Tuned Classifier (later)
- Train lightweight classifier on (context → move_id) pairs from ratings
- Replace prompted router for lower latency and zero LLM cost
- Only viable after significant volume (1000+ rated interactions)

### Phase 3 Deliverables
- [ ] Prompted router live on `/suggest?style=matched`
- [ ] Latency under 500ms
- [ ] Rating analysis showing router outperforms random
- [ ] A/B test: random vs. routed selection

---

## Phase 4 — Website

**Goal:** think-fu.org — human-facing move browser + marketing.

### 4.1 Landing Page
- Random move displayed prominently with a "draw another" button
- Brief explanation of what ThinkFu is
- Links to MCP setup, API docs, GitHub, Claude Code plugin install

### 4.2 Move Browser
- Filter by category and mode
- Search by keyword
- Each move shows: name, one_liner, mode badges, effort badge
- Click to expand full move with rendered mermaid diagram

### 4.3 Individual Move Pages
- `/move/TF-001` — shareable URL
- Full move content with rendered diagram
- Variables re-resolved on each page load
- "Draw another" button

### 4.4 Design
- Minimal. Move-focused. Beautiful deck, not a SaaS dashboard.
- Mermaid diagrams rendered client-side
- Dark/light mode
- Mobile-friendly

### Phase 4 Deliverables
- [ ] Landing page live at think-fu.org
- [ ] Move browser with filtering
- [ ] Individual move pages with shareable URLs
- [ ] Mermaid rendering

---

## Open Questions

### How do we measure success?
- **Agent-side:** Do ThinkFu-assisted agents produce more varied, higher-quality output?
- **Human-side:** Do people come back? Do they share moves? Website analytics + draw frequency.
- **System-side:** Rating volume and usefulness ratio. If nobody rates, the feedback loop is broken.

### Move authoring at scale
- Who writes moves beyond the current set? Open source contributions? Curated submissions?
- Quality control: every move must pass the mechanical-not-aspirational test + `pnpm validate`
- Do we need a move editor / preview tool?

### Pricing / access
- **Plugin:** free always (local-first, opt-in rating sharing)
- **API:** free tier with rate limits. Commercial license for high-volume use (covered by PolyForm Small Business).
- **Website:** free always.
- **Smart router:** potentially premium feature (requires LLM calls = cost)

### What's the moat?
- The catalog quality. Anyone can build infrastructure; the moves are the hard part.
- Rating data becomes a moat over time — informs routing, improves selection, drives more usage.
- Pool quality > pool size. 150 well-chosen domains beat 10,000 random ones.
- The SKILL.md / agent training. How to *use* ThinkFu well is as important as the moves themselves.
