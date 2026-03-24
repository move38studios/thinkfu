---
id: TF-064
name: Geneplore Cycle
one_liner: Don't try to have a good idea. Have a vague shape, then find the idea hiding inside it.
mode: [explore]
category: Exploration
tags: [creativity, pre-inventive, generation, exploration, iterative, ambiguity]
effort: quick
origin: Geneplore model (Finke, Ward & Smith 1992)
problem_signatures:
  - "I'm waiting for a brilliant idea to arrive and nothing is coming"
  - "I need to be creative but I can't force creativity"
  - "every idea I come up with feels half-baked"
  - "I'm stuck between brainstorming and building"
  - "I have vague intuitions but can't turn them into concrete solutions"
variables:
  word:
    type: pick
    count: 1
    pool: random-words
pairs_with:
  - id: TF-063
    why: "diverge before you converge generates the raw material that Geneplore cycles can refine"
  - id: TF-009
    why: "random entry provides external stimuli for the Generate phase when you are stuck"
  - id: TF-021
    why: "merge contradictions when your Explore phase surfaces conflicting properties in a pre-inventive structure"
---

## The Move

Alternate between two phases. GENERATE: produce a "pre-inventive structure" — a rough, ambiguous, half-formed concept. It can be a sketch, a sentence fragment, a data flow with blanks, an interface with no implementation. Seed your pre-inventive structure with the shape/feel of {{word.1}}. Do not try to make it good or useful yet. Just make it concrete enough to examine.

EXPLORE: take that structure and interrogate it. What properties does it have? What could it become? What problems might it accidentally solve? What is interesting about it, even if it was not what you intended?

Then GENERATE again, informed by what you discovered. Repeat for 2-3 cycles. The key insight from Finke, Ward, and Smith's research: creative output improves when generation and evaluation are separated into distinct phases, and when the initial generation is deliberately ambiguous.

## When to Use

- You are sitting in front of a blank canvas and need to start somewhere
- You have vague creative intuitions that you cannot articulate yet
- Direct brainstorming ("think of a good idea") is producing nothing
- You need to explore a design space where you do not know what good looks like yet

## Diagram

```mermaid
flowchart TD
    A["GENERATE: rough, ambiguous concept"] --> B["EXPLORE: what properties does it have?"]
    B --> C["What could this become?"]
    C --> D["What is interesting about it?"]
    D --> E["GENERATE: new version informed by exploration"]
    E --> F["EXPLORE: interrogate again"]
    F --> G["Repeat 2-3 cycles"]
    G --> H["Concrete idea emerges from the iteration"]

    style A fill:#3498db,color:#fff
    style B fill:#9b59b6,color:#fff
    style E fill:#3498db,color:#fff
    style F fill:#9b59b6,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Problem:** "We need a new way for users to discover content in our app."

**Cycle 1 — Generate:** Sketch a rough concept: "What if the home screen was a map instead of a feed?" Don't evaluate yet. Just draw a literal map with pins on it.

**Cycle 1 — Explore:** What properties does a map have? Spatial proximity. Zooming. Landmarks. You can get lost. You can discover things by wandering, not searching. Interesting: "getting lost" is usually bad in UX, but in content discovery, it might be the point.

**Cycle 2 — Generate:** New structure informed by "getting lost is the point": a UI where the user has no search bar and no algorithm — they navigate spatially through a content landscape, where similar content clusters together.

**Cycle 2 — Explore:** This has a "browsing a bookstore" property. Serendipity is built in. But cold start is terrible — a new user sees a random landscape. What if the landscape reshapes itself around what they linger on?

**Cycle 3 — Generate:** An adaptive spatial interface where content clusters form and dissolve based on dwell time. The user "walks" through content, and the terrain shifts beneath them.

The final concept is not something anyone would have arrived at by saying "brainstorm content discovery ideas." It emerged from the iterative refinement of a vague shape.

## Watch Out For

- Do not skip the Explore phase. The temptation is to Generate, judge it bad, and Generate again. Exploration is where the value hides
- Pre-inventive structures should be ambiguous ON PURPOSE. If your first Generate output is fully specified, you have skipped ahead. Make it vaguer
- Two to three cycles is enough. More than that and you are polishing a concept instead of exploring the space
- This move produces raw creative material, not finished solutions. Follow up with evaluation (TF-015, TF-065) to stress-test what you have found
