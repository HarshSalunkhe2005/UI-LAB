# UI Lab: project context

_Last updated: 2026-10-03_

## What it is

A live, runnable reference library of UI patterns, built primarily so coding agents (and humans) can look up
and copy proven frontend patterns when building sites. Every pattern is one self-contained React + Tailwind
file with a live demo, tags, "when to use" notes, accessibility notes and copyable source.

- **Live site:** https://ui-lab-weld.vercel.app (Vercel, auto-deploys on push to `main`)
- **Repo:** https://github.com/HarshSalunkhe2005/UI-LAB (sole author: HarshSalunkhe2005)
- **Machine-readable entry points:** `/llms.txt`, `/llms-full.txt`, `/patterns.json`, `/resources.md`,
  `/docs/<slug>.md`, `/raw/<file>`

## Current state

**134 patterns across 13 categories:**

| Category | Count | Highlights |
|---|---|---|
| Foundations | 1 | Design tokens (light/dark, motion, type, spacing) |
| Components | 25 | Command palette, toasts, drawer, form controls, tabs, OTP, dock, gooey menu, fullscreen menu |
| Text | 8 | Scramble, focus reveal, split reveal, glitch, link hovers, scroll typography |
| Motion | 23 | Scroll reveal, view transitions, pixel/wipe page transitions, cursor effects, preloader |
| Backgrounds | 8 | WebGL shader engine (7 families, 16 presets), liquid slideshow, starfield, dot grid |
| 3D | 15 | CSS-3D galleries: helix (spiral of pictures), DNA, sphere, wave, tunnel, coverflow, ring |
| 3D Motion | 40 | Real 3D (three.js / R3F): rigged robot mascot, fox follow, lanyard badge (Verlet rope), raymarched metaballs, neon sign (bloom), portal card, boids, galaxy, particle text, puzzle cube, Newton's cradle, terrain flyover, audio-reactive ring, solar system, glass shatter, holo card, and more |
| Layouts / Sections / Screens | 1 / 6 / 4 | Bento, pricing, footer, contact, hero; dashboard, auth, kanban, chat |
| Data viz / Recipes | 2 / 1 | SVG charts (line, heatmap, radar), timeline; marquee |

Plus a **Resources directory** (`#/resources`, 93 curated links): inspiration galleries, award-level studios,
Codrops demo repos, component/motion/3D libraries, CC0 model sources, awesome lists, tools.

## Playbook layer (added 2026-10-03)

Patterns are parts; `playbook/` is the judgement that stops generic output. `00-start-here.md` (procedure: brief, real
inspiration, direction card, assets, vertical slice, bounded verification), `worlds.md` (8 design directions), `inspiration.md`
(teardown + synthesis method), `verify.md` (loop + catalogue of real bugs), `scroll-3d-recipe.md`. Also: `tools/site-stack.mjs` (detects a site's libraries), `skills/ui-lab/SKILL.md` (the playbook as a Claude skill,
copied to `~/.claude/skills/ui-lab/`), `CLAUDE.md`. Five whole sites (one design world each) are patterns in the **Sites** category: `src/patterns/sites/{solar,mare,lattice,hotmess,abyss}` (slugs `site-*`, lazy-loaded; deps gsap, lenis, more Fontsource fonts). The pattern page is a launcher card plus per-file source tabs; the demo runs full screen at `#/live/<slug>` (`SiteStage` in `src/SiteViews.tsx`: UI Lab chrome hidden, Esc returns; routes into and out of `live/` skip the View Transition because it hangs on the heavy first render). Per-site CSS is scoped under `.site-<name>` with `tools/scope-css.py`; shared hook `sites/_shared.ts` (`useSiteScroll`). Thumbnails `public/thumbs/site-*.jpg`. Rendered at `#/playbook`; served to agents at `/playbook/*.md`,
`/tools/site-stack.mjs` and listed first in `/llms.txt`. Dev middleware must skip URLs with a query
(Vite `?raw` imports of the .md files).

## Architecture

- **Stack:** Vite 8, React 19, TypeScript 7, Tailwind CSS v4, sugar-high (code highlighting),
  three + @react-three/fiber + @react-three/drei + @react-three/postprocessing (3D Motion only).
- **`src/meta.ts`**: single source of truth. Plain data (no React) describing every pattern:
  slug, title, category, summary, when[], file, tags[], a11y, deps[]. Read by the app AND the build.
- **`src/registry.ts`**: attaches components via `import.meta.glob`. Everything is eager except
  `patterns/motion3d/**`, which is lazy (`React.lazy`) so three.js (~890 KB) loads only when needed.
  All render sites wrap patterns in `<Suspense>`.
- **`ai-index.ts`**: Vite plugin that generates the AI files from `meta.ts` + `resources.ts`
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
- Commit messages are plain; no tool attribution.

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
