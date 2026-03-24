---
id: TF-113
name: Near Miss Detector
one_liner: Your failed approaches cluster near the right answer. Find the smallest flip that turns wrong into right.
mode: [explore, evaluate]
category: Exploration
tags: [failure-analysis, inversion, iteration, solution-space, near-miss]
effort: quick
origin: George Strakhov "108 Thoughts for Strategists" (#9) — Non-uniform solution space
problem_signatures:
  - "we've tried several approaches and none quite worked"
  - "the solution feels close but something is off"
  - "we have a graveyard of failed prototypes"
  - "each attempt fails for a different reason"
  - "the rejected ideas had something good buried in them"
pairs_with:
  - id: TF-037
    why: "Honor Thy Error treats failures as creative prompts — Near Miss Detector systematically mines them"
  - id: TF-050
    why: "Second Right Answer helps you see that the near miss might be an answer to a different question"
  - id: TF-001
    why: "Invert the Problem can reveal why each near miss failed, pointing to the flip needed"
---

## The Move

List every approach you have tried that did not work. For each one, write down specifically why it failed — not vaguely ("it didn't work") but precisely ("it solved the read path but doubled write latency"). Now, for each failed approach, ask: "What is the smallest single change — one inversion, one removal, one reframing — that would fix the specific reason it failed?" The solution space is not uniform. Wrong answers and right answers cluster together; the distance between a near miss and a breakthrough is often one variable.

## When to Use

- You have tried multiple approaches and none succeeded
- You are about to discard a pile of "failed" work and start over
- A prototype almost works but has one critical flaw
- You sense the answer is nearby but cannot find it

## Diagram

```mermaid
flowchart TD
    A["List failed approaches"] --> B["For each: why exactly\ndid it fail?"]
    B --> C["Approach 1: failed because X"]
    B --> D["Approach 2: failed because Y"]
    B --> E["Approach 3: failed because Z"]
    C --> F["Smallest change to fix X?"]
    D --> G["Smallest change to fix Y?"]
    E --> H["Smallest change to fix Z?"]
    F --> I["Candidate solutions"]
    G --> I
    H --> I
    I --> J{"Any of these viable?"}
    J -- Yes --> K["Iterate on the\nnear miss"]
    J -- No --> L["Combine fixes\nacross approaches"]

    style A fill:#3498db,color:#fff
    style J fill:#f39c12,color:#fff
    style K fill:#2ecc71,color:#fff
```

## Example

**Problem:** "We need a notification system that's real-time but doesn't overwhelm users."

**Failed approaches:**
1. **WebSocket push for everything** — Failed because users got 50+ notifications per hour during active periods. Why: no aggregation.
2. **Digest email every hour** — Failed because critical notifications (deploy failures) arrived too late. Why: no priority differentiation.
3. **User-configurable rules** — Failed because nobody configured them; defaults were either too noisy or too quiet. Why: required user effort.

**Smallest flips:**
1. WebSocket push + aggregate by source, batch non-critical into 5-minute windows. One change: add time-windowed batching.
2. Digest email + instant push for P0 events only. One change: add a priority tier.
3. Configurable rules + smart defaults that learn from dismissal patterns. One change: make the defaults adaptive, not static.

**Result:** Approach 1's flip (time-windowed batching with instant P0 bypass) combines the strengths of all three. The answer was one variable away from the first attempt.

## Watch Out For

- Be specific about why something failed. "It didn't work" is not actionable. "It violated our latency budget by 3x on writes" is
- Don't force a near miss to work if the failure is fundamental, not incidental. Some approaches are wrong in kind, not just in degree
- This move assumes you have actually tried things. If you're still in planning mode, you don't have near misses yet — use a different move
- Watch for sunk cost bias. Just because you've invested in an approach doesn't mean it's the nearest miss
