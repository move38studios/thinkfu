---
id: TF-173
name: Knowledge as Design
one_liner: "Treat your solution as a design. What's its purpose, structure, model case, and argument for/against?"
mode: [evaluate, plan]
category: Evaluation
tags: [Project-Zero, Perkins, design, purpose, structure, model-cases, arguments, evaluation]
effort: quick
origin: David Perkins, "Knowledge as Design" (1986) — Project Zero
variables:
  domain:
    type: pick
    count: 1
    pool: domains
problem_signatures:
  - "I can describe the solution but I can't explain WHY it's the right one"
  - "I understand the pieces but not how they justify the whole"
  - "my design doc describes structure but not purpose"
  - "I can't explain this decision to someone outside my team"
  - "the solution works but I can't articulate its strengths and weaknesses"
pairs_with:
  - id: TF-172
    why: "Claim/Support/Question audits individual claims; Knowledge as Design audits the entire solution as a coherent design"
  - id: TF-034
    why: "what would have to be true generates assumptions; Knowledge as Design's Arguments phase tests them"
  - id: TF-004
    why: "import from another domain brings external patterns; Knowledge as Design's cross-domain question checks your solution against them"
---

## The Move

Treat your solution, tool, or concept as a deliberate DESIGN and answer four questions. (1) **PURPOSE:** What is it for? What problem does it solve and for whom? If you can't state the purpose in one sentence, you don't understand it yet. (2) **STRUCTURE:** What are its parts and how do they relate? Draw it. Name the components. (3) **MODEL CASES:** What is one clear example of it working as intended? Walk through the happy path concretely. (4) **ARGUMENTS:** What's the evidence for this design? What's the evidence against it? Any answer weak on one of these four questions has a gap. Then ask: how would someone in **{{domain.1}}** answer these four questions about their version of this problem?

## When to Use

- You need to evaluate whether a solution is sound, not just whether it works
- You're writing a design doc or RFC and want a structured framework
- You can build it but can't explain it — a sign of shallow understanding
- You're comparing two competing approaches and need a consistent evaluation lens

## Diagram

```mermaid
flowchart TD
    A["Your solution"] --> B["PURPOSE: What is it for?"]
    A --> C["STRUCTURE: What are the parts?"]
    A --> D["MODEL CASE: Walk through a concrete example"]
    A --> E["ARGUMENTS: Evidence for and against?"]
    B --> F{"Any answer weak?"}
    C --> F
    D --> F
    E --> F
    F -- Yes --> G["The weak answer is where your understanding has a gap"]
    F -- No --> H["Cross-domain check: How would {{domain.1}} answer these?"]

    style B fill:#3498db,color:#fff
    style C fill:#f39c12,color:#fff
    style D fill:#9b59b6,color:#fff
    style E fill:#e74c3c,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Situation:** You've designed a feature flag system for gradual rollouts. You need to present it to the team.

**(1) PURPOSE:** Enable product teams to roll out features to a percentage of users, with instant kill-switch capability, without requiring a deploy. Audience: product engineers who don't want to manage infrastructure.

**(2) STRUCTURE:** Three components: a **Flag Store** (key-value database mapping flag names to rollout rules), a **SDK** (client library that evaluates flags locally using cached rules), and an **Admin UI** (dashboard for creating/modifying flags and viewing rollout status). The SDK polls the Flag Store every 30 seconds for rule updates.

**(3) MODEL CASE:** Engineer creates flag `new-checkout-v2` in the Admin UI, sets rollout to 5% of users using consistent hashing on user ID. SDK in the checkout service evaluates the flag on each request. Engineer monitors error rates, bumps to 25%, then 100% over three days. On day two at 50%, error rate spikes — engineer hits kill switch in Admin UI, flag goes to 0% within 30 seconds (next SDK poll).

**(4) ARGUMENTS:**
- **For:** Decouples deployment from release. Consistent hashing means the same user always sees the same variant. 30-second polling means near-instant rollback without a deploy.
- **Against:** 30-second polling means up to 30 seconds of stale flags after a kill switch — is that acceptable for safety-critical features? Local evaluation means the SDK must have all user attributes available — what about server-side flags that depend on data the client doesn't have? No audit log in the current design — who changed what flag when?

**Cross-domain lens ({{domain.1}}):** How would someone in this domain handle the equivalent of gradual rollout with instant rollback? What can you import from their approach?

**Result:** The Arguments phase surfaced three real gaps: staleness on kill-switch, missing server-side attribute support, and no audit trail. Two of these are fixable before launch. The third (staleness) requires a design decision about push vs. poll that affects the entire architecture.

## Watch Out For

- Purpose seems obvious but is often unstated or vague. "It's a feature flag system" is not a purpose. "It lets product engineers roll out features without deploys" is. The purpose constrains the design — if you can't state it, you can't evaluate the design against it
- Model Cases must be concrete, not hypothetical. Walk through specific data, specific user actions, specific system responses. Abstract model cases hide flaws
- The Arguments section should be adversarial. If you can't find evidence against your design, you haven't looked hard enough. Every design has trade-offs
- The cross-domain question is not decorative. Practitioners in other fields have often solved the structural equivalent of your problem with entirely different patterns. Take it seriously
