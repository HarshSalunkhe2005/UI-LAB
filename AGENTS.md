# AGENTS.md

Guide for AI coding agents using or extending UI Lab.

## Read this first: the playbook

Patterns are parts; the **playbook** is the judgement that stops generic output. Before building any UI, read
`playbook/00-start-here.md` (live: `/playbook/00-start-here.md`): brief, real inspiration, direction card, assets, vertical slice,
bounded verification. Start with `src/router.ts` (`/for-claude.md` live): brief to world to proof. Then `worlds.md` (8 general directions), `niche-worlds.md` (12 narrower ones), `briefs.md`, `inspiration.md`, `verify.md` (bug catalogue), `scroll-3d-recipe.md`.
Eighteen finished whole sites live *inside* the library as the **Sites** category (`src/patterns/sites/<name>/`: solar, mare, lattice, hotmess, abyss, departures, herbarium, tape, ledger, tidewater, salt-road, pebble, plain-forecast, pip, commute-report, crumb, blueprint, till-roll; slugs `site-<name>`). Twelve smaller **Niche worlds** patterns (`src/patterns/niche/`, `meta-niche.ts`, slugs `niche-*`) prove the rest of the narrow directions. Each runs full screen at `#/live/<slug>` and has per-file source tabs. Site-stack detector: `node tools/site-stack.mjs <url>`.
The same procedure is packaged as a Claude skill in `skills/ui-lab/SKILL.md` (copy to `~/.claude/skills/ui-lab/` to load it in every session).

## Using it as a reference (from another project)

1. Read the index: https://ui-lab-weld.vercel.app/llms.txt (or `/patterns.json` for structured data, `/llms-full.txt` for everything in one file).
2. Pick patterns by `tags`, `category` and `when`. Fetch `/docs/<slug>.md` for metadata + full source, or `/raw/<file>` for the bare file.
3. Copy `src/tokens/tokens.css` into the target project first. Patterns use its CSS variables; Tailwind utilities (`bg-surface`, `text-fg-muted`, `border-border`, `text-accent`, …) map to them via the `@theme` block in `src/index.css`.
4. Keep each pattern's `prefers-reduced-motion` handling and a11y notes when adapting.

## Adding a pattern (in this repo)

1. Create `src/patterns/<folder>/<Name>.tsx` with a **default-exported demo**. Export the reusable piece as a named export.
2. Add an entry to `ALL` in `src/meta.ts`: slug, title, category, summary, when[], file, tags[], a11y, optional source/deps.
3. That's it: sidebar, home grid (live thumbnail), Ctrl+K search, `/llms.txt`, `/patterns.json`, `/docs/<slug>.md` and `/raw/…` all generate from `meta.ts`.

## Adding a whole site (category "Sites")

A site is a *pattern*, not a separate app. Folder `src/patterns/sites/<name>/` with `index.tsx` (default-exported component, root element `className="site-<name>"`), its own files and `styles.css`.

1. **Scope the CSS.** Write it like a normal standalone stylesheet (`:root`, `html`, `body`, `*` are fine), then run `python tools/scope-css.py src/patterns/sites/<name>/styles.css site-<name> <name>`. It rewrites selectors under the wrapper class and prefixes `@keyframes` names.
2. **Use `useSiteScroll(rootRef)`** from `sites/_shared.ts` for Lenis + in-page anchors. Never use a real `href="#section"` navigation (UI Lab's router is the URL hash) and never write to `document.documentElement` (set CSS variables and classes on the root element instead). Clean up everything on unmount.
3. **Avoid UI Lab's global class names** (`.reveal` animates on scroll). Prefix generic ones if in doubt.
4. **Register it** in `src/meta.ts`: `category: "Sites"`, `file: "sites/<name>/index.tsx"`, `files: [...]`, tags, a11y, deps. Add a thumbnail at `public/thumbs/site-<name>.jpg` (the home card and the launcher use it).
5. Fonts via Fontsource imports inside `index.tsx` (they ship with the lazy chunk). Sites are code-split automatically.
6. Verify at `#/live/<slug>`: desktop and 375px, every section, console clean, and leave and re-enter to prove teardown (no leftover classes or pins).

## Reference sites and Signature moves

`src/references.ts` holds 68 teardowns (30 world-class sites, 20 vibe-coded UIs, 12 recent Awwwards winners, 6 community picks from Show HN and One Page Love); the **References** page, `/references.md` and `/references.json` are generated from it, and `playbook/reference-sites.md` is the synthesis. Each technique we took is a pattern in the **Signature moves** category (`src/patterns/moves/`, entries in `src/meta-moves.ts`, slugs `move-*`).

Adding a teardown: measure it in a browser at 1440x900 (computed fonts, colours, canvas/video/sticky counts, `node tools/site-stack.mjs <url>`), write the entry in `references.ts` with an honest `evidence` level (`inspected`, `partial`, `listing`), and link `moves` to the pattern that rebuilds it. Adding a move: a self-contained file in `src/patterns/moves/` with a default-exported demo, an entry in `meta-moves.ts` (summary, when, tags, a11y, `source` pointing at the studied site), keyboard and reduced-motion handled. Never copy a site's code, text or assets; re-implement the technique.

## Rules

- Project slash commands live in `.claude/commands/`: `/brief`, `/build-site`, `/teardown`, `/verify`, `/add-pattern`, `/add-world`.
- Adding a route: edit `src/router.ts`; every slug is validated at build time and the table is emitted as `/for-claude.md`.
- Learned something building a site? Add it back: a bug to `playbook/verify.md`, a world to `worlds.md`, a recipe, or a pattern.

- One self-contained file per pattern. No new runtime dependencies without listing them in `deps`.
- Style with tokens, never hard-coded theme colours (demo content may use its own colours).
- Every motion pattern handles `prefers-reduced-motion`. Every interactive one works by keyboard.
- Build our own implementations. Do not copy code, prompts or copy text from paid libraries.
- Commit messages: plain, no AI attribution.

## Commands

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # typecheck + static build (includes AI files)
```
