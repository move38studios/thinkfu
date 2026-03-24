---
id: TF-021
name: Merge Contradictions
one_liner: Two requirements seem incompatible. Don't compromise — find where both are fully true.
mode: [stuck, explore]
category: Meta
tags: [contradiction, TRIZ, dialectics, synthesis, creative-tension, paradox]
effort: deep
origin: TRIZ Contradiction resolution (Altshuller 1946) / Hegelian dialectics / Janusian thinking (Rothenberg 1979)
problem_signatures:
  - "two requirements that seem to contradict each other"
  - "stuck choosing between two good options"
  - "told to make it both simple and comprehensive"
  - "fast vs. thorough, flexible vs. consistent"
  - "being asked to do the impossible"
  - "every option requires sacrificing something important"
pairs_with:
  - id: TF-027
    why: "separate in time is one of the three core resolution strategies for contradictions"
  - id: TF-049
    why: "name the tradeoff if synthesis fails and you must choose between the two sides"
  - id: TF-046
    why: "steel man the opposite to ensure you understand both sides before attempting synthesis"
---

## The Move

Name the contradiction explicitly: **"It must be X AND Y, but X and Y seem to conflict."** Write it down as a sentence with "AND" in bold.

Now refuse to compromise. A compromise gives you half of X and half of Y — nobody's happy. Instead, ask: **under what conditions could both be fully true simultaneously?**

Three strategies to try: (1) **Separate in time** — can it be X first and Y later, or Y on weekdays and X on weekends? (2) **Separate in space** — can one part of the system be X while another part is Y? (3) **Separate in level** — can it be X at one level of abstraction and Y at another?

## When to Use

- Two stakeholders want opposite things and you're stuck in the middle
- You've been going back and forth between two approaches and can't commit
- The requirements document contains a hidden contradiction nobody has named
- You're about to compromise and it feels like losing twice

## Diagram

```mermaid
flowchart TD
    A["Name the contradiction explicitly"] --> B["It must be X AND Y"]
    B --> C["Refuse to compromise"]
    C --> D["Strategy 1: Separate in time"]
    C --> E["Strategy 2: Separate in space"]
    C --> F["Strategy 3: Separate in level"]
    D --> G{"Both X and Y fully achieved?"}
    E --> G
    F --> G
    G -- Yes --> H["You found a synthesis"]
    G -- No --> I["Try another separation strategy"]
    I --> C

    style A fill:#f39c12,color:#fff
    style C fill:#e74c3c,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Contradiction:** "The API must be **simple for beginners AND powerful for experts**."

**Compromise (avoid this):** A medium-complexity API that frustrates beginners and bores experts.

**Separation in space:** Simple SDK wrapper for beginners, raw API for experts. Two interfaces, one system. Both are fully served.

**Separation in level:** The surface API is simple (five methods, sensible defaults). The configuration layer underneath is powerful (every parameter exposed, composable middleware). Beginners never see the configuration layer. Experts live there.

**Separation in time:** Onboarding flow is radically simple (one function, one concept). After the user hits their first limitation, the system progressively reveals power features. Simple first, powerful later.

Each of these is better than a compromise. The contradiction wasn't real — it was a failure to separate the dimensions.

## Watch Out For

- The hardest step is naming the contradiction. Most contradictions hide in vague requirements. "It should be intuitive" — *and what else?* Force the AND.
- Not every contradiction dissolves. Some are genuinely zero-sum (budget, time). Recognize when you're facing a real tradeoff vs. a false dilemma.
- "Separate in time" is the most commonly overlooked strategy. Many X-vs-Y problems vanish when you ask "can it be X now and Y later?"
- Don't confuse synthesis with complexity. The best solutions to contradictions are often simpler than either original option.
