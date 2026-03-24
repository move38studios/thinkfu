---
id: TF-033
name: Work Backwards from the Output
one_liner: Start from the exact deliverable, then trace backwards to discover what you actually need to build.
mode: [plan]
category: Planning
tags: [backward-chaining, output-first, requirements, scope, working-backwards]
effort: snap
origin: Backward chaining / Working backwards (Polya)
problem_signatures:
  - "I'm not sure where to start"
  - "the task is big and I keep building pieces without a clear target"
  - "I built a bunch of infrastructure and still don't have the thing I need"
  - "the requirements feel vague and I'm guessing at what to build"
  - "I keep gold-plating components that might not matter"
variables:
  genre:
    type: pick
    count: 1
    pool: genres
pairs_with:
  - id: TF-043
    why: "once you have the backward chain, prototype the riskiest step first to validate the whole plan"
  - id: TF-022
    why: "after mapping the steps, remove the most expensive part to see if a simpler chain still produces the output"
  - id: TF-012
    why: "if the backward chain is still complex, reduce to the simplest case to find the minimal viable path"
---

## The Move

Describe the final output as if it were {{genre.1}} — then trace backwards. Write down the *exact* final output. Not a description of it — the actual thing. If it's an API response, write the JSON. If it's a report, sketch the page with real numbers. If it's a CLI tool, write the terminal session showing the command and its output. Now look at that output and ask: what is the last transformation that produces this? Write that down. Then ask: what does *that* step need as input? Keep going until you reach things you already have. The chain from existing inputs to final output is your plan.

## When to Use

- At the start of a project when requirements feel abstract or sprawling
- When you notice yourself building "supporting infrastructure" before the actual deliverable
- When you've been working for a while and lost track of what the end product looks like
- When multiple people are working on a task and need a shared, concrete definition of done

## Diagram

```mermaid
flowchart RL
    A["Final output: the exact deliverable"] --> B["Last step: what produces this?"]
    B --> C["Step before: what does that need?"]
    C --> D["Step before that"]
    D --> E["Step before that"]
    E --> F["Things you already have"]

    style A fill:#2ecc71,color:#fff
    style B fill:#f39c12,color:#fff
    style F fill:#3498db,color:#fff
```

## Example

**Task:** "Build a dashboard showing team velocity."

**Step 1 — Write the exact output:**
A web page with a line chart. X-axis: last 8 sprints. Y-axis: story points completed. One line per team. A table below with columns: Team, Avg Velocity, Trend (up/down/flat), Sprint Commitment vs Actual.

**Work backwards:**

- **To render that page:** Need a React component that takes an array of `{ team, sprint, pointsCompleted, pointsCommitted }` objects.
- **To get that data array:** Need an API endpoint `GET /api/velocity?teams=A,B&sprints=8` that returns that shape.
- **To serve that endpoint:** Need a query that joins the sprints table with the tickets table, grouped by team and sprint, summing points where status = done.
- **To run that query:** Need the database to have a `sprints` table and a `tickets` table with a `sprint_id` foreign key and a `points` column.
- **Do we have those tables?** Yes — they already exist in the project tracker database.

**The plan, forward:** Write the SQL query. Wrap it in an API endpoint. Build the chart component. Done. Three concrete steps, no ambiguity about scope.

**What we avoided building:** A generic "metrics framework," a configurable dashboard system, a data pipeline, an abstraction layer over the project tracker. All things that feel productive but aren't required by the actual output.

## Watch Out For

- Be ruthlessly concrete when writing the output. "A dashboard" is not an output. A screenshot sketch with specific charts, labels, and data is an output
- If you can't write the exact output, that's the real problem — you don't yet know what you're building. Fix that first
- This move optimizes for building *only what's needed*. That's usually good, but sometimes you genuinely need to build for extensibility. Decide consciously, not by default
- The backward chain often reveals that you need less than you thought. Resist the urge to add steps back in "just in case"
