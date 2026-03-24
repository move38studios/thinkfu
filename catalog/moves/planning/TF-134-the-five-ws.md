---
id: TF-134
name: The Five Ws
one_liner: "Answer Who, What, When, Where, Why, and How in one sentence each — if any answer is vague, you're not ready to start."
mode: [plan]
category: Planning
tags: [journalism, requirements, completeness, five-ws, planning-basics]
effort: snap
origin: Journalism — Who, What, When, Where, Why (and How) / Rudyard Kipling "Six Honest Serving-Men"
problem_signatures:
  - "we started building and realized we don't know who this is for"
  - "the requirements feel complete but something obvious is missing"
  - "everyone on the team has a slightly different understanding of the task"
  - "I'm about to start but I have a nagging feeling I've missed something"
  - "the ticket says what to build but not why it matters"
pairs_with:
  - id: TF-003
    why: "Three Framings explores different problem interpretations; Five Ws ensures each framing is complete"
  - id: TF-019
    why: "Map the Assumptions surfaces hidden beliefs; Five Ws surfaces hidden gaps — use both before starting"
  - id: TF-022
    why: "after Five Ws reveals a vague 'why', use Working Backwards to clarify the end state"
---

## The Move

Before starting work, answer these six questions in one sentence each. Write the answers down — do not just think them. (1) WHO is this for? Name a specific user or persona. (2) WHAT does it do? One sentence, no jargon. (3) WHEN do they need it? A date or a trigger condition. (4) WHERE does it live? Which system, repo, service, or context. (5) WHY does it matter? What changes if this ships vs. does not ship. (6) HOW does it work? The one-sentence mechanism.

If any answer is vague ("everyone," "whenever," "because it's better," "somewhere in the backend"), you have found a gap. Resolve the gap before writing code. The framework works because it is both simple and complete — it forces you to address the dimensions that planning typically skips.

## When to Use

- At the start of any task, feature, or project
- When a ticket or brief feels complete but you sense gaps
- When team members disagree about scope — often they agree on WHAT but disagree on WHO or WHY
- As a quick sanity check before a sprint commitment

## Diagram

```mermaid
flowchart TD
    A["New task or feature"] --> B["Answer six questions, one sentence each"]
    B --> C["WHO is this for?"]
    B --> D["WHAT does it do?"]
    B --> E["WHEN do they need it?"]
    B --> F["WHERE does it live?"]
    B --> G["WHY does it matter?"]
    B --> H["HOW does it work?"]
    C --> I{"Any answer vague?"}
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    I -- Yes --> J["Resolve the gap before starting"]
    I -- No --> K["All dimensions covered — proceed"]

    style B fill:#3498db,color:#fff
    style J fill:#e74c3c,color:#fff
    style K fill:#2ecc71,color:#fff
```

## Example

**Task:** "Add rate limiting to the API."

**WHO:** Power users hitting the search endpoint more than 100 times per minute, and the downstream payment service that gets overwhelmed.

**WHAT:** Per-user request throttling that returns HTTP 429 with a Retry-After header when the limit is exceeded.

**WHEN:** Before the Black Friday traffic spike on November 15th. Non-negotiable deadline because last year the payment service went down.

**WHERE:** The API gateway layer (Kong), not individual services. Centralized so all endpoints are covered.

**WHY:** Last Black Friday, three power users caused a cascading failure in the payment service, resulting in 45 minutes of downtime and approximately $120K in lost revenue.

**HOW:** Token bucket algorithm in Kong, backed by a shared Redis counter per API key, with configurable limits per endpoint tier.

**Gap found:** The original ticket said "add rate limiting" — it did not specify per-user vs. global, which layer, or why it was urgent. The Five Ws turned a vague ticket into an actionable specification in five minutes.

## Watch Out For

- One sentence each. If your WHO answer is a paragraph, you are overcomplicating — pick the primary user
- "Everyone" is not a WHO. "Whenever" is not a WHEN. "Because it's important" is not a WHY. These are the vague answers that signal gaps
- The HOW answer at this stage should be a mechanism, not an implementation plan. "Token bucket in Redis" not "Step 1: create a Lua script..."
- This move is diagnostic, not exhaustive. It finds gaps in understanding. Filling those gaps may require research, conversations, or other ThinkFu moves
