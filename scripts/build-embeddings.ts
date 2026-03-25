#!/usr/bin/env node
// Embeds all moves and uploads to Vectorize via the Worker's test endpoint.
// Run: pnpm build:embeddings
//
// Requires the Worker to be deployed with the AI binding and a /__test/embed endpoint.
// Uses the live API to generate embeddings, then wrangler vectorize to upload.

import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogDir = join(__dirname, "..", "catalog");
const movesDir = join(catalogDir, "moves");
const outFile = join(__dirname, "..", "api", "vectorize-upload.ndjson");

const API_BASE = process.env.THINKFU_API ?? "https://api.think-fu.org";

interface MoveEntry {
  id: string;
  text: string; // what we embed
  metadata: { name: string; category: string; modes: string };
}

// Collect all moves
const entries: MoveEntry[] = [];
for (const category of readdirSync(movesDir)) {
  const categoryDir = join(movesDir, category);
  for (const file of readdirSync(categoryDir)) {
    if (!file.endsWith(".md")) continue;
    const raw = readFileSync(join(categoryDir, file), "utf-8");
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;
    try {
      const fm = parseYaml(match[1]);
      // Embed: one_liner + problem_signatures joined
      const signatures = (fm.problem_signatures ?? []).join(". ");
      const text = `${fm.one_liner ?? ""}. ${signatures}`;
      entries.push({
        id: fm.id,
        text,
        metadata: {
          name: fm.name ?? "",
          category: fm.category ?? "",
          modes: (fm.mode ?? []).join(","),
        },
      });
    } catch {
      console.error(`Skip ${file}: YAML error`);
    }
  }
}

async function main() {
  console.log(`Embedding ${entries.length} moves...`);

  const BATCH_SIZE = 20;
  const vectors: Array<{ id: string; values: number[]; metadata: any }> = [];

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const texts = batch.map((e) => e.text);

    const resp = await fetch(`${API_BASE}/__test/embed-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts }),
    });

    if (!resp.ok) {
      // Fallback: embed one at a time
      for (const entry of batch) {
        const r = await fetch(`${API_BASE}/__test/embed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: entry.text }),
        });
        const data = (await r.json()) as any;
        vectors.push({ id: entry.id, values: data.embedding, metadata: entry.metadata });
      }
    } else {
      const data = (await resp.json()) as any;
      for (let j = 0; j < batch.length; j++) {
        vectors.push({ id: batch[j].id, values: data.embeddings[j], metadata: batch[j].metadata });
      }
    }

    console.log(`  ${Math.min(i + BATCH_SIZE, entries.length)}/${entries.length}`);
  }

  // Write NDJSON for vectorize upload
  const ndjson = vectors.map((v) => JSON.stringify(v)).join("\n");
  writeFileSync(outFile, ndjson);
  console.log(`Wrote ${vectors.length} vectors to ${outFile}`);
  console.log(`\nUpload with:\n  cd api && pnpm wrangler vectorize insert thinkfu-moves --file vectorize-upload.ndjson`);
}

main().catch(console.error);
