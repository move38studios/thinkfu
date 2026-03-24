---
id: TF-096
name: Five Whys
one_liner: Ask "why" five times. The first answer is a symptom. The fifth is the system.
mode: [stuck, evaluate]
category: Unsticking
tags: [root-cause, Toyota, Lean, diagnosis, depth, Toyoda]
effort: quick
origin: Toyota Production System / Sakichi Toyoda / Lean manufacturing
problem_signatures:
  - "we keep fixing this and it keeps coming back"
  - "I know WHAT the problem is but not WHY it happens"
  - "the obvious cause feels too shallow"
  - "we're treating symptoms instead of the disease"
  - "the same kind of bug keeps appearing in different places"
variables:
  depth:
    type: number
    min: 3
    max: 7
pairs_with:
  - id: TF-031
    why: "the fifth why often reveals the leverage point — the structural cause worth changing"
  - id: TF-030
    why: "root causes often sit inside feedback loops; map the loops the fifth why points to"
  - id: TF-026
    why: "find the bottleneck as a concrete form of the structural cause the five whys uncover"
---

## The Move

Ask 'why?' {{depth}} times. State the problem in one concrete sentence — not "things are slow" but "the checkout page takes 4 seconds to load." Ask "Why?" and write the answer. Ask "Why?" of that specific answer. Repeat until you've asked five times. Each "why" must target the previous answer specifically, not the original problem. Don't ask "why" in the abstract — ask "why did THAT happen?" If a "why" has multiple answers, pick the one that's most within your control and continue that branch. The first why gives a symptom. The second gives a proximate cause. By the fifth, you're usually at a structural or process-level root cause.

## When to Use

- A problem recurs despite being "fixed" multiple times
- You know the symptoms but haven't traced them to a root cause
- Post-incident, when you need to go deeper than "the server crashed"
- You're about to fix something and want to make sure you're fixing the right thing
- A bug feels like it shouldn't exist and you want to understand the system failure that allowed it

## Diagram

```mermaid
flowchart TD
    A["State the problem concretely"] --> B["Why? → Answer 1: symptom"]
    B --> C["Why? → Answer 2: proximate cause"]
    C --> D["Why? → Answer 3: contributing factor"]
    D --> E["Why? → Answer 4: process gap"]
    E --> F["Why? → Answer 5: root cause"]
    F --> G["Fix at the root level, not the symptom level"]

    style A fill:#3498db,color:#fff
    style B fill:#e67e22,color:#fff
    style F fill:#e74c3c,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Customers are seeing stale product prices on the storefront."

1. **Why are prices stale?** Because the cache is serving old data.
2. **Why is the cache serving old data?** Because cache invalidation isn't triggered when prices change in the admin panel.
3. **Why isn't invalidation triggered?** Because the price update goes through a bulk import endpoint that bypasses the normal update hooks.
4. **Why does the bulk import bypass the hooks?** Because it was written as a quick script during launch to handle a one-time data migration, and it was never refactored into the standard pipeline.
5. **Why was it never refactored?** Because there's no process for tracking temporary workarounds and retiring them. The team doesn't have a "tech debt register" and launch hacks become permanent by default.

**Root cause:** Not the cache. Not the endpoint. The root cause is that the team has no mechanism for tracking and retiring temporary workarounds. Fixing the cache invalidation for this endpoint solves today's bug. Creating a tech debt register and review process prevents the next ten bugs like it.

## Watch Out For

- The most common failure is asking "why" of the original problem each time instead of the previous answer. Each "why" must chain from the last answer specifically
- Five is a guideline, not a rule. Sometimes you hit root cause at three. Sometimes you need seven. Stop when you reach something structural that, if changed, would prevent the entire chain
- Don't let "why" become "whose fault." The goal is to find systemic causes, not to assign blame. If your fifth why is a person's name, you went wrong — ask why the system allowed that person to make that mistake
- When a "why" has multiple valid answers, you're at a branch point. You might need to follow multiple branches to find which root cause is most actionable
- This move finds ONE root cause along ONE causal chain. Complex problems often have multiple contributing chains. Consider running it multiple times from different starting points
