---
name: ui-lab
description: Use when the user asks to "build a landing page", "design a dashboard", "redesign this UI", "make it look less generic" or "critique this design". Runs a gated procedure in three modes (Build, Redesign, Critique) - brief, house-style check with candidates from different design-world families, rendered verification, handoff - so the result avoids the defaults an AI agent drifts to, passes mechanical accessibility and layout checks, and is rendered before it is called done. Includes dense dashboard guidance, token-level design worlds and canonical patterns. Not for backend, data or scripting tasks.
---

# UI Lab

Capable agents already make pages that look fine. The failure is that they all look the same, and nobody rendered them. This skill adds three things: a gate that forces a choice against your own default (with candidate directions drawn from a fixed set of worlds, so your taste is not the only input), a verification gate you cannot skip, and a mode for existing UI. Each gate leaves a short file in `design/` in the project (or a labelled block in your reply for a small task). Say so if you skip a gate on purpose.

If the task is not visual or interaction design (API, SQL, shell, data), this skill does not apply. Load nothing.

## Pick a mode

| The user wants | Mode | Start at |
|---|---|---|
| A new page, screen or component | Build | Gate 1 |
| An existing UI changed or improved | Redesign | Gate R |
| An opinion on a UI, or "what is wrong with this" | Critique | Gate C |

Dashboards, admin tools, tables, editors, anything dense: also read `references/dense-ui.md` before Gate 2.

## Gate 1. Brief (Build)

Fill `templates/brief.md` into `design/brief.md`. Every line needs something real: audience and where they are, the job of the page, three mood words, the one memorable moment, real content, constraints, and what it must not feel like. If a line cannot be filled from the request, ask the user one sharp question; if nobody is there to ask, write your assumption into the brief and say so in the handoff. Do not invent a product. Real copy and real-looking data from the start: no lorem ipsum, no "Feature One", no round-number metrics that look made up.

## Gate 2. House-style check (mandatory, before any code)

Your first idea is the average of what you have seen. Name it, then leave it unless the brief earns it.

1. **Write the default.** In `design/direction.md`, one line per axis for the page you would produce if you did not think: **ground**, **type voice**, **layout grammar**, **accent strategy**, **motion**.
2. **Check it against `references/anti-slop.md`.** It lists the 2023 defaults, the current convergent "tasteful" ones, the dense-UI ones and the defaults this very procedure tends to produce. Mark every match.
3. **Roll, then draw two candidates from different world families.** Read `references/world-index.md` (24 worlds in 6 families, with what each fits and never fits); it is enough to choose, so do not open any world file yet. **Roll for variety:** draw a random number (for example `echo $RANDOM`, or the nanoseconds from `date +%N`; not the whole-second clock, which repeats when two runs start together), take it modulo 6, and write the number in `design/direction.md`. Families are numbered 0 to 5 in the order the index lists them. Candidate A is the best-fitting world in the first family at or after that number (wrapping round) that has a world whose "fits" column matches this brief; candidate B is the best-fitting world in the next family after that which also fits. Skip a family only when none of its worlds fit, and say so. Do not override the roll because another world feels more familiar: your taste is the thing being diversified. **A cream or off-white ground with a serif display voice (most of family 0, and any world adapted that way) needs a line of evidence from the brief, exactly as keeping a house-style default does.** It is the most common landing zone for a page that is trying to look considered, and blind reviewers keep calling it the typical one; choose it only when the brief is about reading, print, craft or heritage. Pick one candidate and say why in a line. **Then roll the ground.** Draw another random number, take it modulo 4 and write it in `design/direction.md`. Treatments, in order: 0 light neutral (white or a cool grey-white, not warm cream), 1 dark (near-black or a deep colour), 2 saturated colour field (the page ground itself is a strong colour), 3 tinted mid-tone (a mid-lightness hue such as sage, clay, slate or mustard, not off-white). Start at that number and take the first treatment the chosen world lists on its **Grounds** line, wrapping round. Rebuild the world's surface, raised surface and ink tokens for that ground; keep its type, rules and signature. This is what keeps three pages from the same world family from all landing on off-white and near-black. Adapt the tokens to this brand; never ship a world's hex values unchanged.
4. **Or defend the default.** For each axis you keep from your default, write one line of evidence from the brief. "It looks good" is not evidence. The winner must differ from your default on at least three of the five axes unless every kept axis is earned.
5. **Different is not enough: it must be stronger.** Name the single boldest visual element on the first screen and the places where the page changes rhythm (ground, density or scale, at least twice). Austere and uniform loses to committed and varied.
6. **Swap test.** Replace the brand name and content with a competitor's. If nothing about the design has to change, it is generic: redo steps 3 to 5.

Gate output: the table of default, matches, candidates (world and family), chosen and reason, per axis.

## Gate 3. Direction card

Fill `templates/direction-card.md` into `design/direction.md`. Open only the chosen world's file (the path is in `references/world-index.md`; one file per world) and start from its `:root` token block, adapting it: palette by role, type scale, spacing scale, radius, motion durations and easing. Choose fonts from the world's pair or `references/typography.md` (15 pairings); roles and contrast rules are in `references/color.md`; motion rules in `references/motion.md`. Never leave the display voice on the system default. Write three refusals.

## Gate 4. Vertical slice, then build

Put the tokens in `:root` first. Build the signature moment end to end with real content and real states (hover, focus, empty, error), then build outward. Semantic HTML first, then style. **If the page has one of these, open the pattern and adapt it before writing your own:** take the structure and the accessibility behaviour, replace the tokens, and note in `design/direction.md` which you adapted.

| The page has | Adapt this pattern file (in `patterns/`) |
|---|---|
| A dense, sortable table | `data-table-sortable.html` |
| A lead figure or KPI row | `kpi-lead-figure.html` |
| A hero that shows real evidence | `hero-evidence.html` |
| Pricing tiers | `pricing-plain.html` |
| A form with errors | `form-field-errors.html` |
| An empty state | `empty-state.html` |
| A navigation that must work at 375 | `nav-responsive.html` |
| A product gallery | `product-gallery.html` |
| An FAQ | `faq-details.html` |
| A code block with a copy button | `code-block-copy.html` |
| A toast or live status message | `toast-live.html` |
| A docs outline that follows the scroll | `toc-scrollspy.html` |

Nothing else is packaged. For anything not in the table, build it from the world's tokens. Small screens are designed, not squashed: decide at 375 what moves, what collapses and what disappears.

Dense UI rules (details in `references/dense-ui.md`):
- Lead with what needs action, not with a summary of everything.
- Numbers right-aligned in tabular figures; one row height; a sticky header on long tables.
- At 375 a wide table becomes a stacked list or a column-priority table, never a clipped one, and it keeps a way to sort.
- At 375 the default view is the action-first subset (the "needs attention" filter is on), with the full list one tap away.
- Status is text plus colour, never colour alone. Charts get direct labels and one accent.
- Controls show their current state. Filters and sorts are visible and reversible.

## Gate 5. Rendered verification (mandatory)

Code that was never rendered is a guess. Do not write "works" or "responsive" in the handoff unless you rendered it.

**Path A: you can render.** Run one command: `node scripts/verify.mjs <project-dir>`. It runs the audit, loads your page in a local Chrome or Edge in a frame that is really 375 px wide (headless browsers refuse narrower windows, so a plain 375 screenshot comes back wider) and at 1440, measures checklist items 1 to 6 and the h1, saves screen-sized slices to `design/verify/`, and writes `design/verify.md` with the real numbers. It prints PASS or FAIL for every gate and exits non-zero on a failure. Fix every FAIL in one batch, run it again, and repeat until it exits 0 (the confirming round). It also builds two contact sheets, `design/verify/sheet-375.png` and `sheet-1440.png`, with every slice tiled small: open both before you write the handoff, and name one concrete thing you saw in each (a section, a defect, a number) in the handoff's verification line. Open single slices to check anything that looks wrong, then fill in the manual rows at the bottom of the log: contrast, keyboard, dead controls, balance. Its gates now also catch one-word-per-line wrapping, squeezed tables and a highlight split across lines; the review items it lists (a band much taller than its content, text over a picture) are heuristics to look at, not gates. The script cannot judge a slice; you can. Do not write the log yourself: the script writes it, and a log you typed by hand is not evidence. If `scripts/verify.mjs` exits 2, no browser was found: treat that as Path B. The audit findings tagged heuristic come from pattern matching and can be wrong: confirm them in a slice before acting. Something rendering wrong? `references/fixes.md` lists each failure and the fix.

**Path B: you cannot render.** Run `node scripts/audit-ui.mjs <project-dir>` (verify.mjs does this and says so when it has no browser) and fix every critical and warning it reports. State its limits in the handoff: it is a static lint that cannot see layout, collisions, images, overlays or the 375 px view, and its heuristic findings can be wrong. Write NOT RENDERED in the handoff with the list of checks you could not do; a clean audit is not a pass of the checklist below.

Defects that only show at native scale, such as a highlight crowding the line above or a badge covering a number, are found only by looking at each slice. An empty manual row means that step was skipped, and the handoff must say so.

Mechanical checklist, all pass/fail:
1. Fresh load: console has zero errors and warnings you caused.
2. No horizontal scroll at 375 (the page is not wider than the viewport).
3. Every interactive element at least 44x44 px at 375, in width and in height (inline text links in a sentence excepted). Nav links and footer links are the usual failures.
4. Exactly one `h1` per page (extra views in a one-page app use `h2`); landmarks `header`, `nav`, `main`, `footer` present where the page has those parts; images have `alt`; form controls have labels.
5. Visible focus on every control (tab through the page); no keyboard trap.
6. `prefers-reduced-motion: reduce` is handled: nothing loops or moves for decoration.
7. Text contrast at least 4.5:1 (3:1 for large text); check pairs with `node scripts/contrast.mjs <fg> <bg>`.
8. No collisions or clipping: stamps over text, sticky headers over headings, labels cut off, tables cut off at 375, text under illustrations.
9. Every control does something: no dead buttons, no dead anchors.
10. Look at every screen-sized slice, not only the top: a downscaled full-page image hides defects. For each: hierarchy clear in three seconds? Then squint: do the sections differ in ground, density or scale, and is there one place with real visual weight? A page that is correct but uniform and flat is not done.
11. First screen: the headline and the primary action are both visible without scrolling at 1440x900 and at 375x812, and the hero headline is no longer than four lines at 1440.
12. Balance and rendering: no band with text in a narrow column beside an empty half; no figure or badge covering other content; code and pre blocks render as one block (inline-code styles must not leak into them); a table at 375 keeps the columns a reader needs, not just the first two.

## Gate 6. Handoff

Fill `templates/handoff.md` into `design/handoff.md`: what was built and how to open it, what you rendered at which sizes, what you could not test, placeholders, known defects left, next steps. Short and honest.

**Placeholders are disclosed in the handoff and never rendered on the page.** No "sample quotes", "placeholder content" or "illustrative data" notes in the shipped UI; the page should read as finished, and the handoff lists what is invented so the user can replace it.

## Gate R. Redesign (existing UI)

Preserve first. Skin, do not rewire.

1. **Inventory before touching anything.** Render every distinct screen at 1440 and 375 and keep the screenshots. List what must survive: routes, copy that is functionally or legally fixed, data shapes, component APIs, handlers, tests, the order of sections if the user kept it. Write it in `design/preserve.md`.
2. **Critique the current state** with `templates/critique-report.md` (Gate C). This is your before. Run `node scripts/audit-ui.mjs` on the source first to seed it.
3. Run Gate 2 against what exists: what is the current default, and which axes will you change, with candidates from two world families? A redesign that changes only colours is a recolour; say so or change more.
4. Change tokens, type, layout and markup. Do not change behaviour, data or routes unless the user agrees. When you must (a broken pattern), list the change in the handoff.
5. Rebuild at the same entry point so the user can compare. Do not edit the original in place unless asked; keep it or work in a copy.
6. Gate 5 on the result, and compare before and after at both widths. The handoff lists what was preserved, what changed and what is better, by measurement.

## Gate C. Critique

Output is `templates/critique-report.md`, filled. Rules:
- Render first (Gate 5, Path A). Critique of unseen UI is opinion. Then run `node scripts/audit-ui.mjs <path>` on the source to seed the report: its findings are evidence for the accessibility, typography and house-style rows (quote the file and line, and the anti-slop id). Do not copy heuristic findings in without checking them against the screenshots.
- Score each area 0, 1 or 2 with the evidence you saw: a quoted element, a measured number, a screenshot region.
- List the top three defects by cost to a real user or reviewer, not by ease.
- Every defect gets a concrete fix as a before and after diff of CSS or markup (a value or a rule, never "improve contrast").
- State which convergent defaults are present and whether the product earns them.
- Do not rewrite the design unless asked. Say what to keep.

## Read this when

| Trigger | Read |
|---|---|
| Gate 2 (always) | `references/anti-slop.md`, then `references/world-index.md` |
| Opening a chosen world (Gate 3) | its single file under `references/worlds/`, named in the index |
| Dashboard, admin tool, table, editor, any dense screen | `references/dense-ui.md` |
| Choosing fonts, setting a type scale | `references/typography.md` |
| Choosing or checking colour, building dark mode | `references/color.md` |
| Anything moves, scrolls, loads or transitions | `references/motion.md` |
| Forms, focus, contrast, keyboard, screen readers | `references/accessibility.md` |
| Something fails verification or renders wrong | `references/fixes.md` |
| One of the twelve situations in the Gate 4 table | that pattern file |
| The brief is thin | `references/briefs.md` |
| Structure for a known site type (SaaS, shop, docs, portfolio, dashboard) | `references/site-types.md` |
| Writing an artifact | the matching file in `templates/` |
| Any project with source files (second pair of eyes), no browser, or seeding a critique | `scripts/audit-ui.mjs` |
| Checking a colour pair | `scripts/contrast.mjs` |

Load only what the trigger names. A typical task needs this file, the anti-slop list, the world index, two worlds, one or two references and the templates.

## Always-on rules

- Real content, real states. Never ship placeholder text as if finished, and never print placeholder notices on the page.
- Never copy another site's code, copy or assets. Learn the technique and rebuild it.
- Motion explains a state change or guides attention. Nothing loops for decoration.
- Draw icons (inline SVG or one icon set). No emoji as icons.
- Work inside the project directory. Do not install packages or fetch anything from the network unless the user asks.
- Do not claim what you did not render. Say what you could not check.
