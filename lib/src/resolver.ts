import type { Move, Pools, MoveVariable, MovePair } from "./types.js";

export interface ResolvedMove {
  _instance: string;
  _seed: string;
  id: string;
  name: string;
  one_liner: string;
  mode: string[];
  category: string;
  tags: string[];
  effort: string;
  origin: string;
  problem_signatures: string[];
  body: string;
  pairs_with: MovePair[];
  resolved_variables: Record<string, string[]>;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resolveVariables(
  variables: Record<string, MoveVariable> | undefined,
  pools: Pools
): Record<string, string[]> {
  const resolved: Record<string, string[]> = {};
  if (!variables) return resolved;

  for (const [name, def] of Object.entries(variables)) {
    if (!def || !def.type) continue;
    if (def.type === "pick") {
      const pool = pools[def.pool ?? ""];
      if (!pool || pool.length === 0) {
        resolved[name] = [`[unknown pool: ${def.pool}]`];
        continue;
      }
      resolved[name] = pickRandom(pool, def.count ?? 1);
    } else if (def.type === "number") {
      const n = randomInt(def.min ?? 1, def.max ?? 10);
      resolved[name] = [String(n)];
    }
  }

  return resolved;
}

function substituteTemplate(text: string, resolved: Record<string, string[]>): string {
  return text.replace(/\{\{(\w+)(?:\.(\d+))?\}\}/g, (match, name, indexStr) => {
    const values = resolved[name];
    if (!values) return match;
    const index = indexStr ? parseInt(indexStr, 10) - 1 : 0;
    return values[index] ?? match;
  });
}

function pickSeed(pools: Pools): string {
  const wordPool = pools["random-words"];
  if (wordPool && wordPool.length > 0) {
    return pickRandom(wordPool, 1)[0];
  }
  return crypto.randomUUID().slice(0, 8);
}

export interface ResolveOptions {
  seed?: string;
  variables?: Record<string, string[]>;
}

export function resolveMove(move: Move, pools: Pools, opts?: ResolveOptions): ResolvedMove {
  const resolved_variables = opts?.variables ?? resolveVariables(move.frontmatter.variables, pools);
  const seed = opts?.seed ?? pickSeed(pools);
  const instanceId = `${move.frontmatter.id}-${crypto.randomUUID().slice(0, 6)}`;

  const sub = (text: string) => substituteTemplate(text, resolved_variables);

  return {
    _instance: instanceId,
    _seed: seed,
    id: move.frontmatter.id,
    name: sub(move.frontmatter.name),
    one_liner: sub(move.frontmatter.one_liner),
    mode: move.frontmatter.mode,
    category: move.frontmatter.category,
    tags: move.frontmatter.tags,
    effort: move.frontmatter.effort,
    origin: move.frontmatter.origin,
    problem_signatures: move.frontmatter.problem_signatures,
    body: sub(move.body),
    pairs_with: move.frontmatter.pairs_with ?? [],
    resolved_variables,
  };
}

// Build query string from a resolved move for shareable URLs
export function resolvedMoveToQuery(resolved: ResolvedMove): string {
  const params = new URLSearchParams();
  params.set("seed", resolved._seed);
  for (const [name, values] of Object.entries(resolved.resolved_variables)) {
    for (let i = 0; i < values.length; i++) {
      params.set(`${name}.${i + 1}`, values[i]);
    }
  }
  return params.toString();
}

// Parse query string back into ResolveOptions
export function queryToResolveOptions(query: Record<string, string>): ResolveOptions | null {
  const seed = query["seed"];
  if (!seed) return null;

  const variables: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(query)) {
    if (key === "seed" || key === "format") continue;
    const match = key.match(/^(\w+)\.(\d+)$/);
    if (match) {
      const name = match[1];
      const idx = parseInt(match[2], 10) - 1;
      if (!variables[name]) variables[name] = [];
      variables[name][idx] = value;
    }
  }

  return { seed, variables: Object.keys(variables).length > 0 ? variables : undefined };
}
