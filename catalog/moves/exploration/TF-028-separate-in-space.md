---
id: TF-028
name: Separate in Space
one_liner: If two requirements conflict, put them in different places.
mode: [explore, stuck]
category: Exploration
tags: [separation, architecture, modularity, conflict-resolution, TRIZ, microservices]
effort: quick
origin: TRIZ Separation Principles / Microservices architecture
problem_signatures:
  - "every change to X breaks Y because they're in the same place"
  - "this component is trying to do two incompatible things at once"
  - "the conflict might dissolve if we put these in different locations"
  - "we need both behaviors but they can't coexist in one module"
pairs_with:
  - id: TF-027
    why: "alternative separation dimension when the conflict is temporal, not spatial"
  - id: TF-029
    why: "complement: change the scale to test whether the spatial separation holds at different sizes"
  - id: TF-049
    why: "follow-up to name the tradeoff that spatial separation introduces (coordination cost vs. conflict cost)"
---

## The Move

You have two requirements that conflict when they live in the same place. Ask: do they actually need to be in the same place? Identify the two conflicting needs, then list the places they could live separately — different modules, different services, different interfaces, different environments, different data stores. For each candidate separation, check whether splitting removes the conflict without creating a worse coordination problem. Pick the split where the boundary is cleanest.

## When to Use

- Two features or requirements keep interfering with each other in the same component
- You're oscillating between two designs and neither fully works
- A module has grown tangled because it serves two masters
- You're hitting a tradeoff that feels fundamental but might just be a colocation problem

## Diagram

```mermaid
flowchart TD
    A["Identify the two conflicting requirements"] --> B["Ask: must they be in the same place?"]
    B --> C{"Same place required?"}
    C -- Yes --> D["Conflict is real — resolve differently"]
    C -- No --> E["List candidate separations"]
    E --> F["Different modules"]
    E --> G["Different services"]
    E --> H["Different interfaces"]
    E --> I["Different environments"]
    F --> J["Pick the cleanest boundary"]
    G --> J
    H --> J
    I --> J

    style B fill:#9b59b6,color:#fff
    style C fill:#f39c12,color:#fff
    style J fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Our API needs to be both fast for real-time reads and support complex analytical queries. Every optimization for one makes the other worse."

**The conflict:** Read latency vs. query flexibility, living in the same database and the same service.

**Separate in space:** Split into two data stores — a fast key-value store (Redis or DynamoDB) for real-time reads, and a columnar database (ClickHouse or BigQuery) for analytics. An event stream keeps them in sync. The API splits into two services: one optimized for low-latency lookups, one for complex queries with higher latency tolerance.

**Result:** Each service optimizes freely for its own requirement. The conflict disappears because the requirements no longer share a home. This is the CQRS pattern — and it's a spatial separation.

## Watch Out For

- Separation creates a coordination problem. Two places that must stay consistent are harder to manage than one place with a tradeoff. Make sure the coordination cost is lower than the conflict cost
- Don't separate prematurely. If the conflict is mild and the system is small, living with the tension may be cheaper than managing two things
- Sometimes the requirements conflict in time, not space — one is needed now, the other later. That's a different separation (TF-029 territory). Make sure you're solving the right dimension
- The cleanest boundary is one where the two sides rarely need to talk. If they need constant synchronization, you haven't actually separated — you've just added a network call
