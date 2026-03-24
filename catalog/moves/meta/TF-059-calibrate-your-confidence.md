---
id: TF-059
name: Calibrate Your Confidence
one_liner: Rate your confidence 1-10, then try to write the failure list that would make it a 3.
mode: [evaluate, plan]
category: Meta
tags: [metacognition, calibration, overconfidence, risk, self-assessment]
effort: snap
origin: Metacognitive calibration (Nelson & Narens 1990) / Overconfidence research (Fischhoff, Slovic & Lichtenstein 1977)
problem_signatures:
  - "I'm pretty sure this will work, but I haven't really stress-tested that feeling"
  - "my gut says this is the right approach but I can't articulate why"
  - "we're about to commit significant resources based on a hunch"
  - "I've been wrong before on things I felt certain about"
  - "the team seems confident but nobody has named the risks"
pairs_with:
  - id: TF-032
    why: "pre-mortem gives structure to the failure scenarios your calibration check surfaces"
  - id: TF-019
    why: "map the assumptions to identify what your confidence is actually resting on"
  - id: TF-005
    why: "name your current strategy before calibrating confidence in it"
---

## The Move

Before committing to an approach, rate your confidence on a 1-10 scale that it will work. Write the number down. Now list everything that would have to go wrong for your confidence to drop to a 3. If that list is easy to write — if failure scenarios pour out — your real confidence is lower than you reported. You are experiencing the overconfidence bias: your felt certainty exceeds your evidenced certainty.

If you genuinely cannot imagine realistic failure paths, either you are right or you have a blind spot. Ask someone else to write the failure list.

## When to Use

- Before committing to an architecture, a plan, or a major design decision
- When the team is expressing high confidence without evidence
- When you catch yourself saying "I'm sure this will be fine"
- As a final gate before any decision that is expensive to reverse

## Diagram

```mermaid
flowchart TD
    A["Rate confidence 1-10"] --> B["Write the number down"]
    B --> C["List what would make it a 3"]
    C --> D{"Was the list easy to write?"}
    D -- Yes --> E["Your confidence is miscalibrated"]
    D -- No --> F{"Can you imagine ANY failure?"}
    F -- Yes --> G["Confidence is roughly accurate"]
    F -- No --> H["Possible blind spot: get a second opinion"]
    E --> I["Adjust plan: add safeguards or explore alternatives"]

    style E fill:#e74c3c,color:#fff
    style G fill:#2ecc71,color:#fff
    style H fill:#f39c12,color:#fff
```

## Example

**Situation:** You're about to migrate a monolith's authentication module to a new microservice. You rate your confidence at 8/10 — you've done service extractions before and this one feels clean.

**The calibration:** "What would make this a 3?"
- Session tokens are referenced by 14 other services in ways we haven't fully mapped
- The legacy auth module has undocumented side effects that populate a shared cache
- Our integration tests don't cover the SSO flow that 40% of enterprise customers use
- The database migration could lock the users table for minutes during peak hours

That list took 90 seconds to write. Four concrete, plausible failure paths. Your real confidence is closer to a 5. You haven't done the homework to justify an 8. The right move: investigate the session token dependencies and the shared cache before committing to the migration timeline.

## Watch Out For

- The goal is not to lower your confidence to zero — it's to match your confidence to your evidence. Sometimes an 8 really is an 8
- Don't confuse "I can imagine bad things" with "bad things are likely." The test is whether the failure scenarios are *plausible and specific*, not merely possible
- This move catches overconfidence, not underconfidence. If you chronically rate yourself low, the calibration check won't help — you need a different intervention
- Teams can perform this together: everyone writes a number privately, then reveals. Spread in the numbers is itself a signal
