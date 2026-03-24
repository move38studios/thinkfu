---
id: TF-018
name: Kill Your Darlings
one_liner: Find the part you love most. Remove it. See what survives.
mode: [evaluate]
category: Evaluation
tags: [attachment, elegance, sunk-cost, simplicity, pruning, ego]
effort: snap
origin: Writing craft (attributed to Faulkner, Quiller-Couch, Stephen King)
problem_signatures:
  - "there's one part I'm especially proud of"
  - "spent disproportionate time on one element"
  - "solution feels complex but I can't see what to cut"
  - "defending a piece of the design more than others"
  - "this clever bit is what makes it special"
pairs_with:
  - id: TF-052
    why: "delete half forces broader cuts after kill your darlings targets the emotional favorite"
  - id: TF-039
    why: "make it ugly first as an alternative when attachment to elegance is the real blocker"
  - id: TF-012
    why: "reduce to simplest case to see if the darling survives in the minimal version"
---

## The Move

Identify the part of your solution you are **most proud of** — the clever abstraction, the elegant pattern, the feature you enjoyed building, the sentence you think is perfect.

Now remove it entirely. Cross it out. Delete the file. Comment out the function.

Ask two questions: (1) Is the solution still good without it? (2) Is the solution *simpler* without it?

If yes to both: your darling was decoration. Ship without it. If the solution collapses: you've found the load-bearing element. Make sure it's *solid*, not just *clever* — cleverness and reliability are different things.

## When to Use

- You've finished and are admiring your own work — admiration is the signal
- The solution feels bloated but you can't identify what to cut
- You're defending one part of the design harder than the rest in a review
- You suspect you built something for yourself, not for the user

## Diagram

```mermaid
flowchart TD
    A["Your solution"] --> B["Identify the part you love most"]
    B --> C["Remove it completely"]
    C --> D{"Is the solution still good?"}
    D -- Yes --> E{"Is it simpler?"}
    D -- No --> F["It is load-bearing"]
    E -- Yes --> G["It was decoration — ship without it"]
    E -- No --> H["Removal created new complexity — reconsider"]
    F --> I["Audit it: is it solid, or just clever?"]

    style B fill:#f39c12,color:#fff
    style C fill:#e74c3c,color:#fff
    style G fill:#2ecc71,color:#fff
    style I fill:#3498db,color:#fff
```

## Example

**Solution:** A configuration system for a CLI tool. You built a clever inheritance mechanism where config files cascade: global defaults, project-level overrides, and directory-level overrides, with each level merging deeply into the previous one.

**Your darling:** The deep-merge cascading inheritance. You're proud of how elegant it is.

**Kill it:** Replace with a single flat config file. No inheritance. No merging.

**What happens?** Users duplicate some settings across projects — but they can *see* every active setting in one place. No confusion about where a value came from. No debugging "why is this setting being overridden?" The system is less powerful but dramatically more predictable.

**The verdict:** The cascading merge was solving a problem most users don't have, while creating confusion all users would hit. Kill it. Or at minimum, make flat config the default and cascade an opt-in advanced feature.

## Watch Out For

- The emotional resistance you feel is the point. If removal feels easy, you haven't found the real darling yet.
- This isn't nihilism. Some darlings are load-bearing *and* brilliant. The move is the test, not the outcome.
- "Kill" means temporarily remove for evaluation, not permanently destroy. You can always put it back — but try life without it first.
- Watch for the sneaky version: removing your darling and then unconsciously rebuilding it under a different name.
