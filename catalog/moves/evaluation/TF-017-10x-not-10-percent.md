---
id: TF-017
name: 10x Not 10%
one_liner: If you needed a {{multiplier}}x improvement, would you still use this approach?
mode: [evaluate, plan]
category: Evaluation
tags: [ambition, paradigm, moonshot, ceiling, incremental, rethink]
effort: deep
origin: Moonshot thinking (Astro Teller / Google X)
problem_signatures:
  - "optimizing within the current approach"
  - "making incremental improvements"
  - "solution works but feels like it has a ceiling"
  - "polishing rather than rethinking"
  - "competitor could leapfrog this easily"
  - "solving the problem the same way everyone else does"
variables:
  multiplier:
    type: number
    min: 20
    max: 200
pairs_with:
  - id: TF-022
    why: "remove the most expensive part to find the paradigm shift that enables 10x"
  - id: TF-031
    why: "find the leverage point where a structural change unlocks an order-of-magnitude gain"
  - id: TF-029
    why: "change the scale to discover what 10x actually looks like concretely"
---

## The Move

Take your current solution and ask: **if I needed this to be {{multiplier}}x better** ({{multiplier}}x faster, {{multiplier}}x cheaper, {{multiplier}}x simpler, {{multiplier}}x more impactful), would I still use this approach?

A 10% improvement lets you optimize within the current paradigm — tune parameters, shave milliseconds, tighten copy. A {{multiplier}}x improvement forces you to question the paradigm itself. You usually can't get {{multiplier}}x by doing the same thing harder. You have to do a different thing entirely.

You don't need to actually *achieve* {{multiplier}}x. The point is to discover whether your current approach has a **ceiling** — and whether that ceiling is lower than you think.

## When to Use

- You're refining and polishing a solution that works but doesn't excite
- You're in an optimization loop — making things 5%, 8%, 12% better
- A competitor, new technology, or market shift could make your approach obsolete
- You want to check whether you're climbing the right hill or just climbing efficiently

## Diagram

```mermaid
flowchart TD
    A["Your current solution"] --> B["Define the key metric"]
    B --> C["Ask: what would {{multiplier}}x look like?"]
    C --> D{"Could your current approach reach {{multiplier}}x?"}
    D -- Yes --> E["You have headroom — keep going"]
    D -- No --> F["You have a ceiling"]
    F --> G["What paradigm shift would be needed for {{multiplier}}x?"]
    G --> H["Is that shift available to you?"]
    H --> I{"Worth pursuing?"}
    I -- Yes --> J["Pivot approach"]
    I -- No --> K["Continue current approach with eyes open about the ceiling"]

    style C fill:#f39c12,color:#fff
    style F fill:#e74c3c,color:#fff
    style E fill:#2ecc71,color:#fff
    style J fill:#3498db,color:#fff
```

## Example

**Solution:** You've built a support chatbot that resolves 30% of tickets automatically. You're tuning prompts and adding FAQ entries to push it to 35%.

**The 10x question:** What would 300% resolution look like — resolving *every* ticket automatically?

**What it reveals:** You can't get there by adding more FAQ entries. The ceiling is the architecture: the bot can only handle questions it's been explicitly programmed for. 10x would require the bot to understand the product deeply enough to diagnose novel problems — a fundamentally different system (retrieval-augmented generation over internal docs, tool-use for account lookups, etc.).

**The decision:** Maybe you don't build the 10x version today. But now you know your current approach tops out around 40-50%, and you can make an informed choice: keep optimizing for near-term gains while planning the architectural shift, rather than being surprised by the ceiling later.

## Watch Out For

- This move can paralyze if you take it too literally. The goal is awareness, not abandonment. Most days you ship the 10% improvement. But you should know where the ceiling is.
- "10x" is a thought experiment, not a requirement. If your domain doesn't have a meaningful 10x, pick a different multiplier — 3x or 5x still works.
- Don't use this to dismiss solid, incremental work. Incremental work compounds. The danger is only when you don't realize you're on a curve that flattens.
- Sometimes the 10x answer is "do less, not more." Removing steps often outperforms adding features.
