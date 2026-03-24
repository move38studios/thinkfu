---
id: TF-149
name: Name Your Inference Type
one_liner: "Are you deducing, inducing, or abducing? Name it — the stuck feeling often means you're using the wrong one."
mode: [stuck, plan]
category: Meta
tags: [peirce, deduction, induction, abduction, inference, logic, metacognition, reasoning]
effort: snap
origin: Peirce — Deduction, Induction, Abduction trichotomy
variables:
  number:
    type: number
    min: 2
    max: 5
problem_signatures:
  - "my reasoning feels circular and I can't tell where the logic breaks"
  - "I'm confident in my conclusion but I got there by a process I can't name"
  - "I keep applying rules but they don't lead anywhere useful"
  - "I generalized from a few examples and I'm not sure the generalization holds"
  - "I have a result but I don't know what caused it"
pairs_with:
  - id: TF-005
    why: "name your strategy at the action level; name your inference type at the reasoning level"
  - id: TF-061
    why: "rate your understanding to calibrate how much weight your current inference deserves"
  - id: TF-078
    why: "generalize then specialize alternates between induction and deduction — this move makes that explicit"
---

## The Move

Three inference types, each with a different shape:

- **DEDUCTION** — rule + case → result. "All services behind this load balancer return 503 when the config is stale. This service is behind that load balancer. Therefore it will return 503." Certain, but only as good as your rule.
- **INDUCTION** — cases + results → rule. "These {{number}} services all returned 503 after a deploy. Services probably return 503 after deploys." Probable, but only as good as your sample.
- **ABDUCTION** — rule + result → case. "Services return 503 when the config is stale. This service is returning 503. Therefore the config is probably stale." Explanatory, but only as good as your candidate hypotheses.

Name which one you're doing **right now**. Write it down. Then ask: is this the right inference type for where you are? If you're deducing from rules that might be wrong, switch to abduction and generate alternative explanations. If you're inducing from {{number}} cases, ask whether your sample is representative. If you're abducing, ask whether you've considered enough candidate explanations.

## When to Use

- When your reasoning feels sound but leads nowhere productive
- When you're stuck in a loop and can't tell why
- When you want to check the *structure* of your reasoning, not just its content
- When debugging and your current approach isn't converging on the root cause

## Diagram

```mermaid
flowchart TD
    A["You're reasoning about something"] --> B{"What type of inference?"}
    B --> C["DEDUCTION: rule + case → result"]
    B --> D["INDUCTION: cases + results → rule"]
    B --> E["ABDUCTION: rule + result → case"]
    C --> F{"Is your rule actually true?"}
    F -- Uncertain --> G["Switch to ABDUCTION: generate alternative rules"]
    F -- Verified --> H["Deduction is appropriate — proceed"]
    D --> I{"Is your sample representative?"}
    I -- Small/biased --> J["Gather more cases or switch to ABDUCTION"]
    I -- Large/diverse --> K["Induction is appropriate — proceed"]
    E --> L{"Have you considered enough hypotheses?"}
    L -- No --> M["Generate more candidates before testing"]
    L -- Yes --> N["Test the best candidate — switch to DEDUCTION"]

    style B fill:#9b59b6,color:#fff
    style G fill:#e67e22,color:#fff
    style J fill:#e67e22,color:#fff
    style M fill:#e67e22,color:#fff
```

## Example

**Situation:** Production is down. A developer is debugging.

**Phase 1 — Stuck in deduction:** "Our runbook says 503 errors mean the database is down. We're getting 503 errors. Therefore the database is down." They check the database — it's healthy. They check again. Still healthy. They're stuck because they're deducing from a rule that's incomplete. The runbook doesn't cover all causes of 503s.

**Diagnosis:** They're deducing, but the rule is wrong. Switch to **abduction**.

**Phase 2 — Abduction:** "We're getting 503 errors. What could cause 503 errors?" They generate candidates: database down (already eliminated), config stale, upstream dependency failing, memory exhaustion, certificate expired. They check each. The certificate expired 20 minutes ago. Abduction found the cause that deduction from an incomplete rule could not.

**Phase 3 — Induction for prevention:** "This is the third certificate expiry incident in 6 months. Certificate expiries probably recur on a regular basis." Induction from 3 cases → new rule. They set up automated certificate rotation.

**Phase 4 — Deduction for verification:** "Automated rotation renews certificates 30 days before expiry. This certificate expires in 45 days. Therefore it will be renewed in 15 days." Deduction from the new rule confirms the fix.

Four phases, three inference types, each appropriate to its moment. The developer got stuck in Phase 1 because they were deducing from a bad rule instead of abducing from the symptoms.

## Watch Out For

- Most people default to deduction because it feels rigorous. But deduction from a wrong rule is worse than abduction from good observations. Name the type to catch this.
- Induction is dangerously seductive with small samples. "It worked on my machine" (n=1) is induction. "It worked in staging" (n=1, different environment) is induction from a non-representative sample. Name it.
- Abduction is the most creative inference type but also the most error-prone. It generates hypotheses, not truths. Always follow abduction with a test.
- In practice, good reasoning cycles through all three types: abduce to generate hypotheses, deduce predictions from each, induce patterns from the test results. The stuck feeling usually means you're stuck in one type when you need to switch.
