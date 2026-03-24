import type { ResolvedMove } from "@thinkfu/lib/resolver.js";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function mdToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let inList = false;
  let inCode = false;

  for (const line of lines) {
    if (line.startsWith("```mermaid")) { html += `<pre class="mermaid">`; inCode = true; continue; }
    if (line.startsWith("```") && inCode) { html += "</pre>"; inCode = false; continue; }
    if (line.startsWith("```")) { html += "<pre><code>"; inCode = true; continue; }
    if (inCode && !line.startsWith("```")) { html += esc(line) + "\n"; continue; }
    if (line.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h3>${line.slice(3)}</h3>`;
    } else if (line.startsWith("- ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(line.slice(2))}</li>`;
    } else if (line.trim() === "") {
      if (inList) { html += "</ul>"; inList = false; }
    } else {
      if (inList) { html += "</ul>"; inList = false; }
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
main { max-width: 640px; margin: 0 auto; padding: 2rem 1.5rem; }

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
.mermaid { background: var(--mermaid-bg); border-radius: 4px; padding: 1rem; margin: 1rem 0; }

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
  main { padding: 1.25rem 0.75rem; }
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
  .theme-toggle { top: 0.75rem; right: 0.75rem; }
  .swipe-hint { font-size: 0.7rem; }
}
`;

function layout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <style>${CSS}</style>
</head>
<body>
  <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()">light</button>
  <main>${content}</main>
  <footer>
    <a href="/">think-fu.org</a> by <a href="https://move38.org">move38</a>
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

function extractMermaid(body: string): { mermaid: string | null; rest: string } {
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
      ${details ? `
        <details class="more">
          <summary>more</summary>
          <div class="body">${mdToHtml(details)}</div>
          ${m.pairs_with.length > 0 ? `
            <div class="pairs">
              pairs with: ${m.pairs_with.map((p) => `<a href="/move/${p.id}">${p.id}</a>`).join(", ")}
            </div>
          ` : ""}
        </details>
      ` : ""}
    </div>`;
}

// --- Pages ---

export function renderLanding(): string {
  return layout("ThinkFu", `
    <div class="landing">
      <h1>ThinkFu</h1>
      <p class="tagline">metacognition as a service</p>
      <div class="paths">
        <a href="/humans">I'm a human</a>
        <a href="/agents">I'm an agent</a>
      </div>
    </div>
  `);
}

export function renderHumans(totalMoves: number): string {
  return layout("ThinkFu — For Humans", `
    <div class="page">
      <h1>ThinkFu for humans</h1>
      <p>${totalMoves} thinking moves. ~548 billion unique draws.</p>
      <p>Each move is a concrete procedure — not advice, not a pep talk. A mechanical operation you can follow to break fixation, challenge your framing, or catch the clich&eacute; before it ships.</p>
      <p>Every draw injects random variables and a seed word that subtly shift interpretation. The same move, drawn twice, produces different thinking. The randomness is the mechanism.</p>
      <p>Sources: TRIZ, Oblique Strategies, Design Thinking, systems thinking, metacognitive research. Reformulated as executable procedures for humans and AI agents.</p>
      <p style="margin-top: 2rem;"><a href="/random">Draw a move</a></p>
    </div>
  `);
}

export function renderAgents(): string {
  return layout("ThinkFu — For Agents", `
    <div class="page">
      <h1>ThinkFu</h1>
      <p>You are reading the ThinkFu agent integration guide. ThinkFu is a metacognition-as-a-service library of 200+ thinking moves (~548 billion unique draws via random variables and seed injection) you can call when you are stuck, on autopilot, or about to produce the obvious answer.</p>

      <h3 style="color:var(--text-strong); margin-top:2rem;">Claude Code plugin</h3>
      <pre><code>/plugin marketplace add move38/thinkfu
/plugin install thinkfu@move38-thinkfu</code></pre>
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
      <pre><code>Base: https://api.think-fu.org

GET  /random              — random move (JSON)
GET  /random?format=md    — random move (markdown)
GET  /move/:id            — specific move by ID
GET  /list                — all move summaries
GET  /list?mode=stuck     — filter by mode
POST /suggest             — context-aware selection
POST /rate                — submit feedback
GET  /catalog             — full catalog</code></pre>

      <p style="margin-top:2rem;"><a href="https://github.com/move38/thinkfu">Source: github.com/move38/thinkfu</a></p>
    </div>
  `);
}

export function renderMove(m: ResolvedMove, shareUrl: string): string {
  return layout(`${m.name} — ThinkFu`, `
    ${renderMoveContent(m)}
    <div class="actions">
      <a href="#" onclick="goBack(); return false;">back</a>
      <a href="#" onclick="goNext(); return false;">next</a>
      <a href="/random?id=${esc(m.id)}">re-roll</a>
      <button onclick="navigator.clipboard.writeText(window.location.origin + '${shareUrl}').then(() => this.textContent = 'copied')">share</button>
      <a href="/">home</a>
    </div>
    <p class="swipe-hint">&larr; back &middot; next &rarr;</p>
    <script>
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
        // Navigated to a new page (not via back/forward) — truncate forward history
        history = history.slice(0, index + 1);
        history.push(here);
        index = history.length - 1;
        save(history, index);
      }

      function goNext() {
        if (index < history.length - 1) {
          // There's forward history — go there
          index++;
          save(history, index);
          window.location.href = history[index];
        } else {
          // At the end — draw new random
          window.location.href = '/random';
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

      // Touch swipe
      let startX = 0;
      document.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
      document.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (dx < -60) goNext();   // swipe left = next
        if (dx > 60) goBack();    // swipe right = back
      });
    </script>
  `);
}
