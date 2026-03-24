---
id: TF-036
name: Temporal Shift
one_liner: "Look at your problem from **{{timeframe.1}}** and from **{{timeframe.2}}**. What changes?"
mode: [explore, evaluate]
category: Exploration
tags: [perspective, time, prioritization, strategy, zoom-out]
effort: quick
origin: Oblique Strategies / Temporal perspective research
problem_signatures:
  - "everything feels equally urgent and I can't prioritize"
  - "I'm optimizing for the short term but it feels wrong"
  - "will this matter in five years or just this week"
  - "I can't tell if this is strategic or just reactive"
variables:
  timeframe:
    type: pick
    count: 2
    pool: timeframes
pairs_with:
  - id: TF-027
    why: "follow-up to separate conflicting requirements into the time phases this move identified"
  - id: TF-035
    why: "complement: evaluate asymmetric bets once you know which timescale matters most"
  - id: TF-032
    why: "follow-up to run a pre-mortem on the priorities the temporal shift surfaced"
---

## The Move

Write down your problem in one sentence. Now evaluate it from two time horizons: **{{timeframe.1}}** and **{{timeframe.2}}**. For each, answer three questions: What matters most at this timescale? What's urgent now but irrelevant then? What seems optional now but becomes critical?

Compare your two lists. The items that appear important at both timescales are your real priorities. The items that only matter at one timescale reveal whether you're being reactive or strategic.

## When to Use

- You're drowning in urgent tasks and can't see the bigger picture
- A decision feels important but you can't articulate why
- You're debating short-term pragmatism vs. long-term investment
- Stakeholders disagree and they're actually arguing about different time horizons

## Diagram

```mermaid
flowchart TD
    A["Your problem"] --> B["View from {{timeframe.1}}"]
    A --> C["View from {{timeframe.2}}"]
    B --> D["What matters?"]
    B --> E["What's irrelevant?"]
    C --> F["What matters?"]
    C --> G["What's irrelevant?"]
    D --> H["Compare: find true priorities"]
    E --> H
    F --> H
    G --> H

    style A fill:#3498db,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Should we rewrite our monolith into microservices?"

**From {{timeframe.1}} (say, 10 seconds):** Irrelevant. What matters at this scale is response time, latency, whether the page loads. The monolith is fine if it's fast.

**From {{timeframe.2}} (say, 5 years):** The question isn't monolith vs. microservices — it's "can we still ship features independently as the team grows from 12 to 60?" The architecture needs to support team autonomy, not just technical elegance.

**Comparison:** The short timescale reveals the rewrite has no user-facing urgency. The long timescale reveals the real driver is team scaling, not technology. This reframes the decision: don't rewrite for microservices, restructure for team independence — which might or might not mean microservices.

## Watch Out For

- Don't let the long-term view paralyze short-term action. Both timescales are real; neither is more "correct"
- If both timeframes produce the same answer, you don't have a time-horizon problem — you have a commitment problem
- This move clarifies priorities, not solutions. Follow up with a planning move to act on what you find
- Be honest about which timeframe you're emotionally drawn to — that's usually the one you should question
