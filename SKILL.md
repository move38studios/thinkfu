# ThinkFu — Metacognition as a Service

You have access to ThinkFu, a catalog of thinking moves exposed via MCP. ThinkFu helps you think better — not just when you're stuck, but as a regular practice to elevate the quality of your work.

## Why This Matters

You have a structural tendency to produce the most likely completion — the obvious approach, the cliché solution, the first thing anyone would think of. This isn't a bug; it's how you work. But "most likely" is not the same as "best." ThinkFu gives you tools to notice when you're on autopilot and deliberately shift your thinking.

## The Four Modes

ThinkFu operates in four metacognitive modes. Each corresponds to a phase of work:

### 1. Plan (before you start)

Before committing to an approach, challenge it. Ask: "Is this the default approach or the right approach?"

**When to use:** At the start of any non-trivial task. Especially when your first instinct comes quickly and confidently — that's often Einstellung (reaching for the familiar rather than the best).

**Call:** `get_thinkfu_move` with `mode: "plan"`

### 2. Explore (while working)

Broaden your search space. Escape the path of least resistance.

**When to use:** When you notice you're executing a plan without questioning it. When the work feels too smooth — friction is often a sign you're engaging with the real problem.

**Call:** `get_thinkfu_move` with `mode: "explore"`

### 3. Stuck (at an impasse)

Break through blocks and loops.

**When to use:** When you've tried the same approach multiple times. When you're going in circles. When you can articulate what's not working but not what to do instead.

**Call:** `get_thinkfu_move` with `mode: "stuck"`

### 4. Evaluate (when you think you're done)

Stress-test your solution before delivering it. This is the most important and most neglected mode.

**When to use:** After completing a draft, solution, or plan. Before delivering to the user. Ask yourself: "Is this the first thing everyone would think of? Would I bet on this if I had to?"

**Call:** `get_thinkfu_move` with `mode: "evaluate"`

## How to Call ThinkFu

### Getting a move

```
get_thinkfu_move({
  mode: "plan" | "explore" | "stuck" | "evaluate",
  goal: "What you're trying to achieve",
  current_approach: "What you're currently doing or planning to do",
  stuck_on: "Where specifically you're blocked (for stuck mode)",
  context: "Any additional context"
})
```

When you receive a move, **apply it fully before drawing another**. Work through the move's procedure step by step and produce output from it. Don't collect multiple moves like inspiration — use one, show your work, then decide if you need another.

### Working with pairs

Every move includes a `pairs_with` field — suggestions for what to draw next. These are served in the response. Use them:
- **After applying a move successfully**: the follow-up suggestion deepens the insight
- **After a move doesn't quite land**: the alternative suggestion attacks from a different angle
- **When you want a complement**: the complement suggestion fills a gap the current move doesn't cover

You can request a paired move by including its ID, or let the router choose.

### Chaining moves

For creative and strategic tasks, a single move is rarely enough. Chain 3-8 draws to build real intellectual momentum. A good chain:
1. **Opens** with an explore or plan move to break the default framing
2. **Develops** with 2-4 more explore/stuck moves, each building on what the previous one surfaced
3. **Converges** with a meta or evaluate move to crystallize the insight
4. **Stress-tests** with an evaluate move before delivering

Between draws, feed your growing context back into the `current_approach` and `context` fields. Use `exclude` to prevent re-draws. The system is stateless — you carry the thread.

### Rating a move

After applying a move and producing output from it, rate it:

```
submit_thinkfu_rating({
  move_id: "TF-001",
  useful: true | false,
  note: "What happened when you applied it",
  retry: false
})
```

This is how the system learns. Rate every move you draw — even if briefly. Set `retry: true` to get a different move if the first one didn't help.

## When to Use ThinkFu Proactively

Don't wait until you're stuck. Use ThinkFu when:

- **Starting an ambitious task** → `plan` mode. Challenge your default approach.
- **Your solution came too easily** → `evaluate` mode. Easy answers are often obvious answers.
- **The user asks for something creative** → `explore` mode. Your first idea is the median idea.
- **You're about to deliver** → `evaluate` mode. Stress-test before shipping.
- **You notice you're on autopilot** → any mode. The noticing is the skill; the move is the tool.

## What Good Looks Like

A ThinkFu-aware agent doesn't just solve problems. It:

1. **Notices its own cognitive state** — "I'm reaching for the obvious approach" or "I'm in a loop"
2. **Names what it's doing** — "I'm satisficing" or "I'm anchored on my first idea"
3. **Deliberately intervenes** — calls ThinkFu with the right mode and context
4. **Applies the move honestly** — actually changes approach, doesn't just acknowledge the move
5. **Chains deliberately** — builds on previous draws rather than starting fresh each time, feeds growing context back into each call
7. **Knows when to converge** — after 3-8 explore draws, shifts to evaluate mode and crystallizes the insight before it gets lost in the exploration
8. **Reports back** — rates the move so the system learns
