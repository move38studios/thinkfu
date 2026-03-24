---
id: TF-006
name: What Would a Beginner Do?
one_liner: Drop your expertise and ask what {{persona.1}} would try first.
mode: [plan]
category: Planning
tags: [beginner-mind, shoshin, assumptions, fresh-eyes, simplicity]
effort: snap
origin: Design Thinking / Shoshin (beginner's mind)
problem_signatures:
  - "I've been working in this codebase so long I can't see it fresh"
  - "the solution feels like it has to be complicated"
  - "I keep reaching for the same patterns I always use"
  - "my first instinct is to build a framework"
  - "I'm over-engineering this but can't stop"
variables:
  persona:
    type: pick
    count: 1
    pool: personas
pairs_with:
  - id: TF-012
    why: "after the beginner lens reveals assumptions, reduce to the simplest case to validate the naive approach"
  - id: TF-022
    why: "complement the beginner mindset by explicitly removing the most expensive part of your expert solution"
  - id: TF-039
    why: "if perfectionism is the real blocker, make it ugly first to bypass the urge to over-engineer"
---

## The Move

Imagine {{persona.1}} encountered this problem for the first time. Write down, concretely, what they would try. Not what they *should* try, but what they *would* try: the naive, obvious, possibly embarrassing approach. Then ask: why won't that work? Write down the specific reasons. Each reason is an assumption worth examining — some of them are load-bearing, and some are not.

## When to Use

- When you've been deep in a domain and your solutions keep getting more elaborate
- When the simplest approach feels "too simple" but you can't articulate why
- When you notice yourself reaching for abstractions before you've solved the concrete case
- When a junior team member's suggestion gets dismissed and you want to pressure-test why

## Diagram

```mermaid
flowchart TD
    A["Complex problem in front of you"] --> B["Pause: what would a beginner try?"]
    B --> C["Write the naive approach"]
    C --> D{"List why it won't work"}
    D --> E["Reason 1: real constraint"]
    D --> F["Reason 2: assumed constraint"]
    D --> G["Reason 3: assumed constraint"]
    F --> H["Remove assumption, keep naive approach"]
    G --> H
    E --> I["Address only the real constraint"]
    H --> I
    I --> J["Simpler solution than you expected"]

    style A fill:#3498db,color:#fff
    style D fill:#f39c12,color:#fff
    style J fill:#2ecc71,color:#fff
```

## Example

**Task:** Build a feature flag system for a growing microservices platform.

**Expert instinct:** Distributed configuration store, real-time propagation via event bus, percentage-based rollouts, user segmentation, audit logging, admin UI.

**Beginner approach:** A JSON file with flag names and true/false values. Each service reads it on startup.

**Why won't that work?**
1. "Flags need to update without redeployment" — Real constraint. But: read the file every 30 seconds instead of only at startup. Still simple.
2. "We need percentage rollouts" — Do we? Right now we have 12 flags and they're all on or off. This is a future need, not a current one.
3. "A JSON file isn't scalable" — We have 4 services. A JSON file is fine for 4 services.
4. "We need an admin UI" — The team is 6 engineers. They can edit JSON.

The beginner's approach, plus a periodic reload, solves the actual problem today. The expert's approach solves problems that don't exist yet.

## Watch Out For

- This is not anti-expertise. The goal is to separate genuine constraints from habitual complexity. Sometimes the expert approach is correct — but you should be able to list the specific reasons why the naive approach fails
- Don't strawman the beginner. Write down what a *reasonable* newcomer would try, not the worst possible approach
- If you can't articulate concrete reasons why the simple approach fails, that's a strong signal it might actually work
