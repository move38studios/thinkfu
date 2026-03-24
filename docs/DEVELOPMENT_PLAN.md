# ThinkFu Development Plan

> The catalog is the product. Everything else is distribution.

---

## Phase 0 — Catalog & Local Tooling

**Goal:** 30+ validated cards, complete pools, and a local tool to test them.

### 0.1 Complete the Pool Files
- [x] `domains.yaml` — 150+ disciplines
- [x] `personas.yaml` — 80+ perspectives
- [x] `random-words.yaml` — 300+ concrete sensory nouns
- [ ] `constraints.yaml` — creative constraints ("max 3 components", "no nouns", "explain in one sentence")
- [ ] `timeframes.yaml` — time horizons ("in 5 minutes", "in 10 years", "in 1888")

### 0.2 Write Seed Cards (target: 30-40)
Current: 5 cards (one per category). Need ~6-8 per category.

**Planning (before you start)**
- [x] TF-003 Three Framings
- [ ] What Would a Beginner Do?
- [ ] Steal the Opposite Brief
- [ ] Who Else Has This Problem?
- [ ] Pre-Mortem
- [ ] Shrink the Scope to One User

**Exploration (while working)**
- [x] TF-004 Import from Another Domain
- [ ] Random Entry (uses `random-words` pool)
- [ ] Add a Constraint (uses `constraints` pool)
- [ ] Worst Possible Idea
- [ ] Combine Two Half-Solutions
- [ ] Time Shift (uses `timeframes` pool)

**Unsticking (when blocked)**
- [x] TF-001 Invert the Problem
- [ ] Reduce to the Simplest Case
- [ ] Backtrack to the Fork
- [ ] Explain It to a Child
- [ ] Change the Representation
- [ ] Remove the Thing That Feels Essential

**Evaluation (when you think you're done)**
- [x] TF-002 Describe It Without the Obvious Words
- [ ] Red Team Your Solution
- [ ] Change the Audience (uses `personas` pool)
- [ ] 10x Not 10%
- [ ] Kill Your Darlings
- [ ] What Would Go Wrong at Scale?

**Meta (thinking about thinking)**
- [x] TF-005 Name Your Current Strategy
- [ ] Map the Assumptions
- [ ] Zoom In / Zoom Out
- [ ] Merge Contradictions
- [ ] Check Your Emotional State
- [ ] What Question Are You Actually Answering?

### 0.3 Local CLI Tool
A simple Node/Deno script that:
- Loads catalog from disk
- Resolves variables from pools
- Injects a random seed
- Serves a card to stdout

```bash
thinkfu random                     # random card, resolved
thinkfu suggest --mode stuck       # random from mode
thinkfu show TF-001                # specific card
thinkfu validate                   # check all cards for format errors
```

This is NOT the production server — it's a development/testing tool.
Validates the card format, variable resolution, and pool references work before we build anything.

### 0.4 Card Quality Checklist
Every card must pass these tests before shipping:

- [ ] **Mechanical, not aspirational.** Could you follow this move as a procedure without needing to "be creative"? If it says "try harder" or "think differently" it's broken.
- [ ] **The Move section is 2-4 sentences.** If it needs more, the move is too complex — split it.
- [ ] **Problem signatures are situation-shaped**, not topic-shaped. "stuck approaching directly" not "creativity".
- [ ] **Example is concrete and specific.** Not "imagine a problem" but "you're designing X and Y happens."
- [ ] **Mermaid diagram renders.** Single-line labels, no `&` joins, tested in a renderer.
- [ ] **Variables resolve correctly.** Pool references exist. Template slots match variable names.
- [ ] **Watch Out For is honest.** Names real failure modes, not just "don't overdo it."

### Phase 0 Deliverables
- [x] 30+ cards across all 5 categories **(54 cards written)**
- [ ] All 5 pool files populated (3/5 done)
- [x] Local MCP server working (FastMCP + stdio)
- [ ] Validation script passing on all cards

---

## Phase 1 — Validate with Real Agents

**Goal:** Evidence that ThinkFu actually changes output quality. This is the go/no-go gate for building infrastructure.

### 1.0 Connect ThinkFu to Claude Code

The local MCP server is built and working. To test with a real agent:

**In any project's `.claude/settings.json`:**

```json
{
  "mcpServers": {
    "thinkfu": {
      "command": "pnpm",
      "args": ["tsx", "src/server.ts"],
      "cwd": "/Users/gs/dev/thinkfu/mcp"
    }
  }
}
```

**Then add to that project's `CLAUDE.md`:**

Copy the contents of `/Users/gs/dev/thinkfu/SKILL.md` into the project's CLAUDE.md (or reference it).

Now Claude Code has ThinkFu available as three MCP tools and knows when/how to use them.

### 1.1 Design the Evaluation
Pick 10 diverse tasks across domains (coding, writing, design, strategy). For each:

1. **Baseline:** Agent solves the task normally
2. **With ThinkFu:** Agent uses SKILL.md + ThinkFu MCP tools
3. **Compare:** Score both outputs on originality, quality, and whether the ThinkFu version explored the solution space more

This doesn't need to be rigorous research — it's a gut check. Do the cards change behavior? Do they improve output? Are some categories more useful than others?

### 1.2 Iterate on Cards
Based on evaluation:
- Kill cards that don't change behavior
- Rewrite cards where the mechanism is unclear
- Identify gaps — situations where the agent needed a move and none existed
- Tune problem signatures based on what contexts each card actually helped with

### 1.3 Test the Seed Effect
Serve the same static card 5 times with different seeds. Does output actually vary? If not, seeds need rethinking (different word pool, different placement in response, etc.)

### Phase 1 Deliverables
- [ ] 10-task evaluation completed
- [ ] Cards iterated based on results
- [ ] Seed effect validated or redesigned
- [ ] Decision: proceed to infrastructure or iterate further on catalog

---

## Phase 1.5 — Claude Code Plugin

**Goal:** Package ThinkFu as a Claude Code plugin so anyone can install it with one command. This is the fastest path to real-world usage and feedback — every Claude Code user becomes a potential tester.

### Why before the API
- Zero infrastructure needed — the plugin bundles the catalog and runs locally
- Immediate distribution — install via marketplace or `--plugin-dir`
- The SKILL.md, MCP server, and catalog are already built — this is just packaging
- Gets real usage data and feedback before investing in cloud infrastructure
- Useful for us too — we can use ThinkFu in every project immediately

### Plugin Structure

```
thinkfu-plugin/
├── .claude-plugin/
│   └── plugin.json          # name, description, version
├── skills/
│   └── thinkfu/
│       └── SKILL.md          # Agent skill (metacognitive instructions)
├── .mcp.json                 # MCP server config (points to bundled server)
├── mcp/
│   └── ...                   # Bundled MCP server + catalog
└── README.md
```

### Plugin Manifest

```json
{
  "name": "thinkfu",
  "description": "Metacognition as a service. Thinking moves for AI agents.",
  "version": "0.1.0",
  "author": {
    "name": "move38"
  }
}
```

### Tasks
- [ ] Restructure repo as a Claude Code plugin
- [ ] SKILL.md becomes a plugin skill (auto-loaded, no manual CLAUDE.md copy)
- [ ] MCP server bundled inside the plugin
- [ ] Test with `claude --plugin-dir ./thinkfu-plugin`
- [ ] Submit to Claude Code plugin marketplace
- [ ] Write install instructions: `claude plugin install thinkfu`

### Phase 1.5 Deliverables
- [ ] ThinkFu installable as a Claude Code plugin
- [ ] Works with `claude --plugin-dir` for local testing
- [ ] Listed in a plugin marketplace for distribution

---

## Phase 2 — API + MCP

**Goal:** ThinkFu live on Cloudflare, usable by any MCP-compatible agent.

### 2.1 Cloudflare Worker
Single Worker serving all interfaces:

**REST API:**
- `GET /random` — random resolved card
- `GET /move/:id` — specific card (resolved)
- `GET /list` — card summaries, filterable
- `GET /catalog` — full catalog
- `POST /suggest` — context-aware card selection (v0: random, mode-filtered)
- `POST /rate` — submit feedback

**Implementation:**
- Catalog baked into the Worker at build time (no runtime file reads)
- Variable resolution at serve time (random picks from pools)
- Seed injection on every response
- D1 database for ratings storage
- Format negotiation: `?format=json|md|html`

### 2.2 MCP Server
Thin wrapper exposing three tools:
- `list_thinkfu_moves`
- `get_thinkfu_move`
- `submit_thinkfu_rating`

MCP protocol handled in the same Worker (different endpoint/transport).

### 2.3 Onboarding
Make it dead simple to start using ThinkFu:

```json
{
  "mcpServers": {
    "thinkfu": {
      "url": "https://api.thinkfu.org/mcp"
    }
  }
}
```

One line in the MCP config. SKILL.md available to copy into any agent's context.

### 2.4 Rating Schema
D1 table storing complete training records:

```sql
CREATE TABLE ratings (
  id TEXT PRIMARY KEY,
  instance_id TEXT,         -- TF-001-x8k2m
  move_id TEXT,             -- TF-001
  seed TEXT,                -- "corrosion"
  resolved_variables TEXT,  -- JSON of resolved variable values
  useful BOOLEAN,
  note TEXT,
  original_request TEXT,    -- JSON of the full suggest request
  created_at TIMESTAMP
);
```

### Phase 2 Deliverables
- [ ] Worker deployed to Cloudflare
- [ ] All REST endpoints working
- [ ] MCP server working with Claude Code
- [ ] D1 ratings storage
- [ ] One-line MCP config documented
- [ ] Domain: api.thinkfu.org

---

## Phase 3 — Website

**Goal:** thinkfu.org — a human-facing card browser that also serves as marketing.

### 3.1 Landing Page
- Random card displayed prominently with a "draw another" button
- Brief explanation of what ThinkFu is
- Links to MCP setup, API docs, GitHub

### 3.2 Card Browser
- Filter by category and mode
- Search by keyword
- Each card shows: name, one_liner, mode badges, effort badge
- Click to expand full card with rendered mermaid diagram

### 3.3 Individual Card Pages
- `/move/TF-001` — shareable URL
- Full card content with rendered diagram
- "Draw a new card" button
- Variables re-resolved on each page load (so refreshing gives a different instance)

### 3.4 Design
- Minimal. Card-focused. Think: a beautiful deck of cards, not a SaaS dashboard.
- Mermaid diagrams rendered client-side
- Dark/light mode
- Mobile-friendly (card format works well on narrow screens)

### Phase 3 Deliverables
- [ ] Landing page live
- [ ] Card browser with filtering
- [ ] Individual card pages with shareable URLs
- [ ] Mermaid rendering working
- [ ] thinkfu.org domain configured

---

## Phase 4 — Smart Router

**Goal:** Replace random card selection with context-aware routing.

### 4.1 Prompted Router
- When `/suggest` is called with `style: matched`, pass the full context + catalog summaries to an LLM
- Prompt asks the LLM to select the most relevant move based on problem signatures, mode, and context
- Use Anthropic API (Haiku for speed/cost)

### 4.2 Rating-Informed Tuning
- Analyze ratings data: which cards work for which problem shapes?
- Update problem signatures based on real usage patterns
- Weight routing toward cards with higher ratings for similar contexts

### 4.3 Oblique Router
- When `style: oblique` is requested, deliberately select a card from a *different* mode or category
- The mismatch is the mechanism — it forces the agent to make unexpected connections

### 4.4 Eventual: Fine-Tuned Classifier
- Train a lightweight classifier on (context → move) pairs from ratings data
- Replace prompted router for lower latency and cost
- Only viable after significant ratings volume (1000+)

### Phase 4 Deliverables
- [ ] Prompted router live
- [ ] Oblique routing working
- [ ] Rating analysis pipeline
- [ ] Latency under 500ms for matched routing

---

## Open Questions

### How do we measure success?
- **Agent-side:** Do ThinkFu-assisted agents produce more varied, higher-quality output? Need a repeatable evaluation.
- **Human-side:** Do people come back? Do they share cards? Website analytics + card draw frequency.
- **System-side:** Rating volume and usefulness ratio. If nobody rates, the feedback loop is broken.

### Card authoring at scale
- Who writes cards beyond the seed set? Open source contributions? Curated submissions?
- Quality control: every card must pass the mechanical-not-aspirational test
- Do we need a card editor / preview tool?

### Pricing / access
- API: free tier with rate limits? Open source catalog, hosted API as a service?
- MCP: always free? The value proposition weakens behind a paywall.
- Website: free, always.

### What's the moat?
- The catalog quality is the moat. Anyone can build the infrastructure; the cards are the hard part.
- Rating data becomes a moat over time — informs routing, which improves card selection, which drives more usage.
- Pool quality matters more than pool size. 150 well-chosen domains beat 10,000 random ones.
