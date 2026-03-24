import { readFileSync, readdirSync, existsSync } from "fs";
import { join, basename } from "path";
import { parse as parseYaml } from "yaml";

// --- Types ---

export interface CardVariable {
  type: "pick" | "number";
  count?: number;
  pool?: string;
  min?: number;
  max?: number;
}

export interface CardPair {
  id: string;
  why: string;
}

export interface CardFrontmatter {
  id: string;
  name: string;
  one_liner: string;
  mode: string[];
  category: string;
  tags: string[];
  effort: "quick" | "deep";
  origin: string;
  problem_signatures: string[];
  variables?: Record<string, CardVariable>;
  pairs_with?: CardPair[];
}

export interface Card {
  frontmatter: CardFrontmatter;
  body: string;
  raw: string;
}

export type Pools = Record<string, string[]>;

// --- Parsing ---

function parseFrontmatter(raw: string): { frontmatter: CardFrontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid card format: no YAML frontmatter found");
  const frontmatter = parseYaml(match[1]) as CardFrontmatter;
  const body = match[2].trim();
  return { frontmatter, body };
}

// --- Loading ---

export function loadCatalog(catalogDir: string): { cards: Card[]; pools: Pools } {
  const cards = loadCards(join(catalogDir, "moves"));
  const pools = loadPools(join(catalogDir, "pools"));
  return { cards, pools };
}

function loadCards(movesDir: string): Card[] {
  const cards: Card[] = [];
  if (!existsSync(movesDir)) return cards;

  for (const category of readdirSync(movesDir)) {
    const categoryDir = join(movesDir, category);
    const stat = readdirSync(categoryDir);
    for (const file of stat) {
      if (!file.endsWith(".md")) continue;
      const raw = readFileSync(join(categoryDir, file), "utf-8");
      try {
        const { frontmatter, body } = parseFrontmatter(raw);
        cards.push({ frontmatter, body, raw });
      } catch (e) {
        console.error(`Failed to parse ${file}: ${e}`);
      }
    }
  }

  return cards;
}

function loadPools(poolsDir: string): Pools {
  const pools: Pools = {};
  if (!existsSync(poolsDir)) return pools;

  for (const file of readdirSync(poolsDir)) {
    if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;
    const name = basename(file, file.endsWith(".yaml") ? ".yaml" : ".yml");
    const raw = readFileSync(join(poolsDir, file), "utf-8");
    const parsed = parseYaml(raw);
    if (Array.isArray(parsed)) {
      pools[name] = parsed.map(String);
    }
  }

  return pools;
}
