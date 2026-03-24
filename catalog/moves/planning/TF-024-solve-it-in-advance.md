---
id: TF-024
name: Solve It in Advance
one_liner: Move complexity from runtime to build time by pre-computing, pre-positioning, or pre-validating.
mode: [plan]
category: Planning
tags: [front-loading, pre-computation, build-time, prevention, triz]
effort: snap
origin: TRIZ Principle 10 (Preliminary action) / Front-loading
problem_signatures:
  - "the runtime logic is getting really complicated"
  - "we keep handling edge cases as they come up"
  - "this would be easy if we had the data ready in advance"
  - "we're doing the same expensive work over and over"
  - "users hit this error and then we scramble to fix it"
pairs_with:
  - id: TF-032
    why: "run a Pre-Mortem to identify which runtime failures are worth front-loading before you invest in pre-computation"
  - id: TF-027
    why: "use Separate in Time to decide which phases (build, deploy, runtime) each piece of complexity belongs in"
  - id: TF-030
    why: "after moving logic upstream, audit the feedback loops to ensure staleness or cache invalidation won't create new problems"
---

## The Move

Take the problem you're solving and ask: when does this complexity actually need to be resolved? For each piece of logic, check whether it can be moved to an earlier phase — build time, deploy time, startup, configuration, or onboarding. For each runtime decision, ask: could this have been a build-time decision? For each runtime validation, ask: could this have been prevented at input time? For each runtime computation, ask: could this have been pre-computed and cached? Move as much as possible upstream. The earlier you resolve complexity, the simpler everything downstream becomes.

## When to Use

- Runtime logic is growing tangled with special cases and conditionals
- You're repeatedly computing the same thing on every request
- Errors keep slipping through to production that could have been caught at build or deploy time
- Your system handles complexity that users or operators could resolve upfront during configuration

## Diagram

```mermaid
flowchart LR
    A["Runtime problem"] --> B{"Can it be solved earlier?"}
    B -- "Build time" --> C["Pre-compute or code-generate"]
    B -- "Deploy time" --> D["Validate in CI or config checks"]
    B -- "Input time" --> E["Prevent at the boundary"]
    B -- "No" --> F["Solve at runtime"]
    C --> G["Simpler runtime"]
    D --> G
    E --> G

    style A fill:#3498db,color:#fff
    style B fill:#f39c12,color:#fff
    style G fill:#2ecc71,color:#fff
    style F fill:#e74c3c,color:#fff
```

## Example

**Problem:** "Our API gateway routes requests to different backend services based on URL patterns, user roles, feature flags, and A/B test groups. The routing logic has 200+ conditional branches and keeps breaking."

**Solve it in advance:**

- **URL patterns** don't change at runtime. Generate a compiled routing table at deploy time from a declarative config file. Zero runtime parsing.
- **User roles** are known at login. Compute the user's effective permissions once at authentication and stamp them into the session token. No per-request role lookups.
- **Feature flags** change infrequently. Evaluate them every 30 seconds and cache the result. Each request reads a flat lookup instead of evaluating flag rules.
- **A/B test groups** are assigned per user. Compute the assignment at signup and store it. No per-request randomization.

**Result:** The 200-branch runtime router becomes a flat table lookup. The complexity didn't disappear — it moved to build time, deploy time, and login time, where it's easier to test, debug, and reason about.

## Watch Out For

- Pre-computation assumes inputs are known in advance. If the inputs are truly dynamic and unpredictable, this move doesn't apply
- Moving complexity to build time means changes require a build/deploy cycle. Make sure that tradeoff is acceptable for your rate of change
- Don't over-cache. If the pre-computed result can go stale and staleness has consequences, you need an invalidation strategy — which is its own complexity
- This is not "premature optimization." It's about choosing the right phase for each decision. Only apply it to complexity you've already identified as painful
