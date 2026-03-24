---
id: TF-202
name: Formalize It
one_liner: Rewrite your problem as a formal expression — equation, logical statement, or pseudocode — and watch the ambiguity fall out.
mode: [stuck, evaluate]
category: Meta
tags: [formalization, precision, math, logic, optimization, ambiguity, constraints]
effort: quick
origin: Mathematical formalization as thinking tool / Herbert Simon / George Polya
problem_signatures:
  - "we keep talking past each other about what this should do"
  - "I can describe the goal but not measure it"
  - "the requirements seem clear until I try to implement them"
  - "not sure what we're actually optimizing for"
  - "the tradeoff feels fuzzy and I can't compare options"
pairs_with:
  - id: TF-155
    why: "three representations — formalization is one lens, pair it with visual and narrative"
  - id: TF-163
    why: "map the problem space — formalization forces you to name every dimension of that space"
  - id: TF-082
    why: "explore parameter space — once formalized, you can systematically vary each variable"
---

## The Move

Write your problem as a formal expression. Pick the notation that fits: a math equation, a logical predicate, a type signature, or pseudocode with named variables. Name every variable. Define every relationship. State what you are maximizing or minimizing. State every constraint explicitly: `subject to X > 0, Y + Z <= budget, latency < 200ms`. If you cannot write the expression, identify the exact point where you get stuck — that gap is the most important thing you have found. Natural language hides ambiguity behind comfortable vagueness. Formalization strips it bare.

## When to Use

- When a team debate keeps circling without resolution — force everyone to agree on the same equation
- When you can describe a goal in English but cannot measure whether you have achieved it
- When you need to compare two options and the comparison feels subjective
- When requirements seem clear until you sit down to implement them
- When you suspect you are optimizing for the wrong thing

## Diagram

```mermaid
flowchart TD
    A["Vague problem statement"] --> B["Identify the output: what are you optimizing?"]
    B --> C["Name every variable involved"]
    C --> D["Define relationships between variables"]
    D --> E["State constraints explicitly"]
    E --> F{"Can you write the full expression?"}
    F -- Yes --> G["Inspect it: does it match your intuition?"]
    F -- No --> H["The gap IS the finding — name what you cannot formalize"]
    G -- Mismatch --> I["Your intuition and your logic disagree — investigate"]
    G -- Match --> J["Use the expression to compare options mechanically"]
    H --> K["Reframe the problem or gather missing information"]

    style F fill:#f39c12,color:#fff
    style H fill:#e74c3c,color:#fff
    style J fill:#2ecc71,color:#fff
```

## Example

**Problem:** "We need to improve the search experience."

That sentence contains zero information about what "improve" means. Formalize it:

```
maximize: relevance(results, user_intent)
subject to:
  latency(query) < 200ms
  cost_per_query < $0.003
  results.length >= 5
  results.length <= 20
  diversity(results) > threshold_d
```

Immediately you discover three things you had not decided:

1. **What is `relevance`?** Click-through rate? Time-to-find? User rating? You cannot optimize what you have not defined.
2. **Is there a diversity constraint?** The business wants varied results, but nobody stated it — so the ranker is free to return 20 near-duplicates.
3. **Cost and latency compete with relevance.** A more expensive model improves relevance but violates the cost constraint. Now you have a real tradeoff to evaluate instead of a vague aspiration.

The formalization turned a wish ("improve search") into a concrete optimization problem with testable constraints.

## Watch Out For

- Formalization is a thinking tool, not a delivery artifact. Do not let the notation become the goal. The point is to find what you cannot formalize, not to produce a pretty equation.
- Some problems resist formalization because they are genuinely multi-objective with no clear weighting. That is a finding, not a failure. Name the objectives and decide the weights explicitly.
- Beware false precision. Writing `relevance > 0.85` feels rigorous but is meaningless if you have not defined how relevance is measured. The formalism is only as good as the definitions behind the symbols.
- If the formalization feels trivial, you are probably formalizing the wrong level. Go one level deeper — formalize the *mechanism*, not just the goal.
