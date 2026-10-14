# UI Lab: project context

_Last updated: 2026-10-15_

## What it is

A live, runnable reference library of UI patterns, built primarily so coding agents (and humans) can look up
and copy proven frontend patterns when building sites. Every pattern is one self-contained React + Tailwind
file with a live demo, tags, "when to use" notes, accessibility notes and copyable source.

- **Live site:** https://ui-lab-weld.vercel.app (Vercel, auto-deploys on push to `main`)
- **Repo:** https://github.com/HarshSalunkhe2005/UI-LAB (sole author: HarshSalunkhe2005)
- **Machine-readable entry points:** `/llms.txt`, `/llms-full.txt`, `/patterns.json`, `/resources.md`,
  `/docs/<slug>.md`, `/raw/<file>`

## Current state

**About 266 patterns** in 15 categories, plus a References page, a Styles page, a Playbook and an AI-assistant router.

| Category | Highlights |
|---|---|
| Foundations, Components, Text, Motion, Backgrounds, 3D, 3D Motion, Layouts, Sections, Screens, Data viz, Recipes | The original library, plus everyday accessible parts added in 2026-10: site nav, FAQ, cookie banner, sign-up form, data table, article layout, shop and basket, settings, 404, combobox, date picker, menu button, pagination, carousel, alerts, password field, file dropzone, faceted search, onboarding checklist, six landing sections, contrast checker, fluid type, layout primitives, container queries and more |
| Sites | **21 whole sites**, one design world each, run full screen at `#/live/site-<name>`: solar, mare, lattice, hotmess, abyss, departures, herbarium, tape, ledger, tidewater, salt-road, pebble, plain-forecast, pip, commute-report, crumb, blueprint, till-roll, curves, specimen, arcade |
| Signature moves | About 55 techniques rebuilt from studied sites (`src/patterns/moves/`, `meta-moves.ts`, slugs `move-*`) |
| Niche worlds | 12 narrow-subject patterns (`src/patterns/niche/`, `meta-niche.ts`) |
| Modern CSS | Scroll-driven reveal, popover, anchor positioning, text-wrap, blur-up placeholder, multi-stroke text (`meta-css.ts`) |

**Design worlds:** 8 general (`playbook/worlds.md`, all with a proof site) and 16 niche (`playbook/niche-worlds.md`, worlds 9 to 24). `src/router.ts` maps a brief to a world, proofs and techniques; it becomes `/for-claude.md` and the Styles page, and every slug in it is validated at build time.

**References (`src/references.ts`, page `#/references`):** 68 teardowns: 30 world-class sites, 20 vibe-coded UIs, 12 recent Awwwards winners, 6 community picks (Hacker News Show HN, One Page Love). Evidence is labelled `inspected`, `partial` or `listing`.

**Quality gates:** `npm run build` typechecks, validates metadata (missing files or thumbnails, unfinished TODO entries, duplicate slugs, playbook mentions of unknown patterns) and emits the AI files; `npm test` runs pure-logic tests (Snake engine, tide model, forecast generator); `tools/axe-crawl.js` is a console sweep that ran clean (axe-core, dark and light) over every pattern page and site; no console errors on any route. Every pattern is code-split; the first load is about 0.62 MB of JavaScript (about 200 KB gzipped).

**Not pushed:** as of 2026-10-15 about 55 local commits sit ahead of `origin/main` (19e5570); push only when asked.

Plus a **Resources directory** (`#/resources`, curated links): inspiration galleries, studios, Codrops, libraries, tools.

## Playbook layer

Patterns are parts; `playbook/` is the judgement: `00-start-here.md` (procedure), `prompts.md`, `site-types.md`, `briefs.md`,
`worlds.md`, `niche-worlds.md`, `inspiration.md`, `reference-sites.md`, `accessibility.md`, `glossary.md`, `verify.md` (loop and
a catalogue of real bugs), `scroll-3d-recipe.md`. Also `tools/site-stack.mjs`, `tools/axe-crawl.js`, `tools/new-site.mjs` (scaffolds a site),
`tools/scope-css.py`, `skills/ui-lab/SKILL.md` (copied to `~/.claude/skills/ui-lab/`), `CLAUDE.md` and project slash commands in `.claude/commands/`.
Whole sites are patterns, not apps: `src/patterns/sites/<name>/` with scoped CSS under `.site-<name>`, the shared hook `sites/_shared.ts`, and a thumbnail `public/thumbs/site-<name>.jpg`.
The pattern page is a launcher card plus per-file source tabs; the demo runs full screen at `#/live/<slug>` (`SiteStage` in `src/SiteViews.tsx`; routes into and out of `live/` skip the View Transition).
Dev middleware must skip URLs with a query (Vite `?raw` imports of the .md files).

## Architecture

- **Stack:** Vite 8, React 19, TypeScript 7, Tailwind CSS v4, sugar-high (code highlighting),
  three + @react-three/fiber + @react-three/drei + @react-three/postprocessing (3D Motion only).
- **`src/meta.ts`** (with `meta-moves.ts`, `meta-niche.ts`, `meta-css.ts`, `meta-practical.ts`, `meta-sites.ts`): single source of truth. Plain data (no React) describing every pattern:
  slug, title, category, summary, when[], file, tags[], a11y, deps[]. Read by the app AND the build.
- **`src/registry.ts`**: attaches components via `import.meta.glob`, all lazy (`React.lazy`), so the first load carries only the shell.
  All render sites wrap patterns in `<Suspense>`. Sources shown on pattern pages load on demand (`useSource` in `App.tsx`).
- **`ai-index.ts`**: Vite plugin that generates the AI files (`llms.txt`, `patterns.json`, `docs/*`, `raw/*`, `for-claude.md`, `references.*`, `resources.md`) and validates metadata
  (dev middleware + emitted on build). Docs inline `three-d/_shared.ts` when a pattern uses it.
- **`src/App.tsx`**: hash router with View Transitions, home (hero, category filters, live thumbnail grid),
  pattern page (Preview/Code tabs, copy, GitHub link, tags, a11y, prev/next), Ctrl+K palette, theme cycle.
- **`src/resources.ts` + `ResourcesPage.tsx`**: the link directory.
- **Assets:** `public/img/0-47.webp` (self-hosted demo photos, via `img()` in `three-d/_shared.ts`),
  `public/models/robot.glb` (RobotExpressive, CC0), `public/models/fox.glb` (Khronos Fox, CC0 model, CC-BY 4.0 rig).

## Conventions

- Add a pattern = file in `src/patterns/<folder>/` (default-exported demo, named export for the reusable
  piece) + one entry in `meta.ts`. Sidebar, grid, search and all AI files update automatically.
- Style through tokens (`src/tokens/tokens.css`); every motion pattern honours `prefers-reduced-motion`;
  every interactive pattern works by keyboard.
- Techniques from paid/third-party sites (Scrolltide, Alche, Codrops, award sites) are re-implemented,
  never copied. Teardowns live in `RESOURCES.md`.
- 3D Motion canvases use `resize={{ offsetSize: true }}` (correct size inside scaled thumbnails) and
  `onCreated={({camera}) => camera.lookAt(0,0,0)}` for elevated cameras.
- Rigged characters: apply look-at offsets in world space and convert to the bone's local frame
  (see `RobotMascot.tsx`), since bone axes differ between rigs.
- Commit messages are plain; no tool attribution. Do not push without asking.
- In a hidden or throttled browser pane, transitions and `requestAnimationFrame` stall: call `document.getAnimations().forEach(a => a.finish())` before screenshots and set `document.startViewTransition = undefined` when crawling routes.

## Known gotchas

- Newer Chromium returns a Promise from `scrollIntoView`; never use it as an arrow-function effect body.
- Tailwind preflight `img { max-width: 100% }` collapses images inside 0×0 CSS-3D parents; use `max-w-none`.
- Don't call `WEBGL_lose_context` in effect cleanup (StrictMode re-runs on the same canvas).
- drei `<Html>` unmounting under React 19 throws; project hotspots manually (see `ProductViewer.tsx`).
- `git push` may need an interactive GitHub sign-in via Git Credential Manager.

## Possible next steps

- Loading placeholder for 3D Motion thumbnails (three.js chunk takes a few seconds on first load).
- More rigged characters (Gobkit / Quaternius CC0 packs), rapier physics demos.
- Synthetic pointer events don't trigger R3F onClick in automated checks; verify click demos with a real click.
- MemoryShards patterns (hero video, view transitions) not yet ported.
- CI (typecheck + build on push) and a README screenshot.
