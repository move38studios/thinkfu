---
id: TF-143
name: Schema Audit
one_liner: "Name the mental category you put this problem in — then name two categories it could belong to instead."
mode: [plan, evaluate]
category: Meta
tags: [piaget, schemas, categorization, framing, mental-models, reframing, diagnosis]
effort: quick
origin: Piaget — Schema theory
variables:
  domain:
    type: pick
    count: 2
    pool: domains
problem_signatures:
  - "I categorized this problem immediately and never questioned the category"
  - "the solutions I keep generating all have the same flavor"
  - "someone else looked at this problem and saw something completely different"
  - "I'm treating this like a problem I've seen before but it keeps not responding to the usual fix"
  - "my diagnosis feels right but the treatment isn't working"
pairs_with:
  - id: TF-019
    why: "the schema you chose IS an assumption — map it alongside the others"
  - id: TF-115
    why: "frame the frame operates on the same insight: your category determines your solution space"
  - id: TF-093
    why: "recognition-primed check reveals which schema your pattern-matching selected automatically"
---

## The Move

Write down the category you've placed this problem in: "This is a ___ problem." (Performance problem. UX problem. People problem. Architecture problem. Data problem.) That category is your **schema** — it determines which solutions you search for. Now name **two alternative categories** this problem could belong to. For each alternative, ask: "If this were a {{domain.1}} problem, what would I try? If it were a {{domain.2}} problem?" Each schema opens a completely different solution space. If your current category hasn't produced a solution, the category — not the problem — may be wrong.

## When to Use

- When your first diagnosis felt instant and obvious — that's a schema firing automatically
- When all your proposed solutions have the same character (all technical, all process, all people-related)
- When someone else sees the same situation and reaches a completely different conclusion
- When the "obvious" fix hasn't worked and you're doubling down on the same approach

## Diagram

```mermaid
flowchart TD
    A["The problem as you see it"] --> B["Name your schema: 'This is a ___ problem'"]
    B --> C["Solution space A: familiar fixes"]
    B --> D["Alternative schema 1: 'What if it's a ___ problem?'"]
    B --> E["Alternative schema 2: 'What if it's a ___ problem?'"]
    D --> F["Solution space B: different fixes"]
    E --> G["Solution space C: different fixes"]
    C --> H{"Has solution space A worked?"}
    H -- Yes --> I["Schema was correct — proceed"]
    H -- No --> J["Try solutions from B or C"]

    style B fill:#9b59b6,color:#fff
    style D fill:#e67e22,color:#fff
    style E fill:#e67e22,color:#fff
    style J fill:#2ecc71,color:#fff
```

## Example

**Situation:** Your web app's checkout page has a 68% abandonment rate. The team has spent three sprints optimizing page load time, reducing it from 3.2s to 1.1s. Abandonment rate: still 68%.

**Current schema:** "This is a performance problem."
- Solutions tried: CDN, image compression, code splitting, lazy loading.
- Result: Page is fast. Users still leave.

**Alternative schema 1:** "This is a trust problem."
- New solutions: Add security badges, show return policy prominently, display customer reviews near the payment form, show a phone number.

**Alternative schema 2:** "This is a pricing problem."
- New solutions: Show total cost earlier (users see shipping cost for the first time at checkout and bail), offer price-match guarantee, add a discount code field that doesn't feel like a trap.

You add the total-cost preview on the product page. Abandonment drops to 41%. It was never a performance problem. The schema — "users leave because the page is slow" — was wrong. The real category was "users leave because of price surprise." Three sprints of optimization were wasted solving a correctly-diagnosed problem in the wrong category.

## Watch Out For

- The first schema that fires is usually based on your expertise. Engineers see technical problems. Designers see design problems. Managers see process problems. Your schema says more about you than about the problem.
- Alternative schemas should be genuinely different categories, not subcategories. "It's a frontend performance problem" to "it's a backend performance problem" is not a schema shift — both live inside the performance schema.
- You don't need to abandon your original schema — just test whether the alternatives explain the symptoms better. The schema that explains the most symptoms with the fewest exceptions wins.
- Beware of schema entrenchment: the more time and effort you've invested in solutions from one schema, the harder it is to consider alternatives. Sunk cost protects bad categories.
