---
id: TF-128
name: Awareness Before Action
one_liner: "Before doing anything, spend 60 seconds just noticing. What is actually true right now?"
mode: [plan, stuck]
category: Meta
tags: [awareness, mindfulness, assumptions, rick-rubin, creative-act, observation, grounding]
effort: snap
origin: Rick Rubin, "The Creative Act" — Awareness as creative practice
problem_signatures:
  - "I jumped into solving and realized later I was solving the wrong problem"
  - "I'm reacting to what I think is happening, not what's actually happening"
  - "the last three decisions were based on assumptions I didn't verify"
  - "I feel urgent but I can't explain why"
  - "the team is moving fast but nobody stopped to look around"
pairs_with:
  - id: TF-019
    why: "Map the Assumptions makes explicit what Awareness Before Action helps you notice"
  - id: TF-060
    why: "Feeling of Knowing Check catches the specific gap between what you think you know and what you actually know"
  - id: TF-005
    why: "Name Your Current Strategy to articulate what you notice you're actually doing"
---

## The Move

Stop. Set a 60-second timer. Do not plan, do not solve, do not discuss. Just notice. Answer these four questions in writing: (1) What is the actual state of the system right now — not what it should be, what it IS? (2) What am I feeling — urgency, confusion, excitement, dread? (3) What am I assuming that I have not verified? (4) What signal am I currently ignoring because it's inconvenient? After 60 seconds, read your answers. The gap between your answers and the story you were telling yourself before the pause — that gap is where mistakes are born. Close the gap before acting.

## When to Use

- You are about to start a sprint, project, or debugging session
- You feel the urge to act immediately and cannot explain why
- The last decision turned out to be based on a false assumption
- The team is in firefighting mode and nobody has paused to assess

## Diagram

```mermaid
flowchart TD
    A["Impulse to act"] --> B["STOP — 60 second pause"]
    B --> C["What IS the actual state?"]
    B --> D["What am I feeling?"]
    B --> E["What am I assuming?"]
    B --> F["What signal am I ignoring?"]
    C --> G["Write answers"]
    D --> G
    E --> G
    F --> G
    G --> H{"Gap between reality and your story?"}
    H -- Small --> I["Proceed — your model is accurate"]
    H -- Large --> J["Update your model BEFORE acting"]

    style B fill:#9b59b6,color:#fff
    style H fill:#f39c12,color:#fff
    style J fill:#e74c3c,color:#fff
```

## Example

**Situation:** Production is throwing 500 errors. The on-call engineer is about to roll back the last deploy.

**Awareness pause (60 seconds):**
1. **Actual state:** Error rate is 2.3% (up from 0.1%). Only hitting the `/api/search` endpoint. Last deploy was 3 hours ago. Errors started 20 minutes ago.
2. **Feeling:** Urgency. Panic. The Slack channel has 40 messages.
3. **Assumptions:** "The last deploy caused this." But the deploy was 3 hours ago and errors started 20 minutes ago. That's a 2-hour-40-minute gap. Why would a deploy cause errors with a delay?
4. **Ignoring:** The search endpoint depends on an external Elasticsearch cluster. Nobody has checked ES health.

**What the pause revealed:** The assumption "last deploy caused this" does not fit the timeline. A 60-second check of the ES cluster shows it is in a degraded state due to a node failure. Rolling back the deploy would have wasted 30 minutes and not fixed the problem.

**Result:** Instead of a pointless rollback, the engineer restarts the failed ES node and errors clear in 2 minutes. The pause saved 30 minutes and a red-herring investigation.

## Watch Out For

- 60 seconds feels like an eternity when you are under pressure. That is exactly when this move is most valuable. The urgency you feel is often the urgency to act on an assumption, not the urgency of the actual situation
- This is not meditation or mindfulness theater. It is a concrete diagnostic: 4 questions, written answers, 60 seconds. Do not turn it into a 20-minute reflection
- If you do this and your model was already accurate, good — you lost 60 seconds and gained confidence. The cost of the check is always lower than the cost of acting on a false model
- Do not use this as a procrastination tool. The timer is 60 seconds, not "until I feel ready." Notice, then act
