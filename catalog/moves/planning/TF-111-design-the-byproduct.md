---
id: TF-111
name: Design the Byproduct
one_liner: The side effect of your solution may be more valuable than the solution itself. Design for it.
mode: [plan, explore]
category: Planning
tags: [indirect-design, byproduct, behavior, incentives, product-strategy]
effort: quick
origin: George Strakhov "108 Thoughts for Strategists" (#8) / Indirect design
problem_signatures:
  - "users are doing something unexpected with the product"
  - "the most valuable thing we built was accidental"
  - "the stated goal and the actual behavior don't match"
  - "we keep optimizing the wrong surface"
  - "engagement comes from a feature we barely maintain"
variables:
  persona:
    type: pick
    count: 1
    pool: personas
pairs_with:
  - id: TF-023
    why: "Use the Problem as the Solution is the inverse — here you design around the unintended output"
  - id: TF-080
    why: "Make the Invisible Visible helps you see the byproducts you're currently ignoring"
  - id: TF-053
    why: "Reverse the Flow can reveal which direction value actually travels"
---

## The Move

What byproduct would {{persona.1}} value more than the main product? List the three to five actual behaviors your solution produces in users — not what you intend, but what people actually do. For each behavior, ask: "If THIS were the product, how would I design for it?" Pick the most valuable byproduct and redesign your solution to amplify it. The intended feature becomes the wrapper; the byproduct becomes the core.

This works because the gap between intended and actual use is where product-market fit hides. What people do when they think nobody is watching is more honest than what they say they want.

## When to Use

- Users are using your product in ways you did not design for
- You notice an accidental side effect that's generating surprising value
- You're building a feature and want to anticipate what it will actually produce
- The stated value proposition feels weaker than some secondary benefit

## Diagram

```mermaid
flowchart TD
    A["Your solution"] --> B["Intended behavior"]
    A --> C["Actual behavior 1"]
    A --> D["Actual behavior 2"]
    A --> E["Actual behavior 3"]
    C --> F{"Which byproduct is\nmost valuable?"}
    D --> F
    E --> F
    F --> G["Redesign to amplify\nthe byproduct"]
    B -.->|"may become\nthe wrapper"| G

    style A fill:#3498db,color:#fff
    style F fill:#f39c12,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Situation:** You build an internal CLI tool that generates boilerplate code from templates. The intended product is the generated code.

**Actual behaviors observed:**
1. Engineers use it to generate boilerplate (intended)
2. Engineers read the templates to understand architectural patterns (unintended)
3. New hires use the tool as an onboarding guide — they run it to see what a "correct" service looks like (unintended)
4. Teams copy and modify templates as a way to propose new patterns (unintended)

**Most valuable byproduct:** #3 — the tool is secretly an onboarding accelerator.

**Redesign:** Add a `--explain` flag that annotates the generated code with why each decision was made. Add a `--tour` mode that walks through the architecture step by step. The code generator is now the wrapper; the onboarding tool is the product.

## Watch Out For

- Not every byproduct is desirable — some are bugs you should fix, not features you should amplify. Apply judgment
- This move requires real observation of actual usage. If you're speculating about byproducts without data, you're just guessing
- Beware of abandoning the original purpose entirely. Sometimes the byproduct supplements the core; it doesn't always replace it
- If users are misusing your tool in harmful ways, that's a different problem — don't design around abuse
