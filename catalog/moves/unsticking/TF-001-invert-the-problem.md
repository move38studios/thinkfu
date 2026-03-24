---
id: TF-001
name: Invert the Problem
one_liner: Instead of solving for success, work backwards from guaranteed failure.
mode: [stuck, evaluate]
category: Unsticking
tags: [reframing, failure-analysis, goals, constraint]
effort: snap
origin: TRIZ (Principle 13 — "The Other Way Round") / General
problem_signatures:
  - "I can list everything wrong but can't describe what good looks like"
  - "the goal is too vague to act on directly"
  - "I know what failure looks like better than success"
  - "I keep trying to define the ideal outcome and getting nowhere"
pairs_with:
  - id: TF-012
    why: "if the inverted failure list is also vague, reduce to the simplest case first"
  - id: TF-046
    why: "steel man the opposite extends inversion into structured adversarial evaluation"
  - id: TF-032
    why: "pre-mortem applies inversion specifically to project planning and risk"
---

## The Move

Instead of asking "How do I achieve X?", ask "How would I guarantee X fails?" List every way to make the outcome terrible. Then systematically avoid or reverse each failure cause.

This works because failure modes are concrete and specific, while success is often vague. Your brain (or model) can enumerate what's wrong more easily than what's right.

## When to Use

- You've been approaching a problem head-on and making no progress
- The goal feels too abstract to act on ("make it better", "improve the UX")
- You're in evaluate mode and want to stress-test a draft — invert to find its weaknesses

## Diagram

```mermaid
flowchart TD
    A["Goal: Achieve X"] --> B{"Can you define success clearly?"}
    B -- Yes --> C["Proceed directly"]
    B -- No --> D["Invert: How to guarantee failure?"]
    D --> E["List failure causes"]
    E --> F["Reverse each cause"]
    F --> G["Solution emerges from the negative space"]

    style D fill:#e74c3c,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Goal:** "Design a good onboarding flow."
**Inverted:** "How would I guarantee users abandon onboarding?"
- Require 12 form fields upfront
- Don't explain why each step matters
- No progress indicator
- Force account creation before showing any value

**Reversed:** Show value first. Minimal fields. Progress bar. Explain the "why" at each step. Defer account creation.

The inverted list practically writes the solution.

## Watch Out For

- Don't get so absorbed in failure scenarios that you forget to flip back to the constructive framing
- This move is *quick* — spend 2 minutes listing failures, not 20 minutes cataloging every edge case
- If the failure list is also vague, you may need a different move (try "Reduce to the Simplest Case")
