#!/usr/bin/env node
// Validates all moves in the catalog for:
// - YAML frontmatter parsing
// - Required fields present
// - Variable references point to existing pools
// - Mermaid diagrams have valid syntax (basic checks)
// - No common YAML pitfalls (unquoted colons, etc.)
//
// Run from repo root: node --experimental-strip-types scripts/validate-catalog.ts

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogDir = join(__dirname, "..", "catalog");
const movesDir = join(catalogDir, "moves");
const poolsDir = join(catalogDir, "pools");

let errors = 0;
let warnings = 0;
let moveCount = 0;

function error(file: string, msg: string) {
  console.error(`  ERROR  ${file}: ${msg}`);
  errors++;
}

function warn(file: string, msg: string) {
  console.warn(`  WARN   ${file}: ${msg}`);
  warnings++;
}

// --- Load pool names ---
const poolNames: Set<string> = new Set();
if (existsSync(poolsDir)) {
  for (const file of readdirSync(poolsDir)) {
    if (file.endsWith(".yaml") || file.endsWith(".yml")) {
      poolNames.add(basename(file, file.endsWith(".yaml") ? ".yaml" : ".yml"));
    }
  }
}

// --- Simple YAML frontmatter parser (same as the one we use in production) ---
function tryParseYaml(raw: string, file: string): Record<string, any> | null  {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    error(file, "No YAML frontmatter found (missing --- delimiters)");
    return null;
  }

  // Try to detect common YAML issues before parsing
  const yamlBlock = match[1];
  const lines = yamlBlock.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check for unquoted values with colons (common pitfall)
    const keyMatch = line.match(/^(\w[\w_]*)\s*:\s*(.*)/);
    if (keyMatch) {
      const value = keyMatch[2].trim();
      // Value contains an unquoted colon that's not in a URL
      if (value && !value.startsWith('"') && !value.startsWith("'") && !value.startsWith("[") &&
          value.includes(":") && !value.includes("://")) {
        warn(file, `Line ${i + 1}: value contains unquoted colon — may cause YAML parse error: "${value.slice(0, 60)}..."`);
      }
      // Value contains {{ }} template syntax that might need quoting
      if (value && !value.startsWith('"') && !value.startsWith("'") && value.includes("{{")) {
        // Only warn if it also has colons or other YAML-special chars
        if (value.includes(":") || value.includes("#")) {
          warn(file, `Line ${i + 1}: template variable in unquoted value with special chars — should be quoted`);
        }
      }
    }
  }

  try {
    return parseYaml(yamlBlock);
  } catch (e: any) {
    error(file, `YAML parse error: ${e.message?.split("\n")[0] ?? e}`);
    return null;
  }
}

// --- Required fields ---
const REQUIRED_FIELDS = ["id", "name", "one_liner", "mode", "category", "tags", "effort", "origin", "problem_signatures"];
const VALID_MODES = ["plan", "explore", "stuck", "evaluate"];
const VALID_CATEGORIES = ["Planning", "Exploration", "Unsticking", "Evaluation", "Meta"];
const VALID_EFFORTS = ["quick", "deep", "snap"];

function validateFrontmatter(fm: Record<string, any>, file: string) {
  for (const field of REQUIRED_FIELDS) {
    if (fm[field] === undefined || fm[field] === null) {
      error(file, `Missing required field: ${field}`);
    }
  }

  // ID format
  if (fm.id && !/^TF-\d{3}$/.test(fm.id)) {
    warn(file, `ID "${fm.id}" doesn't match expected TF-NNN format`);
  }

  // Mode values
  if (Array.isArray(fm.mode)) {
    for (const m of fm.mode) {
      if (!VALID_MODES.includes(m)) {
        error(file, `Invalid mode: "${m}". Valid: ${VALID_MODES.join(", ")}`);
      }
    }
  }

  // Category
  if (fm.category && !VALID_CATEGORIES.includes(fm.category)) {
    warn(file, `Category "${fm.category}" not in standard set: ${VALID_CATEGORIES.join(", ")}`);
  }

  // Effort
  if (fm.effort && !VALID_EFFORTS.includes(fm.effort)) {
    warn(file, `Effort "${fm.effort}" not in standard set: ${VALID_EFFORTS.join(", ")}`);
  }

  // Variables reference valid pools
  if (fm.variables && typeof fm.variables === "object") {
    for (const [name, def] of Object.entries(fm.variables)) {
      const d = def as any;
      if (d?.type === "pick" && d?.pool && !poolNames.has(d.pool)) {
        error(file, `Variable "${name}" references unknown pool: "${d.pool}". Available: ${[...poolNames].join(", ")}`);
      }
    }
  }

  // pairs_with references
  if (fm.pairs_with && Array.isArray(fm.pairs_with)) {
    for (const pair of fm.pairs_with) {
      if (!pair.id) {
        warn(file, `pairs_with entry missing id`);
      }
      if (!pair.why) {
        warn(file, `pairs_with entry for ${pair.id} missing "why"`);
      }
    }
  }
}

// --- Body validation ---
function validateBody(body: string, file: string) {
  // Required sections
  if (!body.includes("## The Move")) {
    error(file, 'Missing required section: "## The Move"');
  }
  if (!body.includes("## When to Use")) {
    warn(file, 'Missing section: "## When to Use"');
  }
  if (!body.includes("## Example")) {
    warn(file, 'Missing section: "## Example"');
  }

  // Mermaid diagram checks
  const mermaidMatch = body.match(/```mermaid\n([\s\S]*?)```/);
  if (!mermaidMatch) {
    warn(file, "No mermaid diagram found");
  } else {
    const diagram = mermaidMatch[1];

    // Check for multi-line labels (common rendering issue)
    const multiLineLabel = diagram.match(/\["[^"]*\n/);
    if (multiLineLabel) {
      error(file, "Mermaid diagram has multi-line label — will break rendering");
    }

    // Check for & join syntax (unsupported in many renderers)
    if (diagram.includes(" & ")) {
      warn(file, 'Mermaid diagram uses "&" join syntax — may break in some renderers');
    }
  }

  // Check for unresolved template variables that reference non-existent variables
  const templateVars = body.matchAll(/\{\{(\w+)(?:\.\d+)?\}\}/g);
  for (const match of templateVars) {
    // Just note them — we can't validate without knowing the frontmatter variables here
  }
}

// --- Main ---
function main() {
  console.log("Validating ThinkFu catalog...\n");

  if (!existsSync(movesDir)) {
    console.error("ERROR: catalog/moves/ directory not found");
    process.exit(1);
  }

  console.log(`Pools found: ${[...poolNames].join(", ")}\n`);

  const seenIds = new Set<string>();

  for (const category of readdirSync(movesDir)) {
    const categoryDir = join(movesDir, category);
    let categoryCount = 0;

    for (const file of readdirSync(categoryDir)) {
      if (!file.endsWith(".md")) continue;
      moveCount++;
      categoryCount++;

      const raw = readFileSync(join(categoryDir, file), "utf-8");
      const fm = tryParseYaml(raw, `${category}/${file}`);

      if (fm) {
        // Duplicate ID check
        if (fm.id && seenIds.has(fm.id)) {
          error(`${category}/${file}`, `Duplicate ID: ${fm.id}`);
        }
        if (fm.id) seenIds.add(fm.id);

        validateFrontmatter(fm, `${category}/${file}`);
      }

      // Body validation (even if frontmatter failed)
      const bodyMatch = raw.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
      if (bodyMatch) {
        validateBody(bodyMatch[1].trim(), `${category}/${file}`);
      }
    }

    console.log(`  ${category}/: ${categoryCount} moves`);
  }

  console.log(`\n${moveCount} moves validated.`);
  console.log(`${errors} errors, ${warnings} warnings.`);

  if (errors > 0) {
    process.exit(1);
  }
}

main();
