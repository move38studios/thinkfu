---
id: TF-005
name: Name Your Current Strategy
one_liner: If you can't name what you're doing, you're on autopilot.
mode: [plan, explore, stuck, evaluate]
category: Meta
tags: [metacognition, awareness, autopilot, reflection, self-monitoring]
effort: snap
origin: Metacognitive regulation (Schraw & Dennison 1994) / Reflective practice (Schon 1983)
problem_signatures:
  - "been working for a while without stepping back"
  - "can't articulate current approach when asked"
  - "making decisions by feel"
  - "not sure why I chose this direction"
  - "on autopilot"
  - "working hard but unsure if it's the right work"
variables:
  word_limit:
    type: number
    min: 2
    max: 7
pairs_with:
  - id: TF-013
    why: "backtrack to the fork if naming your strategy reveals you drifted from a better path"
  - id: TF-020
    why: "zoom in/out to check if your named strategy is operating at the right level"
  - id: TF-049
    why: "name the tradeoff your current strategy is implicitly making"
---

## The Move

Stop. Name it in exactly {{word_limit}} words. Name the strategy you are currently using to solve this problem.

Not what you're *doing* ("writing code", "researching options") — what you're *strategically doing* ("narrowing the solution space by testing edge cases first", "building a minimal prototype to validate the core assumption", "pattern-matching against similar problems I've seen before").

If you can't name it, you don't have a strategy. You're executing on momentum. That's sometimes fine — but you should be choosing it, not defaulting to it.

## When to Use

- At any point during work — this move is a universal interrupt
- When you realize you've been "heads down" for a while without checking direction
- When someone asks "why are you doing it that way?" and you don't have a crisp answer
- As a periodic check-in: every 15 minutes of focused work, or at natural breakpoints

## Diagram

```mermaid
flowchart TD
    A["Pause work"] --> B["Name your current strategy in one sentence"]
    B --> C{"Can you name it?"}
    C -- Yes --> D{"Is it the right strategy?"}
    C -- No --> E["You are on autopilot"]
    D -- Yes --> F["Continue with confidence"]
    D -- No --> G["Change strategy now"]
    E --> H["Define a strategy, draw a ThinkFu move, or backtrack"]

    style C fill:#f39c12,color:#fff
    style E fill:#e74c3c,color:#fff
    style F fill:#2ecc71,color:#fff
    style G fill:#e67e22,color:#fff
```

## Example

**Situation:** You're 30 minutes into refactoring a module. You've renamed some variables, extracted a helper function, and are now considering splitting a class.

**The check:** "What's my strategy here?"

- **Can't name it?** You started with a small rename and scope-crept into a full refactor. You're on autopilot. Stop and decide: is a full refactor what you actually want to do right now?
- **"I'm improving readability by reducing cognitive load in the hot path."** Good — that's a real strategy. Now ask: is this the right strategy given the time you have?
- **"I'm refactoring because the code is messy."** That's a *motivation*, not a strategy. What specifically are you trying to achieve and how will you know you're done?

## Watch Out For

- Naming your strategy doesn't mean it's the right one — it just means you're conscious of it. Follow up with "is this the right strategy?" not just "do I have one?"
- This move can feel trivially simple. That's the point. The value isn't in the complexity of the technique — it's in the interrupt itself. Most bad decisions happen on autopilot
- Don't over-formalize. The answer can be casual ("I'm basically just trying things until something works") — the value is in *noticing*, not in having a grand plan
