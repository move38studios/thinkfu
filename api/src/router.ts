// Smart move router: embedding similarity + LLM selection + variable choosing
import type { Move, Pools } from "@thinkfu/lib/types.js";
import { resolveMove } from "@thinkfu/lib/resolver.js";
import type { ResolvedMove } from "@thinkfu/lib/resolver.js";
import { filterMoves, pickRandom } from "@thinkfu/lib/helpers.js";

const EMBED_MODEL = "@cf/google/embeddinggemma-300m";
const LLM_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const SIMILAR_COUNT = 3;
const RANDOM_COUNT = 2;
const POOL_SAMPLE_SIZE = 20;

interface RouterInput {
  mode: string;
  goal: string;
  current_approach?: string;
  stuck_on?: string;
  context?: string;
  exclude?: string[];
}

interface LLMResponse {
  move_id: string;
  reason: string;
  variables?: Record<string, string[]>;
}

function buildContextString(input: RouterInput): string {
  const parts = [input.goal];
  if (input.current_approach) parts.push(input.current_approach);
  if (input.stuck_on) parts.push(input.stuck_on);
  if (input.context) parts.push(input.context);
  return parts.join(". ");
}

function samplePool(pool: string[], count: number): string[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function buildCandidatePrompt(candidates: Move[], pools: Pools, input: RouterInput): string {
  const movesText = candidates.map((m, i) => {
    const fm = m.frontmatter;
    let entry = `${i + 1}. ${fm.id}: ${fm.name}\n   ${fm.one_liner}\n   Signatures: ${(fm.problem_signatures ?? []).join(", ")}`;

    if (fm.variables && Object.keys(fm.variables).length > 0) {
      const varDescs: string[] = [];
      const poolSamples: string[] = [];

      for (const [name, def] of Object.entries(fm.variables)) {
        if (!def || !def.type) continue;
        if (def.type === "pick" && def.pool) {
          const pool = pools[def.pool];
          if (pool) {
            varDescs.push(`${name}: pick ${def.count ?? 1} from ${def.pool} pool`);
            poolSamples.push(`  ${def.pool} pool samples: ${samplePool(pool, POOL_SAMPLE_SIZE).join(", ")}`);
          }
        } else if (def.type === "number") {
          varDescs.push(`${name}: pick number ${def.min ?? 1}-${def.max ?? 10}`);
        }
      }

      if (varDescs.length > 0) {
        entry += `\n   Variables: {${varDescs.join("; ")}}`;
        entry += "\n" + poolSamples.join("\n");
      }
    } else {
      entry += "\n   Variables: none";
    }

    return entry;
  }).join("\n\n");

  return `Select one move for this situation.

Situation:
- Mode: ${input.mode}
- Goal: ${input.goal}
${input.current_approach ? `- Current approach: ${input.current_approach}` : ""}
${input.stuck_on ? `- Stuck on: ${input.stuck_on}` : ""}

Moves:
${movesText}

Pick the most surprisingly useful move — not the most obviously related, but the one that will shift thinking in an unexpected direction. If the move has variables, choose specific values from the pool samples that create interesting tension with the situation.

Example for a move with variables: {"move_id":"TF-004","reason":"...","variables":{"domain":["val1","val2","val3"]}}
Example for a move without: {"move_id":"TF-040","reason":"...","variables":{}}`;
}

export async function routeMove(
  input: RouterInput,
  moves: Move[],
  pools: Pools,
  ai: any,
  vectorize: any,
): Promise<ResolvedMove | null> {
  try {
    // Step 1: Embed the context
    const contextStr = buildContextString(input);
    const embedResult = await ai.run(EMBED_MODEL, { text: [contextStr] });
    const queryVector = embedResult.data[0];

    // Step 2: Pull candidates — 3 similar + 2 random
    const searchResults = await vectorize.query(queryVector, {
      topK: SIMILAR_COUNT + 5, // overfetch to filter excludes
      returnMetadata: "all",
    });

    const excludeSet = new Set(input.exclude ?? []);
    const similarIds: string[] = [];
    for (const match of searchResults.matches) {
      if (excludeSet.has(match.id)) continue;
      // Filter by mode if metadata available
      const modes = match.metadata?.modes?.split(",") ?? [];
      if (modes.length > 0 && !modes.includes(input.mode)) continue;
      similarIds.push(match.id);
      if (similarIds.length >= SIMILAR_COUNT) break;
    }

    // Get the actual move objects for similar results
    const similarMoves = similarIds
      .map((id) => moves.find((m) => m.frontmatter.id === id))
      .filter(Boolean) as Move[];

    // 2 random moves from same mode, not in similar set
    const randomPool = filterMoves(moves, { mode: input.mode, exclude: [...similarIds, ...(input.exclude ?? [])] });
    const randomMoves: Move[] = [];
    const shuffled = [...randomPool].sort(() => Math.random() - 0.5);
    for (const m of shuffled) {
      randomMoves.push(m);
      if (randomMoves.length >= RANDOM_COUNT) break;
    }

    const candidates = [...similarMoves, ...randomMoves];

    if (candidates.length === 0) return null;

    // Step 3: LLM selects move + chooses variables
    const prompt = buildCandidatePrompt(candidates, pools, input);

    const llmResult = await ai.run(LLM_MODEL, {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      response_format: {
        type: "json_schema",
        json_schema: {
          type: "object",
          properties: {
            move_id: { type: "string" },
            reason: { type: "string" },
            variables: { type: "object" },
          },
          required: ["move_id", "reason"],
        },
      },
    });

    // Parse LLM response
    let llmChoice: LLMResponse;
    if (typeof llmResult.response === "string") {
      llmChoice = JSON.parse(llmResult.response);
    } else {
      llmChoice = llmResult.response as LLMResponse;
    }

    // Find the chosen move
    const chosenMove = candidates.find((m) => m.frontmatter.id === llmChoice.move_id);
    if (!chosenMove) {
      // LLM hallucinated an ID — fall back to first candidate
      return resolveMove(candidates[0], pools);
    }

    // Step 4: Resolve with LLM-chosen variables (seed stays random)
    const llmVars = llmChoice.variables ?? {};

    // Normalize LLM variables: ensure arrays match expected counts
    const resolvedVars: Record<string, string[]> | undefined =
      Object.keys(llmVars).length > 0
        ? Object.fromEntries(
            Object.entries(llmVars).map(([k, v]) => [
              k,
              Array.isArray(v) ? v : [String(v)],
            ])
          )
        : undefined;

    return resolveMove(chosenMove, pools, {
      variables: resolvedVars,
      // seed: undefined → random, always
    });
  } catch (e) {
    console.error("Router error, falling back to random:", e);
    return null; // caller falls back to random
  }
}
