---
id: TF-167
name: Build to Think
one_liner: "Stop analyzing. Build an artifact — not to ship, but to understand what you don't understand."
mode: [stuck, explore]
category: Unsticking
tags: [constructionism, Papert, Dewey, learning-by-doing, prototyping, understanding, artifact]
effort: quick
origin: Seymour Papert, constructionism / Dewey, learning by doing
problem_signatures:
  - "I've been reading docs and thinking for hours but I still don't get it"
  - "the architecture discussions keep going in circles without resolution"
  - "I can't tell if this approach will work without trying it"
  - "I understand the pieces but not how they fit together"
  - "we keep debating trade-offs in the abstract"
variables:
  word:
    type: pick
    count: 1
    pool: random-words
pairs_with:
  - id: TF-039
    why: "make it ugly first breaks perfectionism paralysis; build to think breaks analysis paralysis"
  - id: TF-064
    why: "geneplore cycle alternates between generating and exploring — build to think is one focused generate-then-learn pass"
  - id: TF-061
    why: "rate your understanding before and after building — the gap reveals what the artifact taught you"
---

## The Move

Choose the thing you understand LEAST about the problem. Build the smallest possible artifact that embodies that specific uncertainty — a script, a diagram, a state machine, a throwaway function, a spreadsheet model. Build it in under 30 minutes. The artifact is not a prototype for others; it is a thinking tool for you. When you finish, ask: "What did building this force me to decide that I was previously avoiding?" Write down those forced decisions. They are the real questions your analysis was circling. As a lateral prompt: if {{word.1}} were a building material, what would you construct to represent this problem?

## When to Use

- You've been analyzing or discussing for more than an hour without progress
- You understand individual components but not how they interact
- The team keeps debating trade-offs abstractly with no resolution
- You need to discover what you don't know, not confirm what you do know

## Diagram

```mermaid
flowchart TD
    A["Stuck in analysis"] --> B["Identify what you understand LEAST"]
    B --> C["Build smallest artifact embodying that uncertainty"]
    C --> D["30-minute time box"]
    D --> E["What decisions did building force?"]
    E --> F["List the forced decisions"]
    F --> G["Those are your real questions"]
    G --> H["Address them directly"]

    style B fill:#e74c3c,color:#fff
    style C fill:#3498db,color:#fff
    style F fill:#9b59b6,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Situation:** Your team is debating whether to use event sourcing or a traditional CRUD approach for an order management system. The debate has lasted three meetings. Everyone has opinions but nobody has certainty.

**What you understand least:** How event replay would actually work when an order has 15+ state transitions and some events need to be compensated.

**Build to think:** You write a 50-line Python script that models an order as a list of events: `OrderCreated`, `ItemAdded`, `ItemRemoved`, `PaymentReceived`, `Shipped`, `ReturnRequested`. You implement `replay(events)` to rebuild current state and `compensate(event)` to reverse an event.

**What building forced you to decide:**
1. Do compensating events delete the original, or append a negation? (You chose append — and realized this means your event store grows monotonically.)
2. What happens when you compensate `Shipped`? (You couldn't implement it — shipping is irreversible in the real world.)
3. How do you handle event ordering across services? (You hardcoded sequential IDs and realized you'd need distributed timestamps in production.)

**Result:** 30 minutes of building surfaced three concrete questions that three meetings of analysis had not. Question 2 alone ("some events are physically irreversible") killed the pure event-sourcing approach and led the team to a hybrid design.

## Watch Out For

- The artifact must be throwaway. If you start caring about code quality, variable names, or test coverage, you've shifted from thinking to building — and this move is about thinking through building
- 30 minutes is a hard cap. If the artifact isn't done, the INCOMPLETENESS is the lesson — it tells you the scope of what you don't understand
- This move assumes you've already spent time analyzing. If you haven't, building first is just hacking. The value is in the contrast between what you thought you understood and what building revealed
- Don't confuse this with prototyping. A prototype tests whether a solution works for users. Build-to-think tests whether YOU understand the problem
