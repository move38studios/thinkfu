---
id: TF-197
name: Genre Shift
one_liner: "Your problem is stuck in its genre. Recast it as **{{genre.1}}**, then **{{genre.2}}** — the structure suggests the solution."
mode: [explore, evaluate]
category: Exploration
tags: [reframing, narrative, genre, structure, creative, perspective-shifting]
effort: quick
origin: Narrative reframing / Genre theory
problem_signatures:
  - "the problem feels stale and I keep writing the same analysis"
  - "I'm trapped in engineering-speak and can't see the human dynamics"
  - "the solution structure feels obvious but unimaginative"
  - "I need a new arc — not just a new idea, a new shape for the whole thing"
  - "stakeholder conversations keep rehashing the same framing"
variables:
  genre:
    type: pick
    count: 2
    pool: genres
pairs_with:
  - id: TF-115
    why: "Frame the Frame names the current frame; Genre Shift replaces it with a narrative structure that has built-in momentum"
  - id: TF-003
    why: "Three Framings generates multiple views; Genre Shift gives each view a complete narrative arc with tension and resolution"
  - id: TF-144
    why: "Excavate the Metaphor digs into a single metaphor; genre is a macro-metaphor that shapes the entire problem structure"
---

## The Move

First, name the genre your problem is currently living in. (Most technical problems default to "engineering report" or "business case.") Now recast the entire situation as **{{genre.1}}**. Who is the protagonist? What is the central tension? What does the genre's structure demand happens next — a twist, a reveal, a reversal, a climax? Write a 3-4 sentence version of your problem in that genre. Then recast it again as **{{genre.2}}**. Different genres have different resolution structures: a mystery needs a hidden truth revealed, a heist needs a team with complementary skills, a comedy needs a reversal of expectations. The genre's expected resolution suggests a solution shape your problem's native genre doesn't.

## When to Use

- The problem statement has calcified into one way of telling the story
- You need to see the human/political/emotional dynamics that technical framing hides
- Stakeholders are bored or disengaged with the current framing
- You want to discover what kind of resolution this problem actually needs

## Diagram

```mermaid
flowchart TD
    A["Name the genre your problem is currently in"] --> B["Recast as {{genre.1}}"]
    B --> C["Who's the protagonist? What's the tension? What happens next?"]
    A --> D["Recast as {{genre.2}}"]
    D --> E["Who's the protagonist? What's the tension? What happens next?"]
    C --> F["What resolution structure does each genre demand?"]
    E --> F
    F --> G["Map genre resolutions back to concrete solutions"]

    style A fill:#7f8c8d,color:#fff
    style B fill:#e67e22,color:#fff
    style D fill:#9b59b6,color:#fff
    style G fill:#2ecc71,color:#fff
```

## Example

**Problem:** "Our payment processing system has intermittent failures that nobody can reproduce. Three teams have investigated. Each blames a different upstream dependency."

**Current genre:** Detective procedural / blame game.

**Recast as mystery:** "Something is stealing transactions in the night. Three witnesses point in different directions. In a mystery, the resolution is always: the clues that DON'T fit the obvious suspects are the real clues. What evidence have all three teams dismissed because it didn't fit THEIR theory? There's a hidden actor — a cron job, a race condition, a DNS cache — that no team owns, which is why no team found it."

**Recast as heist:** "The system needs to move a payment from point A to point B through hostile territory (unreliable networks, concurrent requests, stale caches). In a heist, every team member has a specialty. The failure happens when two specialists' domains overlap and neither covers the gap. Map the handoff points. The bug lives in a seam between teams, not inside any team's domain."

**What shifted:** The mystery framing says "look at what's been dismissed." The heist framing says "look at the seams between specialists." Both point away from deeper investigation within each team and toward the gaps between them. Concrete next step: audit the inter-service boundaries that no single team owns.

## Watch Out For

- The genre is a thinking tool, not a presentation format. You don't need to write an actual mystery — you need the mystery's STRUCTURE to suggest where to look
- Some genres will feel forced for your problem. That's useful information — it means your problem has a strong implicit genre that's worth naming
- Don't stop at "this is funny." Push to: "what resolution does this genre demand, and what does that suggest I should actually do?"
- The most productive genre shifts are usually the most surprising ones. If the genre feels like a natural fit, it probably won't reveal much
