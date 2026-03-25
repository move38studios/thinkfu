import { Hono } from "hono";
import { moves, pools } from "./catalog-data.js";
import { selectMove, filterMoves, formatMoveAsMarkdown, pickRandom } from "@thinkfu/lib/helpers.js";
import { resolveMove, resolvedMoveToQuery, queryToResolveOptions } from "@thinkfu/lib/resolver.js";
import type { ResolvedMove } from "@thinkfu/lib/resolver.js";
import { renderLanding, renderHumans, renderAgents, renderWhy, renderSetup, renderCredits, renderMove } from "./html.js";
import { routeMove } from "./router.js";

type Bindings = {
  DB: D1Database;
  AI: any;
  VECTORIZE: any;
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

  let resolved: ResolvedMove | null = null;

  if (style === "matched" && c.env.AI && c.env.VECTORIZE) {
    // Smart routing: embeddings + LLM
    resolved = await routeMove(
      { mode, goal: body.goal ?? "", current_approach: body.current_approach, stuck_on: body.stuck_on, context: body.context, exclude },
      moves,
      pools,
      c.env.AI,
      c.env.VECTORIZE,
    );
  }

  // Fallback to random if router returned null or style is "random"
  if (!resolved) {
    resolved = selectMove(moves, pools, { mode, exclude, style: "random" });
  }

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

// GET /why
app.get("/why", (c) => c.html(renderWhy()));

// GET /setup
app.get("/setup", (c) => c.html(renderSetup()));

// GET /credits
app.get("/credits", (c) => c.html(renderCredits()));

// GET /match?q=...&exclude=... — smart-routed move for humans, redirects to pinned URL
app.get("/match", async (c) => {
  const q = c.req.query("q") ?? "";
  const excludeStr = c.req.query("exclude") ?? "";
  const exclude = excludeStr ? excludeStr.split(",") : [];

  if (!q) return c.redirect("/humans");

  let resolved: ResolvedMove | null = null;

  if (c.env.AI && c.env.VECTORIZE) {
    resolved = await routeMove(
      { mode: "explore", goal: q, exclude },
      moves,
      pools,
      c.env.AI,
      c.env.VECTORIZE,
    );
  }

  // Fallback to random
  if (!resolved) {
    resolved = selectMove(moves, pools, { mode: "explore", exclude, style: "random" });
  }

  if (!resolved) return c.redirect("/humans");

  const shareQuery = resolvedMoveToQuery(resolved);
  return c.redirect(`/move/${resolved.id}?${shareQuery}`);
});

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

// --- Test endpoints for router development (remove before production) ---

// Test embedding model (single)
app.post("/__test/embed", async (c) => {
  const { text } = await c.req.json();
  const result = await c.env.AI.run("@cf/google/embeddinggemma-300m", { text: [text] });
  return c.json({
    model: "embeddinggemma-300m",
    input_length: text.length,
    embedding_dimensions: result.data[0].length,
    embedding: result.data[0],
  });
});

// Batch embedding (for build-embeddings script)
app.post("/__test/embed-batch", async (c) => {
  const { texts } = await c.req.json();
  const result = await c.env.AI.run("@cf/google/embeddinggemma-300m", { text: texts });
  return c.json({
    count: result.data.length,
    dimensions: result.data[0]?.length,
    embeddings: result.data,
  });
});

// Test LLM (with structured output)
app.post("/__test/llm", async (c) => {
  const { prompt } = await c.req.json();
  const result = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
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
  return c.json({
    model: "llama-3.1-8b-instruct",
    response: result.response,
  });
});

// Test similarity search
app.post("/__test/search", async (c) => {
  const { text, top_k } = await c.req.json();
  // Embed the query
  const embedResult = await c.env.AI.run("@cf/google/embeddinggemma-300m", { text: [text] });
  const queryVector = embedResult.data[0];
  // Search Vectorize
  const results = await c.env.VECTORIZE.query(queryVector, { topK: top_k ?? 5, returnMetadata: "all" });
  return c.json({
    query: text,
    matches: results.matches.map((m: any) => ({
      id: m.id,
      score: m.score,
      name: m.metadata?.name,
      category: m.metadata?.category,
    })),
  });
});

export default app;
