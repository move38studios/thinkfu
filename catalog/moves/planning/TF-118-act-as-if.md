---
id: TF-118
name: Act As If
one_liner: "Pretend you have the skill, budget, or authority you lack. The plan you make while pretending is often executable."
mode: [plan, stuck]
category: Planning
tags: [confidence, constraints, presupposition, planning, courage]
effort: snap
origin: George Strakhov "108 Thoughts for Strategists" (#87) — Presupposing capability
problem_signatures:
  - "we can't do that because we don't have the expertise"
  - "that's above my pay grade"
  - "if only we had more resources this would be straightforward"
  - "I'm not qualified to propose this"
  - "we're blocked waiting for permission or capability we don't have"
variables:
  constraint:
    type: pick
    count: 1
    pool: constraints
pairs_with:
  - id: TF-047
    why: "Rewrite the Constraints formally challenges the boundaries — Act As If informally ignores them to see what emerges"
  - id: TF-017
    why: "10x Not 10% asks 'what if the goal were radically bigger?' — Act As If asks 'what if the barrier didn't exist?'"
  - id: TF-039
    why: "Make It Ugly First removes quality pressure — Act As If removes capability pressure, similar liberation technique"
---

## The Move

Name the barrier that is stopping you: lack of expertise, budget, authority, team size, time, or something else. Now ignore it entirely. Assume you have whatever you lack. Write the plan you would execute if that barrier did not exist. Do not hedge, qualify, or scale down. Once the plan is written, examine it: which parts actually require the missing resource, and which parts were self-censored? You will often find that 60-80% of the "as if" plan is executable right now. The barrier was psychological, not structural. Ship the parts you can; negotiate for the parts you cannot. Also try: **what if {{constraint.1}} were removed?**

## When to Use

- You are self-censoring because you feel unqualified
- A constraint feels absolute but you have never tested it
- The team is in "learned helplessness" mode, assuming nothing can change
- You need to generate an ambitious plan before negotiating it down to reality

## Diagram

```mermaid
flowchart TD
    A["Name the barrier"] --> B["Ignore it completely"]
    B --> C["Write the unconstrained plan"]
    C --> D["Review each step"]
    D --> E{"Does this step\nactually require\nthe missing resource?"}
    E -- No --> F["Execute now"]
    E -- Yes --> G["Negotiate, acquire,\nor find workaround"]
    F --> H["Ship what you can"]
    G --> H

    style A fill:#e74c3c,color:#fff
    style B fill:#9b59b6,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Barrier:** "We can't redesign the auth system — none of us are security experts."

**Act-as-if plan (pretend you are security experts):**
1. Audit the current auth flow and document every token lifecycle
2. Identify the three weakest points using OWASP top 10 as a checklist
3. Replace the hand-rolled session management with an industry-standard library
4. Add rate limiting and anomaly detection on the login endpoint
5. Commission a professional pen test on the result

**Reality check:**
- Steps 1-2: Require no expertise beyond reading docs. Executable now.
- Step 3: Replacing custom code with a well-maintained library *reduces* the need for expertise. Executable now.
- Step 4: Standard engineering work. Executable now.
- Step 5: This is the only step that requires outside expertise — and it's the verification step, not the implementation.

**Result:** 4 out of 5 steps are executable immediately. The "we're not security experts" barrier was blocking work that doesn't require security expertise. The one step that does require expertise (pen test) can be outsourced for a fraction of the cost of the full redesign.

## Watch Out For

- This move liberates, but don't let it make you reckless. In genuinely safety-critical domains (medical, financial, infrastructure), the barrier may be real and the consequence of ignoring it severe
- "Act as if" is for planning, not for misrepresenting your qualifications. You are making a plan, not committing fraud
- If the entire plan requires the missing resource, the barrier is real. Acknowledge it and seek the resource rather than pretending
- The psychological insight cuts both ways: sometimes you're not self-censoring, you're correctly recognizing a genuine limitation. Use judgment
