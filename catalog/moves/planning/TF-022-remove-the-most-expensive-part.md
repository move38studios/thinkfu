---
id: TF-022
name: Remove the Most Expensive Part
one_liner: Identify the costliest element of your solution and delete it entirely — then check if the solution still works.
mode: [plan, evaluate]
category: Planning
tags: [simplification, cost-reduction, assumptions, triz, subtraction]
effort: snap
origin: TRIZ Principle 2 (Taking out) / Simplification
problem_signatures:
  - "this solution feels too complex for what it does"
  - "we're over budget on time and I don't know what to cut"
  - "there's one part that keeps causing problems"
  - "I assumed we needed this but now I'm not sure"
  - "the architecture has a piece that scares everyone"
pairs_with:
  - id: TF-052
    why: "if removing one part helped, try Delete Half to aggressively strip down the rest of the solution"
  - id: TF-026
    why: "use Find the Bottleneck to verify whether the expensive part was actually the constraint before cutting it"
  - id: TF-049
    why: "after removal, use Name the Tradeoff to make explicit what you're giving up and whether it's acceptable"
---

## The Move

List every component of your current solution. For each one, estimate its cost — in implementation time, ongoing complexity, risk, or literal dollars. Rank them. Take the most expensive one and remove it completely. Don't replace it with something cheaper — just delete it. Now ask: does the remaining solution still solve the core problem? If yes, you were carrying dead weight. If no, ask what minimal thing you'd need to add back. That minimal thing is almost always cheaper than what you removed.

## When to Use

- Your solution has grown complex and you suspect not all of it is load-bearing
- One component dominates the cost, timeline, or risk of the whole project
- You inherited a design and want to question its assumptions
- You're over budget and need to cut scope without losing the core value

## Diagram

```mermaid
flowchart TD
    A["List all components of your solution"] --> B["Rank by cost: time, complexity, risk, dollars"]
    B --> C["Take the most expensive part"]
    C --> D["Remove it entirely"]
    D --> E{"Does the solution still work?"}
    E -- Yes --> F["Ship without it"]
    E -- No --> G["What minimal piece would you add back?"]
    G --> H["Add only that piece"]

    style C fill:#e74c3c,color:#fff
    style E fill:#f39c12,color:#fff
    style F fill:#2ecc71,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Problem:** "We're building a real-time collaborative document editor."

**Component list, ranked by cost:**

1. **Real-time sync engine (CRDT/OT)** — 60% of the engineering effort, highest risk
2. Permissions system — 15%
3. Document storage and versioning — 15%
4. UI editor component — 10%

**Remove the most expensive part:** Delete the real-time sync engine entirely.

**Does it still work?** Users can still create, edit, save, and share documents. They just can't see each other's cursors live.

**What's the minimal add-back?** A simple polling mechanism that refreshes the document every 5 seconds, plus a lock indicator showing "Alice is editing Section 3." That covers 80% of the collaboration need at 5% of the original cost.

**What we learned:** The team assumed real-time sync was the product. It wasn't. The product was collaborative editing — and most collaboration is asynchronous anyway.

## Watch Out For

- Don't confuse "expensive" with "valuable." Sometimes the expensive part IS the core differentiator. The move is to test that assumption, not to blindly cut
- This works best when the expensive part was added because "that's how everyone does it" rather than from first-principles reasoning
- If removing the part breaks the solution, resist the urge to put the whole thing back. The minimal add-back is the key insight
- Run this move early, before you've sunk cost into the expensive part. Sunk cost makes it psychologically harder to delete
