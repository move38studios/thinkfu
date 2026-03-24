---
id: TF-072
name: Increase Dynamism
one_liner: Find what's rigid in your system and make it flexible, adjustable, or adaptive.
mode: [explore]
category: Exploration
tags: [triz, dynamization, flexibility, adaptability, evolution]
effort: quick
origin: TRIZ Principle 15 (Dynamization) / Lines of Evolution
variables:
  constraint:
    type: pick
    count: 1
    pool: constraints
problem_signatures:
  - "the system works but can't adapt to new requirements"
  - "every change requires a code deploy"
  - "we hard-coded something that turned out to vary"
  - "this was designed for one scenario and now we have five"
  - "the configuration is baked in and we keep getting requests to change it"
pairs_with:
  - id: TF-009
    why: "after identifying rigid parts, use Analogy Mining to find how other systems made similar things dynamic"
  - id: TF-069
    why: "the Ideal Final Result often implies a fully dynamic system — Increase Dynamism moves you toward it incrementally"
  - id: TF-040
    why: "use What Varies and What's Fixed to systematically identify which rigid parts are worth making dynamic"
---

## The Move

List every fixed, hard-coded, or static element in your system: constants, configurations, algorithms, structures, interfaces, and workflows. For each one, ask: does this NEED to be fixed, or did we just make it fixed because it was easier? Rate each element on the dynamism scale: (1) Fixed — cannot change. (2) Configurable — can change at deploy time. (3) Adjustable — can change at runtime. (4) Adaptive — changes automatically based on context. Pick the element where the gap between current and needed dynamism is largest and most painful. Move it one step up the scale. As a provocation, also consider: what if {{constraint.1}} were applied — which rigid parts would HAVE to become dynamic?

## When to Use

- When requirements keep changing and the system can't keep up without code changes
- When you hard-coded a value early and it's now causing pain
- When different users or environments need different behavior from the same system
- When the system was designed for one context and is being forced into others

## Diagram

```mermaid
flowchart TD
    A["List all fixed/static elements"] --> B["For each: does it NEED to be fixed?"]
    B -- No --> C["Rate on dynamism scale"]
    B -- Yes --> D["Leave it fixed"]
    C --> E["Fixed → Configurable"]
    C --> F["Configurable → Adjustable"]
    C --> G["Adjustable → Adaptive"]
    E --> H["Move it one step up"]
    F --> H
    G --> H
    H --> I["System gains flexibility where it matters"]

    style C fill:#f39c12,color:#fff
    style H fill:#3498db,color:#fff
    style I fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Our rate limiter is set to 100 requests per minute for all users, and both power users and free-tier users are complaining."

**Static elements identified:**
1. Rate limit: fixed at 100 req/min (hard-coded constant)
2. Time window: fixed at 1 minute (hard-coded)
3. Response when limited: fixed 429 error (hard-coded)
4. Limit scope: fixed per-user (hard-coded)

**Dynamism assessment:**

| Element | Current | Needed | Gap |
|---|---|---|---|
| Rate limit value | Fixed (100) | Adjustable per tier | 2 steps |
| Time window | Fixed (1 min) | Configurable | 1 step |
| Throttle response | Fixed (429) | Adaptive (queue vs reject) | 3 steps |
| Limit scope | Fixed (per-user) | Configurable (per-user, per-endpoint, per-org) | 1 step |

**Biggest gap:** The throttle response. Instead of always returning 429, make it adaptive: for burst traffic, queue requests and process them slightly delayed. For sustained overuse, return 429 with a Retry-After header. For abusive patterns, escalate to a temporary block. The system responds differently based on the pattern it observes.

**Result:** Moving from "fixed reject" to "adaptive response" eliminated 70% of rate-limit complaints. Power users experiencing brief spikes get queued, not rejected. Abusive bots get blocked faster than before.

## Watch Out For

- Not everything should be dynamic. Every degree of dynamism adds complexity. Only dynamize what's causing real pain
- "Make it configurable" is the most common first step, but it can lead to config sprawl. Sometimes adaptive (automatic) is better than adjustable (manual)
- Increased dynamism means increased testing surface. A fixed system has one behavior to test; an adaptive one has many
- Don't confuse dynamism with indirection. Adding a config file that nobody ever changes isn't dynamism — it's complexity disguised as flexibility
