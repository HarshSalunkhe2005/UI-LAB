# CLAUDE.md

This repo is a design library with a procedure attached. Using it well means following the procedure, not browsing patterns.

## If you are building or changing UI (here or in any project that uses UI Lab)

1. Read `src/router.ts` (or `/for-claude.md` on the live site): it maps a brief to a world, a proof site and the techniques to take.
2. Follow `playbook/00-start-here.md`: brief, real inspiration, direction card, assets, vertical slice, one bounded verification.
3. Open the proof site or pattern for your world before writing code. Run it. Read its source.
4. Verify by rendering: fresh load, console clean, every section at 1440 and 375, reduced motion, keyboard. Read `playbook/verify.md` first.

Shortcuts in this repo: `/brief`, `/build-site`, `/teardown`, `/verify`, `/add-pattern`, `/add-world` (see `.claude/commands/`).

## If you are extending the library

`AGENTS.md` has the conventions: one self-contained file per pattern, `src/meta.ts` (and `meta-moves.ts`, `meta-niche.ts`, `meta-sites.ts`) as the single source of truth, whole sites under `src/patterns/sites/<name>/` with scoped CSS and a thumbnail, techniques re-implemented in our own code and never copied.

## Rules that are easy to get wrong

- Do not push without asking. Commit messages are plain: no tool attribution, no Co-Authored-By lines.
- Never build a standalone showcase site; whole-site demos are patterns in category Sites.
- `src/router.ts` slugs are validated at build time; if you rename a pattern, the build tells you.
- Do not bypass bot walls or CAPTCHAs when studying a reference. Record it as `listing` evidence and move on.
- Thumbnails: Sites cards need `public/thumbs/site-<name>.jpg`.
- `npm run build` validates metadata and `npm test` checks the pure logic; run both before committing. `tools/axe-crawl.js` is the accessibility sweep.
