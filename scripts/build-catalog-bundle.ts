#!/usr/bin/env node
// Generates a JSON bundle of the entire catalog for embedding in the Worker.
// No external dependencies — uses only Node builtins + inline YAML parsing.
// Run from repo root: node scripts/build-catalog-bundle.ts

import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogDir = join(__dirname, "..", "catalog");
const outFile = join(__dirname, "..", "api", "catalog-bundle.json");

// Load cards as raw strings
const cards: Array<{ raw: string }> = [];
const movesDir = join(catalogDir, "moves");
for (const category of readdirSync(movesDir)) {
  const categoryDir = join(movesDir, category);
  for (const file of readdirSync(categoryDir)) {
    if (!file.endsWith(".md")) continue;
    const raw = readFileSync(join(categoryDir, file), "utf-8");
    cards.push({ raw });
  }
}

// Load pools — simple YAML arrays (just lines starting with "- ")
const pools: Record<string, string[]> = {};
const poolsDir = join(catalogDir, "pools");
for (const file of readdirSync(poolsDir)) {
  if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;
  const name = basename(file, file.endsWith(".yaml") ? ".yaml" : ".yml");
  const raw = readFileSync(join(poolsDir, file), "utf-8");
  // Simple parser for YAML arrays: lines starting with "- "
  pools[name] = raw
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim().replace(/^["']|["']$/g, ""));
}

const bundle = { cards, pools };
writeFileSync(outFile, JSON.stringify(bundle));
console.log(
  `Built catalog bundle: ${cards.length} cards, ${Object.keys(pools).length} pools → ${outFile}`
);
