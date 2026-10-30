# Phase 3: references and patterns (no eval this phase)

Date: 2026-10-30. Scope: author the taste content in `skill/ui-lab/`, retire the playbook copy step in the build, and run one smoke test.

## What was added

| Area | Files | Notes |
|---|---|---|
| Worlds | `references/worlds.md` (1 to 8), `niche-worlds.md` (9 to 24), `world-index.md` | 24 worlds in 6 families. Each has metaphor, use when, never when, free font pair, a full `:root` token block (palette roles, type scale, spacing, radius, motion), signature, three numbered refusals and a three-line first screen. |
| Anti-slop | `references/anti-slop.md` | 40 entries in sections A (2023), B (convergent "tasteful"), C (dense UI), D (this procedure's own defaults). Each has why it reads as AI, a signal (`audit: <rule>`, `audit: planned` or `manual`) and an alternative. |
| Type and colour | `typography.md`, `color.md` | 15 pairings with roles, moods, worlds and fallbacks; the role method, contrast rules, tint building in OKLCH, dark mode derived rather than inverted. |
| Motion, accessibility, bugs, verify | `motion.md`, `accessibility.md`, `bugs.md`, `verify.md` | `bugs.md` and `verify.md` are the old verify.md split and rewritten without repo references; 60 catalogue rows. `verify.md` explains rendering with headless Chrome or Edge when no browser tool exists. |
| Teardowns | `references/teardowns.md` (pro) | 68 teardowns condensed into about 40 techniques: when, how to rebuild, what to watch. Site names only, no URLs. |
| Other references | `briefs.md`, `site-types.md`, `glossary.md` (pro) | Rewritten from the playbook; examples now point at worlds and packaged patterns. |
| Patterns | `patterns/*.html` (32) and a generated `patterns/INDEX.md` | Self-contained HTML, CSS and vanilla JS, each with a header (when, a11y, adapt, tier). 16 are in lite. |
| Tooling | `tools/build-skill.mjs`, `tools/tests/worlds.test.mjs`, `skill-content.test.mjs` | The playbook copy and rewrite step is gone. The build parses pattern headers and writes `patterns/INDEX.md` and a `patterns-index.md` whose first half lists packaged patterns (paths that resolve) and whose second half lists the 262 wider-library ideas as names only. |
| SKILL.md | 136 lines | Gate 2 now draws two candidates from different world families; Gate 6 bans placeholder notices on the shipped page; dense rules add the action-first mobile default and a way to sort at 375; the "read this when" table covers every file. |

## Verification

- `npm run skill`: 9 of 9 checks pass on both zips (pro: 59 files, 305 KB unpacked, 140 KB zipped; lite: 35 files, 164 KB, 76 KB).
- `npm run skill:test` passes: clean install of both zips (own reader and the system `tar` agree; paths resolve; no repo path or live-site host leaks; `contrast.mjs` runs under Node's permission model), 30 validator negative tests, 49 world checks, 9 content checks.
- World checks: all 24 worlds have every required token, a family from the six, numbered refusals, an index entry, and pass 4.5:1 for ink on surface, muted ink on surface and accent-ink on accent. One world (1) failed on the first pass (muted ink 3.92:1) and was fixed.
- Content checks: at least 30 anti-slop entries across A to D with five columns each; every `audit: <rule>` named in the catalogue exists in `audit-ui.mjs`; 15 pairings; 32 patterns with complete headers, no external requests, lang and viewport, a semantic container, and a reduced-motion branch wherever they animate.
- Patterns rendered: all 32 loaded in headless Chrome at 1440 and 375 through the eval harness. Result after fixes: zero console errors, no horizontal overflow, no target under 44 px, no text collisions. Real defects found and fixed this way: the stacked table at 375 had no way to sort (added a sort select), the poster hero's nav links were under 44 px wide, a script error in `skeleton-loading`, and sticky headers inside an `overflow: hidden` wrapper.
- Harness change made along the way: `shoot.mjs` no longer counts text parked off-screen or fully transparent custom radios as visible. This only removes false positives; Phase 2 gate results for the skill runs are unaffected (they passed), and baseline fails would still fail.

Not verified: that every world works as a full page (their token blocks are contrast-tested, not rendered), and that agents use `patterns/` in practice (see the smoke run).

## Smoke run: brief 06 (e-commerce product page, never run before)

Same setup as Phase 2 (a Sonnet subagent reading the unpacked pro skill, no other repo folders). Output: `evals/runs/skill-p3/06-ecommerce-product-page/`.

- **Family rule followed.** Its direction file lists Candidate 1: world 1 Product Hero Scroll (Cinematic and Spatial) and Candidate 2: world 23 Thermal Receipt (Instrument and Spec), chooses 23 and adapts it: the receipt logic became the "order slip" in the buy column, while the mono voice and black counter were dropped on purpose to avoid D2 and D5. It also cites section D.
- **Variety by construction worked here, partly.** The result (a saturated colour field that follows the selected colour, a big-figure spec band, a dark "what's in the bag" cutaway band, a review ledger, an oat shipping band) does not resemble the 01, 02 or 08 outputs.
- **Gates:** 7 of 7 (console clean, no overflow at 375, no target under 44 px, one h1 and main, reduced-motion and focus rules present, no collisions).
- **Hierarchy and rhythm** look right in the full-page render: the colour field plus order slip is a clear first screen and the page changes ground five times.
- **Pattern use is not shown.** None of its design files mention `patterns/`; the page is self-built. The agent's report does not say whether it opened `patterns/INDEX.md`, and the transcript was not inspected. Treat the value of the patterns as unproven until Phase 5.
- Single run, no judge, no baseline; this is a smoke test.

## Budget

Approximate tokens (bytes / 4) for a typical Build task: SKILL.md 3.0k, anti-slop 2.6k, world-index 1.3k, two world sections (read as sections, not whole files) about 1k each, dense-ui 1.4k (dashboards only), templates 1.3k, verify 1.0k, plus typography 1.4k and color 1.2k when choosing fonts and colour, `patterns/INDEX.md` 3.7k and one or two patterns at about 1k. That is roughly 20k to 25k. If an agent opens both whole world files (3.3k and 5.8k) it exceeds 25k. The pro-only `patterns-index.md` is about 15k tokens (the 262 wider-library ideas) and should be read only when asked for ideas; it is a candidate to shrink in Phase 6.
