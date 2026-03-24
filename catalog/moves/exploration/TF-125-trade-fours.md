---
id: TF-125
name: Trade Fours
one_liner: "Hand your problem to {{persona.1}}, then {{persona.2}}, then back to you — each builds on the last."
mode: [explore]
category: Exploration
tags: [perspective-shifting, collaboration, jazz, improvisation, iteration, personas]
effort: quick
origin: Jazz — "Trading fours" (musicians alternate 4-bar solos)
problem_signatures:
  - "my approach is coherent but one-dimensional"
  - "I keep optimizing for the same variable and ignoring others"
  - "the solution feels like it was designed by one person (because it was)"
  - "I need multiple perspectives but don't have multiple people"
  - "brainstorming with the team just produces groupthink"
variables:
  persona:
    type: pick
    count: 2
    pool: personas
pairs_with:
  - id: TF-004
    why: "Import from Another Domain brings in cross-field patterns; Trade Fours brings in cross-role perspectives on the same field"
  - id: TF-006
    why: "What Would a Beginner Do is a single-perspective version; Trade Fours chains multiple perspectives"
  - id: TF-102
    why: "Yes-And keeps each round additive; combine with Trade Fours so each persona builds rather than replaces"
---

## The Move

State your current approach in 2-3 sentences. Now hand it to **{{persona.1}}**: what would they change, add, or emphasize? Write their modification in 2-3 sentences — this is their "four bars." Do not evaluate yet. Now hand the modified version to **{{persona.2}}**: what do they change, add, or emphasize? Write their modification. Finally, take it back yourself: given what both perspectives added, what is your final version? The constraint is critical: each round must BUILD on the previous one, not start over. Short turns prevent any single perspective from dominating.

## When to Use

- You are working solo and need to simulate diverse viewpoints
- The solution optimizes for one stakeholder at the expense of others
- You want structured perspective-shifting, not open-ended brainstorming
- The design feels technically sound but one-dimensional

## Diagram

```mermaid
flowchart TD
    A["Your approach (2-3 sentences)"] --> B["{{persona.1}} takes 4 bars"]
    B --> C["Modified approach"]
    C --> D["{{persona.2}} takes 4 bars"]
    D --> E["Further modified approach"]
    E --> F["You take it back"]
    F --> G["Final version: multi-perspective synthesis"]

    style A fill:#3498db,color:#fff
    style B fill:#e67e22,color:#fff
    style D fill:#9b59b6,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Design an alerting system for a microservices platform."

**Your approach:** "Send PagerDuty alerts when error rates exceed 2x baseline for 5 minutes. Group related alerts by service. On-call engineer triages."

**{{persona.1}} (a UX designer) takes four bars:** "Show the on-call engineer a visual diff of what changed in the last hour alongside the alert — deployment, config change, traffic spike. Don't just say 'errors are up,' show WHY they might be up. Reduce cognitive load at 3am."

**{{persona.2}} (a CFO) takes four bars:** "Add cost-awareness to the alert. If the error rate is up but it's only affecting 0.1% of traffic on a non-revenue endpoint, maybe it's a P2, not a page. Tie alert severity to business impact, not just technical thresholds."

**You take it back:** "The alerting system sends pages based on business-impact thresholds (not just error rates), includes a visual context panel showing recent changes and traffic patterns, and auto-classifies severity by revenue impact. The technical alert becomes a decision-support screen."

**Result:** Three rounds turned a standard alerting setup into a context-rich, business-aware incident response tool. The UX perspective added context; the finance perspective added prioritization.

## Watch Out For

- Each persona must BUILD on what came before, not discard it. If {{persona.2}} ignores {{persona.1}}'s contribution, the chain breaks
- Choose personas that are genuinely different from your own perspective. Two technical personas trading fours just produces more of the same
- Keep each round to 2-3 sentences. The constraint forces prioritization — each persona can only change the most important thing
- This is a generation move. The final synthesis may still need evaluation — Trade Fours produces a richer draft, not a finished design
