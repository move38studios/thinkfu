---
id: TF-016
name: Change the Audience
one_liner: Test your solution against someone radically unlike your assumed user.
mode: [evaluate]
category: Evaluation
tags: [empathy, inclusion, perspective-shift, audience, blind-spots, accessibility]
effort: quick
origin: Design Thinking / Inclusive design
problem_signatures:
  - "designed for people like me"
  - "haven't questioned who the user is"
  - "solution works for the typical case"
  - "never tested with an atypical user"
  - "assumptions about the audience are unexamined"
variables:
  persona:
    type: pick
    count: 3
    pool: personas
pairs_with:
  - id: TF-002
    why: "redescribe without obvious words to expose audience assumptions before switching perspectives"
  - id: TF-042
    why: "shrink the audience to one specific person after discovering who gets excluded"
  - id: TF-020
    why: "zoom in/out to find the right level of abstraction for the new audience"
---

## The Move

Your solution was designed for someone. Name that someone explicitly. Now meet three different people: **{{persona.1}}**, **{{persona.2}}**, and **{{persona.3}}**.

Pick the person **most unlike** your assumed user. Walk through your solution step by step from their perspective. What do they see first? Where do they get confused? What do they not have (knowledge, access, patience, ability) that your solution silently requires? What part of your design is invisible to them — or actively hostile?

Write down what breaks. Then decide: is that breakage acceptable, or does it reveal a flaw in the design itself?

## When to Use

- Your solution was designed quickly and you never explicitly named the audience
- You're building for "everyone" — which usually means "people like the builder"
- The solution works perfectly for the happy-path user and you haven't checked anyone else
- You want to find accessibility, usability, or comprehension gaps before launch

## Diagram

```mermaid
flowchart TD
    A["Your solution"] --> B["Name your assumed user explicitly"]
    B --> C["Meet: {{persona.1}}"]
    B --> D["Meet: {{persona.2}}"]
    B --> E["Meet: {{persona.3}}"]
    C --> F["Pick the one most unlike your assumed user"]
    D --> F
    E --> F
    F --> G["Walk through your solution as that person"]
    G --> H{"What breaks, confuses, or excludes?"}
    H -- Nothing --> I["Either your solution is robust or your walkthrough was shallow"]
    H -- Something --> J["Fix the design or document the exclusion consciously"]

    style F fill:#f39c12,color:#fff
    style G fill:#3498db,color:#fff
    style J fill:#e74c3c,color:#fff
```

## Example

**Solution:** An onboarding flow for a developer tool. It walks new users through creating an API key, configuring a YAML file, and running a CLI command.

**Assumed user:** Mid-career backend developer comfortable with terminals.

**Changed audience:** {{persona.3}} — say this resolves to "a grandmother who just got her first smartphone."

**Walkthrough:** She doesn't know what an API key is. She doesn't have a terminal. YAML means nothing. The word "configure" is a wall. Every single step assumes prior knowledge that she doesn't have.

**What this reveals:** The onboarding isn't "simple" — it's simple *for experts*. If the product truly wants broader adoption, the onboarding needs a zero-jargon path. If the product is only for developers, that's fine — but make that choice explicitly rather than letting it happen by default.

## Watch Out For

- Don't patronize the alternate persona. A grandmother isn't stupid; she has different knowledge. A blind engineer isn't less capable; they have different tools. Respect the persona's intelligence while acknowledging their context.
- If nothing breaks for any persona, either your solution is genuinely universal (rare) or you didn't take the walkthrough seriously. Try harder.
- This move doesn't mean you must design for everyone. It means you should *know* who you're excluding and *choose* that consciously.
- The most valuable output is often the thing your solution silently requires but never states.
