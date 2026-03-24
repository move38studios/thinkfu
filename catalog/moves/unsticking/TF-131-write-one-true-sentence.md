---
id: TF-131
name: Write One True Sentence
one_liner: "Stop trying to solve the whole thing. Write one sentence you'd bet money is true about this problem."
mode: [stuck]
category: Unsticking
tags: [hemingway, clarity, writing, first-principles, simplicity]
effort: snap
origin: Ernest Hemingway — "Write the truest sentence you know" / Annie Dillard — "The Writing Life"
problem_signatures:
  - "I've been staring at this for twenty minutes and haven't typed anything"
  - "every direction I consider feels equally uncertain"
  - "I can't figure out where to start because everything is connected"
  - "my draft keeps growing but none of it feels right"
  - "I know something about this problem but I can't articulate what"
variables:
  koan:
    type: pick
    count: 1
    pool: koans
pairs_with:
  - id: TF-012
    why: "if you can't write even one true sentence, the problem is too big — reduce to the simplest case first"
  - id: TF-014
    why: "Explain It to a Child forces simplification; one true sentence forces truthfulness — use both when deeply stuck"
  - id: TF-001
    why: "if you can't state what IS true, invert and state what is definitely NOT true about the problem"
---

## The Move

Hold this while writing: **{{koan.1}}** Stop trying to solve, plan, or design. Write one sentence about this problem that you are certain is true. Not clever, not comprehensive — factually correct and non-trivial. Something you would bet money on. Then write another. Then another. After three to five true sentences, re-read them: the shape of the problem will have emerged, and you will know where to go next.

The discipline is truthfulness. Most stuckness comes from trying to write something good before you have written anything true. Hemingway used this technique every morning to break through the blank page. The act of committing to a single true claim forces you to separate what you know from what you are guessing.

## When to Use

- You have been stuck for more than five minutes without producing anything
- Your draft or plan keeps expanding but nothing feels solid
- You are paralyzed by the number of possible starting points
- You suspect you understand the problem but cannot articulate it

## Diagram

```mermaid
flowchart TD
    A["Stuck: can't start or make progress"] --> B["Stop trying to solve"]
    B --> C["Write ONE true sentence about the problem"]
    C --> D{"Is it true? Would you bet money?"}
    D -- No --> C
    D -- Yes --> E["Write another true sentence"]
    E --> F["Write a third true sentence"]
    F --> G["Re-read your true sentences"]
    G --> H["The shape of the problem emerges"]

    style C fill:#e74c3c,color:#fff
    style D fill:#f39c12,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Situation:** You need to design a caching strategy for a product catalog service. You have been going back and forth between Redis, in-memory caches, CDN caching, and various invalidation strategies for 20 minutes without making a decision.

**One true sentence:** "The product catalog changes at most a few times per day, but is read thousands of times per second."

**Another:** "A user seeing a stale price for 60 seconds is annoying; seeing a stale price for 24 hours would cause support tickets."

**Another:** "We already have Redis in the infrastructure; adding a new caching layer means a new thing to operate."

**Re-read:** The problem is now clear. You need a cache with a TTL between 60 seconds and 24 hours, and Redis is the pragmatic choice because it is already available. The three true sentences eliminated the CDN-only approach (staleness risk too high) and the in-memory-only approach (no shared invalidation) without you needing to formally evaluate either.

## Watch Out For

- "True" means factually verifiable, not "sounds reasonable." "Our users want fast responses" is vague. "P95 latency is currently 800ms and the SLA is 200ms" is true
- If you cannot write even one true sentence, that is the most important finding of all — you do not understand the problem yet, and you need to gather information before solving
- Do not edit or polish your true sentences. The point is speed and honesty, not elegance
- This is a snap move — spend two minutes, not twenty. If five true sentences have not clarified the problem, switch to a different move
