---
id: TF-102
name: "Yes, And"
one_liner: "Stop evaluating. For three rounds, every response must start with 'Yes, and...'"
mode: [explore]
category: Exploration
tags: [improv, brainstorming, additive-thinking, ideation, premature-evaluation]
effort: snap
origin: Improv comedy / Keith Johnstone, "Impro" (1979) / Viola Spolin, "Improvisation for the Theater" (1963)
problem_signatures:
  - "every idea gets shot down before it's fully formed"
  - "brainstorms keep collapsing into debate about feasibility"
  - "the team defaults to 'yes, but' and ideas die on the vine"
  - "we need volume of ideas, not quality — and we keep filtering too early"
pairs_with:
  - id: TF-063
    why: "Yes-And is a micro-protocol for the diverge phase of diverge-before-you-converge"
  - id: TF-011
    why: "worst possible idea is another way to suspend judgment and generate raw material"
  - id: TF-050
    why: "after Yes-And generates volume, use Second Right Answer to pick a non-obvious winner"
---

## The Move

State the seed idea out loud (or write it down). The next response — yours or someone else's — must begin with "Yes, and..." Accept the idea as given and ADD something to it. Not "yes, but." Not "yes, although." Literally: "Yes, and..." Do this for a minimum of three rounds. Each round builds on the previous one, never subtracts. After three rounds, read the chain back. You now have raw material that never would have survived a normal brainstorm.

## When to Use

- Brainstorms keep producing the same safe, consensus ideas
- Ideas get killed by feasibility concerns before they develop
- You need to generate volume and variety, not polish
- The group (or your inner critic) defaults to "that won't work"

## Diagram

```mermaid
flowchart LR
    A["Seed idea"] --> B["Yes, and... (round 1)"]
    B --> C["Yes, and... (round 2)"]
    C --> D["Yes, and... (round 3)"]
    D --> E["Read chain back"]
    E --> F["Extract raw directions"]

    style A fill:#3498db,color:#fff
    style D fill:#e67e22,color:#fff
    style F fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Our CI pipeline takes 40 minutes and developers are losing flow."

**Seed:** "What if we just ran tests in parallel?"

**Round 1:** "Yes, and what if each developer had their own test shard that only runs the tests relevant to files they changed?"

**Round 2:** "Yes, and what if the shard assignment was learned — the system tracks which tests actually fail for which file changes and only runs those, dropping to near-zero for safe changes?"

**Round 3:** "Yes, and what if passing that learned check was enough to merge, and the full suite ran post-merge asynchronously, with auto-revert if it fails?"

The chain went from "parallel tests" (obvious) to "predictive test selection with post-merge verification" (a real architecture used by large-scale CI systems). Round 3 would have been instantly killed in a normal brainstorm — "what if we merge before all tests pass?" sounds reckless. But Yes-And forced the group to build on it instead.

## Watch Out For

- "Yes, and" is a GENERATION tool, not a decision tool. After the rounds, switch to evaluation. Do not ship the chain as-is
- Watch for covert blocking: "Yes, and... we could do that, but it would be really hard" is a "yes, but" in disguise
- Three rounds is a minimum. Five or six often produce the most surprising results because the obvious extensions are exhausted by round three
- If you are doing this solo, it requires discipline. Your inner critic will want to evaluate. Write fast and don't re-read until the rounds are done
