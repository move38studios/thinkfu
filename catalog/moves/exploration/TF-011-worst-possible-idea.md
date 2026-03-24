---
id: TF-011
name: Worst Possible Idea
one_liner: "Generate the worst solutions you can imagine — with one twist: {{constraint.1}} — then mine them for what actually works."
mode: [explore, stuck]
category: Exploration
tags: [reverse-brainstorming, creativity, inversion, ideation, humor]
effort: quick
origin: Design Thinking / Reverse brainstorming
problem_signatures:
  - "the team is self-censoring and only safe ideas are surfacing"
  - "pressure to be right is blocking any ideas at all"
  - "brainstorming feels stiff and we need to loosen up"
  - "we need to laugh before we can think"
  - "nobody wants to say the dumb idea that might contain a seed"
variables:
  constraint:
    type: pick
    count: 1
    pool: constraints
pairs_with:
  - id: TF-001
    why: "complement: invert the problem structurally after worst-idea mining reveals hidden assumptions"
  - id: TF-015
    why: "follow-up to red-team the design principles extracted from worst-idea inversions"
  - id: TF-040
    why: "alternative angle — exaggerate the problem instead of generating deliberately bad solutions"
---

## The Move

Set a timer for 3 minutes. Generate your worst ideas with this additional constraint: {{constraint.1}}. Come up with as many deliberately terrible solutions as you can — the kind that would get you fired, bankrupt the company, or make users actively hostile. Be specific: not just "make it bad" but "charge users per keystroke" or "require a fax of your passport to log in."

Now examine each terrible idea. For each one, ask: *why exactly is this bad?* Write down the specific reason. Then invert that reason into a design principle. The terrible idea "charge per keystroke" is bad because it punishes engagement — invert it and you get "reward engagement," which is a real design direction.

## When to Use

- The room is stuck in "good idea" paralysis — everyone is filtering before speaking
- Brainstorming has gone stale and keeps producing the same cautious suggestions
- You want to discover hidden assumptions about what makes a solution "good"
- You need to break tension and energize a demoralized exploration session

## Diagram

```mermaid
flowchart TD
    A["Your problem"] --> B["Generate terrible ideas"]
    B --> C["Idea 1: deliberately awful"]
    B --> D["Idea 2: deliberately awful"]
    B --> E["Idea 3: deliberately awful"]
    C --> F["Why is it bad?"]
    D --> G["Why is it bad?"]
    E --> H["Why is it bad?"]
    F --> I["Invert into design principle"]
    G --> I
    H --> I

    style B fill:#e74c3c,color:#fff
    style I fill:#2ecc71,color:#fff
```

## Example

**Problem:** "How do we reduce churn in our SaaS product?"

**Terrible ideas:**
1. Delete the user's data if they don't log in for 3 days
2. Make the cancellation flow 47 steps long
3. Send 20 emails per day begging them to come back
4. Lock their most-used feature behind an annual contract

**Inversions:**
1. *Why bad:* Punishes absence with irreversible loss. *Inverted:* Reward return with a visible record of what they've built. *Design principle:* Show accumulated value on login — "You have 340 saved analyses."
2. *Why bad:* Traps users through friction, breeds resentment. *Inverted:* Make cancellation easy but show what they'll lose. *Design principle:* The cancellation page becomes a personalized summary of value received.
3. *Why bad:* Volume without relevance is spam. *Inverted:* One perfectly timed, perfectly relevant message. *Design principle:* Trigger re-engagement based on the user's specific usage pattern, not a calendar.
4. *Why bad:* Coercion erodes trust. *Inverted:* Make the most-used feature so good they choose to stay. *Design principle:* Invest disproportionately in the features that correlate with retention.

Inversion 1 and 3 are concrete product ideas that never came up in the original brainstorm.

## Watch Out For

- The terrible ideas must be *specific*, not vaguely bad. "Make it worse" yields nothing. "Require users to solve a CAPTCHA every 30 seconds" yields something
- Don't skip the "why is it bad" step. The inversion is where the value lives, not the joke
- This is a quick move — 3 minutes generating, 5 minutes inverting. If you spend longer, you're overthinking it
- Some terrible ideas are actually just bold ideas in disguise. If a "worst idea" makes you pause and think "wait, what if...", follow that thread
