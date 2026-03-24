import { Card, Pools, CardVariable, CardPair } from "./catalog.js";
import { randomUUID } from "crypto";

export interface ResolvedCard {
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
  pairs_with: CardPair[];
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
  variables: Record<string, CardVariable> | undefined,
  pools: Pools
): Record<string, string[]> {
  const resolved: Record<string, string[]> = {};
  if (!variables) return resolved;

  for (const [name, def] of Object.entries(variables)) {
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
    const index = indexStr ? parseInt(indexStr, 10) - 1 : 0; // 1-based
    return values[index] ?? match;
  });
}

function pickSeed(pools: Pools): string {
  const wordPool = pools["random-words"];
  if (wordPool && wordPool.length > 0) {
    return pickRandom(wordPool, 1)[0];
  }
  return randomUUID().slice(0, 8);
}

export function resolveCard(card: Card, pools: Pools): ResolvedCard {
  const resolved_variables = resolveVariables(card.frontmatter.variables, pools);
  const seed = pickSeed(pools);
  const instanceId = `${card.frontmatter.id}-${randomUUID().slice(0, 6)}`;

  const sub = (text: string) => substituteTemplate(text, resolved_variables);

  return {
    _instance: instanceId,
    _seed: seed,
    id: card.frontmatter.id,
    name: sub(card.frontmatter.name),
    one_liner: sub(card.frontmatter.one_liner),
    mode: card.frontmatter.mode,
    category: card.frontmatter.category,
    tags: card.frontmatter.tags,
    effort: card.frontmatter.effort,
    origin: card.frontmatter.origin,
    problem_signatures: card.frontmatter.problem_signatures,
    body: sub(card.body),
    pairs_with: card.frontmatter.pairs_with ?? [],
    resolved_variables,
  };
}
