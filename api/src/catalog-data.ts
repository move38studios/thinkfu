import { parseFrontmatter } from "@thinkfu/lib/parser.js";
import type { Move, Pools } from "@thinkfu/lib/types.js";
import catalogBundle from "../catalog-bundle.json";

const moves: Move[] = [];
for (const entry of (catalogBundle as any).cards) {
  try {
    const { frontmatter, body } = parseFrontmatter(entry.raw);
    moves.push({ frontmatter, body, raw: entry.raw });
  } catch (e) {
    console.error(`Failed to parse move: ${e}`);
  }
}

const pools: Pools = (catalogBundle as any).pools;

export { moves, pools };
