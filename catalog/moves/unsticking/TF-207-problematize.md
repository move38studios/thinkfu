---
id: TF-207
name: Problematize
one_liner: Deliberately destroy your current understanding so a better one can emerge.
mode: [stuck, explore]
category: Unsticking
tags: [reframing, destruction, shchedrovitsky, mmc, problematization, radical-doubt]
effort: quick
origin: Shchedrovitsky / Moscow Methodological Circle — Problematization technique
problem_signatures:
  - "my understanding feels complete but my solution still doesn't work"
  - "I keep patching the same mental model and it's getting worse"
  - "I've reframed this three times and all the reframes feel like cosmetic changes"
  - "I suspect my entire picture of this problem is wrong but I can't let go of it"
  - "every path I try leads back to the same dead end"
variables:
  koan:
    type: pick
    count: 1
    pool: koans
pairs_with:
  - id: TF-189
    why: "empty the cup is a gentler clearing; problematize is the version where you smash the cup"
  - id: TF-141
    why: "problematization forces accommodation — you cannot assimilate when the old schema is demolished"
  - id: TF-166
    why: "after destroying your framework, return to the raw situation to see what's actually there"
---

## The Move

Write down your current understanding of the problem in 2-3 sentences. Now attack each sentence — not to improve it, but to dismantle it. For each sentence ask: "What if this is not slightly off but fundamentally wrong? What if the opposite is true? What if this category does not even apply?" Cross out each sentence as you demolish it. The goal is to reach genuine not-knowing — a cleared space where a completely new understanding can form. Hold {{koan.1}} in the back of your mind while you do this; it keeps you in productive confusion rather than rushing to rebuild. Do not reconstruct until the ground is fully cleared.

## When to Use

- You have reframed the problem multiple times and every reframe feels like rearranging deck chairs
- Your mental model is internally consistent but keeps failing against reality
- You notice yourself defending your understanding rather than questioning it
- You feel like you are "too deep in" to start over, but nothing is working

## Diagram

```mermaid
flowchart TD
    A["Write current understanding in 2-3 sentences"] --> B["Attack sentence 1: What if fundamentally wrong?"]
    B --> C["Attack sentence 2: What if the opposite is true?"]
    C --> D["Attack sentence 3: What if this category doesn't apply?"]
    D --> E["Cross out all sentences"]
    E --> F["Sit in genuine not-knowing"]
    F --> G{"New understanding emerging?"}
    G -- Yes --> H["Write the new understanding from scratch"]
    G -- Not yet --> I["Return to Raw Situation — TF-166"]

    style E fill:#e74c3c,color:#fff
    style F fill:#9b59b6,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Situation:** You are building a real-time collaborative editor. For two weeks your understanding has been: "The core problem is conflict resolution between concurrent edits. We need a better CRDT." You have evaluated five CRDT libraries. None feel right. Progress has stalled.

**Problematize:**

1. *"The core problem is conflict resolution."* — What if it is not? What if conflicts are actually rare in your use case and the core problem is latency perception? Cross it out.
2. *"Concurrent edits need a CRDT."* — What if they do not? What if your users never actually edit the same paragraph at the same time and a simple last-write-wins with undo history would suffice? Cross it out.
3. *"We need a better CRDT."* — What if no CRDT will help because the real issue is that your document model is wrong — you are treating it as a flat text buffer when users think in blocks? Cross it out.

**Cleared ground:** You no longer "know" what the problem is. You go back to the raw situation (TF-166): watch three users actually collaborate. You notice they rarely have conflicts — but they constantly wait for saves. The problem was never conflict resolution. It was perceived responsiveness. A completely different architecture (optimistic local-first rendering) solves it without any CRDT at all.

## Watch Out For

- This move is violent by design. Do not soften it into "gentle reframing." The point is to actually demolish, not adjust
- You will feel uncomfortable in the not-knowing state. That discomfort is the signal it is working. Do not rush to rebuild
- Problematization is not nihilism — you destroy the old understanding IN ORDER to build a better one. If you stay in destruction mode permanently, pair with TF-166 to re-anchor in concrete reality
- Do not use this move on well-validated understandings that are working. It is for situations where your framework has repeatedly failed
