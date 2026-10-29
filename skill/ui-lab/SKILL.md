---
name: ui-lab
description: Use when the user asks to "build a landing page", "design a dashboard", "redesign this UI", "make it look less generic" or "critique this design". Runs a gated procedure in three modes (Build, Redesign, Critique) - brief, house-style check, direction, rendered verification, handoff - so the result avoids the defaults an AI agent drifts to, passes mechanical accessibility and layout checks, and is rendered before it is called done. Includes guidance for dense dashboards and apps. Not for backend, data or scripting tasks.
---

# UI Lab

Capable agents already make pages that look fine. The failure is that they all look the same, and nobody rendered them. This skill adds three things: a gate that forces a choice against your own default, a verification gate you cannot skip, and a mode for existing UI. Each gate leaves a short file in `design/` in the project (or a labelled block in your reply for a small task). Say so if you skip a gate on purpose.

If the task is not visual or interaction design (API, SQL, shell, data), this skill does not apply. Load nothing.

## Pick a mode

| The user wants | Mode | Start at |
|---|---|---|
| A new page, screen or component | Build | Gate 1 |
| An existing UI changed or improved | Redesign | Gate R |
| An opinion on a UI, or "what is wrong with this" | Critique | Gate C |

Dashboards, admin tools, tables, editors, anything dense: also read `references/dense-ui.md` before Gate 2.

## Gate 1. Brief (Build)

Fill `templates/brief.md` into `design/brief.md`. Every line needs something real: audience and where they are, the job of the page, three mood words, the one memorable moment, real content, constraints, and what it must not feel like. If a line cannot be filled from the request, ask the user one sharp question. Do not invent a product. Real copy and real-looking data from the start: no lorem ipsum, no "Feature One", no round-number metrics that look made up.

## Gate 2. House-style check (mandatory, before any code)

Your first idea is the average of what you have seen. Name it, then leave it unless the brief earns it.

1. **Write the default.** In `design/direction.md`, one line per axis for the page you would produce if you did not think: **ground** (background and surface), **type voice** (display and text faces), **layout grammar** (how the first screen and the sections are composed), **accent strategy** (how colour is used), **motion**.
2. **Check it against `references/anti-slop.md`.** It lists the 2023 defaults and the current convergent ones (the "tasteful" house style that most agents now produce). Mark every match.
3. **Diverge, then pick.** Write two candidate directions that differ from the default and from each other (a different ground, type voice and accent logic, not two shades of one idea). Choose one and say why in a line. The winner must differ from the default on at least three of the five axes, and each change must come from the brief, the audience or the product, not from contrarianism. `references/anti-slop.md` has an alternatives menu per axis and a list of the defaults that this very procedure tends to produce (section D): if your choice is on that list, you have only swapped one default for another.
4. **Or defend the default.** For each axis you keep, write one line of evidence from the brief that earns it. "It looks good" is not evidence.
5. **Different is not enough: it must be stronger.** Name the single boldest visual element on the first screen (an object, a colour field, a type treatment, a piece of product), and the places where the page changes rhythm (ground, density or scale, at least twice). Austere and uniform loses to committed and varied, so restraint is a choice you spend on purpose, not the default.
6. **Swap test.** Replace the brand name and content with a competitor's. If nothing about the design has to change, it is generic: redo steps 3 to 5.

Gate output: the table of default, matches, chosen, and reason, per axis.

## Gate 3. Direction card

Fill `templates/direction-card.md` into `design/direction.md` (below the Gate 2 table). It must include a CSS custom-property block: palette by role (surface, surface-raised, ink, ink-muted, accent, accent-ink, success, warning, danger), type scale, spacing scale, radius, motion durations and easing. Pick fonts that suit the direction and load them (self-hosted or a font service); never leave the display voice on the system default. Read `references/worlds.md` for worked directions to learn from, not to copy. {{pro}}For a narrow subject (a ticket, a receipt, a specimen, a board) also read `references/niche-worlds.md`.{{/pro}}

Write three refusals: things this design will not do.

## Gate 4. Vertical slice, then build

Put the tokens in `:root` first. Build the signature moment end to end with real content and real states (hover, focus, empty, error), then build outward. Semantic HTML first, then style. Small screens are designed, not squashed: decide at 375 what moves, what collapses and what disappears.

Dense UI rules (details in `references/dense-ui.md`):
- Lead with what needs action, not with a summary of everything.
- Numbers right-aligned in tabular figures; one row height; a sticky header on long tables.
- At 375 a wide table becomes a stacked list or a column-priority table, never a clipped one.
- Status is text plus colour, never colour alone. Charts get direct labels and one accent.
- Controls show their current state. Filters and sorts are visible and reversible.

## Gate 5. Rendered verification (mandatory)

Code that was never rendered is a guess. Do not write "works" or "responsive" in the handoff unless you rendered it.

**Path A: you can render.** Use a browser tool, or headless Chrome or Edge with a screenshot flag (set the window to 1440x900 and 375x812, and a tall height for full-page shots). Then open the screenshots and look at them.

**Path B: you cannot render.** Run `node scripts/audit-ui.mjs <project-dir>` for a static audit, fix what it reports, and write NOT RENDERED in the handoff with the list of checks you could not do.

Do one batched round, fix everything it found in one batch, then one confirming round, then stop. Record the result in `design/verify.md` from `templates/verify-log.md`.

Mechanical checklist, all pass/fail:
1. Fresh load: console has zero errors and warnings you caused.
2. No horizontal scroll at 375 (the page is not wider than the viewport).
3. Every interactive element at least 44x44 px at 375 (inline text links excepted).
4. Exactly one `h1`; landmarks `header`, `nav`, `main`, `footer` present where the page has those parts; images have `alt`; form controls have labels.
5. Visible focus on every control (tab through the page); no keyboard trap.
6. `prefers-reduced-motion: reduce` is handled: nothing loops or moves for decoration.
7. Text contrast at least 4.5:1 (3:1 for large text){{pro}}; check pairs with `node scripts/contrast.mjs <fg> <bg>`{{/pro}}.
8. No collisions or clipping: stamps over text, sticky headers over headings, labels cut off, tables cut off at 375, text under illustrations.
9. Every control does something: no dead buttons, no dead anchors.
10. Look at each screenshot as a reviewer would. Hierarchy clear in three seconds? Then squint (or view the full page small): do the sections differ in ground, density or scale, and is there one place with real visual weight? A page that is correct but uniform and flat is not done.

If something renders wrong, check the bug catalogue in `references/verify.md` before debugging from scratch.

## Gate 6. Handoff

Fill `templates/handoff.md` into `design/handoff.md`: what was built and how to open it, what you rendered at which sizes, what you could not test, placeholders, known defects left, next steps. Short and honest.

## Gate R. Redesign (existing UI)

Preserve first. Skin, do not rewire.

1. **Inventory before touching anything.** Render every distinct screen at 1440 and 375 and keep the screenshots. List what must survive: routes, copy that is functionally or legally fixed, data shapes, component APIs, handlers, tests, the order of sections if the user kept it. Write it in `design/preserve.md`.
2. **Critique the current state** with `templates/critique-report.md` (Gate C). This is your before.
3. Run Gate 2 against what exists: what is the current default, and which axes will you change? A redesign that changes only colours is a recolour; say so or change more.
4. Change tokens, type, layout and markup. Do not change behaviour, data or routes unless the user agrees. When you must (a broken pattern), list the change in the handoff.
5. Rebuild at the same entry point so the user can compare. Do not edit the original in place unless asked; keep it or work in a copy.
6. Gate 5 on the result, and compare before and after at both widths. Handoff lists what was preserved, what changed and what is better, by measurement.

## Gate C. Critique

Output is `templates/critique-report.md`, filled. Rules:
- Render first (Gate 5, Path A). Critique of unseen UI is opinion.
- Score each area 0, 1 or 2 with the evidence you saw: a quoted element, a measured number, a screenshot region.
- List the top three defects by cost to a real user or reviewer, not by ease.
- Every defect gets a concrete fix as a before and after diff of CSS or markup (a value or a rule, never "improve contrast").
- State which convergent defaults are present and whether the product earns them.
- Do not rewrite the design unless asked. Say what to keep.

## Read this when

| Trigger | Read |
|---|---|
| Gate 2 (always) | `references/anti-slop.md` |
| The product is a dashboard, admin tool, table, editor, any dense screen | `references/dense-ui.md` |
| Choosing a direction, learning how a committed one is specified | `references/worlds.md` |
| The subject suits a narrow, object-like direction (ticket, receipt, specimen, board) | `references/niche-worlds.md` | {{pro-line}}
| Verification, or something renders wrong | `references/verify.md` |
| Forms, focus, contrast, motion preferences, keyboard | `references/accessibility.md` |
| The brief is thin | `references/briefs.md` | {{pro-line}}
| Choosing structure for a known site type (SaaS, shop, docs, portfolio) | `references/site-types.md` | {{pro-line}}
| Looking for a component or section idea | `references/patterns-index.md` | {{pro-line}}
| A design term is unclear | `references/glossary.md` | {{pro-line}}
| Writing an artifact | the matching file in `templates/` |
| No browser available, or a quick lint of a project | `scripts/audit-ui.mjs` | {{pro-line}}
| Checking a colour pair | `scripts/contrast.mjs` | {{pro-line}}

Load only what the trigger names. A typical task needs this file, the anti-slop list, one reference and the templates.

## Always-on rules

- Real content, real states. Never ship placeholder text as if finished.
- Never copy another site's code, copy or assets. Learn the technique and rebuild it.
- Motion explains a state change or guides attention. Nothing loops for decoration.
- Draw icons (inline SVG or one icon set). No emoji as icons.
- Work inside the project directory. Do not install packages or fetch anything from the network unless the user asks.
- Do not claim what you did not render. Say what you could not check.
