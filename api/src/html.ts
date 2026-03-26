import type { ResolvedMove } from "@thinkfu/lib/resolver.js";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mdToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let inList = false;
  let inCode = false;

  for (const line of lines) {
    if (line.startsWith("```mermaid")) {
      html += `<pre class="mermaid">`;
      inCode = true;
      continue;
    }
    if (line.startsWith("```") && inCode) {
      html += "</pre>";
      inCode = false;
      continue;
    }
    if (line.startsWith("```")) {
      html += "<pre><code>";
      inCode = true;
      continue;
    }
    if (inCode && !line.startsWith("```")) {
      html += esc(line) + "\n";
      continue;
    }
    if (line.startsWith("## ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h3>${line.slice(3)}</h3>`;
    } else if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inline(line.slice(2))}</li>`;
    } else if (line.trim() === "") {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<p>${inline(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  if (inCode) html += "</pre>";
  return html;
}

function inline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

const CSS = `
:root {
  --bg: #111; --text: #ccc; --text-strong: #fff; --text-muted: #666;
  --text-faint: #444; --text-dim: #555; --border: #222; --link: #ccc;
  --link-hover: #fff; --code: #e0a060; --pre-bg: #1a1a1a;
  --mermaid-bg: #f8f8f8; --move-text: #ddd;
}
.light {
  --bg: #fafafa; --text: #333; --text-strong: #111; --text-muted: #888;
  --text-faint: #bbb; --text-dim: #999; --border: #e0e0e0; --link: #333;
  --link-hover: #000; --code: #c45d00; --pre-bg: #f0f0f0;
  --mermaid-bg: #fff; --move-text: #444;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', monospace;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  line-height: 1.7;
  font-size: 15px;
}
a { color: var(--link); }
a:hover { color: var(--link-hover); }
main { max-width: 640px; margin: 0 auto; padding: 3rem 1.5rem 2rem; }

/* Landing */
.landing { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center; }
.landing h1 { font-size: 2.5rem; color: var(--text-strong); margin-bottom: 0.25rem; letter-spacing: -0.02em; }
.landing .tagline { color: var(--text-muted); margin-bottom: 3rem; font-size: 0.95rem; }
.landing .paths { display: flex; gap: 2rem; }
.landing .paths a {
  color: var(--text-muted);
  font-size: 0.95rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  transition: all 0.15s;
}
.landing .paths a:hover { color: var(--text-strong); border-color: var(--link-hover); text-decoration: none; }

/* Page */
.page h1 { color: var(--text-strong); font-size: 1.3rem; margin-bottom: 1.5rem; }
.page p { margin-bottom: 1rem; color: var(--text-dim); }
.page a { border-bottom: 1px solid var(--border); }
.page a:hover { border-color: var(--link-hover); text-decoration: none; }

/* Move */
.move { margin: 1rem 0; }
.move-id { color: var(--text-dim); font-size: 0.8rem; margin-bottom: 0.25rem; }
.move h2 { color: var(--text-strong); font-size: 1.4rem; margin-bottom: 0.5rem; letter-spacing: -0.01em; }
.move .one-liner { color: var(--text-muted); font-style: italic; margin-bottom: 1.5rem; }
.move .meta { color: var(--text-dim); font-size: 0.8rem; margin-bottom: 1.5rem; }
.move .body h3 { color: var(--text-dim); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin: 2rem 0 0.75rem; }
.move .body p { margin-bottom: 0.75rem; }
.move .body ul { margin: 0.5rem 0 0.75rem 1.25rem; }
.move .body li { margin-bottom: 0.3rem; }
.move .body strong { color: var(--text-strong); }
.move .body em { color: var(--text-muted); }
.move .body code { color: var(--code); font-size: 0.9em; }
.move .body pre { background: var(--pre-bg); padding: 1rem; border-radius: 4px; overflow-x: auto; margin: 0.75rem 0; font-size: 0.85rem; }
.move .seed { color: var(--text-faint); font-size: 0.8rem; margin-top: 2rem; }
.move .pairs { color: var(--text-dim); font-size: 0.8rem; margin-top: 0.75rem; }
.move .pairs a { color: var(--text-dim); }

/* The Move (compact) */
.the-move { margin: 1rem 0; }
.the-move p { color: var(--move-text); }

/* Mermaid */
.mermaid { background: var(--mermaid-bg); border-radius: 4px; padding: 1rem; margin: 1rem 0; text-align: center; }

/* Details toggle */
details.more { margin-top: 1.5rem; }
details.more summary {
  color: var(--text-dim);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.5rem 0;
  border-top: 1px solid var(--border);
}
details.more summary:hover { color: var(--text-dim); }

/* Actions */
.actions { display: flex; gap: 1.5rem; margin: 2rem 0; font-size: 0.85rem; }
.actions a, .actions button {
  color: var(--text-muted);
  background: none;
  border: none;
  border-bottom: 1px solid var(--border);
  padding: 0.25rem 0;
  cursor: pointer;
  font: inherit;
  font-size: 0.85rem;
  transition: all 0.15s;
}
.actions a:hover, .actions button:hover { color: var(--text-strong); border-color: var(--link-hover); text-decoration: none; }

/* Swipe hint */
.swipe-hint { color: var(--text-faint); font-size: 0.75rem; text-align: center; margin-top: 2rem; }

/* Side arrows (desktop) */
.side-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: var(--text-faint);
  cursor: pointer;
  padding: 2rem 1rem;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
  user-select: none;
}
.side-arrow:hover { color: var(--text-muted); }
body:hover .side-arrow { opacity: 1; }
.side-arrow.left { left: 0; }
.side-arrow.right { right: 0; }
@media (max-width: 600px) { .side-arrow { display: none; } }

/* Match form */
.match-form { margin: 2rem 0 0; }
.match-form label { display: block; color: var(--text-dim); font-size: 0.85rem; margin-bottom: 0.5rem; }
.match-form textarea {
  width: 100%;
  background: var(--pre-bg);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.75rem;
  font: inherit;
  font-size: 0.9rem;
  resize: vertical;
  line-height: 1.5;
}
.match-form textarea:focus { outline: none; border-color: var(--text-dim); }
.match-form button {
  margin-top: 0.5rem;
  background: none;
  color: var(--text-muted);
  border: none;
  border-bottom: 1px solid var(--border);
  padding: 0.25rem 0;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}
.match-form button:hover { color: var(--text-strong); border-color: var(--link-hover); }

/* Rating */
.rating { margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-dim); }
.rating span { cursor: pointer; padding: 0.25rem 0; border-bottom: 1px solid var(--border); margin-right: 1rem; }
.rating span:hover { color: var(--text-strong); border-color: var(--link-hover); }
.rating .done { color: var(--text-muted); border: none; cursor: default; }

/* Home link */
.home-link {
  position: fixed;
  top: 1rem;
  left: 1.5rem;
  color: var(--text-faint);
  font-size: 0.75rem;
  text-decoration: none;
  z-index: 10;
}
.home-link:hover { color: var(--text-dim); text-decoration: none; }
@media (max-width: 600px) { .home-link { position: static; display: block; margin: 0 0 1rem 0; } }

/* Theme toggle */
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1.5rem;
  color: var(--text-faint);
  font-size: 0.75rem;
  cursor: pointer;
  z-index: 10;
  background: none;
  border: none;
  font: inherit;
  font-size: 0.75rem;
}
.theme-toggle:hover { color: var(--text-dim); }

/* Footer */
footer { color: var(--text-faint); font-size: 0.75rem; text-align: center; padding: 2rem; margin-top: 2rem; }
footer a { color: var(--text-faint); }

/* Mobile */
@media (max-width: 600px) {
  body { font-size: 13px; }
  main { padding: 1rem 0.75rem; }
  .landing h1 { font-size: 1.8rem; }
  .landing .tagline { font-size: 0.85rem; }
  .landing .paths { flex-direction: column; gap: 1rem; align-items: center; }
  .move h2 { font-size: 1.1rem; }
  .move .one-liner { font-size: 0.9rem; }
  .move .meta { font-size: 0.7rem; }
  .actions { gap: 1rem; }
  pre { font-size: 0.75rem; white-space: pre-wrap; word-break: break-word; }
  .mermaid { padding: 0.5rem; font-size: 0.7rem; overflow-x: auto; }
  .page pre { overflow-x: auto; white-space: pre; }
  .the-move p { font-size: 0.95rem; }
  .home-link, .theme-toggle { position: static; display: inline-block; }
  .home-link { margin: 0.75rem 1rem 0.5rem 0.75rem; }
  .theme-toggle { float: right; margin: 0.75rem 0.75rem 0.5rem 0; }
  .swipe-hint { font-size: 0.7rem; }
}
`;

const DEFAULT_OG_DESC =
  "200+ thinking moves for AI agents and humans. Metacognition as a service.";
const OG_IMAGE = "https://thinkfu.org/og-image.png";

interface LayoutMeta {
  description?: string;
  url?: string;
}

function layout(title: string, content: string, meta?: LayoutMeta): string {
  const desc = meta?.description ?? DEFAULT_OG_DESC;
  const url = meta?.url ?? "https://thinkfu.org";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <style>${CSS}</style>
</head>
<body>
  <a href="/" class="home-link">tf</a>
  <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()">light</button>
  <main>${content}</main>
  <footer>
    <a href="/">thinkfu.org</a> &middot; <a href="/credits">credits</a> &middot; <a href="/terms">terms</a> &middot; <a href="https://move38.org">move38</a>
  </footer>
  <script>
    // Theme
    function toggleTheme() {
      const isLight = document.body.classList.toggle('light');
      localStorage.setItem('thinkfu-theme', isLight ? 'light' : 'dark');
      document.getElementById('theme-toggle').textContent = isLight ? 'dark' : 'light';
    }
    (function() {
      if (localStorage.getItem('thinkfu-theme') === 'light') {
        document.body.classList.add('light');
        document.getElementById('theme-toggle').textContent = 'dark';
      }
    })();
  </script>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    const isLight = document.body.classList.contains('light');
    mermaid.initialize({ startOnLoad: true, theme: isLight ? 'default' : 'dark' });
  </script>
</body>
</html>`;
}

function extractMermaid(body: string): {
  mermaid: string | null;
  rest: string;
} {
  const match = body.match(/```mermaid\n([\s\S]*?)```/);
  if (!match) return { mermaid: null, rest: body };
  const mermaid = match[1].trim();
  const rest = body.replace(/## Diagram\n\n```mermaid\n[\s\S]*?```/, "").trim();
  return { mermaid, rest };
}

function extractTheMove(body: string): { theMove: string; rest: string } {
  const match = body.match(/## The Move\n\n([\s\S]*?)(?=\n## |\n*$)/);
  if (!match) return { theMove: "", rest: body };
  const theMove = match[1].trim();
  const rest = body.replace(/## The Move\n\n[\s\S]*?(?=\n## |\n*$)/, "").trim();
  return { theMove, rest };
}

function renderMoveContent(m: ResolvedMove): string {
  const { mermaid, rest: bodyNoMermaid } = extractMermaid(m.body);
  const { theMove, rest: details } = extractTheMove(bodyNoMermaid);

  return `
    <div class="move">
      <div class="move-id">${esc(m.id)}</div>
      <h2>${esc(m.name)}</h2>
      <p class="one-liner">${esc(m.one_liner)}</p>
      ${theMove ? `<div class="the-move">${mdToHtml(theMove)}</div>` : ""}
      ${mermaid ? `<pre class="mermaid">${esc(mermaid)}</pre>` : ""}
      <div class="meta">${m.mode.join(" / ")} &middot; ${m.effort} &middot; ${esc(m.category)} &middot; seed: ${esc(m._seed)}</div>
      ${
        details
          ? `
        <details class="more">
          <summary>more</summary>
          <div class="body">${mdToHtml(details)}</div>
          ${
            m.pairs_with.length > 0
              ? `
            <div class="pairs">
              pairs with: ${m.pairs_with.map((p) => `<a href="/move/${p.id}">${p.id}</a>`).join(", ")}
            </div>
          `
              : ""
          }
        </details>
      `
          : ""
      }
    </div>`;
}

// --- Pages ---

export function renderLanding(): string {
  return layout(
    "ThinkFu",
    `
    <div class="landing">
      <h1>ThinkFu</h1>
      <p class="tagline">metacognition as a service</p>
      <div class="paths">
        <a href="/humans">I'm a human</a>
        <a href="/agents">I'm an agent</a>
        <a href="/why">why?</a>
        <a href="/how">how?</a>
      </div>
    </div>
  `,
  );
}

export function renderHumans(totalMoves: number): string {
  return layout(
    "ThinkFu — For Humans",
    `
    <div class="page">
      <p>Thinking is an art. Thinking well -originally, creatively, methodically -is a martial art.</p>

      <p>And like any martial art - it requires practice, discipline, and a library of moves to master.</p>

      <p>ThinkFu.org is such a library. We've collected ${totalMoves} thinking moves and created an easy way for your AI (or you?) to break out of the black hole of cliche thinking.</p>
      <p><a href="/setup">Set up ThinkFu for your AI</a> -Claude Code, Claude Desktop, ChatGPT and others.</p>

      <h1 style="margin-top: 2rem;">Or try it yourself</h1>
      <p>Describe what you're working on and ThinkFu will find the right move for you.</p>

      <form class="match-form" action="/match" method="get" onsubmit="sessionStorage.setItem('thinkfu-query', this.q.value); sessionStorage.setItem('thinkfu-excludes', '[]');">
        <textarea id="q" name="q" rows="3" placeholder="What are you working on? Where are you stuck?"></textarea>
        <button type="submit">Find a move</button>
      </form>

      <p style="margin-top: 1.5rem;">or <a href="/random" onclick="sessionStorage.removeItem('thinkfu-query'); sessionStorage.removeItem('thinkfu-excludes');">draw a random move</a></p>
    </div>
  `,
  );
}

export function renderWhy(): string {
  return layout(
    "Why ThinkFu?",
    `
    <div class="page">
      <h1>Why ThinkFu?</h1>
      <p>Thinking is an art. Thinking well - originally, creatively, methodically - is a martial art.</p>
      <p>This art is especially hard for LLMs because they've been trained to produce the average of everything. The most likely completion. The clich&eacute;. The middle of the average that would affect nobody, but say nothing interesting.</p>
      <p>So it's no surprise that without deliberate intervention, "most likely" is all you get from LLMs.</p>
      <p>ThinkFu is that deliberate intervention. A library of 200+ named thinking moves -drawn from TRIZ, oblique strategies, design thinking, systems thinking, and metacognitive research - reformulated as <em>mechanical procedures</em> and spiced up with a clever use of chance operations (hello, John Cage!)</p>
      <p>So if you install ThinkFu, you give your AI access to ~548 billion unique draws from 200+ metacognitive moves. Half a trillion different nudges to think differently. And next time you try to brainstorm with it... you just might get something interesting.</p>
      <p style="margin-top: 2rem;"><a href="/setup">Set up ThinkFu for your AI</a> · <a href="/humans">Try it yourself</a></p>
    </div>
  `,
  );
}

export function renderHow(): string {
  return layout(
    "How ThinkFu Works",
    `
    <div class="page">
      <h1>How it works</h1>

      <h3 style="color:var(--text-strong); margin-top:2rem;">The catalog</h3>
      <p>200+ thinking moves, each a concrete procedure with YAML frontmatter. Many moves have variables (domains, personas, random words) that get filled from curated pools at serve time. One move template can produce millions of unique draws.</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">The seed</h3>
      <p>Every response includes a random concrete noun (e.g. "anvil", "estuary", "furnace") appended quietly at the end. The agent doesn't know it's there as a seed. It subtly shifts how the LLM interprets the move. Same move, different seed, different thinking.</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">The router</h3>
      <p>When you describe your problem, ThinkFu doesn't pick a move randomly. It runs a three-step pipeline, all on Cloudflare's edge:</p>
      <p>1. Your context gets embedded into a 768-dimensional vector (embeddinggemma-300m, ~50ms)</p>
      <p>2. We search a vector database (Cloudflare Vectorize) for the 3 most similar moves by problem signature. Then we add 2 random moves from the same mode as "left field" candidates.</p>
      <p>3. A small LLM (llama-3.1-8b) picks the most <em>unexpectedly useful</em> move from these 5 candidates. If the move has variables, the LLM also chooses specific values from the pools based on your context. Not random, not obvious. Aimed at productive friction.</p>
      <p>The seed word is the one thing the LLM never controls. That stays random.</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">Ratings and learning</h3>
      <p>When an agent (or human) rates a move, that rating gets stored with the full context (stripped of PII and other sensitive stuff): what the situation was, which move was served, whether it actually shifted thinking, and how the user reacted.</p>
      <p>Right now, ratings help us understand which moves work and which don't. Over time, they will improve routing: weighting moves by historical performance for similar situations, and eventually training a custom model that replaces the general-purpose LLM.</p>
      <p>This is why we ask for opt-in rating sharing. More data means better move selection for everyone.</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">What's next</h3>
      <p>Rating-informed routing. A fine-tuned classifier that learns which moves work for which problem shapes. And more moves. As well as ability to submit new ones. The thinking dojo where new moves are submitted and tested and new thinking styles (router preferences) are invented, taught and learned.</p>

      <p style="margin-top: 2rem;"><a href="https://github.com/move38studios/thinkfu">GitHub</a> · <a href="/setup">Set up ThinkFu</a> · <a href="/">home</a></p>
    </div>
  `,
  );
}

export function renderSetup(): string {
  return layout(
    "Set Up ThinkFu",
    `
    <div class="page">
      <h1>Give ThinkFu to your AI</h1>

      <h3 style="color:var(--text-strong); margin-top:2rem;">Claude Code</h3>
      <p>The fastest path. Install the ThinkFu plugin:</p>
      <pre><code>/plugin marketplace add move38studios/thinkfu
/plugin install thinkfu@move38studios-thinkfu</code></pre>
      <p>Your agent now has access to 200+ thinking moves via MCP tools. The SKILL.md teaches it when and how to use them.</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">Claude Desktop</h3>
      <p>Add ThinkFu as an MCP server. Edit your Claude Desktop config (Settings &rarr; Developer &rarr; Edit Config):</p>
      <pre><code>{
  "mcpServers": {
    "thinkfu": {
      "command": "npx",
      "args": ["-y", "thinkfu-mcp"]
    }
  }
}</code></pre>
      <p>(npm package coming soon -for now, clone the <a href="https://github.com/move38studios/thinkfu">repo</a> and point to <code>plugin/mcp/start.sh</code>)</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">ChatGPT / other LLMs</h3>
      <p>Paste this into your system prompt or custom instructions:</p>
      <pre><code>When you are stuck, on autopilot, or about to deliver
an obvious answer, draw a thinking move from ThinkFu:

  curl -s https://api.thinkfu.org/random?format=md

Apply the move. Work through it step by step.
Let it change your approach.</code></pre>
      <p>Or give your LLM the full API: <code>https://api.thinkfu.org</code></p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">Any MCP-compatible client</h3>
      <p>ThinkFu exposes three tools: <code>list_thinkfu_moves</code>, <code>get_thinkfu_move</code>, <code>submit_thinkfu_rating</code>. Point your MCP client at the plugin's server or use the REST API directly.</p>

      <p style="margin-top: 2rem;"><a href="/random">Start drawing</a> &middot; <a href="/">home</a></p>
    </div>
  `,
  );
}

export function renderCredits(): string {
  return layout(
    "Credits — ThinkFu",
    `
    <div class="page">
      <h1>Credits &amp; Intellectual Traditions</h1>
      <p>ThinkFu draws on ideas, principles, and methods from established traditions in metacognition, systematic innovation, creativity research, and design. Each move attributes its intellectual origins in its frontmatter.</p>
      <p>No copyrighted text is reproduced in the catalog. Where a move is inspired by a specific technique, principle, or framework, ThinkFu provides its own original procedures, examples, and framing. The ideas are credited; the expression is ours.</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">Traditions &amp; Sources</h3>
      <ul>
        <li><strong>TRIZ</strong> (Genrich Altshuller, 1956&ndash;1984) -systematic innovation principles and contradiction resolution</li>
        <li><strong>Oblique Strategies</strong> (Brian Eno &amp; Peter Schmidt, 1975) -creative perturbation through indirect prompts</li>
        <li><strong>Lateral Thinking</strong> (Edward de Bono) -techniques for breaking fixation and generating alternatives</li>
        <li><strong>Design Thinking</strong> -human-centered problem-solving methodology</li>
        <li><strong>Systems Thinking</strong> (Donella Meadows, Peter Senge) -feedback loops, leverage points, system archetypes</li>
        <li><strong>Metacognition research</strong> (John Flavell, Gregory Schraw) -thinking about thinking</li>
        <li><strong>Classical philosophy</strong> (Socrates, Plato, Hegel) -dialectic, elenchus, and the synthesis of opposites</li>
        <li><strong>Argumentation theory</strong> (Mercier &amp; Sperber, Charlan Nemeth) -reasoning as social exchange, authentic dissent</li>
        <li><strong>Improv theater</strong> (Keith Johnstone, Viola Spolin) -spontaneity, status, offers and blocks</li>
        <li><strong>Christopher Alexander</strong> -pattern languages, wholeness, and the nature of living structure</li>
        <li><strong>Cognitive science</strong> (Daniel Kahneman, Gary Klein, Marin Kapur) -heuristics, recognition-primed decision making, productive failure</li>
        <li><strong>Writing craft</strong> -editing principles from a long tradition of practitioners</li>
        <li><strong>Constructionism</strong> (Seymour Papert, Mitch Resnick) -learning through making, tinkering, and play</li>
        <li><strong>Zen Buddhism</strong> -koan practice and contemplative inquiry</li>
        <li><strong>Music &amp; performance</strong> (John Cage, Miles Davis, Claude Debussy) -silence, accident, and constraint as creative forces</li>
      </ul>

      <h3 style="color:var(--text-strong); margin-top:2rem;">Ideas vs. Expression</h3>
      <p>Copyright protects expression, not ideas. You cannot copyright a thinking technique, a problem-solving principle, or a cognitive strategy. ThinkFu's catalog consists of original procedures built on ideas that belong to the intellectual commons -many of them centuries old, all of them enriched by the practitioners listed above.</p>
      <p>We credit them because we stand on their shoulders, not because we reproduce their words.</p>

      <p style="margin-top: 2rem;"><a href="/">home</a></p>
    </div>
  `,
  );
}

export function renderTerms(): string {
  return layout(
    "Terms — ThinkFu",
    `
    <div class="page">
      <h1>Terms of Use</h1>
      <p>ThinkFu is provided free of charge by move38 B.V.</p>
      <p><strong>No warranty.</strong> Thinking moves are cognitive prompts, not professional advice. Outcomes depend on how you apply them. Use at your own risk.</p>
      <p><strong>Fair use.</strong> The API and website are for interactive use. Automated scraping, bulk downloading, or sustained high-volume programmatic access without permission is not allowed. Rate limits apply.</p>
      <p><strong>Ratings.</strong> When you rate a move on this website (or via the plugin with sharing enabled), your anonymous feedback is stored and used to improve move routing and train models. No personal information is collected. Ratings cannot be attributed to any individual. By submitting a rating, you agree that move38 may use this data to improve ThinkFu, including training proprietary routing models.</p>
      <p><strong>Software license.</strong> The ThinkFu codebase and catalog are released under the <a href="https://github.com/move38studios/thinkfu/blob/main/LICENSE.md">PolyForm Small Business License 1.0.0</a> -free for individuals and companies under $1M USD annual revenue.</p>
      <p>Contact: thinkfu@move38.org</p>
      <p style="margin-top: 2rem;"><a href="/">home</a></p>
    </div>
  `,
  );
}

export function renderAgents(): string {
  return layout(
    "ThinkFu — For Agents",
    `
    <div class="page">
      <h1>ThinkFu</h1>
      <p>You are reading the ThinkFu agent integration guide. ThinkFu is a metacognition-as-a-service library of 200+ thinking moves (~500 billion+ unique draws via random variables and seed injection) you can call when you are stuck, on autopilot, or about to produce the obvious answer.</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">Claude Code plugin</h3>
      <pre><code>/plugin marketplace add move38studios/thinkfu
/plugin install thinkfu@move38studios-thinkfu</code></pre>
      <p>Once installed, you have access to three MCP tools:</p>
      <pre><code>list_thinkfu_moves  — browse available moves, filter by mode or category
get_thinkfu_move    — draw a move (provide mode, goal, current_approach, stuck_on)
submit_thinkfu_rating — rate a move after applying it</code></pre>

      <h3 style="color:var(--text-strong); margin-top:2rem;">When to call ThinkFu</h3>
      <pre><code>mode: "plan"     — before starting. Challenge your default approach.
mode: "explore"  — while working. Broaden the search space.
mode: "stuck"    — at an impasse. Break through.
mode: "evaluate" — before delivering. Stress-test your output.</code></pre>
      <p>Apply each move fully before drawing another. Rate every move you draw.</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">REST API</h3>
      <pre><code>Base: https://api.thinkfu.org

GET  /random              — random move (JSON)
GET  /random?format=md    — random move (markdown)
GET  /move/:id            — specific move by ID
GET  /list                — all move summaries
GET  /list?mode=stuck     — filter by mode
POST /suggest             — context-aware selection
POST /rate                — submit feedback
GET  /catalog             — full catalog</code></pre>

      <p style="margin-top:2rem;"><a href="https://github.com/move38studios/thinkfu">Source: github.com/move38studios/thinkfu</a></p>
    </div>
  `,
  );
}

export function renderMove(m: ResolvedMove, shareUrl: string): string {
  return layout(
    `${m.name} — ThinkFu`,
    `
    <div class="side-arrow left" onclick="goBack()">&lsaquo;</div>
    <div class="side-arrow right" onclick="goNext()">&rsaquo;</div>
    ${renderMoveContent(m)}
    <div class="actions">
      <a href="#" onclick="goBack(); return false;">back</a>
      <a href="#" onclick="goNext(); return false;">next</a>
      <a href="/random?id=${esc(m.id)}">re-roll</a>
      <button onclick="navigator.clipboard.writeText(window.location.origin + '${shareUrl}').then(() => this.textContent = 'copied')">share</button>
      <a href="#" id="clear-link" style="display:none" onclick="clearProblem(); return false;">clear problem</a>
      <a href="/">home</a>
    </div>
    <div class="rating" id="rating-ui" style="display:none">
      did this move help?
      <span onclick="rateMove(true, this)">yes</span>
      <span onclick="rateMove(false, this)">no</span>
    </div>
    <p class="swipe-hint" id="swipe-hint"><span onclick="goBack()" style="cursor:pointer">&larr; back</span> &middot; <span onclick="goNext()" style="cursor:pointer">next &rarr;</span></p>
    <script>
      // Active problem tracking
      const query = sessionStorage.getItem('thinkfu-query');
      const currentId = '${esc(m.id)}';

      // Track excludes for matched mode
      if (query) {
        let excludes = JSON.parse(sessionStorage.getItem('thinkfu-excludes') || '[]');
        if (!excludes.includes(currentId)) excludes.push(currentId);
        sessionStorage.setItem('thinkfu-excludes', JSON.stringify(excludes));
        // Show clear link, rating, and update hint
        document.getElementById('clear-link').style.display = '';
        document.getElementById('rating-ui').style.display = '';
        document.getElementById('swipe-hint').innerHTML = 'matched to your problem &middot; <span onclick="goBack()" style="cursor:pointer">&larr; back</span> &middot; <span onclick="goNext()" style="cursor:pointer">next &rarr;</span>';
      }

      function getNextUrl() {
        if (query) {
          const excludes = JSON.parse(sessionStorage.getItem('thinkfu-excludes') || '[]');
          return '/match?q=' + encodeURIComponent(query) + '&exclude=' + excludes.join(',');
        }
        return '/random';
      }

      function clearProblem() {
        sessionStorage.removeItem('thinkfu-query');
        sessionStorage.removeItem('thinkfu-excludes');
        window.location.href = '/random';
      }

      function rateMove(helpful, el) {
        const ui = document.getElementById('rating-ui');
        ui.innerHTML = helpful ? 'thanks — rated helpful' : 'thanks — noted';
        ui.querySelector?.('.done')?.remove;
        fetch('/rate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            move_id: currentId,
            instance_id: '${esc(m._instance)}',
            changed_approach: helpful,
            user_reaction: helpful ? 'positive' : 'negative',
            note: 'Website rating',
            original_request: query ? { mode: 'explore', goal: query } : undefined,
          }),
        }).catch(() => {});
      }

      // History as array + cursor index (like browser back/forward)
      const H_KEY = 'thinkfu-history';
      const I_KEY = 'thinkfu-index';
      function getHistory() { return JSON.parse(sessionStorage.getItem(H_KEY) || '[]'); }
      function getIndex() { return parseInt(sessionStorage.getItem(I_KEY) || '-1', 10); }
      function save(h, i) {
        sessionStorage.setItem(H_KEY, JSON.stringify(h));
        sessionStorage.setItem(I_KEY, String(i));
      }

      // Record this page
      const here = window.location.pathname + window.location.search;
      let history = getHistory();
      let index = getIndex();
      if (history[index] !== here) {
        history = history.slice(0, index + 1);
        history.push(here);
        index = history.length - 1;
        save(history, index);
      }

      function goNext() {
        if (index < history.length - 1) {
          index++;
          save(history, index);
          window.location.href = history[index];
        } else {
          window.location.href = getNextUrl();
        }
      }
      function goBack() {
        if (index > 0) {
          index--;
          save(history, index);
          window.location.href = history[index];
        }
      }

      // Keyboard
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goBack();
      });

      // Touch swipe — horizontal only, ignore diagonal/vertical scrolling
      let startX = 0, startY = 0;
      document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      });
      document.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        // Must be clearly horizontal: >100px and at least 2x the vertical movement
        if (Math.abs(dx) > 100 && Math.abs(dx) > Math.abs(dy) * 2) {
          if (dx < 0) goNext();
          if (dx > 0) goBack();
        }
      });
    </script>
  `,
    { description: m.one_liner, url: `https://thinkfu.org${shareUrl}` },
  );
}
