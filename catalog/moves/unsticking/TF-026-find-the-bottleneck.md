---
id: TF-026
name: Find the Bottleneck
one_liner: Your system moves at the speed of its slowest constraint — find it, because everything else is distraction.
mode: [stuck, evaluate]
category: Unsticking
tags: [constraints, bottleneck, theory-of-constraints, prioritization, leverage]
effort: quick
origin: Theory of Constraints (Goldratt, "The Goal")
problem_signatures:
  - "the system is slow or stuck and I don't know where the constraint is"
  - "I improved one part but overall throughput didn't change"
  - "work keeps piling up at the same stage"
  - "the team is busy everywhere but delivery is flat"
  - "I need to find the single point that's holding everything back"
variables:
  persona:
    type: pick
    count: 1
    pool: personas
pairs_with:
  - id: TF-031
    why: "find the leverage point generalizes bottleneck thinking beyond throughput to any system"
  - id: TF-022
    why: "remove the most expensive part to eliminate the bottleneck rather than optimize it"
  - id: TF-012
    why: "reduce to simplest case if you can't tell which stage is the bottleneck"
---

## The Move

{{persona.1}} watches your process end to end — where do they see the queue forming? Map the flow of work through your system from start to finish — every stage, handoff, and queue. For each stage, estimate throughput (how much can it process per unit of time) and observe where work piles up waiting. The stage with the lowest throughput or the longest queue in front of it is your bottleneck. Now apply the rule: any improvement not at the bottleneck is an illusion. Ignore everything else. Focus all effort on increasing the capacity of that one stage. Once it's no longer the bottleneck, find the new one and repeat.

## When to Use

- You're improving parts of a system but overall performance isn't changing
- The team is busy across the board but delivery is slow
- You need to decide where to invest limited improvement effort
- You're evaluating a system and want to find the highest-leverage intervention point

## Diagram

```mermaid
flowchart LR
    A["Stage 1: 100/hr"] --> B["Stage 2: 100/hr"]
    B --> C["Stage 3: 20/hr"]
    C --> D["Stage 4: 100/hr"]
    D --> E["Output: 20/hr"]
    F["Work piles up here"] --> C

    style C fill:#e74c3c,color:#fff
    style F fill:#f39c12,color:#fff
    style E fill:#3498db,color:#fff
    style A fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Our feature delivery is too slow. Engineering says they need more developers. Design says they need more designers. PM says they need better requirements."

**Map the flow:**

1. **Requirements** — PM writes specs. Throughput: 5 features/week. Queue: 0 (specs available on demand).
2. **Design** — Designers create mocks. Throughput: 4 features/week. Queue: 1-2 features waiting.
3. **Engineering** — Developers build features. Throughput: 6 features/week. Queue: 0 (waiting for designs).
4. **QA** — Testers verify features. Throughput: 2 features/week. Queue: 4+ features waiting.
5. **Deploy** — Ops ships to production. Throughput: 10 features/week. Queue: 0.

**The bottleneck is QA.** Output is capped at 2 features/week no matter how fast any other stage works. Hiring more developers (Stage 3 is already at 6/week) would just make the QA queue longer.

**Fix the bottleneck:** Automate the most repetitive QA checks. Have developers write acceptance tests. Move some validation into CI. QA throughput rises to 5/week.

**New bottleneck:** Now Design at 4/week is the constraint. Repeat the process.

## Watch Out For

- People will resist the idea that their hard work on non-bottleneck stages doesn't help overall throughput. It's true anyway. Improving a non-bottleneck just builds up inventory before the bottleneck
- The bottleneck isn't always obvious. Sometimes it's a hidden dependency: a shared resource, an approval process, a single person who reviews everything
- Don't just add capacity to the bottleneck — first ask whether the work going through it is all necessary. Reducing demand on the bottleneck is often faster than increasing its capacity
- Bottlenecks shift. Once you fix one, another stage becomes the constraint. This is normal and expected — it means you're making progress
