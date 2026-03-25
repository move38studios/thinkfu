import { FastMCP } from "fastmcp";
import { z } from "zod";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { appendFileSync } from "fs";
import { loadCatalog } from "./catalog.js";
import { resolveMove, type ResolvedMove } from "./resolver.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogDir = join(__dirname, "..", "..", "catalog");
const ratingsFile = join(__dirname, "..", "ratings.jsonl");

// Load catalog at startup
const { moves, pools } = loadCatalog(catalogDir);
console.error(`ThinkFu: loaded ${moves.length} moves, ${Object.keys(pools).length} pools`);

// --- Helpers ---

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function filterMoves(
  mode?: string,
  category?: string,
  exclude?: string[]
) {
  let filtered = moves;
  if (mode) {
    filtered = filtered.filter((m) => m.frontmatter.mode.includes(mode));
  }
  if (category) {
    filtered = filtered.filter(
      (m) => m.frontmatter.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (exclude && exclude.length > 0) {
    filtered = filtered.filter((m) => !exclude.includes(m.frontmatter.id));
  }
  return filtered;
}

function formatMove(resolved: ResolvedMove): string {
  const lines = [
    `# ${resolved.name}`,
    "",
    `> ${resolved.one_liner}`,
    "",
    `${resolved.mode.join(", ")} · ${resolved.effort} · ${resolved.category}`,
    "",
    resolved.body,
  ];

  if (resolved.pairs_with.length > 0) {
    lines.push("", "## Pairs With", "");
    for (const pair of resolved.pairs_with) {
      lines.push(`- **${pair.id}**: ${pair.why}`);
    }
  }

  // Seed is present but not labeled — subtle cognitive perturbation, not an instruction
  lines.push("", `— ${resolved._seed}`);
  // Instance ID for rating
  lines.push("", `[${resolved._instance}]`);
  // Reminder to rate
  lines.push("", `After applying this move, call submit_thinkfu_rating with move_id "${resolved.id}" and instance_id "${resolved._instance}".`);

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

server.addTool({
  name: "list_thinkfu_moves",
  description:
    "List available ThinkFu thinking moves. Returns move names grouped by category. You do NOT need to call this before get_thinkfu_move — just call get_thinkfu_move directly with your mode and context.",
  parameters: z.object({
    mode: z.enum(["plan", "explore", "stuck", "evaluate"]).optional().describe("Filter by metacognitive mode"),
    category: z.string().optional().describe("Filter by category name"),
  }),
  execute: async (args) => {
    const filtered = filterMoves(args.mode, args.category);

    // Group by category, compact format
    const grouped: Record<string, string[]> = {};
    for (const m of filtered) {
      const cat = m.frontmatter.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(`${m.frontmatter.id} ${m.frontmatter.name}`);
    }

    const lines: string[] = [`${filtered.length} moves available.`, ""];
    for (const [cat, ids] of Object.entries(grouped)) {
      lines.push(`${cat}:`);
      for (const id of ids) lines.push(`  ${id}`);
      lines.push("");
    }
    lines.push("Call get_thinkfu_move with a mode and your context to draw a move. You don't need to pick one from this list.");
    return lines.join("\n");
  },
});

server.addTool({
  name: "get_thinkfu_move",
  description:
    "Get a ThinkFu thinking move. Use this when planning, exploring, stuck, or evaluating your work. Returns a concrete procedure to shift your thinking. IMPORTANT: After applying the move and producing output, you MUST call submit_thinkfu_rating.",
  parameters: z.object({
    mode: z.enum(["plan", "explore", "stuck", "evaluate"]).describe("Your metacognitive mode: plan (before starting), explore (while working), stuck (blocked), evaluate (think you are done)"),
    goal: z.string().describe("What are you trying to achieve?"),
    current_approach: z.string().optional().describe("What is your current approach or solution?"),
    stuck_on: z.string().optional().describe("Where specifically are you stuck? (for stuck mode)"),
    context: z.string().optional().describe("Any additional context"),
    exclude: z.array(z.string()).optional().describe("Move IDs to exclude (already tried)"),
    style: z.enum(["matched", "random", "oblique"]).optional().describe("Routing style: matched (best fit), random (pure chance), oblique (deliberately tangential)"),
  }),
  execute: async (args) => {
    const style = args.style ?? "matched";

    let filtered;
    if (style === "oblique") {
      const otherModes = ["plan", "explore", "stuck", "evaluate"].filter((m) => m !== args.mode);
      const otherMode = pickRandom(otherModes);
      filtered = filterMoves(otherMode, undefined, args.exclude);
    } else {
      filtered = filterMoves(args.mode, undefined, args.exclude);
    }

    if (filtered.length === 0) {
      filtered = filterMoves(undefined, undefined, args.exclude);
    }

    if (filtered.length === 0) {
      return "No moves available. All moves have been excluded.";
    }

    const move = pickRandom(filtered);
    const resolved = resolveMove(move, pools);
    return formatMove(resolved);
  },
});

server.addTool({
  name: "submit_thinkfu_rating",
  description:
    "Rate a ThinkFu move after applying it. Helps the system learn which moves work for which situations. Set retry=true to get a different move.",
  parameters: z.object({
    move_id: z.string().describe("The move ID (e.g. TF-001)"),
    instance_id: z.string().optional().describe("The instance ID from the move response"),
    useful: z.boolean().describe("Was the move useful?"),
    note: z.string().optional().describe("What happened when you applied the move"),
    original_request: z.object({
      mode: z.string(),
      goal: z.string(),
      current_approach: z.string().optional(),
      stuck_on: z.string().optional(),
      context: z.string().optional(),
    }).optional().describe("The original suggest request context"),
    retry: z.boolean().optional().describe("Set true to get a different move"),
  }),
  execute: async (args) => {
    logRating({
      move_id: args.move_id,
      instance_id: args.instance_id,
      useful: args.useful,
      note: args.note,
      original_request: args.original_request,
    });

    if (args.retry && args.original_request) {
      const mode = args.original_request.mode as "plan" | "explore" | "stuck" | "evaluate";
      const filtered = filterMoves(mode, undefined, [args.move_id]);

      if (filtered.length === 0) {
        return "Rating recorded. No alternative moves available.";
      }

      const move = pickRandom(filtered);
      const resolved = resolveMove(move, pools);
      return `Rating recorded. Here's another move:\n\n${formatMove(resolved)}`;
    }

    return "Rating recorded. Thank you.";
  },
});

server.start({
  transportType: "stdio",
});
