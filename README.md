# ThinkFu

> *Metacognition as a service. A catalog of thinking moves for AI agents — and the humans working alongside them.*

---

## What is ThinkFu?

ThinkFu is a curated catalog of **thinking moves** — strategic, creative, and analytical techniques that help unstick problems, reframe challenges, and generate novel approaches. Think of it as a martial arts manual for cognitive work: a set of named, practiced moves you can reach for when you're stuck, looping, or just need a jolt.

Inspired by:
- **TRIZ** — the Soviet-era systematic innovation methodology that distilled 40 inventive principles from thousands of patents
- **Brian Eno's Oblique Strategies** — a deck of disorienting prompts designed to break creative deadlock
- **Design Thinking, Lateral Thinking, Systems Thinking** — and other structured reasoning traditions

ThinkFu does what those do, but is built for **three audiences simultaneously**: AI agents (via MCP), developers (via REST API), and humans (via the website... and maybe one day an app or a card deck).

---

## The Problem

AI agents — like humans — have two failure modes:

1. **They get stuck.** They loop, overfit to their current framing, miss adjacent approaches. They know they're stuck — but don't know what to do about it.

2. **They don't know they should be stuck.** They confidently produce the first workable solution — the cliché, the default, the most-probable-token-sequence answer. They satisfice when they should explore. They never question whether their approach is the obvious one everyone would reach for.

Problem 1 is an impasse. Problem 2 is the **Einstellung effect** — the tendency to apply a familiar method even when a better one exists. For AI agents, this is structural: they are trained to produce the most likely completion. Without deliberate intervention, "most likely" is all you get.

There's currently no standard, reusable, queryable library of *thinking moves* that agents or humans can reach for — not just when stuck, but as a regular practice to elevate the quality of their thinking.

ThinkFu is that library. It provides **metacognition as a service**: the ability to think about how you're thinking, to notice when you're on autopilot, and to deliberately shift your cognitive approach.

---

## Architecture

One Cloudflare Worker serves three interfaces from the same catalog:

```
                    ┌─────────────┐
                    │   Catalog   │
                    │  (YAML/MD)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Cloudflare │
                    │   Worker    │
                    └──┬───┬───┬──┘
                       │   │   │
              ┌────────┘   │   └────────┐
              ▼            ▼            ▼
         MCP Server    REST API      Website
        (AI agents)   (developers)  (humans)
```

### 1. The Catalog

A manually curated library of thinking moves. Each move is a structured card (see Card Format below). The catalog is the foundation — everything else builds on it.

Sources to draw from initially:
- TRIZ's 40 inventive principles
- Oblique Strategies
- Design Thinking methods
- Lateral thinking techniques (de Bono)
- Systems thinking heuristics

### 2. The REST API

The canonical interface. Both the MCP server and website are thin layers on top of it.

#### `GET /random`

Returns a random ThinkFu card.

Optional query params:
- `category` — filter by category
- `format` — `json` (default), `md`, `html`

#### `GET /move/:id`

Returns a specific card by ID (e.g., `/move/TF-001`).

Optional query params:
- `format` — `json` (default), `md`, `html`

#### `POST /suggest`

The smart route. Surfaces the most relevant move based on context and metacognitive mode.

```json
{
  "mode": "plan | explore | stuck | evaluate",
  "goal": "What are you trying to achieve?",
  "current_approach": "What's your current approach or solution?",
  "stuck_on": "Where specifically are you stuck? (optional, for stuck mode)",
  "context": "Any additional free-form context (optional)",
  "exclude": ["TF-001", "TF-003"],
  "style": "matched | random | oblique"
}
```

The `mode` field maps to metacognitive phases (see Theoretical Foundations):
- **`plan`** — before starting: challenge your default approach, consider alternatives
- **`explore`** — during work: broaden the search space, escape the obvious path
- **`stuck`** — at an impasse: break through a block
- **`evaluate`** — after drafting a solution: stress-test it, check for cliché

The `exclude` array lists move IDs already tried in this session. The server will not return these.

The `style` field controls the routing strategy:
- **`matched`** (default) — best move for this context, using problem signatures and mode
- **`random`** — pure random draw (mode-filtered). Sometimes the wrong card is the most useful one.
- **`oblique`** — deliberately tangential. Returns a move from a *different* mode or category than expected. Designed to break fixation through surprise.

Returns a ThinkFu card. Backend logic for `matched` (progressive):
- v0: Random selection (mode-filtered)
- v1: Prompt-based router — pass context to an LLM with the catalog and ask it to select the most relevant move
- v2: Fine-tuned classifier trained on usage data

#### `POST /rate`

Submit feedback on a move. Stateless — the client sends the original context back so each rating is a self-contained training record.

```json
{
  "move_id": "TF-001",
  "useful": true,
  "note": "Optional: what happened when you tried to apply it",
  "original_request": {
    "mode": "stuck",
    "goal": "...",
    "current_approach": "...",
    "stuck_on": "...",
    "context": "..."
  },
  "retry": false
}
```

If `retry: true`, returns another move. The `original_request` is reused for routing, the rated move is auto-added to `exclude`, and the `note` is appended as additional context.

Each rating record is a complete training example: *situation → move → outcome*. No server-side session state needed.

#### `GET /list`

Returns a summary of all available moves — just enough to browse or build a picker UI.

```json
[
  {
    "id": "TF-001",
    "name": "Invert the Problem",
    "one_liner": "Instead of solving for success, work backwards from guaranteed failure.",
    "mode": ["stuck", "evaluate"],
    "category": "Unsticking",
    "effort": "quick"
  },
  ...
]
```

Optional query params:
- `mode` — filter by metacognitive mode
- `category` — filter by category

#### `GET /catalog`

Returns the full catalog with complete card content as a JSON array. Useful for caching locally, offline use, or building custom UIs.

### 3. The MCP Server

Wraps the REST API for AI agents. Exposes three tools:

- **`list_thinkfu_moves`** — calls `GET /list`. Returns summaries of all available moves, optionally filtered by mode or category. Lets the agent browse the catalog and understand what's available.
- **`get_thinkfu_move`** — calls `POST /suggest` with the agent's context. Returns a full card.
- **`submit_thinkfu_rating`** — calls `POST /rate` with the outcome and original context.

The MCP layer is thin by design. All logic lives in the API.

### 4. The Website

**thinkfu.org** — a human-facing card browser, also served by the same Worker.

- `/` — landing page with a random card and a "draw another" button
- `/browse` — filterable card catalog
- `/move/:id` — individual card page (shareable URL)

The website reads from the same API endpoints, rendered as HTML.

### 5. The System Prompt Snippet

Include in any agent's system prompt to activate ThinkFu-aware behavior:

```
You have access to ThinkFu — a metacognitive toolkit exposed via MCP.

USE IT IN FOUR MOMENTS:
1. PLAN — Before starting a non-trivial task, call get_thinkfu_move with mode
   "plan" to challenge your default approach. Ask yourself: "Am I about to do
   the obvious thing?"
2. EXPLORE — While working, if you notice you're executing without questioning,
   call with mode "explore" to broaden your search space.
3. STUCK — When looping or blocked, call with mode "stuck".
4. EVALUATE — Before delivering a solution, call with mode "evaluate" to
   stress-test your output. Especially if the solution came quickly.

WHEN YOU RECEIVE A MOVE: Actually apply it. Work through it step by step.
Let it change your approach if warranted.

AFTER APPLYING: Call submit_thinkfu_rating with the outcome. Include the
original context so the system can learn.

WATCH THE USER'S REACTION: If the user pushes back on your output, seems
unsatisfied, or asks you to redo something — that's a signal. Consider whether
a ThinkFu move would have caught the issue. If so, call submit_thinkfu_rating
retroactively (useful: false, with a note about what the user flagged) and
try a new move.

You can call list_thinkfu_moves to browse available moves by mode or category.
```

---

## The Card Format

Each ThinkFu move is a structured card. YAML frontmatter for machine parsing, markdown body for readability. Cards can be **static** (fixed procedure) or **dynamic** (contain variable slots resolved at serve time).

### Static card example (TF-001):

```yaml
---
id: TF-001
name: Invert the Problem
one_liner: Instead of solving for success, work backwards from guaranteed failure.
mode: [stuck, evaluate]
category: Unsticking
tags: [constraint, goals, failure-analysis, reframing]
effort: quick
origin: TRIZ / General
problem_signatures:
  - "stuck approaching directly"
  - "goal feels vague"
  - "know more about what's wrong than what's right"
  - "solution feels obvious but unexciting"
---
```

### Dynamic card example (TF-004):

```yaml
---
id: TF-004
name: Import from Another Domain
one_liner: Steal a solution pattern from {{domain.1}}, {{domain.2}}, or {{domain.3}}.
# ...
variables:
  domain:
    type: pick
    count: 3
    pool: domains
---

## The Move

Your problem has a structural tension. How would someone in
**{{domain.1}}**, **{{domain.2}}**, or **{{domain.3}}** resolve
a similar tension in their field?
```

### Variable Types

| Type | Description | Example |
|------|-------------|---------|
| `pick` | Randomly select N items from a pool file | `pick 3 from domains` |
| `number` | Random integer in a range | `min: 2, max: 7` |

Pools are shared YAML files in `catalog/pools/`:

| Pool | Contents | Used by |
|------|----------|---------|
| `domains.yaml` | 150+ fields/disciplines | Import from Another Domain |
| `personas.yaml` | Diverse user archetypes | Change the Audience |
| `random-words.yaml` | 500+ concrete nouns with strong sensory associations | Seeds + Random Entry |
| `constraints.yaml` | Creative constraints | Add a Constraint |
| `timeframes.yaml` | Time horizons | Temporal Shift |

### The Seed

Every card response — static or dynamic — includes a **seed**: a random concrete noun drawn from `random-words.yaml`.

```json
{
  "_seed": "corrosion",
  "_instance": "TF-001-x8k2m",
  "card": { ... }
}
```

The seed is **visible in the response**, not hidden metadata. It must be in the LLM's processing window because its purpose is to subtly shift interpretation. The same card, served twice with different seeds, activates different reasoning paths — even if the card content is identical.

The word pool should be concrete nouns with strong sensory associations — "lighthouse", "fermentation", "cartilage", "avalanche", "loom" — not abstract words like "synergy" or "paradigm" that are already overrepresented in the LLM's default vocabulary.

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Unique ID, `TF-NNN` format |
| `name` | yes | Short, memorable name. May contain `{{variable}}` slots. |
| `one_liner` | yes | Single sentence. May contain `{{variable}}` slots. |
| `mode` | yes | Which metacognitive modes this move applies to: `plan`, `explore`, `stuck`, `evaluate`. Array. |
| `category` | yes | Primary category: Planning, Exploration, Unsticking, Evaluation, Meta |
| `tags` | yes | Freeform tags for filtering and routing |
| `effort` | yes | `quick` (apply in seconds) or `deep` (requires sustained thinking) |
| `origin` | yes | Attribution — where the idea comes from |
| `problem_signatures` | yes | Short phrases describing the *shape* of problem this move fits. |
| `variables` | no | Variable definitions for dynamic cards. See Variable Types. |

### Body Sections

| Section | Required | Description |
|---------|----------|-------------|
| The Move | yes | What to actually do. 2-4 sentences max. May contain `{{variable}}` slots. Must be a **mechanical procedure**, not an aspiration. Test: could you follow it without needing to "be creative"? |
| When to Use | yes | Bullet list of situations where this move applies. |
| Example | yes | One concrete example showing the move in action. |
| Watch Out For | no | Common pitfalls when applying this move. |
| Diagram | yes | Mermaid diagram. Single-line labels, no `&` joins. |

---

## Card Categories

Organized by **metacognitive mode** and **moment of use**:

### Planning Moves (before you start)
*Challenge your default approach before committing to it.*

- **What Would a Beginner Do?** — drop your expertise and see the problem fresh
- **Three Framings** — write three different problem statements before solving any of them
- **Steal the Opposite Brief** — what if your goal were the reverse of what was asked?
- **Who Else Has This Problem?** — find an adjacent domain that solved something similar

### Exploration Moves (while you're working)
*Broaden the search space. Escape the path of least resistance.*

- **Random Entry** — introduce an unrelated concept and force a connection
- **Add a Constraint** — make the problem harder to make the solution more creative
- **Worst Possible Idea** — generate deliberately terrible solutions, then invert them
- **Import from Another Domain** — steal a pattern from a completely different field

### Unsticking Moves (when you're blocked)
*Break through impasses and loops.*

- **Invert the Problem** — work backwards from guaranteed failure
- **Reduce to the Simplest Case** — solve the trivial version first, then add complexity
- **Backtrack to the Fork** — find the last point where you made an assumption and try the other branch
- **Explain It to a Child** — if you can't explain it simply, you don't understand the block

### Evaluation Moves (when you think you're done)
*Stress-test your solution. Catch the cliché before it ships.*

- **Is This the First Thing Everyone Would Think Of?** — if yes, you haven't thought enough
- **Red Team Your Solution** — argue against it as hard as you can
- **Change the Audience** — would this solution work for a user who is nothing like you?
- **10x Not 10%** — if you needed a 10x improvement, would you still use this approach?
- **Kill Your Darlings** — remove the part you're most proud of. Is it still good?

### Meta Moves (thinking about thinking)
*Step back from the problem entirely.*

- **Name Your Current Strategy** — if you can't name what you're doing, you're on autopilot
- **Map the Assumptions** — list every assumption you're making, then question each one
- **Zoom In / Zoom Out** — you might be at the wrong level of abstraction
- **Merge Contradictions** — the two things that seem incompatible might both be true

---

## Theoretical Foundations

ThinkFu is grounded in established research on metacognition, problem-solving, and creativity:

### Metacognition (Flavell 1979, Schraw & Dennison 1994)

The study of "thinking about thinking." Flavell distinguishes metacognitive *knowledge* (knowing what strategies exist) from metacognitive *regulation* (knowing when to deploy them). ThinkFu externalizes both: the catalog is the knowledge, the mode system is the regulation.

Schraw & Dennison's **Metacognitive Awareness Inventory** identifies three regulatory skills — **planning**, **monitoring**, and **evaluating** — which map directly to ThinkFu's four modes (plan, explore, stuck, evaluate).

### The Einstellung Effect (Luchins 1942, Bilalić et al. 2008)

The tendency to apply a familiar solution even when a better one exists. Bilalić's eye-tracking studies showed that even chess experts literally couldn't *see* a shorter solution once they'd found a workable one — their attention was captured by the first approach. For AI agents, this is the default behavior: produce the most likely completion. ThinkFu's evaluation moves are specifically designed to break Einstellung.

### Productive Failure (Kapur 2008, 2014)

Research showing that struggling with a problem *before* receiving instruction leads to deeper understanding. This informs ThinkFu's design: the `stuck_on` and `current_approach` fields require the agent to articulate its struggle before receiving a move. The struggle is the signal.

### Impasse-Driven Learning (VanLehn 1988)

Learning happens at impasses — moments when current knowledge is insufficient. VanLehn's taxonomy of impasse types (stuck, error, anomaly) informed the unsticking category, but ThinkFu extends beyond impasse to include the *absence* of impasse as its own problem state.

### TRIZ Contradiction Matrix (Altshuller 1956–1984)

Altshuller's core insight: inventive problems contain contradictions (improving one parameter worsens another), and specific principles resolve specific contradiction types. The contradiction matrix is a problem-signature → move routing table — a direct precedent for ThinkFu's `problem_signatures` → `/suggest` routing.

### Satisficing vs. Maximizing (Simon 1956)

Herbert Simon's distinction between choosing the first acceptable option (satisficing) and searching for the best option (maximizing). AI agents are structural satisficers — they produce the most probable output. ThinkFu's evaluation moves push toward maximizing by forcing the agent to question whether "good enough" is actually good.

### Oblique Strategies as Cognitive Perturbation (Eno & Schmidt 1975)

Random perturbation breaks fixation. When stuck in a local optimum, even an irrelevant nudge can push into a new search space. This justifies keeping the `/random` endpoint even after building a smart router. Sometimes the *wrong* card is more useful than the *right* one.

---

## Tech Stack

- **Catalog storage:** YAML+MD flat files in a git repo
- **Server:** Cloudflare Worker (serves API, MCP, and website)
- **Router/classifier:** Prompted LLM call via Anthropic API initially; fine-tuned later
- **Rating storage:** Cloudflare D1
- **Website:** HTML rendered by the Worker (no separate build step)
- **Domain:** thinkfu.org

---

## Milestones

### Phase 0 — Format & Seed Catalog
- [ ] Finalize card format (YAML frontmatter + markdown body)
- [ ] Write 30–50 seed cards drawing from TRIZ, Oblique Strategies, Design Thinking
- [ ] Set up git repo with catalog folder structure
- [ ] Validate cards with a script

### Phase 1 — API + MCP v0 (random)
- [ ] Cloudflare Worker with REST API (`/random`, `/move/:id`, `/suggest`, `/rate`, `/catalog`)
- [ ] MCP server wrapping the API
- [ ] Rating storage in D1
- [ ] System prompt snippet documented
- [ ] End-to-end test with a real agent task

### Phase 2 — Website
- [ ] Landing page with random card draw
- [ ] Card browser with filtering
- [ ] Individual card pages with shareable URLs
- [ ] Served from the same Worker

### Phase 3 — Smart Router (prompted)
- [ ] LLM-based move selection replacing random in `/suggest`
- [ ] Use `problem_signatures` + context for matching
- [ ] Tune selection prompt using early rating data
- [ ] Retry logic with exclusion

### Phase 4 — Classifier
- [ ] Train lightweight classifier on rating data
- [ ] Replace prompted router

---

## Repo Structure

```
thinkfu/
├── README.md
├── catalog/
│   ├── moves/
│   │   ├── planning/
│   │   ├── exploration/
│   │   ├── unsticking/
│   │   ├── evaluation/
│   │   └── meta/
│   └── pools/
│       ├── domains.yaml
│       ├── personas.yaml
│       ├── random-words.yaml
│       ├── constraints.yaml
│       └── timeframes.yaml
├── SKILL.md
├── worker/
│   ├── src/
│   │   ├── index.ts          # Router: API, MCP, and website
│   │   ├── api.ts            # REST API handlers
│   │   ├── mcp.ts            # MCP protocol handler
│   │   ├── web.ts            # HTML rendering
│   │   ├── catalog.ts        # Catalog loader and search
│   │   └── router.ts         # Move selection logic
│   └── wrangler.toml
├── web/
│   └── templates/            # HTML templates
└── scripts/
    └── validate-catalog.ts
```

---

## Name & Spirit

**ThinkFu** — like kung fu, but for thinking. Because thinking — when done well — is a martial art. Martial arts traditions are exactly this: a named, practiced, teachable catalog of moves. You don't invent a new kick every fight. You have a repertoire. You train. You reach for the right move at the right moment.

ThinkFu is that repertoire for cognitive work. For agents. For humans. For anyone doing hard thinking under pressure.

---

*Built by move38.*
