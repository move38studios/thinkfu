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
- Agent tends to move-hop (draw many, apply shallowly) rather than apply deeply — SKILL.md updated to address this
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

**Status: API DEPLOYED, PLUGIN NOT YET PUBLISHED**

### 2.1 Cloudflare Worker API ✅ (deployed)
Hono + D1, all endpoints working locally:
- `GET /random` — random resolved move
- `GET /move/:id` — specific move
- `GET /list` — move summaries, filterable by mode/category
- `GET /catalog` — full catalog
- `POST /suggest` — context-aware selection (v0: random, mode-filtered)
- `POST /rate` — submit feedback → D1

Catalog bundled at build time. Variable resolution + seed injection at serve time.

### 2.2 Deploy to Cloudflare ✅
- [x] D1 database created (thinkfu-ratings)
- [x] Schema migrated (ratings table + indexes)
- [x] think-fu.org + api.think-fu.org custom domains configured
- [x] Deployed via `pnpm wrangler deploy`
- [x] Website live: landing, /humans, /agents, /random, /move/:id
- [x] API live: all endpoints returning JSON on api.think-fu.org

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
- [ ] Create marketplace repo (`move38studios/thinkfu` or separate)
- [ ] Submit to official Anthropic marketplace
- [ ] Write install instructions

### Phase 2 Deliverables
- [ ] API live at api.think-fu.org
- [ ] Plugin installable via marketplace
- [ ] Rating opt-in working (local default, remote opt-in)

---

## Phase 3 — Smart Router

**Goal:** Replace random move selection in `/suggest?style=matched` with intelligent routing that balances relevance with surprise.

**When:** Can be built alongside or shortly after Phase 2 deployment. Rating data improves it over time but isn't required to start — the embedding + LLM pipeline works from day one.

### Design Principle

Pure embedding similarity would just return "the move that sounds most like your problem" — which is the opposite of good metacognition. The whole point is to sometimes give you the move you *wouldn't* have reached for. The router must balance **relevance** (the move should apply) with **surprise** (the move should shift your thinking somewhere unexpected).

### 3.1 The Routing Pipeline

When `/suggest` is called with `style: matched`:

```
Context (goal, approach, stuck_on, mode)
        │
        ▼
┌─────────────────────┐
│  Embed the context   │  embeddinggemma-300m (~50ms)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Pull 5 candidates   │  3 by vector similarity + 2 random from same mode
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  LLM picks the best  │  llama-3.2-1b-instruct (~200ms)
└─────────┬───────────┘
          │
          ▼
     Resolved move
     (variables + seed)
```

**Step 1 — Embed the context.** Concatenate `goal + current_approach + stuck_on` into a single string. Embed with `embeddinggemma-300m` (300M params, runs on Cloudflare edge, effectively free).

**Step 2 — Pull candidates.** Query Vectorize for the top 3 most similar moves (by `one_liner + problem_signatures` embeddings). Then add 2 random moves from the same mode that are NOT in the top 3. These random candidates are the "left field" insurance — they ensure the router doesn't become insular.

**Step 3 — LLM picks the best.** Send all 5 candidates (id, name, one_liner, problem_signatures) plus the agent's context to `llama-3.2-1b-instruct` (1B params, ~200ms on Cloudflare edge). The prompt explicitly asks for the most *unexpectedly useful* move, not the most obviously related one.

**Total latency:** ~250ms. No external API calls. Everything runs inside the Cloudflare Worker on edge infrastructure.

**The LLM prompt:**
```
You are a metacognitive advisor selecting a thinking move for someone who is working on a problem.

SITUATION:
- Mode: {{mode}}
- Goal: {{goal}}
- Current approach: {{current_approach}}
- Stuck on: {{stuck_on}}

CANDIDATE MOVES:
{{for each candidate: id, name, one_liner, problem_signatures}}

Pick the single move most likely to shift this person's thinking in an unexpected and useful direction. Not the most obviously related move — the one that will produce the most surprising insight.

Return ONLY the move ID.
```

### 3.2 Embedding Management

All move embeddings are pre-computed and stored in Vectorize. Recalculation on change:

- `scripts/build-embeddings.ts` — reads all moves, embeds `one_liner + problem_signatures`, upserts to Vectorize
- Run when moves are added/edited: `pnpm build:embeddings`
- Can be a pre-deploy hook: `pnpm build:embeddings && pnpm wrangler deploy`
- 200 moves × 1 embedding each = a few seconds total. No incremental logic needed at this scale.

### 3.3 Oblique Router ✅ (already built)

`style: oblique` skips the pipeline entirely and picks from a different mode. Pure random. This is by design — sometimes the most useful move is the one with zero contextual relevance.

### 3.4 Rating-Informed Tuning (later)

Once we have 100+ ratings:
- Analyze which moves work for which problem shapes
- Weight the vector similarity results by historical performance
- Feed rating history into the LLM prompt as additional context ("moves that worked well in similar situations: ...")
- Update problem_signatures on moves based on real usage patterns

### 3.5 Fine-Tuned Classifier (much later)

After 1000+ rated interactions:
- Fine-tune a small model on (context → move_id) pairs
- Could run as a custom model on Workers AI
- Replaces the embedding + LLM pipeline for even lower latency
- Only worth the effort if the pipeline is provably better than random

### Infrastructure (all Cloudflare-native)

| Component | Service | Cost |
|-----------|---------|------|
| Embedding model | Workers AI: embeddinggemma-300m | Free tier |
| Vector storage | Vectorize | Free tier (5M vectors) |
| Routing LLM | Workers AI: llama-3.2-1b-instruct | Neurons pricing (negligible) |
| Everything else | Same Worker | Already deployed |

No external API keys. No Anthropic billing. The entire routing stack runs on the edge.

### Phase 3 Deliverables
- [ ] `scripts/build-embeddings.ts` — pre-compute and upload move embeddings
- [ ] Vectorize index configured in `wrangler.toml`
- [ ] Routing pipeline in `/suggest` handler
- [ ] LLM tiebreaker prompt tuned
- [ ] Latency under 300ms
- [ ] A/B test: random vs. routed selection (once we have rating data)

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
