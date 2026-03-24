---
id: TF-010
name: Add a Constraint
one_liner: "Make the problem harder: what if {{constraint.1}}? Or what if {{constraint.2}}?"
mode: [explore]
category: Exploration
tags: [constraints, creativity, reframing, simplification, TRIZ]
effort: quick
origin: TRIZ / Creative constraint literature
problem_signatures:
  - "the freedom to do anything is producing nothing"
  - "too many options and I can't narrow the solution space"
  - "I need artificial pressure to force a creative direction"
  - "the problem is too open-ended to think about productively"
variables:
  constraint:
    type: pick
    count: 2
    pool: constraints
pairs_with:
  - id: TF-047
    why: "follow-up to rewrite real constraints after discovering which artificial ones were productive"
  - id: TF-012
    why: "alternative approach — reduce to simplest case instead of adding artificial constraints"
  - id: TF-022
    why: "complement: removing the most expensive part is a specific, high-leverage constraint to add"
---

## The Move

State your problem. Now artificially impose a constraint that isn't actually required: **{{constraint.1}}**. Design a solution under that constraint. Then try a second: **{{constraint.2}}**. Design again.

The constraint isn't the point — the *detour* is. When the obvious path is blocked, you're forced down side roads. Some of those side roads turn out to be better than the main road, even after you remove the constraint.

## When to Use

- The solution space is so open that every option looks equally mediocre
- You keep gravitating toward the same safe, incremental approach
- You want to discover non-obvious designs without needing a flash of inspiration
- Early exploration phase where you want to generate structurally different alternatives

## Diagram

```mermaid
flowchart TD
    A["Your problem"] --> B["Add constraint 1: {{constraint.1}}"]
    A --> C["Add constraint 2: {{constraint.2}}"]
    B --> D["Design under constraint 1"]
    C --> E["Design under constraint 2"]
    D --> F["Remove the constraint"]
    E --> F
    F --> G["Keep what still works"]

    style B fill:#e74c3c,color:#fff
    style C fill:#e74c3c,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Design a better onboarding experience for our developer tool."

**Constraint 1:** *"It must be explainable in one sentence."*
This forces you to strip the onboarding to its absolute core. You realize the current flow has 8 steps because the product has 8 features, not because the user needs 8 things on day one. The constrained design: "Run this one command, see your first result." Even after removing the constraint, this insight survives — lead with one outcome, not a tour.

**Constraint 2:** *"A child must be able to operate it."*
Now you can't rely on users reading documentation or knowing terminal conventions. You design a visual, drag-and-drop setup wizard. After removing the constraint, you don't ship the children's version — but you do notice that the wizard approach eliminated three steps where users previously got stuck on config syntax.

Both constraints produced ideas the unconstrained brainstorm never reached.

## Watch Out For

- The constraint is a tool, not a requirement. Always remove it afterward and ask "what survives?"
- If a constraint produces nothing interesting, don't grind — re-roll and try a different one
- Don't pick constraints that are too close to your actual constraints. The value comes from *arbitrary* restrictions that force genuinely different paths
- Two constraints are enough. Adding more in a single session dilutes focus
