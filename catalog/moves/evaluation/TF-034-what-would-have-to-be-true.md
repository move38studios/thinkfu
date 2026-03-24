---
id: TF-034
name: What Would Have to Be True?
one_liner: Convert vague confidence into specific, testable bets.
mode: [evaluate, plan]
category: Evaluation
tags: [assumptions, strategy, testability, Lafley-Martin, derisking, validation]
effort: quick
origin: Strategic logic (Lafley & Martin, "Playing to Win")
problem_signatures:
  - "I believe this will work but I can't explain why"
  - "we're arguing about the solution but not about the assumptions behind it"
  - "this plan has a lot of unstated assumptions"
  - "we're confident but we haven't validated anything"
  - "different people are imagining different scenarios for success"
variables:
  persona:
    type: pick
    count: 1
    pool: personas
pairs_with:
  - id: TF-019
    why: "map the assumptions to classify the conditions you surfaced as fact, belief, or hope"
  - id: TF-032
    why: "pre-mortem the plan after identifying which assumptions are most fragile"
  - id: TF-043
    why: "prototype the riskiest part to test the most critical assumption cheaply"
---

## The Move

Take your proposed solution and complete this sentence for each domain: "For this to work, it would have to be true that ___." Cover at least these domains: the user (behavior, needs, willingness), the technology (feasibility, performance, reliability), the market or environment (timing, competition, regulation), and the team (skills, capacity, coordination). Write each assumption as a specific, testable condition — not "users will like it" but "at least 30% of current users will complete onboarding within 5 minutes." Now rank the assumptions by two axes: how critical they are (if false, does the whole plan collapse?) and how testable they are (can you validate this cheaply?). Test the critical, testable ones first. Stare hard at the critical, untestable ones. After listing your assumptions, ask: would {{persona.1}} agree with these? Which assumptions would they challenge?

## When to Use

- Before committing to a strategy, to surface hidden assumptions
- When a team disagrees about a plan — often they actually disagree about assumptions
- When you feel confident but haven't articulated why
- To turn a strategy debate into a testable experiment
- When comparing multiple options — compare their assumptions, not just their features

## Diagram

```mermaid
flowchart TD
    A["State your proposed solution"] --> B["For each domain: what would have to be true?"]
    B --> C["User assumptions"]
    B --> D["Technology assumptions"]
    B --> E["Market assumptions"]
    B --> F["Team assumptions"]
    C --> G["Write each as a testable condition"]
    D --> G
    E --> G
    F --> G
    G --> H["Rank: critical vs. nice-to-have"]
    H --> I["Rank: testable vs. untestable"]
    I --> J["Test critical testable ones first"]
    I --> K["Examine critical untestable ones hard"]

    style B fill:#f39c12,color:#fff
    style J fill:#2ecc71,color:#fff
    style K fill:#e74c3c,color:#fff
```

## Example

**Proposed solution:** "We'll build a Slack bot that summarizes long threads so people stop missing important decisions."

**What would have to be true:**

- **User:** People actually miss decisions because threads are long (not because they mute channels). At least 40% of teams have threads over 20 messages where decisions get buried.
- **Technology:** An LLM can reliably distinguish "a decision was made" from "people are still debating." False positives (summarizing a non-decision as a decision) would be worse than missing one.
- **Market:** People won't just switch to a tool that already does this (Notion AI, Loom summaries). Our integration advantage in Slack is enough to win.
- **Team:** We can ship a reliable v1 in 6 weeks with our current backend team, without pulling anyone off the core product.

**Ranking:** The user assumption is critical and testable — survey 20 teams this week. The technology assumption is critical and testable — run the summarizer on 100 real threads and check accuracy. The market assumption is critical but harder to test. The team assumption is critical and testable — talk to the engineering lead today.

**Scariest assumption:** The technology one. If the LLM can't distinguish decisions from debate, the product is worse than useless.

## Watch Out For

- The most dangerous assumptions are the ones you don't think to list — they feel so obvious that you skip them. Push yourself to list at least two more than feel natural
- "Testable" doesn't mean "easy." Some assumptions require building something to test. That's fine — but know the cost before you commit
- This move is especially powerful when two people disagree. Often they agree on the solution but disagree on an assumption. Finding the specific assumption unlocks the debate
- Don't treat this as a box-checking exercise. The value is in discovering the assumption that, if false, collapses everything. That one gets your attention first
