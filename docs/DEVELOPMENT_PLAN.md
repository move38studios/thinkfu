# ThinkFu Development Plan

> The catalog is the product. Everything else is distribution.

---

## Phase 0 — Catalog & Local Tooling ✅

**Goal:** 200+ validated moves, complete pools, local MCP server, validation tooling.

**Status: DONE**

- [x] 208 moves across 5 categories (planning, exploration, unsticking, evaluation, meta)
- [x] 10 pool files (domains, personas, random-words, constraints, timeframes, genres, koans, languages, thinkers, scamper)
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

### 1.2 Testing ✅
Multiple test conversations across brainstorming, strategy, essay feedback, product ideation.

**Key findings (iteratively addressed):**
- Seed word was too prominent → fixed: seed now unlabeled footnote, agent no longer fixates
- Agent wasn't rating moves → fixed: explicit reminder in every move response + "MUST" in tool description
- Agent always rated useful:true → fixed: changed from `useful` boolean to `changed_approach` + `user_reaction`
- Agent move-hopped → fixed: SKILL.md updated to enforce "apply fully before drawing another"
- List tool returned 14k tokens → fixed: compact grouped format, ~3k tokens
- Seed instruction in SKILL.md caused fixation → removed entirely
- Smart router produces better move selection than random (tested on Nose, startup ideation, essay feedback)
- Agent now re-rates moves when user reacts negatively

### 1.3 Remaining Validation
- [ ] More testing with `plan` and `stuck` modes specifically
- [ ] Validate smart router vs random quality with larger sample

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

### 2.4 Rating Architecture ✅
- **First-use config flow:** first call to `get_thinkfu_move` triggers setup — agent asks user about sharing, calls `thinkfu_config`
- **Default: sharing ON** (informed default, user can opt out anytime via `thinkfu_config`)
- **Local:** always written to `plugin/mcp/ratings.jsonl` (scrubbed)
- **Remote:** when sharing enabled, POSTs scrubbed ratings to `api.think-fu.org/rate` → D1
- **PII/secret scrubber:** regex-based, catches emails, phones, API keys (sk-, ghp_, AKIA, etc.), URLs with tokens, env var assignments, credit cards, SSNs, addresses
- **Agent instructed** to not include PII in context fields + to resubmit ratings when user reaction changes initial assessment

### 2.5 Publish Plugin
- [x] Test with `claude --plugin-dir /path/to/plugin`
- [ ] Create marketplace repo (move38studios/thinkfu)
- [ ] Submit to official Anthropic marketplace
- [ ] Write install instructions

### Phase 2 Deliverables
- [x] API live at api.think-fu.org
- [ ] Plugin installable via marketplace
- [x] Rating opt-in working (first-use config, PII scrubbing, remote sync)

---

## Phase 3 — Smart Router ✅

**Goal:** Replace random move selection with intelligent routing that balances relevance with surprise, and lets the LLM choose contextually appropriate variables.

**Status: DEPLOYED**

### Design Principles

1. Pure embedding similarity would return "the move that sounds most like your problem" — the opposite of good metacognition. The router must balance **relevance** with **surprise**.
2. The LLM should choose variables from pools with intent, not randomly. "Given this is a scaling problem, pick domains that deal with scaling in unusual ways." Still from the pool (quality controlled), but not random.
3. The seed word stays random always — non-negotiable perturbation that the LLM does not control.

### 3.1 Two Styles (simplified)

- **`matched`** (default) — the full pipeline: embedding → candidates → LLM selects move + chooses variables
- **`random`** — pure random, mode-filtered. No intelligence. For the website `/random` and testing.

`oblique` is dropped. The "left field" surprise is built into `matched` via the 2 random candidates mixed with 3 similar ones, filtered through the LLM.

### 3.2 The Routing Pipeline

When `/suggest` is called with `style: matched`:

```
Context (goal, approach, stuck_on, mode)
        │
        ▼
┌──────────────────────┐
│  1. Embed context     │  embeddinggemma-300m (~50ms)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  2. Pull 5 candidates │  3 by vector similarity + 2 random (same mode)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  3. LLM selects move  │  llama-3.1-8b-instruct (~200ms)
│     + picks variables │  (from pools, with intent)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  4. Inject random seed│  always random from pool
└──────────┬───────────┘
           │
           ▼
      Resolved move
```

**Step 1 — Embed the context.** Concatenate `goal + current_approach + stuck_on`. Embed with `embeddinggemma-300m` (300M params, Cloudflare edge, free tier).

**Step 2 — Pull candidates.** Query Vectorize for top 3 similar moves (by pre-embedded `one_liner + problem_signatures`). Add 2 random moves from the same mode not in the top 3. The random candidates are "left field" insurance.

**Step 3 — LLM selects move + chooses variables.** Send all 5 candidates plus the context to `llama-3.1-8b-instruct`. The LLM returns:
- Which move to use
- For moves with variables: specific values chosen from the pools, based on context

**Step 4 — Inject random seed.** Always random from `random-words` pool. The LLM never sees or controls the seed.

**Total latency target:** ~300ms. All on Cloudflare edge. No external API calls.

**The LLM prompt:**
```
You are a metacognitive advisor. Someone is working on a problem. Select
a thinking move and, if the move has variables, choose specific values
that will produce the most unexpectedly useful result for their situation.

SITUATION:
- Mode: {{mode}}
- Goal: {{goal}}
- Current approach: {{current_approach}}
- Stuck on: {{stuck_on}}

CANDIDATE MOVES:
{{for each candidate: id, name, one_liner, problem_signatures, variables}}

AVAILABLE POOLS:
{{for each pool referenced by candidates: pool_name, 20 random samples}}

Pick the move most likely to shift this person's thinking in a surprising
and useful direction. Not the most obviously related — the one that will
produce the most unexpected insight.

If the chosen move has variables, select specific values from the pools.
Choose values that create interesting tension with the situation — not
the obvious choices, but not random either. Aim for productive friction.

Return JSON:
{
  "move_id": "TF-XXX",
  "reason": "one sentence why",
  "variables": { "domain": ["value1", "value2", "value3"] }
}
```

### 3.3 Embedding Management

Pre-computed, stored in Vectorize. Rebuilt on catalog changes:

- `scripts/build-embeddings.ts` — reads all moves, embeds `one_liner + problem_signatures`, upserts to Vectorize
- `pnpm build:embeddings` — run when moves change
- Pre-deploy hook: `pnpm build:embeddings && pnpm wrangler deploy`
- 200+ moves × 1 embedding = a few seconds total

### 3.4 Implementation ✅

- [x] embeddinggemma-300m — 768-dim vectors, ~50ms
- [x] Vectorize index — all moves embedded and uploaded
- [x] llama-3.1-8b-instruct with JSON schema — structured output (move + reason + variables)
- [x] Full pipeline in `/suggest?style=matched` and `/match?q=...` (website)
- [x] End-to-end latency ~1.4s
- [ ] MCP plugin to call API for `matched` style (deferred — plugin uses random locally)

### 3.5 Rating-Informed Tuning (later)

Once we have 100+ ratings:
- Weight similarity results by historical performance
- Feed rating history into the LLM prompt ("moves that worked in similar situations")
- Update problem_signatures based on real usage patterns

### 3.6 Fine-Tuned Classifier (much later)

After 1000+ rated interactions:
- Fine-tune a small model on (context → move_id) pairs
- Run as custom model on Workers AI
- Replace the pipeline for lower latency and zero per-request LLM cost

### Infrastructure (all Cloudflare-native)

| Component | Service | Cost |
|-----------|---------|------|
| Embedding model | Workers AI: embeddinggemma-300m | Free tier |
| Vector storage | Vectorize | Free tier (5M vectors) |
| Routing LLM | Workers AI: llama-3.1-8b-instruct | Neurons pricing (negligible) |
| Everything else | Same Worker | Already deployed |

No external API keys. No Anthropic billing. Entire routing stack on the edge.

### Phase 3 Deliverables
- [x] Vectorize index with all move embeddings
- [x] `scripts/build-embeddings.ts`
- [x] Routing pipeline in `/suggest` handler
- [x] LLM selects move + variables from pools
- [x] Seed always random
- [x] Latency ~1.4s (target was 300ms — LLM inference is the bottleneck, acceptable)
- [x] Fallback to random if pipeline fails

---

## Phase 4 — Website ✅

**Status: DEPLOYED** at think-fu.org

- [x] Landing page: `/` with human / agent / why paths
- [x] `/humans` — description + "describe your problem" textarea (calls smart router) + random draw
- [x] `/agents` — agent-facing integration guide (MCP tools, REST API)
- [x] `/why` — manifesto page
- [x] `/setup` — step-by-step for Claude Code, Claude Desktop, ChatGPT
- [x] `/credits` — intellectual traditions and attribution
- [x] `/random` — redirects to pinned move URL
- [x] `/match?q=...` — smart-routed move for humans, redirects to pinned URL
- [x] `/move/:id?seed=...&vars=...` — shareable pinned instance with swipe/back/next/share
- [x] Mermaid diagrams rendered client-side
- [x] Dark/light mode toggle
- [x] Session history (back/forward navigation)
- [x] Problem-mode: matched moves cycle with excludes, "clear problem" to return to random

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

---

## What's Next

### Immediate
- [x] **Rating opt-in in plugin** — first-use config, PII scrubbing, remote sync to D1
- [ ] **Publish Claude Code plugin** — create marketplace repo, submit to official marketplace
- [ ] **MCP plugin uses smart router** — plugin calls API `/suggest?style=matched` instead of local random
- [ ] **Remove test endpoints** — `/__test/*` routes in the API

### Soon
- [ ] Rating-informed routing — weight results by historical performance
- [ ] Browse page on website — filterable move catalog for humans
- [ ] npm package for MCP server — `npx thinkfu-mcp` for Claude Desktop users

### Later
- [ ] Fine-tuned classifier replacing LLM router
- [ ] Usage analytics dashboard
- [ ] Community move contributions
