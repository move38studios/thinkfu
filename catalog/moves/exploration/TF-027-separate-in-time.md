---
id: TF-027
name: Separate in Time
one_liner: Two conflicting requirements don't have to coexist — split them into different phases.
mode: [explore, stuck]
category: Exploration
tags: [separation-principles, triz, phasing, conflict-resolution, scheduling]
effort: quick
origin: TRIZ Separation Principles
problem_signatures:
  - "two requirements contradict each other but don't need to happen simultaneously"
  - "this needs to be fast AND thorough — maybe at different stages"
  - "what if we did X first and Y later instead of both at once"
  - "the conflict might dissolve if we split it into phases"
variables:
  timeframe:
    type: pick
    count: 2
    pool: timeframes
pairs_with:
  - id: TF-028
    why: "alternative separation dimension when both requirements must hold at every moment"
  - id: TF-021
    why: "follow-up to merge the contradictions that remain after temporal separation"
  - id: TF-036
    why: "complement: temporal shift clarifies which time horizons matter before you split phases"
---

## The Move

State the contradiction explicitly: "We need the system to be A, but we also need it to be B, and A conflicts with B." Now ask: do A and B actually need to be true at the same moment? Identify distinct time phases in your system — setup vs. runtime, ingestion vs. query, pre-launch vs. post-launch, peak hours vs. off-peak, write path vs. read path. Phase 1 happens at {{timeframe.1}}, phase 2 at {{timeframe.2}}. Assign each conflicting requirement to the phase where it matters most. Design a transition mechanism between phases. The conflict dissolves because A and B never coexist.

## When to Use

- Two requirements seem logically contradictory and every design tries to compromise between them
- You need a system to have two incompatible properties (fast and thorough, flexible and stable, open and secure)
- You're stuck because optimizing for one goal degrades the other
- The problem has natural phases or modes that you haven't yet exploited

## Diagram

```mermaid
flowchart TD
    A["Contradiction: need both A and B"] --> B{"Must A and B be simultaneous?"}
    B -- "Yes" --> C["Try a different separation: space, scale, or condition"]
    B -- "No" --> D["Identify time phases"]
    D --> E["Phase 1: optimize for A"]
    D --> F["Phase 2: optimize for B"]
    E --> G["Transition mechanism"]
    F --> G
    G --> H["Contradiction resolved"]

    style A fill:#e74c3c,color:#fff
    style B fill:#f39c12,color:#fff
    style H fill:#2ecc71,color:#fff
    style D fill:#9b59b6,color:#fff
```

## Example

**Problem:** "Our search index needs to be always-available for queries (fast reads, no downtime) AND periodically rebuilt from scratch to incorporate new ranking algorithms (slow, resource-intensive, causes inconsistency during rebuild)."

**The contradiction:** Available and consistent vs. rebuildable and improvable.

**Do they need to be simultaneous?** No. Users need fast queries during business hours. Rebuilds can happen on a different schedule.

**Separate in time:**
- **Phase 1 (serving):** A read-only, optimized index serves all queries. No writes, no rebuilds. Maximum speed and availability.
- **Phase 2 (building):** A background process builds a completely new index from scratch using the latest algorithm. Takes as long as it needs. No user impact.
- **Transition:** When the new index is ready, swap it in atomically. The old index stays available until the swap completes. If the new index has issues, swap back.

**Result:** This is exactly how Elasticsearch rolling restarts and Solr's core swaps work. The pattern appears everywhere: blue-green deployments, double-buffering in graphics, database read replicas. The same insight — separate the conflicting needs into different time phases.

## Watch Out For

- The transition between phases is where bugs live. Design the handoff carefully — what happens to in-flight work when you switch phases?
- Not all contradictions are temporal. If both requirements genuinely must hold at every moment, you need a different separation (in space, by condition, or by scale). Don't force a temporal split where it doesn't fit
- Phasing adds operational complexity. You now have two modes to test, monitor, and debug instead of one. Make sure the contradiction is real before adding this machinery
- Check whether the phases can drift. If Phase 1 gets longer and Phase 2 gets squeezed, the separation breaks down
