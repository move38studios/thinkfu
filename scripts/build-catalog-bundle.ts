#!/usr/bin/env node
// Generates a JSON bundle of the entire catalog for embedding in the Worker.
// Pre-parses YAML frontmatter using the full yaml package at build time,
// so the Worker doesn't need a YAML parser at runtime.
// Run from repo root: pnpm build:catalog

import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogDir = join(__dirname, "..", "catalog");
const outFile = join(__dirname, "..", "api", "catalog-bundle.json");

interface BundledMove {
  frontmatter: Record<string, any>;
  body: string;
}

const moves: BundledMove[] = [];
const movesDir = join(catalogDir, "moves");
let errors = 0;

for (const category of readdirSync(movesDir)) {
  const categoryDir = join(movesDir, category);
  for (const file of readdirSync(categoryDir)) {
    if (!file.endsWith(".md")) continue;
    const raw = readFileSync(join(categoryDir, file), "utf-8");
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      console.error(`SKIP (no frontmatter): ${category}/${file}`);
      errors++;
      continue;
    }
    try {
      const frontmatter = parseYaml(match[1]);
      const body = match[2].trim();
      moves.push({ frontmatter, body });
    } catch (e: any) {
      console.error(`SKIP (YAML error): ${category}/${file}: ${e.message?.split("\n")[0]}`);
      errors++;
    }
  }
}

// Load pools
const pools: Record<string, string[]> = {};
const poolsDir = join(catalogDir, "pools");
for (const file of readdirSync(poolsDir)) {
  if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;
  const name = basename(file, file.endsWith(".yaml") ? ".yaml" : ".yml");
  const raw = readFileSync(join(poolsDir, file), "utf-8");
  const parsed = parseYaml(raw);
  if (Array.isArray(parsed)) {
    pools[name] = parsed.map(String);
  }
}

const bundle = { moves, pools };
writeFileSync(outFile, JSON.stringify(bundle));
console.log(
  `Built catalog bundle: ${moves.length} moves, ${Object.keys(pools).length} pools${errors > 0 ? ` (${errors} errors)` : ""} → ${outFile}`
);
