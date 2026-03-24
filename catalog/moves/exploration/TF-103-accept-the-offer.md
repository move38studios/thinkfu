---
id: TF-103
name: Accept the Offer
one_liner: "That surprise, error, or interruption is an offer. Accept it: how does **{{word.1}}** become a feature?"
mode: [explore, stuck]
category: Exploration
tags: [improv, serendipity, reframing, surprise, error-as-signal, Johnstone]
effort: snap
origin: Keith Johnstone, "Impro" (1979) — Offers and blocks
problem_signatures:
  - "something unexpected happened and I'm trying to route around it"
  - "a constraint just appeared that breaks my plan"
  - "I keep dismissing surprises instead of investigating them"
  - "this error is annoying but weirdly interesting"
  - "the user is doing something I didn't design for"
variables:
  word:
    type: pick
    count: 1
    pool: random-words
pairs_with:
  - id: TF-037
    why: "Honor Thy Error is the same principle applied specifically to mistakes"
  - id: TF-023
    why: "Use the Problem as the Solution is a structural cousin — the obstacle becomes the path"
  - id: TF-009
    why: "Random Entry provides the unexpected input when reality hasn't supplied one yet"
---

## The Move

Identify the unexpected thing that just happened — a bug, a weird user behavior, a constraint change, a surprising test result, or simply the random word **{{word.1}}**. This is the "offer." Now, instead of blocking it (dismissing, ignoring, routing around), deliberately ACCEPT it. Ask three questions: (1) What does this make possible that my original plan didn't? (2) If I designed the system around this surprise instead of against it, what would change? (3) Who would love this behavior?

## When to Use

- An unexpected constraint or event just disrupted your plan
- Users are using your system in a way you didn't intend
- A test failure reveals behavior you didn't expect
- You need a creative prompt and want to use the random word as an "offer" from the universe
- You notice yourself reflexively dismissing or routing around something surprising

## Diagram

```mermaid
flowchart TD
    A["Unexpected event / {{word.1}}"] --> B{"Block or Accept?"}
    B -->|Block| C["Route around it\n(lose the signal)"]
    B -->|Accept| D["What does this make possible?"]
    D --> E["If I designed AROUND this?"]
    E --> F["Who would love this behavior?"]
    F --> G["New design direction"]

    style B fill:#f39c12,color:#fff
    style C fill:#e74c3c,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Situation:** You're building a note-taking app. During testing, you notice that when users paste a URL, the parser sometimes grabs surrounding text and includes it as a quote block. This is a bug — the parser is too greedy.

**Block response:** Fix the parser to only grab the URL. File a bug ticket. Move on.

**Accept response:** Wait — users are accidentally creating quote blocks alongside their links. What if that's useful? What if pasting a URL automatically pulled a preview snippet from the page and inserted it as a quote? The "bug" is a feature sketch. The greedy parser was pointing toward a behavior users might actually want — contextual link previews.

**Outcome:** Instead of just fixing the parser, you build a link-preview feature that fetches a snippet from the URL and inserts it as a collapsible quote. The "bug" became the product's most-used feature.

## Watch Out For

- Not every surprise is a gift. Accept the offer to EXPLORE it, but you still evaluate afterward. The point is to investigate before dismissing, not to ship every accident
- "Accept the offer" is hardest when you're under time pressure and the surprise feels like a setback. That's exactly when the offer is most valuable
- If using the random word as the offer, spend at most 3 minutes. If nothing emerges, the word wasn't the right stimulus — re-roll or move on
- The opposite failure mode: accepting EVERY offer leads to scope creep and lack of direction. Accept selectively, but investigate generously
