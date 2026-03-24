---
id: TF-070
name: Trim the System
one_liner: For each component, ask — can another existing component absorb its function? If yes, delete it.
mode: [plan, evaluate]
category: Planning
tags: [triz, trimming, simplification, architecture, elimination]
effort: quick
origin: TRIZ Trimming
problem_signatures:
  - "the system has too many moving parts"
  - "every component depends on two others and nothing feels removable"
  - "we keep adding services but never retiring them"
  - "the architecture diagram needs a legend"
  - "onboarding new developers takes weeks because of all the pieces"
pairs_with:
  - id: TF-022
    why: "Remove the Most Expensive Part targets the costliest piece; Trimming systematically checks ALL pieces for absorption"
  - id: TF-069
    why: "the Ideal Final Result tells you what the system should look like with zero waste — Trimming gets you there component by component"
  - id: TF-046
    why: "use Stress Test to verify the trimmed system still handles edge cases the removed components were covering"
---

## The Move

Draw a table with three columns: Component, Function, and Can Another Component Do This? List every component in your system — every service, module, library, middleware, queue, and config file. For each one, write its primary function in plain language. Then ask: could an existing, remaining component absorb this function, either as-is or with a small modification? If the answer is yes, mark it for trimming. Remove the trimmed components and reassign their functions. Repeat until no more trimming is possible. The result is the simplest system that preserves all necessary functions.

## When to Use

- After a system has grown organically and you suspect redundancy
- Before a major refactor, to identify what can be merged or deleted
- When onboarding complexity is a problem — simpler systems are easier to learn
- When you want to reduce operational burden without losing capability

## Diagram

```mermaid
flowchart TD
    A["List every component"] --> B["For each: what function does it perform?"]
    B --> C{"Can another component absorb this function?"}
    C -- Yes --> D["Mark for trimming"]
    C -- No --> E["Keep it"]
    D --> F["Remove component, reassign function"]
    F --> G{"Any more trimmable?"}
    G -- Yes --> C
    G -- No --> H["Minimal system, same capability"]

    style D fill:#e74c3c,color:#fff
    style G fill:#f39c12,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Our data pipeline has eight services and is hard to maintain."

**Component table:**

| Component | Function | Can another absorb it? |
|---|---|---|
| Ingestion API | Receives data from sources | No — entry point |
| Validation Service | Checks data format | Yes — Ingestion API can validate on receipt |
| Deduplication Service | Removes duplicate records | Yes — the database can handle with UPSERT |
| Transformation Service | Maps fields to internal schema | No — core logic |
| Enrichment Service | Adds metadata from external APIs | Yes — Transformation Service can call enrichment as a step |
| Message Queue | Buffers between services | Partially — fewer services means less need for buffering |
| Storage Writer | Writes to the database | Yes — Transformation Service can write directly |
| Monitoring Sidecar | Tracks pipeline health | No — cross-cutting concern |

**After trimming:** Eight services become four. Ingestion API absorbs validation. Transformation Service absorbs enrichment and writes directly to storage. The database handles deduplication via UPSERT. The message queue is simplified to buffer only between ingestion and transformation.

**What we learned:** Five of the eight services existed because someone decided each "step" needed its own service. Trimming revealed that only two services had genuinely distinct responsibilities.

## Watch Out For

- Trimming is not the same as cramming. If absorbing a function makes the host component unreasonably complex, that's a sign the function needs its own home
- Trim functions, not capabilities. The system should do everything it did before, just with fewer parts
- Check for hidden coupling — sometimes a component exists to provide isolation between two others, and removing it creates a dependency you didn't want
- Do this on paper first. Don't start deleting services in production as a discovery exercise
