---
id: TF-037
name: Honor Thy Error as a Hidden Intention
one_liner: Before fixing the mistake, ask what it's trying to tell you.
mode: [explore, stuck]
category: Exploration
tags: [error, serendipity, reframing, creativity, accidents]
effort: snap
origin: Oblique Strategies (Eno & Schmidt 1975)
problem_signatures:
  - "that wasn't supposed to happen but it's weirdly interesting"
  - "I made a mistake and my instinct is to undo it — but should I?"
  - "the prototype does the wrong thing but users actually like it"
  - "this bug produced a surprisingly useful side effect"
variables:
  koan:
    type: pick
    count: 1
    pool: koans
pairs_with:
  - id: TF-023
    why: "complement: use the problem as the solution takes the same judo logic to structural obstacles"
  - id: TF-019
    why: "follow-up to map the assumptions the error just contradicted"
  - id: TF-043
    why: "follow-up to prototype the risky new direction the error revealed before committing"
---

## The Move

You got an unintended result — a bug, a wrong output, a mistake. Before analyzing the error, hold this: **{{koan.1}}** Before you hit undo: stop. Describe exactly what happened, not what was supposed to happen. Now ask three questions: (1) What is this result actually good at? (2) What problem would this be the right answer to? (3) What assumption of mine does this error contradict?

Write down the answers. If any of them point somewhere interesting, follow that thread before reverting to the original plan.

## When to Use

- You produced an output that's "wrong" but strangely compelling
- A bug created behavior that users actually prefer
- Your prototype went sideways and you're about to throw it away
- You're stuck and the only new information you have is an error

## Diagram

```mermaid
flowchart TD
    A["Unintended result"] --> B{"Pause before fixing"}
    B --> C["What is it good at?"]
    B --> D["What problem does it solve?"]
    B --> E["What assumption does it break?"]
    C --> F{"Interesting signal?"}
    D --> F
    E --> F
    F -- Yes --> G["Follow the new thread"]
    F -- No --> H["Fix and move on"]

    style B fill:#e67e22,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Situation:** A team building a music recommendation engine accidentally swapped the similarity metric — instead of recommending songs similar to what users listened to, it recommended songs similar to what users *skipped*. The recommendations were "wrong" by every metric.

**Honoring the error:** They noticed users were discovering more new artists through the broken recommendations. The "correct" algorithm was a filter bubble; the "broken" one was an exploration engine.

**Outcome:** They didn't ship the bug, but they extracted the insight: users need a mix of familiar and unfamiliar. They added an "adventure mode" toggle that deliberately loosened the similarity threshold — a feature that came directly from observing the error.

## Watch Out For

- Not every error is a hidden gem. Spend 2 minutes examining it; if there's no signal, fix it and move on
- This is not an excuse to avoid debugging. You're looking for insight, not rationalizing sloppiness
- The error is useful as *data*, not as a *solution*. Extract the insight, then decide deliberately whether to act on it
- If you find yourself "honoring" every error, you're procrastinating, not exploring
