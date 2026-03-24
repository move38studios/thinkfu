import type { Move, MoveFrontmatter, Pools } from "@thinkfu/lib/types.js";
import catalogBundle from "../catalog-bundle.json";

// Frontmatter is pre-parsed at build time by the full yaml package.
// No runtime parsing needed.
const bundle = catalogBundle as { moves: Array<{ frontmatter: MoveFrontmatter; body: string }>; pools: Pools };

const moves: Move[] = bundle.moves.map((m) => ({
  frontmatter: m.frontmatter,
  body: m.body,
  raw: "", // not needed at runtime
}));

const pools: Pools = bundle.pools;

export { moves, pools };
