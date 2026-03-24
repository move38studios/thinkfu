import type { Move, Pools } from "./types.js";
import { ResolvedMove, resolveMove } from "./resolver.js";

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function filterMoves(
  moves: Move[],
  opts: { mode?: string; category?: string; exclude?: string[] }
): Move[] {
  let filtered = moves;
  if (opts.mode) {
    filtered = filtered.filter((m) => m.frontmatter.mode.includes(opts.mode!));
  }
  if (opts.category) {
    filtered = filtered.filter(
      (m) => m.frontmatter.category.toLowerCase() === opts.category!.toLowerCase()
    );
  }
  if (opts.exclude && opts.exclude.length > 0) {
    filtered = filtered.filter((m) => !opts.exclude!.includes(m.frontmatter.id));
  }
  return filtered;
}

export function selectMove(
  moves: Move[],
  pools: Pools,
  opts: {
    mode: string;
    exclude?: string[];
    style?: "matched" | "random" | "oblique";
  }
): ResolvedMove | null {
  const style = opts.style ?? "matched";

  let filtered: Move[];
  if (style === "oblique") {
    const otherModes = ["plan", "explore", "stuck", "evaluate"].filter(
      (m) => m !== opts.mode
    );
    const otherMode = pickRandom(otherModes);
    filtered = filterMoves(moves, { mode: otherMode, exclude: opts.exclude });
  } else {
    filtered = filterMoves(moves, { mode: opts.mode, exclude: opts.exclude });
  }

  // Fall back to all moves minus excludes
  if (filtered.length === 0) {
    filtered = filterMoves(moves, { exclude: opts.exclude });
  }

  if (filtered.length === 0) return null;

  const move = pickRandom(filtered);
  return resolveMove(move, pools);
}

export function formatMoveAsMarkdown(resolved: ResolvedMove): string {
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
