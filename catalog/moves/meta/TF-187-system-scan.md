---
id: TF-187
name: System Scan
one_liner: Move attention through every component of your system. Notice without fixing.
mode: [plan, evaluate]
category: Meta
tags: [body-scan, mindfulness, systems-thinking, awareness, architecture, diagnosis]
effort: quick
origin: Body scan meditation / Vipassana awareness practice / Systems awareness
problem_signatures:
  - "I keep fixing the first thing I find and missing the bigger issue"
  - "I don't have a clear picture of the overall system health"
  - "problems keep popping up in unexpected places"
  - "I'm not sure where the real pain is in this codebase"
  - "I jump to solutions before understanding the full landscape"
pairs_with:
  - id: TF-020
    why: "Zoom In/Out changes magnification at a single point; System Scan maintains one magnification but covers every point"
  - id: TF-031
    why: "Find the Leverage Point identifies where to act; System Scan gives you the map that makes leverage points visible"
  - id: TF-005
    why: "Name Your Current Strategy checks your process; System Scan checks the state of the thing you're working on"
---

## The Move

Start at the entry point of your system — the user's first interaction, the API gateway, the main() function. Move your attention through each component in the order a request or action flows through the system. At each stop, answer three questions: (1) What is the current state here? (2) Is there tension — anything that feels fragile, slow, unclear, or over-complicated? (3) What am I assuming about this component that I haven't verified?

Do not fix anything. Do not open a ticket. Do not start refactoring. Complete the entire scan first. Write one line per component: name, state, tension (if any). The completed scan is a map of where attention is needed — and that map is more valuable than any single fix.

## When to Use

- Starting a new project or inheriting an unfamiliar codebase
- Before sprint planning or prioritization — see the full landscape first
- When bugs keep appearing in "surprising" places
- After a major change, to check for ripple effects
- When you feel like you're playing whack-a-mole with issues

## Diagram

```mermaid
flowchart LR
    A["Entry point"] --> B["Component 1\nState? Tension?"]
    B --> C["Component 2\nState? Tension?"]
    C --> D["Component 3\nState? Tension?"]
    D --> E["Component N\nState? Tension?"]
    E --> F["Complete scan map"]
    F --> G["Identify where tension clusters"]
    G --> H["Now choose where to act"]

    style A fill:#3498db,color:#fff
    style F fill:#f39c12,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Situation:** A team lead inherits a Node.js e-commerce platform after the previous lead left. Users report "it feels slow" but nobody knows where.

**The scan:**

| Component | State | Tension |
|-----------|-------|---------|
| Nginx reverse proxy | Running, default config | None apparent |
| Express API gateway | 47 routes, no rate limiting | Mild — no protection |
| Auth middleware | JWT validation on every request | Tension — verifying against DB on each call |
| Product service | 3 endpoints, well-tested | Clean |
| Cart service | 12 endpoints, 0 tests | High tension — untested, most complex |
| PostgreSQL | 230ms avg query time | Tension — no query optimization, missing indexes |
| Redis cache | Exists but hit rate is 12% | High tension — cache exists but barely works |
| Payment integration | Stripe, working | Clean |
| Email service | SES, 2% bounce rate | Mild tension |

**What the scan reveals:** The "slowness" isn't in one place. It's the combination of per-request DB auth checks, unoptimized Postgres queries, and a cache that isn't caching. No single component is "broken" — the tension is distributed. Without the full scan, the team would have optimized whichever component they looked at first.

## Watch Out For

- The hardest part is NOT FIXING things as you scan. Your instinct will be to stop and address the first issue. Resist. The full map changes what you'd prioritize
- Don't confuse "unfamiliar" with "tense." A component you don't understand isn't necessarily unhealthy — it might just need learning
- Keep the scan at a consistent level of depth. Don't spend 20 minutes on one component and 10 seconds on another
- This move produces a map, not a plan. You still need to prioritize after scanning. The scan just ensures you're prioritizing from full awareness, not partial
