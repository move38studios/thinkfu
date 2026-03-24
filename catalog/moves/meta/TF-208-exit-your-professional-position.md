---
id: TF-208
name: Exit Your Professional Position
one_liner: Your job title determines what you see. Step outside it.
mode: [plan, evaluate]
category: Meta
tags: [perspective, methodology, position, shchedrovitsky, mmc, organizational-activity-games, professional-blindness]
effort: quick
origin: Shchedrovitsky / Moscow Methodological Circle — Organizational Activity Games / Methodological position
problem_signatures:
  - "everyone on the team sees a different problem and no one can reconcile the views"
  - "I keep proposing solutions that match my skill set rather than the actual need"
  - "this problem feels like it should be simple but nobody can solve it"
  - "cross-functional discussions keep going in circles"
  - "I suspect my expertise is blinding me to something obvious"
variables:
  thinker:
    type: pick
    count: 1
    pool: thinkers
pairs_with:
  - id: TF-104
    why: "lowering your status is one way to exit position; this move goes further by exiting the entire professional frame"
  - id: TF-143
    why: "your professional position IS a schema — schema audit helps you see its structure before you step out"
  - id: TF-115
    why: "your profession is the frame you never question; frame the frame makes it visible"
---

## The Move

Name your professional position: "I am thinking about this AS a ___." Now step outside it entirely. Ask three questions from the methodologist's chair: (1) What methodology is being used here? (2) What does that methodology make visible, and what does it hide? (3) What methodology would make the hidden things visible? Then ask: how would {{thinker.1}} approach this if they had no professional identity at all — if they were simply a thinker encountering this situation for the first time? Write down what they might see that your professional position cannot.

## When to Use

- You notice your proposed solution suspiciously matches your job description (the engineer proposes a technical fix, the designer proposes a redesign, the PM proposes a process change)
- A cross-functional team is stuck because each member keeps pulling toward their own domain
- You are evaluating a plan and want to check for professional blind spots
- The problem has resisted domain-expert solutions and may need a non-domain perspective

## Diagram

```mermaid
flowchart TD
    A["Name your position: I am thinking AS a ___"] --> B["Step into methodologist's chair"]
    B --> C["Q1: What methodology is being used?"]
    C --> D["Q2: What does it make visible? What does it hide?"]
    D --> E["Q3: What methodology would reveal the hidden?"]
    E --> F["Ask: How would a thinker with no professional identity see this?"]
    F --> G["Write down what they see that you cannot"]
    G --> H{"New angle found?"}
    H -- Yes --> I["Integrate the new view into your plan"]
    H -- No --> J["Try TF-143 Schema Audit to dig deeper"]

    style B fill:#9b59b6,color:#fff
    style F fill:#f39c12,color:#fff
    style I fill:#2ecc71,color:#fff
```

## Example

**Situation:** Your team is debating how to handle a sudden spike in customer churn. The backend engineer says the API is too slow and wants to optimize response times. The designer says the onboarding flow is confusing and wants to redesign it. The PM says the pricing tier is wrong and wants to restructure plans. Everyone has data supporting their view. The debate has gone three rounds with no resolution.

**Exit your position:**

1. *"I am thinking about this AS an engineer."* Name it. Set it down.
2. *Methodologist's chair:* The methodology being used is "each specialist diagnoses within their domain and proposes a domain-native fix." This makes visible the things each domain can measure (latency, usability scores, conversion rates). It hides anything that crosses domain boundaries — for example, whether churn correlates with a specific user journey that touches all three domains in sequence.
3. *What methodology would reveal that?* Cohort analysis on the full user journey, not segmented by domain. Map the actual paths of churned users across all touchpoints.
4. *A thinker with no professional identity* might simply ask: "Have you talked to the people who left? What did they say?" No methodology at all — just direct contact with the phenomenon.

**Result:** The team stops debating domain fixes and instead interviews 10 churned users. They discover the real issue: users who hit a specific error during their first integration attempt never come back. It is a cross-domain problem (API error + unclear error message + no recovery flow in onboarding) that no single professional position could see.

## Watch Out For

- Exiting your position does not mean your expertise is wrong — it means it is partial. You will return to your position after seeing the fuller picture
- The methodologist's chair can become its own professional position. Do not get stuck there. The point is to see and then act, not to endlessly analyze methodologies
- In team settings, asking others to exit their positions can feel threatening. Frame it as "let's all step out together" rather than "your view is biased"
- This move takes practice. The first few times you will find yourself sneaking back into your professional frame mid-exercise. That is normal — just notice it and step out again
