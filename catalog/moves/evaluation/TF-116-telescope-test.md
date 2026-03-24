---
id: TF-116
name: Telescope Test
one_liner: "Compress your idea to {{word_count}} words. Expand it to a paragraph. The gap reveals what's missing."
mode: [evaluate]
category: Evaluation
tags: [clarity, compression, communication, exformation, writing]
effort: snap
origin: George Strakhov "108 Thoughts for Strategists" (#7, #15) — Telescopic writing / Exformation
problem_signatures:
  - "I can't explain this idea concisely"
  - "the pitch deck is 40 slides and still unclear"
  - "people nod but then build the wrong thing"
  - "the concept makes sense to me but not to anyone else"
  - "we keep adding more detail but understanding doesn't increase"
variables:
  word_count:
    type: number
    min: 3
    max: 7
pairs_with:
  - id: TF-052
    why: "Delete Half forces compression at the artifact level — Telescope Test forces compression at the idea level"
  - id: TF-058
    why: "Argue Both Sides in One Sentence is another compression test, focused on tensions rather than core message"
  - id: TF-081
    why: "See the Whole Thing at Once checks whether you can hold the full picture — Telescope Test checks if you can compress it"
---

## The Move

Write your idea in exactly **{{word_count}} words**. No cheating with hyphens or compound words. Then expand those {{word_count}} words into one full paragraph that a stranger could act on. If you cannot compress, the idea is not crisp enough — you do not truly know what it is. If you cannot expand, the idea is not rich enough — there is nothing underneath the slogan. The gap between the compressed and expanded versions is the "exformation" — the shared context you are relying on your audience to supply. If that gap is too large, your audience will unzip the message wrong.

## When to Use

- Before presenting an idea to stakeholders
- When a document keeps growing but clarity is not improving
- When people consistently misunderstand your proposal
- As a final check before committing to a direction

## Diagram

```mermaid
flowchart TD
    A["Your idea"] --> B["Compress to\n{{word_count}} words"]
    A --> C["Expand to\none paragraph"]
    B --> D{"Can you\ncompress?"}
    C --> E{"Can you\nexpand?"}
    D -- No --> F["Idea is not crisp.\nSimplify until you can."]
    D -- Yes --> G["Good compression"]
    E -- No --> H["Idea is shallow.\nDevelop until you can."]
    E -- Yes --> I["Good expansion"]
    G --> J["Compare the gap:\nhow much context does\nexpansion add?"]
    I --> J
    J --> K{"Gap manageable\nfor your audience?"}
    K -- Yes --> L["Ship it"]
    K -- No --> M["Reduce assumed context"]

    style A fill:#3498db,color:#fff
    style K fill:#f39c12,color:#fff
    style L fill:#2ecc71,color:#fff
```

## Example

**Idea:** A feature flag system for the platform team.

**Compressed (5 words):** "Decouple deployment from feature release."

**Expanded:** "Build a feature flag service that lets any team ship code to production without exposing it to users, then gradually roll out features by percentage, user segment, or geography — so deployment is a technical event and launch is a business decision, and the two never have to happen at the same time."

**Gap analysis:** The compressed version assumes the reader knows what "decouple" means in this context and why deployment and release being coupled is a problem. For engineers, the gap is fine — they'll unzip it correctly. For the VP of Product, you need to add: "This means we can ship every day without risk, and Product controls when users see new things." Different audiences need different expansion levels.

## Watch Out For

- The compression should capture the core *insight*, not just the category. "Better notifications" is a label, not a compression. "Notify only when action is needed" is a compression
- If you can compress to {{word_count}} words in five different ways that lead to different solutions, you have multiple ideas pretending to be one. Split them
- This is a test of understanding, not a writing exercise. If the compression is poetic but misleading, it fails
- Don't confuse brevity with clarity. A compressed version that requires a decoder ring is worse than a slightly longer version that's self-evident
