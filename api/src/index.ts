import { Hono } from "hono";
import { moves, pools } from "./catalog-data.js";
import { selectMove, filterMoves, formatMoveAsMarkdown, pickRandom } from "@thinkfu/lib/helpers.js";
import { resolveMove, resolvedMoveToQuery, queryToResolveOptions } from "@thinkfu/lib/resolver.js";
import type { ResolvedMove } from "@thinkfu/lib/resolver.js";
import { renderLanding, renderHumans, renderAgents, renderMove } from "./html.js";

type Bindings = {
  DB: D1Database;
  RATE_LIMIT_READ: any;
  RATE_LIMIT_WRITE: any;
};

const app = new Hono<{ Bindings: Bindings }>();

// --- Rate limiting ---

function rateLimit(getLimiter: (env: Bindings) => any) {
  return async (c: any, next: any) => {
    try {
      const limiter = getLimiter(c.env);
      if (limiter) {
        const ip = c.req.header("cf-connecting-ip") ?? "unknown";
        const { success } = await limiter.limit({ key: ip });
        if (!success) return c.json({ error: "Rate limit exceeded" }, 429);
      }
    } catch {
      // Rate limiting unavailable — proceed without it
    }
    return next();
  };
}

// 60 reads/min per IP
app.use("/random", rateLimit((env) => env.RATE_LIMIT_READ));
app.use("/move/*", rateLimit((env) => env.RATE_LIMIT_READ));
app.use("/list", rateLimit((env) => env.RATE_LIMIT_READ));
app.use("/suggest", rateLimit((env) => env.RATE_LIMIT_READ));

// 10 writes/min per IP
app.use("/rate", rateLimit((env) => env.RATE_LIMIT_WRITE));

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

// --- API Routes ---

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

// --- Website vs API routing ---

function isApiRequest(c: any): boolean {
  const host = c.req.header("host") ?? "";
  return host.startsWith("api.");
}

// GET / — landing page (website) or API info (api subdomain)
app.get("/", (c) => {
  if (isApiRequest(c)) {
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
  }
  return c.html(renderLanding());
});

// GET /humans
app.get("/humans", (c) => c.html(renderHumans(moves.length)));

// GET /agents
app.get("/agents", (c) => c.html(renderAgents()));

// GET /random — website: HTML card with swipe. API: JSON.
app.get("/random", (c) => {
  const format = c.req.query("format");
  const mode = c.req.query("mode");
  const category = c.req.query("category");

  // ?id=TF-004 → re-roll a specific move with fresh variables/seed
  const id = c.req.query("id");
  let move;
  if (id) {
    move = moves.find((m) => m.frontmatter.id === id);
    if (!move) return c.json({ error: "Move not found" }, 404);
  } else {
    let filtered = filterMoves(moves, { mode: mode ?? undefined, category: category ?? undefined });
    if (filtered.length === 0) filtered = [...moves];
    move = pickRandom(filtered);
  }

  const resolved = resolveMove(move, pools);

  if (format === "md") {
    return new Response(formatMoveAsMarkdown(resolved), { headers: { "Content-Type": "text/markdown" } });
  }
  if (format === "json" || isApiRequest(c)) {
    return Response.json(moveToJSON(resolved));
  }

  // Website — redirect to the pinned instance URL so the URL is shareable
  const shareQuery = resolvedMoveToQuery(resolved);
  return c.redirect(`/move/${resolved.id}?${shareQuery}`);
});

// GET /move/:id — website: HTML. API: JSON. Query params pin a specific instance.
app.get("/move/:id", (c) => {
  const id = c.req.param("id");
  const format = c.req.query("format");

  const move = moves.find((m) => m.frontmatter.id === id);
  if (!move) {
    if (isApiRequest(c) || format) return c.json({ error: "Move not found" }, 404);
    return c.html("<h1>Move not found</h1>", 404);
  }

  const opts = queryToResolveOptions(c.req.query() as Record<string, string>);
  const resolved = resolveMove(move, pools, opts ?? undefined);

  if (format === "md") {
    return new Response(formatMoveAsMarkdown(resolved), { headers: { "Content-Type": "text/markdown" } });
  }
  if (format === "json" || isApiRequest(c)) {
    return Response.json(moveToJSON(resolved));
  }

  const shareQuery = resolvedMoveToQuery(resolved);
  return c.html(renderMove(resolved, `/move/${resolved.id}?${shareQuery}`));
});

export default app;
