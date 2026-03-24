---
id: TF-162
name: Set Your Aspiration Level
one_liner: "Before searching for solutions, define 'good enough' for every criterion — then search until you hit all thresholds."
mode: [plan]
category: Planning
tags: [satisficing, bounded-rationality, Simon, decision-making, criteria, thresholds]
effort: snap
origin: Herbert Simon — Satisficing / Bounded rationality (1956)
problem_signatures:
  - "I keep evaluating options and none of them feel perfect"
  - "we've been comparing alternatives for days and can't pick one"
  - "I'm over-optimizing one dimension at the expense of shipping"
  - "I don't know when to stop looking for a better solution"
  - "the team can't agree because everyone has a different implicit quality bar"
pairs_with:
  - id: TF-049
    why: "name the tradeoff makes explicit what you're giving up; aspiration levels make explicit what you'll accept"
  - id: TF-142
    why: "decentration surfaces the dimensions you forgot; aspiration levels set thresholds on each one"
  - id: TF-034
    why: "what would have to be true asks about assumptions; aspiration levels ask about acceptance criteria"
---

## The Move

Before you search for solutions, write down every criterion that matters: speed, cost, quality, maintainability, time-to-ship, whatever applies. For EACH criterion, set an explicit aspiration level — the threshold below which you will not accept a solution and above which you will stop optimizing. Search until you find something that meets ALL thresholds. If nothing qualifies, lower the aspiration on the LEAST important criterion by one notch and search again. Stop the moment a candidate clears every bar.

## When to Use

- You've been comparing options for more than a day without converging
- The team argues in circles because everyone has a different implicit standard
- You catch yourself rejecting workable solutions because they aren't ideal on one dimension
- You need to decide quickly but don't want to settle blindly

## Diagram

```mermaid
flowchart TD
    A["List all criteria"] --> B["Set aspiration level for each"]
    B --> C["Search for a solution"]
    C --> D{"Meets ALL thresholds?"}
    D -- Yes --> E["Accept it. Stop searching."]
    D -- No --> F{"Any candidates left?"}
    F -- Yes --> C
    F -- No --> G["Lower the LEAST important threshold"]
    G --> C

    style B fill:#3498db,color:#fff
    style E fill:#2ecc71,color:#fff
    style G fill:#f39c12,color:#fff
```

## Example

**Situation:** You're choosing an authentication library for a new microservice. The team has spent three days reading comparison blog posts.

**Set aspiration levels:**
- **Security:** Must support OAuth 2.0 + PKCE. Non-negotiable.
- **Maintenance:** Must have a release in the last 6 months. Non-negotiable.
- **Integration effort:** Less than 2 days to integrate. Flexible.
- **Performance:** Token validation under 5ms p99. Flexible.

**Search:** Library A meets security and maintenance but integration estimate is 3 days. Library B meets all four. Accept Library B. Stop evaluating Libraries C through G.

**Without aspiration levels:** The team would have spent another two days benchmarking Library F's 2ms advantage on token validation — an optimization nobody asked for on a criterion already above threshold.

## Watch Out For

- Setting aspirations too high on every criterion recreates the perfectionism problem. At least one criterion should have a genuinely relaxed threshold
- Aspiration levels should be written down and shared with the team BEFORE the search begins. Setting them after seeing options invites anchoring bias — you'll unconsciously set thresholds to match the option you already prefer
- Simon's point is that satisficing is RATIONAL given bounded cognition and time. It's not laziness. Optimizing is only better when the cost of continued search is lower than the expected gain — and for most software decisions, it isn't
- Revisit aspirations if the problem changes. A threshold set on Monday may be wrong by Friday if requirements shifted
