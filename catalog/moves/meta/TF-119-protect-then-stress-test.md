---
id: TF-119
name: Protect Then Stress-Test
one_liner: "Infant ideas need nurture; mature ideas need attack. Name the stage before choosing the force."
mode: [plan, evaluate]
category: Meta
tags: [idea-lifecycle, timing, criticism, nurture, metacognition]
effort: snap
origin: George Strakhov "108 Thoughts for Strategists" (#60) — Idea fragility and timing
problem_signatures:
  - "someone just killed a promising idea with premature criticism"
  - "we shipped something that should have been challenged harder"
  - "the brainstorm turned into a debate too early"
  - "good ideas keep dying in review"
  - "we're not sure if this idea needs more development or more scrutiny"
variables:
  stage:
    type: pick
    count: 1
    pool: timeframes
pairs_with:
  - id: TF-015
    why: "Red Team Your Solution is the stress-test side — use it only when the idea is mature enough to survive attack"
  - id: TF-063
    why: "Diverge Before You Converge establishes the same principle at the session level — protect divergence, then converge critically"
  - id: TF-046
    why: "Steel Man the Opposite is a mature-stage move — apply it when Protect Then Stress-Test says the idea is ready"
---

## The Move

Before evaluating any idea, ask one question first: "Is this idea still fragile, or is it load-bearing?" If fragile (just born, half-formed, has potential but no structure), protect it — develop it further, flesh it out, build on it, say "yes, and..." If load-bearing (fleshed out, about to be committed to, resources are about to be spent), attack it — red team it, find the flaws, steel man the opposite, ask what would have to be true. Write down which stage the idea is in before anyone evaluates it. The wrong force at the wrong time either kills good ideas (criticism too early) or ships bad ones (nurture too late). Think of it in terms of a timeline: where are you — closer to **{{stage.1}}** from now, or already at the decision point?

## When to Use

- Before any idea review meeting, to set the right mode
- When you notice a brainstorm turning adversarial too quickly
- When an idea has been nurtured for a long time and nobody has challenged it
- When you feel defensive about an idea and want to know if that's appropriate or a warning sign

## Diagram

```mermaid
flowchart TD
    A["Idea to evaluate"] --> B{"What stage\nis this idea?"}
    B -- Fragile/infant --> C["PROTECT mode"]
    B -- Mature/load-bearing --> D["STRESS-TEST mode"]
    C --> E["Develop, flesh out,\n'yes and...',\nbuild on strengths"]
    D --> F["Red team, find flaws,\nsteel man the opposite,\nchallenge assumptions"]
    E --> G{"Ready for\nstress-test now?"}
    G -- Not yet --> C
    G -- Yes --> D
    F --> H["Ship, pivot, or kill"]

    style B fill:#f39c12,color:#fff
    style C fill:#3498db,color:#fff
    style D fill:#e74c3c,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Situation:** An engineer proposes using event sourcing for the new order management system during a design review.

**Wrong approach:** Immediately red-teaming: "Event sourcing is complex, the team has no experience, the storage costs will be high, what about GDPR deletion requirements?" The idea dies in 3 minutes.

**Right approach using Protect Then Stress-Test:**

**Stage check:** The idea is 5 minutes old. It's fragile. Protect first.

**Protect phase (15 minutes):** "What problems would event sourcing solve that our current approach can't? What would the ideal version look like? What would we gain from a complete audit trail? How would replay capability change our debugging story?" The idea develops structure and clear benefits.

**Stage check again:** Now the idea has concrete benefits (audit trail, debugging via replay, temporal queries) and a rough architecture. It's no longer fragile. Switch to stress-test.

**Stress-test phase (15 minutes):** "What's the learning curve cost? How do we handle GDPR right-to-deletion? What's the storage projection at 10x current volume? Can we hire for this skill?" The idea is now challenged on its merits, not killed in its crib.

**Result:** The team adopts event sourcing for the audit-critical order state transitions but keeps CRUD for the rest. A nuanced outcome that neither pure protection nor pure attack would have produced.

## Watch Out For

- "Protect" does not mean "agree." It means "develop the idea to the point where criticism is meaningful." You can protect an idea you personally dislike
- Some people default to protect mode always (conflict-avoidant teams) and some to attack mode always (adversarial cultures). Know your team's bias and compensate
- Don't use "it's still fragile" as a shield forever. At some point, resources will be committed and the idea must face scrutiny. Set a deadline for the transition
- The stage is a property of the idea, not the person. Telling someone "your idea is fragile" can feel condescending — instead, say "let's develop this further before we challenge it"
