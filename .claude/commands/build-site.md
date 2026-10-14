---
description: Build a whole site as a UI Lab pattern (category Sites), end to end
argument-hint: <brief>
---
Brief: $ARGUMENTS

Follow `playbook/00-start-here.md` and the "Adding a whole site" section of `AGENTS.md`.
1. Brief, world (from `src/router.ts`), direction card with three refusals, swap test.
2. Open the proof site for that world. Take apart three outside references in five lines each.
3. Scaffold with `node tools/new-site.mjs <name> "<Title>" <world>`, then build `src/patterns/sites/<name>/` with `index.tsx` (root `className="site-<name>"`), `styles.css` scoped with `python tools/scope-css.py <css> site-<name> <name>`, `useSiteScroll`, Fontsource fonts.
4. Register in `src/meta-sites.ts`, add `public/thumbs/site-<name>.jpg`, run `npx tsc --noEmit` and `npm run build`.
5. Verify at `#/live/site-<name>`: console clean, 1440 and 375, reduced motion, keyboard, leave and re-enter. One batch, one confirmation, stop.
6. Report: URL, what you rendered, what you could not test, what is placeholder. Commit plainly. Do not push without asking.
