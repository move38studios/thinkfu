import { Hono } from "hono";
import { cors } from "hono/cors";
import { moves, pools } from "./catalog-data.js";
import { selectMove, filterMoves, formatMoveAsMarkdown, pickRandom } from "@thinkfu/lib/helpers.js";
import { resolveMove } from "@thinkfu/lib/resolver.js";
import type { ResolvedMove } from "@thinkfu/lib/resolver.js";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors());

// --- Helpers ---

function moveToJSON(resolved: ResolvedMove) {
  return {
    _instance: resolved._instance,
    _seed: resolved._seed,
    id: resolved.id,
    name: resolved.name,
    one_liner: resolved.one_liner,
    mode: resolved.mode,
    category: resolved.category,
    tags: resolved.tags,
    effort: resolved.effort,
    origin: resolved.origin,
    problem_signatures: resolved.problem_signatures,
    body: resolved.body,
    pairs_with: resolved.pairs_with,
    resolved_variables: resolved.resolved_variables,
  };
}

function formatResponse(resolved: ResolvedMove, format: string) {
  if (format === "md") {
    return new Response(formatMoveAsMarkdown(resolved), {
      headers: { "Content-Type": "text/markdown" },
    });
  }
  return Response.json(moveToJSON(resolved));
}

// --- Routes ---

// GET /random
app.get("/random", (c) => {
  const format = c.req.query("format") ?? "json";
  const mode = c.req.query("mode");
  const category = c.req.query("category");

  let filtered = filterMoves(moves, { mode: mode ?? undefined, category: category ?? undefined });
  if (filtered.length === 0) filtered = [...moves];

  const move = pickRandom(filtered);
  const resolved = resolveMove(move, pools);
  return formatResponse(resolved, format);
});

// GET /move/:id
app.get("/move/:id", (c) => {
  const id = c.req.param("id");
  const format = c.req.query("format") ?? "json";

  const move = moves.find((m) => m.frontmatter.id === id);
  if (!move) {
    return c.json({ error: "Move not found" }, 404);
  }

  const resolved = resolveMove(move, pools);
  return formatResponse(resolved, format);
});

// GET /list
app.get("/list", (c) => {
  const mode = c.req.query("mode");
  const category = c.req.query("category");

  const filtered = filterMoves(moves, { mode: mode ?? undefined, category: category ?? undefined });
  const summaries = filtered.map((m) => ({
    id: m.frontmatter.id,
    name: m.frontmatter.name,
    one_liner: m.frontmatter.one_liner,
    mode: m.frontmatter.mode,
    category: m.frontmatter.category,
    effort: m.frontmatter.effort,
  }));

  return c.json(summaries);
});

// GET /catalog
app.get("/catalog", (c) => {
  const all = moves.map((m) => {
    const resolved = resolveMove(m, pools);
    return moveToJSON(resolved);
  });
  return c.json(all);
});

// POST /suggest
app.post("/suggest", async (c) => {
  const body = await c.req.json();
  const format = c.req.query("format") ?? "json";

  const mode = body.mode ?? "explore";
  const exclude = body.exclude ?? [];
  const style = body.style ?? "matched";

  const resolved = selectMove(moves, pools, { mode, exclude, style });

  if (!resolved) {
    return c.json({ error: "No moves available" }, 404);
  }

  return formatResponse(resolved, format);
});

// POST /rate
app.post("/rate", async (c) => {
  const body = await c.req.json();

  const stmt = c.env.DB.prepare(
    `INSERT INTO ratings (id, instance_id, move_id, seed, resolved_variables, useful, note, original_request, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  await stmt
    .bind(
      crypto.randomUUID(),
      body.instance_id ?? null,
      body.move_id,
      body.seed ?? null,
      body.resolved_variables ? JSON.stringify(body.resolved_variables) : null,
      body.useful ? 1 : 0,
      body.note ?? null,
      body.original_request ? JSON.stringify(body.original_request) : null,
      new Date().toISOString()
    )
    .run();

  // If retry requested, serve another move
  if (body.retry && body.original_request) {
    const resolved = selectMove(moves, pools, {
      mode: body.original_request.mode ?? "explore",
      exclude: [body.move_id],
      style: "matched",
    });

    if (resolved) {
      return c.json({
        status: "rated",
        next_move: moveToJSON(resolved),
      });
    }
  }

  return c.json({ status: "rated" });
});

// GET / — basic info
app.get("/", (c) => {
  return c.json({
    name: "ThinkFu API",
    version: "0.1.0",
    description: "Metacognition as a service",
    moves: moves.length,
    pools: Object.keys(pools).length,
    endpoints: {
      "GET /random": "Random move",
      "GET /move/:id": "Specific move",
      "GET /list": "Move summaries",
      "GET /catalog": "Full catalog",
      "POST /suggest": "Context-aware move selection",
      "POST /rate": "Submit feedback",
    },
  });
});

export default app;
