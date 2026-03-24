---
id: TF-129
name: Present the Seed, Not the Flower
one_liner: "Share the raw, unfinished version. Seeds invite collaboration; flowers invite critique."
mode: [plan]
category: Planning
tags: [sharing, feedback, collaboration, rick-rubin, creative-act, vulnerability, early-sharing]
effort: snap
origin: Rick Rubin, "The Creative Act" — Early sharing / Seeds vs. finished work
problem_signatures:
  - "I keep polishing before showing anyone and then they suggest a different direction"
  - "feedback always comes too late to act on without major rework"
  - "stakeholders feel excluded from the process and nitpick the output"
  - "I'm afraid to show work that isn't ready"
  - "the team only sees finished proposals and rubber-stamps them"
pairs_with:
  - id: TF-057
    why: "Ship the Worst Version is the execution-level cousin — present the seed externally; ship the worst version to users"
  - id: TF-043
    why: "Prototype the Riskiest Part First identifies which seed to share first"
  - id: TF-039
    why: "Make It Ugly First overcomes the perfectionism that prevents seed-sharing"
---

## The Move

You have an idea, a design, or a plan. Your instinct is to polish it before showing anyone. Override that instinct. Take the idea in its current, rough form — sketch, bullet points, half-built prototype, napkin diagram — and show it to the relevant person NOW. Frame it explicitly: "This is a seed, not a proposal. I'm showing it early so you can shape it with me." When people see a seed, they imagine what it could become and contribute their vision. When people see a polished flower, they judge what it IS and look for flaws. The same person gives different feedback at different stages. Get the generative feedback, not the evaluative feedback.

## When to Use

- You have been working on something for more than a day without showing anyone
- Past feedback has come too late and required expensive rework
- Stakeholders feel surprised by final outputs and push back defensively
- You are waiting to feel "ready" to share and that moment keeps receding

## Diagram

```mermaid
flowchart LR
    A["Raw idea (seed)"] --> B{"Share now or polish first?"}
    B -- "Polish first" --> C["Flower: finished-looking"]
    B -- "Share now" --> D["Seed: rough, open"]
    C --> E["Audience evaluates and critiques"]
    D --> F["Audience imagines and contributes"]
    F --> G["Collaborative direction"]
    E --> H["Defensive rework"]

    style D fill:#2ecc71,color:#fff
    style C fill:#e74c3c,color:#fff
    style G fill:#2ecc71,color:#fff
    style H fill:#e74c3c,color:#fff
```

## Example

**Situation:** You are designing a new permissions model for a multi-tenant SaaS app. You have spent two days on a detailed RFC with role hierarchies, permission matrices, and migration plans. You are about to spend another day adding edge case analysis before sharing with the team.

**Present the seed instead:** Share a 5-bullet Slack message: "Thinking about permissions. Rough direction: (1) roles are per-workspace not global, (2) three built-in roles: viewer/editor/admin, (3) custom roles as a paid feature, (4) permissions are additive only (no deny rules), (5) migration: map existing users by current usage patterns. Poking holes welcome."

**What happens:** The tech lead replies: "Additive-only is clever but breaks for the compliance customers — they need explicit deny on PII fields." The product manager replies: "Love per-workspace roles. Can we demo this to the enterprise prospect on Thursday?" The junior engineer asks: "What about API keys — do they get roles too?"

**Result:** In 10 minutes you got: a critical design constraint (deny rules for compliance), a business opportunity (Thursday demo), and a scope question you missed (API key permissions). If you had shared the polished RFC, you would have gotten: "Looks good, some minor comments on the migration section." The seed got generative feedback. The flower would have gotten copyediting.

## Watch Out For

- Frame the share explicitly as a seed. If you show rough work without context, people assume it is your best effort and judge accordingly. The framing is load-bearing
- Not everything should be a seed. If the audience needs to make a go/no-go decision, give them a flower. Seeds are for shaping, not for approval
- Some people are bad at seed-stage feedback. They will say "I need to see more before I can comment." Show them a slightly more developed seed next time — but do not wait for the flower
- Vulnerability is the mechanism. Showing unfinished work feels risky. That risk is what creates the collaborative space. If it felt safe, everyone would already do it
