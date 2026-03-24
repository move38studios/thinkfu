---
id: TF-146
name: Image Schema Shift
one_liner: "Your thinking runs on a hidden physical schema — CONTAINER, PATH, FORCE, BALANCE. Name it, then switch it."
mode: [explore, stuck]
category: Exploration
tags: [lakoff, image-schemas, embodied-cognition, spatial-reasoning, reframing, metaphor, structure]
effort: quick
origin: Lakoff — Image schemas / Embodied cognition
problem_signatures:
  - "I keep thinking about this in terms of boundaries and what's inside vs. outside"
  - "my framing is all about the journey — start, goal, obstacles on the path"
  - "the problem feels like a balancing act and I can't see it any other way"
  - "I'm stuck in one spatial metaphor for this system"
  - "I need a structural reframe, not just a new idea"
variables:
  word:
    type: pick
    count: 1
    pool: random-words
pairs_with:
  - id: TF-144
    why: "excavate the metaphor finds the surface language; image schema shift operates on the deeper spatial structure"
  - id: TF-003
    why: "three framings generates alternative views; image schemas provide a systematic source of those frames"
  - id: TF-020
    why: "zoom in/out changes scale within a schema; this move changes which schema you're using"
---

## The Move

Identify which **image schema** structures your current understanding of the problem. The six core schemas are:

- **CONTAINER** — things are in or out, boundaries, inclusion/exclusion
- **PATH** — start point, goal, route, obstacles, progress
- **FORCE** — push, resist, pressure, momentum, friction
- **BALANCE** — equilibrium, weight, tipping point, symmetry
- **SCALE** — more/less, bigger/smaller, ranking, degree
- **LINK** — connection, disconnection, binding, dependency

Name yours. {{word.1}} suggests which schema to shift to — is it a CONTAINER, a PATH, a FORCE? Then deliberately switch to a different schema and redescribe the problem. If you see CONTAINER (what's inside/outside the system boundary?), try PATH (where are we trying to get to?). If PATH (we're stuck on the route), try BALANCE (what's out of equilibrium?). If FORCE (too much pressure), try LINK (what's connected that shouldn't be?). Each schema generates different questions and different solutions.

## When to Use

- When your understanding of the problem feels locked into one spatial structure
- When you need a systematic way to generate genuinely different framings
- When the team keeps using the same spatial language ("we're stuck," "it's overflowing," "it's unbalanced")
- When you want to go deeper than surface-level reframing

## Diagram

```mermaid
flowchart TD
    A["Your problem"] --> B["Identify current image schema"]
    B --> C["CONTAINER: in/out?"]
    B --> D["PATH: start/goal/route?"]
    B --> E["FORCE: push/resist?"]
    B --> F["BALANCE: equilibrium?"]
    B --> G["SCALE: more/less?"]
    B --> H["LINK: connected/disconnected?"]
    C --> I["Switch to a different schema"]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    I --> J["Redescribe the problem"]
    J --> K["New questions and solutions emerge"]

    style B fill:#9b59b6,color:#fff
    style I fill:#e67e22,color:#fff
    style K fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Our monolith is too big. We need to break it apart into smaller services. Some components should be inside the service boundary, others outside."

**Current schema:** CONTAINER. You're thinking about boundaries, inclusion, what goes in which box. Solutions: draw service boundaries, define what's inside vs. outside each microservice, enforce encapsulation.

**Switch to PATH:** "Where is a request trying to get from and to? What's the route? Where does it get stuck?" Now you're mapping request flows, not boundaries. You discover that 80% of requests follow just 3 paths, and those paths cross every proposed service boundary. The container decomposition was clean, but the paths are tangled. Solution: decompose along *paths* (user journeys), not containers (domain entities).

**Switch to FORCE:** "What forces are pushing on this system? Where is the pressure? Where is the friction?" Now you see that the real pressure is on the deployment pipeline — one team's changes block everyone else. Solution: decompose along *deployment independence*, not domain boundaries. The force schema reveals the operational pressure the container schema couldn't see.

**Switch to LINK:** "What's connected that shouldn't be? What's disconnected that should be linked?" Now you map the actual runtime dependencies and find that two "separate" modules share a database table and can't be deployed independently. The link schema exposes coupling the container schema assumed away.

Three different schemas, three different decomposition strategies. The container schema was the default but produced the least useful decomposition.

## Watch Out For

- You're usually not aware of your image schema until you try to name it. Listen to the spatial language in your descriptions — "inside," "path," "pressure," "balance," "bigger," "connected" — each word is a schema fingerprint.
- Not every schema will be productive for every problem. Try two switches. If neither opens anything new, the current schema may actually be the right one.
- Image schemas can combine. "We're on a path and hitting a wall" uses both PATH and FORCE. Decompose the combination — which schema is dominant? Switch the dominant one.
- This is a thinking tool, not a presentation tool. Use the schema shift to generate new insights, then describe your solution in plain language.
