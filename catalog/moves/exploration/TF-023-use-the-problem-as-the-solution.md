---
id: TF-023
name: Use the Problem as the Solution
one_liner: The obstacle causing your problem might itself be a resource — stop fighting it and start exploiting it.
mode: [explore, stuck]
category: Exploration
tags: [reframing, judo-strategy, triz, obstacle-as-resource, lateral-thinking]
effort: quick
origin: TRIZ Principle 22 (Blessing in disguise) / Judo strategy
problem_signatures:
  - "we keep fighting this obstacle and it keeps winning"
  - "what if the thing blocking us could actually be useful"
  - "users keep doing the 'wrong' thing no matter what we do"
  - "there's a force we can't control — maybe we should harness it instead"
  - "the harder we push against it, the worse it gets"
variables:
  word:
    type: pick
    count: 1
    pool: random-words
pairs_with:
  - id: TF-037
    why: "complement: honor the error treats accidents as signal, this treats obstacles as resources"
  - id: TF-047
    why: "follow-up to rewrite the constraints once you see the obstacle as usable material"
  - id: TF-001
    why: "alternative when the obstacle truly cannot be exploited and you need a clean inversion instead"
---

## The Move

Name the specific thing causing your problem. Write it down as a factual statement: "X is happening." Now reframe X as a resource by asking three questions. First: what information does X carry? (Every problem is also a signal.) Second: what energy or momentum does X have that you could redirect? Third: if you had deliberately designed X into your system, what would it be good for? What if the obstacle had the properties of {{word.1}}? Which properties make it useful? Pick the most promising reframe and design a solution that uses X as an input rather than treating it as an obstacle to eliminate.

## When to Use

- You've been fighting the same obstacle repeatedly and it keeps coming back
- An external force (user behavior, market condition, technical constraint) resists all your attempts to change it
- Your problem has built-in energy or volume that you're currently wasting by suppressing it
- You're stuck because every solution requires eliminating something you can't actually eliminate

## Diagram

```mermaid
flowchart TD
    A["Name the obstacle: X is happening"] --> B["What information does X carry?"]
    A --> C["What energy does X have?"]
    A --> D["If X were deliberate, what would it be for?"]
    B --> E["Pick the strongest reframe"]
    C --> E
    D --> E
    E --> F["Design a solution that uses X as input"]
    F --> G["Problem becomes fuel"]

    style A fill:#e74c3c,color:#fff
    style E fill:#f39c12,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Users keep entering their data in the wrong format. We've added validation, tooltips, examples, and they still get it wrong 30% of the time."

**The obstacle:** Users enter data in the wrong format.

**Question 1 — What information does this carry?** The "wrong" formats show us what users actually think the data looks like. They're revealing their mental model.

**Question 2 — What energy does this have?** 30% of all submissions. That's a massive volume of signal we're currently throwing away with error messages.

**Question 3 — If this were deliberate, what would it be for?** It would be a free, continuous usability study showing us how users naturally express this data.

**The judo move:** Stop validating and rejecting. Instead, accept every format users enter and build a parser that handles the top 10 "wrong" formats. Log the ones you can't parse to discover new formats to support. The error rate drops to near zero — not because users changed, but because the system learned to meet them where they are.

**What shifted:** The team stopped seeing user input as a problem to correct and started seeing it as a spec for what the system should accept.

## Watch Out For

- Not every problem is a hidden resource. Sometimes a crash is just a crash and you need to fix the bug. Apply this move when you're fighting a recurring, structural obstacle — not one-off failures
- The reframe has to produce a concrete design change, not just a philosophical shift. "Embrace the chaos" is not a solution. "Route the chaos into a logging pipeline that feeds a classifier" is
- This move can take time to land. The three questions often produce nothing on the first pass. Sit with them. The best reframes tend to arrive after you've explored several bad ones
- Be honest about whether you're using the problem or just rationalizing inaction. The test: does your new design actively exploit the obstacle, or does it just tolerate it?
