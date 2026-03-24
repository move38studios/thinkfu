// Portable parser — no Node.js or external deps. Works in Workers + Node.
import type { MoveFrontmatter, Move } from "./types.js";

// Minimal YAML frontmatter parser for ThinkFu moves.
// Handles the subset of YAML we actually use: scalars, arrays, nested objects.

export function parseFrontmatter(raw: string): { frontmatter: MoveFrontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid move format: no YAML frontmatter found");

  const frontmatter = parseSimpleYaml(match[1]) as MoveFrontmatter;
  const body = match[2].trim();
  return { frontmatter, body };
}

function parseSimpleYaml(text: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = text.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) { i++; continue; }

    const keyMatch = line.match(/^(\w[\w_]*)\s*:\s*(.*)/);
    if (!keyMatch) { i++; continue; }

    const key = keyMatch[1];
    let value = keyMatch[2].trim();

    // Inline array: [a, b, c]
    if (value.startsWith("[") && value.endsWith("]")) {
      result[key] = value.slice(1, -1).split(",").map((s) => parseScalar(s.trim()));
      i++;
      continue;
    }

    // Block array or nested object starting on next line
    if (value === "" || value === undefined) {
      const nested = collectBlock(lines, i + 1);
      if (nested.lines.length > 0 && nested.lines[0].trimStart().startsWith("- ")) {
        result[key] = parseBlockArray(nested.lines);
      } else if (nested.lines.length > 0) {
        result[key] = parseNestedObject(nested.lines);
      }
      i = nested.nextIndex;
      continue;
    }

    result[key] = parseScalar(value);
    i++;
  }

  return result;
}

function collectBlock(lines: string[], startIndex: number): { lines: string[]; nextIndex: number } {
  const collected: string[] = [];
  let i = startIndex;
  if (i >= lines.length) return { lines: [], nextIndex: i };

  const firstLine = lines[i];
  const indentMatch = firstLine.match(/^(\s+)/);
  if (!indentMatch) return { lines: [], nextIndex: i };
  const indent = indentMatch[1].length;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i++; continue; }
    const lineIndent = line.match(/^(\s*)/)?.[1].length ?? 0;
    if (lineIndent < indent) break;
    collected.push(line);
    i++;
  }

  return { lines: collected, nextIndex: i };
}

function parseBlockArray(lines: string[]): any[] {
  const items: any[] = [];

  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("- ")) {
      const content = trimmed.slice(2).trim();
      const kvMatch = content.match(/^(\w[\w_]*)\s*:\s*(.*)/);
      if (kvMatch) {
        const obj: Record<string, any> = {};
        obj[kvMatch[1]] = parseScalar(kvMatch[2].trim());
        items.push(obj);
      } else {
        items.push(parseScalar(content));
      }
    } else if (items.length > 0 && typeof items[items.length - 1] === "object") {
      const kvMatch = trimmed.match(/^(\w[\w_]*)\s*:\s*(.*)/);
      if (kvMatch) {
        const lastItem = items[items.length - 1] as Record<string, any>;
        lastItem[kvMatch[1]] = parseScalar(kvMatch[2].trim());
      }
    }
  }

  return items;
}

function parseNestedObject(lines: string[]): Record<string, any> {
  const obj: Record<string, any> = {};
  for (const line of lines) {
    const kvMatch = line.trim().match(/^(\w[\w_]*)\s*:\s*(.*)/);
    if (kvMatch) {
      obj[kvMatch[1]] = parseScalar(kvMatch[2].trim());
    }
  }
  return obj;
}

function parseScalar(value: string): any {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "") return null;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
  return value;
}
