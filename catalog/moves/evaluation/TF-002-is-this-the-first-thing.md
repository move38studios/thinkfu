---
id: TF-002
name: Describe It Without the Obvious Words
one_liner: Redescribe your solution without using any key terms from the original problem.
mode: [evaluate]
category: Evaluation
tags: [cliche, originality, satisficing, einstellung, reframing, constraint]
effort: quick
origin: Constrained description technique / Einstellung effect (Luchins 1942)
problem_signatures:
  - "solution came quickly and easily"
  - "feels done but somehow unsatisfying"
  - "this is what anyone would do"
  - "haven't considered alternatives"
  - "went with the first workable approach"
variables:
  persona:
    type: pick
    count: 1
    pool: personas
---

## The Move

Write a one-paragraph description of your solution — but you are **not allowed to use any of the nouns or verbs from the original problem statement**. You must find completely different language.

If you can't do it, your solution is welded to the original framing. If you can, the new description will reveal what your solution *actually does* — stripped of the inherited vocabulary. You may discover it's just restating the problem, or you may see a genuinely different angle you'd missed.

Then: explain your solution as if you were {{persona.1}} describing it to a peer. What would they emphasize? What would they find irrelevant?

## When to Use

- You've finished a solution and it came together smoothly — suspiciously smoothly
- You're about to deliver and feel a vague unease you can't name
- The user asked for something creative and you produced something competent
- You want to check whether your solution is genuinely considered or just the default

## Diagram

```mermaid
flowchart TD
    A["Your draft solution"] --> B["List key nouns and verbs from the original problem"]
    B --> C["Redescribe your solution without those words"]
    C --> D{"Does the new description reveal anything different?"}
    D -- Yes --> E["You found a new angle — explore it"]
    D -- No --> F["Your solution is the problem restated — rethink it"]
    C --> G["Now explain it as {{persona.1}} would"]
    G --> H["What shifts?"]

    style C fill:#f39c12,color:#fff
    style E fill:#2ecc71,color:#fff
    style F fill:#e74c3c,color:#fff
```

## Example

**Task:** "Design a notification system for overdue tasks."
**Banned words:** notification, system, overdue, task

**Redescribed:** "A gentle, escalating series of nudges that reconnect a person with commitments they've drifted from, starting quiet and getting louder only if silence continues."

That redescription suggests a fundamentally different design than "show a red badge with a count." It implies escalation, tone, reconnection — none of which were in the original framing.

**As {{persona.1}}:** The shift in perspective may highlight who this serves, how urgency feels from outside your assumptions, or what "overdue" even means in a different context.

## Watch Out For

- The constraint is the mechanism — don't skip it and just "try to think differently." Actually ban the words. Write with the constraint active.
- The persona perspective isn't decoration. If {{persona.1}} wouldn't care about your solution, that's a signal.
- Sometimes the redescription confirms your solution is good. That's a valid outcome — now you know it with more confidence.
