---
id: TF-115
name: Frame the Frame
one_liner: Before arguing within a frame, choose the frame itself. The framer wins before the conversation starts.
mode: [plan, evaluate]
category: Meta
tags: [framing, metacognition, persuasion, strategy, perspective]
effort: quick
origin: George Strakhov "108 Thoughts for Strategists" (#44, #75) — Framing conversations
problem_signatures:
  - "the debate is stuck because both sides are arguing past each other"
  - "the discussion feels predetermined by how the question was asked"
  - "someone else set the terms and we are reacting"
  - "we keep arguing about solutions but disagree on what the problem is"
  - "the framing of the question has already eliminated the best answers"
pairs_with:
  - id: TF-003
    why: "Three Framings generates alternative frames — Frame the Frame is the meta-move of choosing which frame to operate in"
  - id: TF-005
    why: "Name Your Current Strategy surfaces the implicit frame you're already operating under"
  - id: TF-047
    why: "Rewrite the Constraints challenges the frame's boundaries once you've made the frame explicit"
---

## The Move

Before you present an argument, proposal, or solution, stop. Write down the frame you are currently operating in — what coordinates, time horizon, stakeholders, and definition of success are assumed. Then write two alternative frames: a different time horizon, a different stakeholder's perspective, a different definition of success. For each frame, note what solutions become obvious and what solutions become invisible. Choose the frame deliberately, then proceed.

The person who sets the frame controls the conversation before a word is spoken. If you let someone else frame it, you are playing their game.

## When to Use

- You are preparing a proposal or presentation and want to control the narrative
- A discussion is stuck and participants are arguing past each other
- You realize the question itself is biased toward a particular answer
- Two teams disagree and the disagreement seems emotional but is actually about framing

## Diagram

```mermaid
flowchart TD
    A["About to argue,\npropose, or decide"] --> B["Name the current frame:\nhorizon, stakeholder,\ndefinition of success"]
    B --> C["Frame A\n(current)"]
    B --> D["Frame B\n(different horizon)"]
    B --> E["Frame C\n(different stakeholder)"]
    C --> F["What's obvious? What's invisible?"]
    D --> F
    E --> F
    F --> G{"Choose the frame\nthat serves the\nactual goal"}
    G --> H["Argue within\nthe chosen frame"]

    style A fill:#3498db,color:#fff
    style G fill:#f39c12,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Situation:** The team is debating whether to rewrite the payment service in a new language.

**Frame A (Engineering efficiency):** "Will this make the codebase easier to maintain?" This frame makes the rewrite look appealing — cleaner code, better tooling, modern patterns.

**Frame B (Business risk):** "What is the probability-weighted cost of a payments outage during migration?" This frame makes the rewrite look terrifying — payments is the highest-risk surface area.

**Frame C (Talent):** "Can we hire for the current stack in 2 years?" This frame makes the rewrite look inevitable — the talent pool for the current language is shrinking.

**Observation:** The team was stuck because half were using Frame A and half Frame B. Nobody had named Frame C, which actually resolves the debate: the rewrite is necessary (Frame C) but should be phased to manage risk (Frame B). Frame A was the least useful frame — it was the most comfortable but the least strategic.

**Decision:** Adopt Frame C as the primary lens, constrained by Frame B. Plan a phased migration, not a big-bang rewrite.

## Watch Out For

- This can become manipulative. The goal is to choose the most truthful and useful frame, not the one that just wins the argument
- Naming someone else's frame out loud can feel confrontational. Do it with curiosity ("I think we're framing this as X — what if we framed it as Y?"), not accusation
- Every frame excludes something. When you choose a frame, be explicit about what you are choosing not to see
- Don't spend so long framing that you never get to the substance. Two minutes of frame-setting saves twenty minutes of argument, but twenty minutes of frame-setting is procrastination
