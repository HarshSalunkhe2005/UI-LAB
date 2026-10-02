---
name: ui-lab
description: Use whenever you build, redesign, restyle or polish any website, landing page, web app UI, component, animation, scroll experience or 3D/WebGL frontend, or when the user wants "premium", "awwwards-level", "not generic" or inspired-by-a-site design. Gives the design procedure (brief, real inspiration, direction card, assets, vertical slice, bounded verification), 8 design worlds, a scroll-driven 3D template, 130+ copyable patterns, and a catalogue of bugs already solved. Not for backend-only work.
---

# UI Lab: design with judgement, not defaults

UI Lab is Harsh's reference library, kept at `C:\Users\Harsh\Projects\UI-Lab` and live at https://ui-lab-gzfw.onrender.com.
It has parts (patterns, templates) and judgement (the playbook). Use both. Most "mid, buggy" output comes from skipping the
judgement and the verification, not from lack of capability.

## Where things are

Prefer the local checkout when it exists; otherwise fetch the same paths from the live site.

| What | Local | Live |
|---|---|---|
| Procedure (read first) | `playbook/00-start-here.md` | `/playbook/00-start-here.md` |
| Design worlds | `playbook/worlds.md` | `/playbook/worlds.md` |
| Inspiration method | `playbook/inspiration.md` | `/playbook/inspiration.md` |
| Verification loop + bug catalogue | `playbook/verify.md` | `/playbook/verify.md` |
| Scroll-driven 3D recipe | `playbook/scroll-3d-recipe.md` | `/playbook/scroll-3d-recipe.md` |
| Finished reference sites (5 worlds) | `src/patterns/sites/<name>/`, run at `#/live/site-<name>` | `/docs/site-<name>.md` (all files), `#/site-<name>` |
| 130+ patterns (index) | `src/meta.ts` | `/patterns.json`, `/llms.txt`, `/docs/<slug>.md` |
| Site-stack detector | `tools/site-stack.mjs` | `/tools/site-stack.mjs` |
| External references | `src/resources.ts` | `/resources.md` |

## Procedure (summary; the playbook is authoritative)

1. **Brief.** Write 5 lines: who/where/mood, mode (Persuade / Operate / Read / Experience), the ONE memorable moment, real content, constraints.
   Ask the user one sharp question if you cannot. Never guess a whole site.
2. **Inspiration, for real.** First look at UI Lab's five finished sites to see what committed design looks like. Then open at least 3 outside reference sites in a browser; scroll them slowly; run `node tools/site-stack.mjs <url>`.
   Write a 5-line teardown each (idea, technique, palette/type, take/leave). Then *cross* them around this product's content.
   Never copy code, copy text, assets or exact layouts; re-implement techniques.
3. **Commit to a world.** Pick from `worlds.md` or invent one; write the direction card (name, metaphor, palette roles, type pair,
   motion language, signature moment, three refusals). Brief beats taste. When torn between refined and committed, commit.
   Run the *swap test* (replace the brand with a competitor's: if nothing changes, redo it) and add one deliberate tension.
4. **Assets before code.** The signature moment dictates the asset (GLB, frame sequence, video, photography). Don't substitute gradient blobs.
5. **Vertical slice first.** Make the signature moment work end to end, then build outward. Pull parts from patterns/templates; copy
   `tokens.css` first.
6. **Verify, bounded.** Build once; ONE batched round (fresh load, console clean, every section screenshotted at 1440 and 375,
   reduced-motion, keyboard); fix everything in one batch; one confirming round; stop. Check the bug catalogue in `verify.md` first.
7. **Hand off honestly.** URL to open, what you rendered, what you could not test, what is placeholder, next steps.

## Always-on rules

- Fonts self-hosted (Fontsource). No system font as the display voice. Draw icons (SVG/one icon set); no emoji/unicode icons.
- Contrast 4.5:1 body. Touch targets 44px. `100svh`. No horizontal scroll at 375px. `prefers-reduced-motion` honoured. Keyboard reachable, visible focus.
- Refuse unless the brief earns them: identical icon-heading-text card grids, hero-metric rows as filler, eyebrow labels, numbered sections without meaning,
  gradient text, decorative glass, coloured side-borders, hard shadows outside neo-brutalism, identical fade-up on every block.
- Scroll + 3D: one GSAP master timeline (1 time unit = 1px), mutable state object read in `useFrame`, never `setState` per scroll tick.
- In the built-in browser pane WebGL is software-rendered and slow; wait before judging a screenshot, don't "fix" test-environment slowness.

## When you learn something new

Add it back: a bug to `playbook/verify.md`, a new world to `worlds.md`, a technique to a recipe, a pattern to `src/meta.ts`.
Commit messages stay plain, with no tool attribution. Do not push without asking.
