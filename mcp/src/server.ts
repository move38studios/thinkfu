import { FastMCP } from "fastmcp";
import { z } from "zod";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { loadCatalog } from "./catalog.js";
import { resolveCard, ResolvedCard } from "./resolver.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogDir = join(__dirname, "..", "..", "catalog");
const ratingsFile = join(__dirname, "..", "ratings.jsonl");

// Load catalog at startup
const { cards, pools } = loadCatalog(catalogDir);
console.error(`ThinkFu: loaded ${cards.length} cards, ${Object.keys(pools).length} pools`);

// --- Helpers ---

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function filterCards(
  mode?: string,
  category?: string,
  exclude?: string[]
) {
  let filtered = cards;
  if (mode) {
    filtered = filtered.filter((c) => c.frontmatter.mode.includes(mode));
  }
  if (category) {
    filtered = filtered.filter(
      (c) => c.frontmatter.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (exclude && exclude.length > 0) {
    filtered = filtered.filter((c) => !exclude.includes(c.frontmatter.id));
  }
  return filtered;
}

function formatCard(resolved: ResolvedCard): string {
  const lines = [
    `# ${resolved.name}`,
    "",
    `> ${resolved.one_liner}`,
    "",
    `**Mode:** ${resolved.mode.join(", ")} | **Effort:** ${resolved.effort} | **Category:** ${resolved.category}`,
    `**Seed:** ${resolved._seed} | **Instance:** ${resolved._instance}`,
    "",
    resolved.body,
  ];

  if (resolved.pairs_with.length > 0) {
    lines.push("", "## Pairs With", "");
    for (const pair of resolved.pairs_with) {
      lines.push(`- **${pair.id}**: ${pair.why}`);
    }
  }

  return lines.join("\n");
}

function logRating(data: Record<string, unknown>) {
  const line = JSON.stringify({ ...data, timestamp: new Date().toISOString() });
  appendFileSync(ratingsFile, line + "\n");
}

// --- Server ---

const server = new FastMCP({
  name: "ThinkFu",
  version: "0.1.0",
});

// Tool 1: list_thinkfu_moves
server.addTool({
  name: "list_thinkfu_moves",
  description:
    "List available ThinkFu thinking moves. Optionally filter by metacognitive mode (plan, explore, stuck, evaluate) or category (Planning, Exploration, Unsticking, Evaluation, Meta).",
  parameters: z.object({
    mode: z
      .enum(["plan", "explore", "stuck", "evaluate"])
      .optional()
      .describe("Filter by metacognitive mode"),
    category: z
      .string()
      .optional()
      .describe("Filter by category name"),
  }),
  execute: async (args) => {
    const filtered = filterCards(args.mode, args.category);
    const summaries = filtered.map((c) => ({
      id: c.frontmatter.id,
      name: c.frontmatter.name,
      one_liner: c.frontmatter.one_liner,
      mode: c.frontmatter.mode,
      category: c.frontmatter.category,
      effort: c.frontmatter.effort,
    }));
    return JSON.stringify(summaries, null, 2);
  },
});

// Tool 2: get_thinkfu_move
server.addTool({
  name: "get_thinkfu_move",
  description:
    "Get a ThinkFu thinking move. Use this when planning, exploring, stuck, or evaluating your work. Returns a full card with a concrete procedure to shift your thinking. Every response includes a random seed word for cognitive perturbation.",
  parameters: z.object({
    mode: z
      .enum(["plan", "explore", "stuck", "evaluate"])
      .describe("Your metacognitive mode: plan (before starting), explore (while working), stuck (blocked), evaluate (think you are done)"),
    goal: z.string().describe("What are you trying to achieve?"),
    current_approach: z
      .string()
      .optional()
      .describe("What is your current approach or solution?"),
    stuck_on: z
      .string()
      .optional()
      .describe("Where specifically are you stuck? (for stuck mode)"),
    context: z
      .string()
      .optional()
      .describe("Any additional context"),
    exclude: z
      .array(z.string())
      .optional()
      .describe("Move IDs to exclude (already tried)"),
    style: z
      .enum(["matched", "random", "oblique"])
      .optional()
      .describe("Routing style: matched (best fit), random (pure chance), oblique (deliberately tangential)"),
  }),
  execute: async (args) => {
    const style = args.style ?? "matched";

    let filtered;
    if (style === "oblique") {
      // Deliberately pick from a DIFFERENT mode
      const otherModes = ["plan", "explore", "stuck", "evaluate"].filter(
        (m) => m !== args.mode
      );
      const otherMode = pickRandom(otherModes);
      filtered = filterCards(otherMode, undefined, args.exclude);
    } else {
      // matched and random both filter by mode (matched will get smarter later)
      filtered = filterCards(args.mode, undefined, args.exclude);
    }

    if (filtered.length === 0) {
      // Fall back to all cards minus excludes
      filtered = filterCards(undefined, undefined, args.exclude);
    }

    if (filtered.length === 0) {
      return "No moves available. All cards have been excluded.";
    }

    const card = pickRandom(filtered);
    const resolved = resolveCard(card, pools);
    return formatCard(resolved);
  },
});

// Tool 3: submit_thinkfu_rating
server.addTool({
  name: "submit_thinkfu_rating",
  description:
    "Rate a ThinkFu move after applying it. Helps the system learn which moves work for which situations. Include the original context for training data. Set retry=true to get a different move.",
  parameters: z.object({
    move_id: z.string().describe("The move ID (e.g. TF-001)"),
    instance_id: z.string().optional().describe("The instance ID from the card response"),
    useful: z.boolean().describe("Was the move useful?"),
    note: z
      .string()
      .optional()
      .describe("What happened when you applied the move"),
    original_request: z
      .object({
        mode: z.string(),
        goal: z.string(),
        current_approach: z.string().optional(),
        stuck_on: z.string().optional(),
        context: z.string().optional(),
      })
      .optional()
      .describe("The original suggest request context"),
    retry: z
      .boolean()
      .optional()
      .describe("Set true to get a different move"),
  }),
  execute: async (args) => {
    // Log the rating
    logRating({
      move_id: args.move_id,
      instance_id: args.instance_id,
      useful: args.useful,
      note: args.note,
      original_request: args.original_request,
    });

    if (args.retry && args.original_request) {
      // Serve another card, excluding the rated one
      const mode = args.original_request.mode as "plan" | "explore" | "stuck" | "evaluate";
      const filtered = filterCards(mode, undefined, [args.move_id]);

      if (filtered.length === 0) {
        return "Rating recorded. No alternative moves available.";
      }

      const card = pickRandom(filtered);
      const resolved = resolveCard(card, pools);
      return `Rating recorded. Here's another move:\n\n${formatCard(resolved)}`;
    }

    return "Rating recorded. Thank you.";
  },
});

// Start
server.start({
  transportType: "stdio",
});
