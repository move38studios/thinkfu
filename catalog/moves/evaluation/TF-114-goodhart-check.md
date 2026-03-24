---
id: TF-114
name: Goodhart Check
one_liner: For every metric you track, ask what happens when someone optimizes only for that number.
mode: [evaluate]
category: Evaluation
tags: [metrics, incentives, goodhart, gaming, measurement]
effort: snap
origin: Goodhart's Law / George Strakhov "108 Thoughts for Strategists" (#34)
problem_signatures:
  - "we're about to pick KPIs for a new feature"
  - "the metric is going up but the product feels worse"
  - "teams are gaming the numbers"
  - "the dashboard is green but users are unhappy"
  - "we need to choose what to measure"
variables:
  persona:
    type: pick
    count: 1
    pool: personas
pairs_with:
  - id: TF-032
    why: "Pre-mortem imagines project failure — Goodhart Check imagines metric corruption, a specific failure mode"
  - id: TF-049
    why: "Name the Tradeoff surfaces the tensions between competing metrics that Goodhart Check exposes"
  - id: TF-098
    why: "Error-Proof by Design applies to metrics — design measurements that are hard to game"
---

## The Move

List every metric or KPI your solution tracks. If {{persona.1}} were gaming this metric, what would they do? For each one, complete the sentence: "If someone optimized ONLY for this number, ignoring everything else, they would..." If the resulting behavior is perverse, the metric is gameable and will eventually be gamed. Either replace it with a metric that is harder to corrupt, or pair it with a counter-metric that creates productive tension (e.g., speed paired with error rate).

## When to Use

- You are defining success metrics for a feature or project
- A metric is improving but the user experience is degrading
- You suspect a team is optimizing for the scorecard, not the outcome
- You are designing incentive structures, OKRs, or automated alerts

## Diagram

```mermaid
flowchart TD
    A["List all metrics"] --> B["For each metric:\nIf someone optimized\nONLY for this..."]
    B --> C{"Perverse behavior\nresults?"}
    C -- No --> D["Metric is robust\n(for now)"]
    C -- Yes --> E{"Can you replace it?"}
    E -- Yes --> F["Find a harder-to-game\nmetric"]
    E -- No --> G["Add a counter-metric\nthat creates tension"]

    style A fill:#3498db,color:#fff
    style C fill:#f39c12,color:#fff
    style F fill:#2ecc71,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Situation:** A platform team picks three metrics for their new developer portal.

| Metric | "If someone optimized only for this..." | Verdict |
|---|---|---|
| Number of API docs pages | They'd split every page into tiny fragments to inflate count | Gameable |
| Time-to-first-API-call for new devs | They'd auto-generate a trivial "hello world" call and count it | Gameable |
| Support tickets filed per 100 new developers | They'd make filing tickets harder, not docs better | Perverse |

**After Goodhart Check:**
- Replace page count with "% of endpoints with complete, tested examples"
- Replace time-to-first-call with "% of devs who make a second call within 24 hours" (shows real engagement, not synthetic)
- Replace ticket count with "% of devs who self-served to resolution" (measured via docs search-to-success funnel)

Each new metric is harder to game because it measures the outcome, not the proxy.

## Watch Out For

- Every metric is gameable at some level. The goal is not perfection but raising the cost of gaming above the benefit
- Counter-metrics can create paralysis if they're perfectly opposed. Ensure there exists a real behavior that improves both
- Don't add so many metrics that nobody can optimize for anything. Three to five metrics with natural tension is the sweet spot
- This check should be repeated periodically. Gaming behaviors evolve as people learn the system
