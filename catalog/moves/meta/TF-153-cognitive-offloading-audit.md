---
id: TF-153
name: Cognitive Offloading Audit
one_liner: "Map what's in your head, on paper, in the tool, held by others. Move the bottleneck out of your skull."
mode: [stuck, plan]
category: Meta
tags: [hutchins, distributed-cognition, offloading, externalization, working-memory, tools]
effort: quick
origin: Edwin Hutchins, "Cognition in the Wild" (1995) / Extended mind thesis (Clark & Chalmers 1998)
problem_signatures:
  - "I'm trying to hold too many things in my head at once"
  - "I keep forgetting a detail and having to re-derive it"
  - "the problem feels overwhelming but I can't say why"
  - "I'm the only person who understands how this all fits together"
  - "I feel like I'm juggling and about to drop something"
pairs_with:
  - id: TF-156
    why: "Load Triage classifies the type of load; Cognitive Offloading Audit moves extraneous load out of your head"
  - id: TF-155
    why: "Three Representations externalizes the problem in multiple formats, which is a form of offloading"
  - id: TF-157
    why: "Element Interactivity Check counts what you must hold simultaneously; this move decides where each element should live"
---

## The Move

Draw four columns: HEAD, PAPER, TOOL, OTHER PERSON. For your current problem, list every piece of information, decision, or constraint and place it in the column where it currently lives. Now look at the HEAD column. The longest column is your bottleneck. For each item in HEAD, ask: "Does this NEED to be in my head, or am I just keeping it there out of habit?" Move at least three items out of HEAD into one of the other columns — write it on a sticky note (PAPER), encode it in a test or config file (TOOL), or tell a teammate and make it their responsibility (OTHER PERSON). Hutchins showed that a ship's navigation team is smarter than any individual because the computation is distributed across people and instruments. Your "team" includes your notes, your IDE, and your colleagues.

## When to Use

- You feel overwhelmed and cannot explain why the problem is so hard
- You keep re-deriving the same facts because you forgot a detail
- You are the single point of failure for understanding a system
- You are about to context-switch and need to preserve your mental state

## Diagram

```mermaid
flowchart TD
    A["List everything in your current problem"] --> B["Classify: HEAD / PAPER / TOOL / OTHER PERSON"]
    B --> C{"Which column is longest?"}
    C -- HEAD --> D["That is your bottleneck"]
    D --> E["For each HEAD item: must it be there?"]
    E -- No --> F["Move to PAPER, TOOL, or OTHER PERSON"]
    E -- Yes --> G["Keep — this is irreducible mental work"]
    F --> H["HEAD column is now lighter — resume work"]
    C -- "Not HEAD" --> I["Your cognition is already well-distributed"]

    style C fill:#f39c12,color:#fff
    style D fill:#e74c3c,color:#fff
    style F fill:#3498db,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Situation:** You are debugging a distributed system issue where requests intermittently fail between Service A and Service B. You feel stuck and overwhelmed.

**The audit:**
| HEAD | PAPER | TOOL | OTHER PERSON |
|------|-------|------|--------------|
| Service A's retry logic (3 retries, exponential backoff) | | | |
| The fact that Service B recently changed its timeout from 30s to 10s | | | |
| Three different error messages you saw in the logs | | | |
| The network team's statement that latency is normal | | | |
| Your hypothesis that connection pooling is exhausted | | | |
| The deployment timeline of the last 4 releases | | | |

Everything is in HEAD. No wonder you are stuck.

**Offloading:**
- Move error messages to PAPER: write them on a sticky note so you stop re-checking the logs.
- Move deployment timeline to TOOL: write a script that pulls deploy timestamps and correlates them with error spikes.
- Move the timeout change to OTHER PERSON: ask the Service B team to confirm the change and its rationale.
- Move retry logic to TOOL: write it as a comment in your debugging doc so you stop recalculating backoff windows.

**Result:** HEAD now contains only your hypothesis and the network team's claim — the two things that actually require your judgment. Everything else is externalized. The problem went from overwhelming to tractable.

## Watch Out For

- Offloading is not the same as delegating. Putting something on paper still means you own it — you have just freed up working memory
- Some things genuinely must stay in your head: creative connections, judgment calls, the "feel" of a problem. Do not try to externalize everything
- If you offload to OTHER PERSON, make sure they know they are holding that piece. Implicit distribution is not distribution — it is dropping
- Revisit the audit if the problem changes shape. What you externalized may need to come back into HEAD, and what was in HEAD may become irrelevant
