---
id: TF-003
name: Three Framings
one_liner: Write three different problem statements before solving any of them.
mode: [plan]
category: Planning
tags: [framing, problem-definition, assumptions, divergent-thinking]
effort: quick
origin: Design Thinking / Reframing literature
problem_signatures:
  - "about to start a complex task"
  - "problem statement feels given and fixed"
  - "jumping straight to solution mode"
  - "only see one way to interpret the brief"
  - "treating the problem as already defined"
pairs_with:
  - id: TF-019
    why: "after generating three framings, map the assumptions behind each to decide which framing fits best"
  - id: TF-001
    why: "if three framings still feel too similar, invert the problem to force a radically different perspective"
  - id: TF-034
    why: "use What Would Have to Be True to stress-test each framing before committing to one"
---

## The Move

Before solving anything, write three genuinely different versions of the problem statement. Not three wordings of the same problem — three different *framings* that would lead to different solutions.

The way you frame a problem determines the solution space you search. Most of the time, you inherit one framing (from the user, the ticket, the brief) and never question it. But the framing is a choice, and it's often the most consequential choice in the entire process.

## When to Use

- At the very start of a task, before any solution work
- When you receive a brief or spec and your mind immediately jumps to an approach
- When the problem feels obvious — that's often a sign you've accepted a framing uncritically

## Diagram

```mermaid
flowchart TD
    A["Received brief"] --> B["Framing 1: Usability problem"]
    A --> C["Framing 2: Trust problem"]
    A --> D["Framing 3: Value problem"]
    B --> E["Each framing leads to a different solution"]
    C --> E
    D --> E
    E --> F{"Which framing fits the evidence?"}
    F --> G["Now solve the right problem"]

    style A fill:#3498db,color:#fff
    style F fill:#f39c12,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Brief:** "Our API is too slow."

**Framing 1 — Performance problem:** The code is inefficient. Profile, find bottlenecks, optimize hot paths.

**Framing 2 — Architecture problem:** The system isn't designed for this load pattern. No amount of optimization fixes a fundamentally wrong architecture.

**Framing 3 — Expectations problem:** The API is fine; the caller's expectations are wrong. Maybe the real fix is making the operation async, adding a progress indicator, or caching results client-side.

Each framing leads you to a different part of the codebase, a different set of tools, and a different definition of "done."

## Watch Out For

- The three framings should be *genuinely different*, not surface rewording. "Users find checkout confusing" and "The checkout UX is bad" are the same framing
- You don't need to solve all three — the goal is to *choose* a framing deliberately rather than inheriting one by default
- Sometimes the first framing is correct. That's fine. But you should be able to articulate *why* it's correct and what you'd do differently under the other framings
