---
id: TF-184
name: Representation Shift
one_liner: "You're not stuck on a hard problem — you're stuck on a bad representation. Change the format."
mode: [stuck]
category: Unsticking
tags: [representation, Simon, Newell, problem-solving, reframing, visualization, format]
effort: quick
origin: Herbert Simon / Newell — "Representation matters more than search"
problem_signatures:
  - "I've been staring at this code for an hour and can't see the bug"
  - "the problem feels impossibly complex"
  - "I understand each piece but can't see how they fit together"
  - "I keep getting confused by the same thing"
  - "when I explain it to someone else, it suddenly seems different"
variables:
  genre:
    type: pick
    count: 1
    pool: genres
pairs_with:
  - id: TF-014
    why: "explain it to a child is a specific representation shift — from technical to simple language"
  - id: TF-081
    why: "see the whole thing at once is a representation shift from sequential to spatial"
  - id: TF-020
    why: "zoom in/zoom out shifts the level of abstraction within the same representation"
---

## The Move

Shift to the native format of {{genre.1}}. Simon and Newell showed that choosing the right REPRESENTATION often matters more than clever problem-solving within a bad representation. The famous Mutilated Checkerboard problem is nearly impossible when represented as a tiling problem and trivial when represented as a coloring problem. You are stuck — but the problem may not be hard. Your REPRESENTATION may be making it hard. Rewrite the problem in a completely different format: if it is code, draw it as a diagram. If it is a diagram, write it as a narrative. If it is abstract, make it concrete with specific numbers. If it is a wall of text, make it a table. The same problem in a new representation may be trivially easy.

## When to Use

- You have been staring at the same representation for too long without progress
- The problem feels impossibly complex but you suspect it should not be
- You understand each piece individually but cannot see the whole
- Explaining the problem in a different medium (whiteboard, conversation) makes it suddenly clearer

## Diagram

```mermaid
flowchart TD
    A["Stuck on a problem"] --> B["Identify current representation"]
    B --> C{"What format is it in?"}
    C -- Code --> D["Draw it as a diagram"]
    C -- Diagram --> E["Write it as a narrative"]
    C -- Abstract --> F["Make it concrete with real numbers"]
    C -- Text --> G["Convert to a table or matrix"]
    C -- Sequential --> H["Make it spatial/visual"]
    D --> I["Re-examine: is it still hard?"]
    E --> I
    F --> I
    G --> I
    H --> I

    style B fill:#f39c12,color:#fff
    style I fill:#2ecc71,color:#fff
```

## Example

**Problem:** A developer is debugging a race condition in an order processing system. Three services (Payment, Inventory, Notification) communicate via events. Orders occasionally end up in an inconsistent state — payment charged but inventory not decremented. The developer has been reading event handler code across three repositories for two hours, tracing execution paths in their head.

**Current representation:** Code (sequential text across three repos).

**Representation shift — sequence diagram:**

```
Payment Service          Inventory Service         Notification Service
     |                         |                         |
     |--- PaymentCharged --->  |                         |
     |                         |--- InventoryReserved --> |
     |                         |                         |--- NotifyUser
     |                         |                         |
     |  (What if this fails?)  |                         |
     |                         |<-- timeout, no ack --   |
     |                         |--- InventoryReleased    |
     |                         |                         |
     |  (But payment already   |                         |
     |   charged!)             |                         |
```

**What the new representation reveals:** The race condition is immediately visible in the sequence diagram: the Inventory Service releases inventory on timeout, but the Payment Service has already charged. In code, this required tracing through three repos and mentally simulating asynchronous timing. In the diagram, the gap between the PaymentCharged event and the InventoryReleased event is visually obvious. The fix is also obvious in this representation: the Payment Service needs to listen for InventoryReleased events and issue a refund. In the code representation, this missing handler was invisible because you cannot see what is NOT there.

## Watch Out For

- Representation shifts take effort. You must actually DO the conversion, not just think "I could draw this." The insight comes from the act of translating, which forces you to re-examine every element
- Some representations lose information. A diagram of code drops the details. A narrative of a diagram drops the spatial relationships. Be aware of what each format hides as well as what it reveals
- If the first shift does not help, try a second. The goal is not any specific format — it is breaking out of the representation that has you stuck
- Do not confuse this with "just think about it differently." This move requires a concrete, physical change in format — on paper, on screen, on a whiteboard. The new medium constrains your thinking in productive ways
