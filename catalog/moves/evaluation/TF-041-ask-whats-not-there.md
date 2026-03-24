---
id: TF-041
name: Ask What's Not There
one_liner: The most revealing thing about your solution is what you forgot to include.
mode: [evaluate]
category: Evaluation
tags: [negative-space, gaps, blind-spots, review, completeness]
effort: quick
origin: Negative space thinking / Absence-based reasoning / Sherlock Holmes ("the dog that didn't bark")
problem_signatures:
  - "the design looks complete but something feels off"
  - "we got no pushback in the review, which worries me"
  - "it works for the happy path but I'm not sure about the rest"
  - "I can't tell if this is simple or just incomplete"
  - "the plan is clean — maybe too clean"
variables:
  persona:
    type: pick
    count: 1
    pool: personas
pairs_with:
  - id: TF-015
    why: "red team the specific gaps you found to determine their severity"
  - id: TF-019
    why: "map the assumptions hiding behind each absence"
  - id: TF-016
    why: "change the audience to discover absences you can't see from your own perspective"
---

## The Move

Look at your solution, design, or plan. Instead of evaluating what's there, list what's absent. Answer these five questions: (1) What user did you not consider? (2) What failure mode has no handler? (3) What input did you not account for? (4) What question does this design not answer? (5) What transition or state change is missing?

What would {{persona.1}} notice is conspicuously absent? Write each absence down. Rank them by how damaging they'd be if they surfaced in production. The top two absences are your blind spots — address them before calling the design done.

## When to Use

- You've finished a design and it feels suspiciously clean
- A review passed with no objections and that makes you nervous
- You're evaluating someone else's proposal and want to find what they missed
- You need to stress-test a plan without building a full prototype

## Diagram

```mermaid
flowchart TD
    A["Your solution"] --> B["What user is missing?"]
    A --> C["What failure has no handler?"]
    A --> D["What input is unaccounted for?"]
    A --> E["What question is unanswered?"]
    A --> F["What state change is missing?"]
    B --> G["Rank absences by damage potential"]
    C --> G
    D --> G
    E --> G
    F --> G
    G --> H["Address top 2 blind spots"]

    style A fill:#3498db,color:#fff
    style H fill:#2ecc71,color:#fff
```

## Example

**Solution under review:** An API design for a collaborative document editor. It has endpoints for create, read, update, delete, share, and real-time sync.

**What's not there:**
1. **Missing user:** What about the user who was shared-to but doesn't have an account yet? No invited-user flow exists.
2. **Missing failure mode:** What happens when two users edit the same paragraph simultaneously and the sync fails? No conflict resolution endpoint or strategy.
3. **Missing input:** What about documents with embedded images or files? The schema only handles text.
4. **Missing question:** Who can revoke sharing permissions? The share endpoint exists but there's no unshare.
5. **Missing transition:** What happens when a document owner deletes their account? No ownership-transfer or orphan-document handling.

**Result:** Items 2 and 4 ranked highest for damage potential. Conflict resolution was added to the design before implementation. The unshare endpoint was trivial to add but would have been embarrassing to discover in production.

## Watch Out For

- This move finds gaps, not solutions. Once you've identified the absence, you still need to decide whether it matters enough to address now
- Don't use this to generate an infinite punch list. Five questions, top two absences — then move on
- Absence-hunting can become perfectionism. Some gaps are acceptable. The question is "would this absence cause real harm?" not "is this theoretically incomplete?"
- If you can't find any absences, ask someone unfamiliar with the project to look. Fresh eyes see negative space more easily
