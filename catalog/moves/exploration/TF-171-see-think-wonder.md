---
id: TF-171
name: See, Think, Wonder
one_liner: "Observe without interpreting. Interpret without concluding. Question without answering. In that order."
mode: [plan, explore]
category: Exploration
tags: [Project-Zero, thinking-routines, observation, interpretation, inquiry, Harvard, separation]
effort: quick
origin: Project Zero (Harvard) — Thinking Routines Toolbox
problem_signatures:
  - "I jumped to a conclusion and now I'm not sure it's right"
  - "the team made assumptions before fully understanding the situation"
  - "I'm interpreting data before I've finished looking at it"
  - "everyone has an opinion but nobody has observed carefully"
  - "we're arguing about solutions before agreeing on what we're looking at"
pairs_with:
  - id: TF-165
    why: "sit with the felt difficulty is Dewey's version of the same impulse — observe before solving"
  - id: TF-094
    why: "spot the anomaly during the See phase — anomalies are observations that don't fit your mental model"
  - id: TF-080
    why: "make the invisible visible to expand what you can See before you Think or Wonder"
---

## The Move

Three phases, done strictly in order with no bleeding between them. **SEE (3 minutes):** Write down only what you observe. Facts. No interpretation. "The response time graph shows a spike at 2:14 PM." NOT "The server was overloaded at 2:14 PM." **THINK (3 minutes):** Now interpret. What do your observations suggest? "The spike coincides with the daily cron job. It might be resource contention." **WONDER (3 minutes):** What questions do your interpretations raise? "Does the cron job run on the same host? What happens if we move it to off-peak hours? Are there other daily patterns we haven't noticed?" Do not answer the Wonder questions yet. Collect them.

## When to Use

- You're about to diagnose a production incident and need to avoid premature conclusions
- You're reviewing unfamiliar code and want to understand before judging
- The team is arguing about interpretations of the same data
- You're starting a new project and need to survey the landscape before committing to a direction

## Diagram

```mermaid
flowchart LR
    A["Raw input: code, data, logs, design"] --> B["SEE: What do I observe? Facts only."]
    B --> C["THINK: What do I think about what I observed?"]
    C --> D["WONDER: What questions does this raise?"]
    D --> E["Collect questions — do NOT answer yet"]

    style B fill:#3498db,color:#fff
    style C fill:#f39c12,color:#fff
    style D fill:#9b59b6,color:#fff
    style E fill:#2ecc71,color:#fff
```

## Example

**Situation:** You inherit a microservice from a team that left the company. No documentation. You need to understand it before making changes.

**SEE (facts only):**
- The service has 47 API endpoints
- 31 of those endpoints have no test coverage
- The database has 12 tables; 4 of them have no foreign key constraints
- The Dockerfile pins to a base image from 2023
- There are 6 environment variables referencing services that no longer exist in the infrastructure registry
- The deploy pipeline has been green for 11 months (no deploys in 11 months)

**THINK (interpretation):**
- 31 untested endpoints suggest the original team stopped writing tests at some point — perhaps after a deadline push
- The 4 unconstrained tables may be append-only event logs (common pattern for tables without FK constraints)
- 6 dead service references mean this service has orphaned integrations that probably fail silently
- No deploys in 11 months means it's either rock-solid or abandoned

**WONDER (questions):**
- Which of the 31 untested endpoints are actually called in production? (Some might be dead code)
- Are the 4 unconstrained tables actually event logs, or just poorly modeled?
- Do the 6 dead service references cause silent failures or are they behind feature flags?
- Why did deploys stop? Fear? Stability? Team departure?

**Result:** Without See/Think/Wonder, you would have likely jumped from "47 endpoints, no tests" straight to "this is a mess, let's rewrite it." The structured observation reveals that the service might be mostly dead code with a small, stable core — a very different conclusion.

## Watch Out For

- The hardest discipline is keeping See free of interpretation. "The code is messy" is a Think, not a See. "The average function is 200 lines with 4 levels of nesting" is a See. Practice the distinction
- Think is not a license to speculate wildly. Each Think should connect to a specific See. "The spike coincides with the cron job" connects to an observation. "The system was probably hacked" does not
- Wonder is the most valuable phase and the one most people rush through. The quality of your questions determines the quality of your next steps. Spend the full 3 minutes
- This move is especially powerful in group settings where people have different observations. Have each person do See independently, then share before moving to Think
