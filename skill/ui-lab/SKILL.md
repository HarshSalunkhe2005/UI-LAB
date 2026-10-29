---
name: ui-lab
description: Use when the user asks to "build a landing page", "design a dashboard", "redesign this UI", "make it look less generic" or "critique this design". Runs a gated design procedure (brief, direction card, vertical slice, rendered verification, handoff) in three modes - Build, Redesign, Critique - and checks the result against known AI-default patterns, accessibility rules and a catalogue of solved frontend bugs. Not for backend-only, data or scripting tasks.
---

# UI Lab

A design procedure with gates. Each gate produces a short written artifact. Do not move past a gate without it, and say so in the reply if you skip one on purpose.

## 0. Pick a mode

| The user wants | Mode | Entry point |
|---|---|---|
| A new page, screen or component | **Build** | Gate 1 |
| An existing UI made better, without breaking it | **Redesign** | Gate R1 (then Gate 2 onward) |
| An opinion on a UI they already have | **Critique** | Gate C1 |

If the request is not about visual or interaction design (APIs, SQL, shell scripts, data work), stop. This skill does not apply and none of its files should be loaded.

## 1. Brief (Build)

Fill `templates/brief.md`: audience and context, the job the page must do, mood in three words, the one memorable moment, real content (never lorem ipsum), constraints (stack, devices, deadline). If you cannot fill a line from the request, ask the user one sharp question. Never guess a whole product.

Artifact: the filled brief, kept in your working notes or a `BRIEF.md` in the project.

## R1. Audit before touching (Redesign)

1. Run the app and screenshot every distinct screen at 1440 and 375.
2. List what must be preserved: routes, copy that is legally or functionally fixed, data flow, component APIs, anything with tests.
3. Fill `templates/critique-report.md` for the current state (Gate C1 below).
4. Rule: skin, do not rewire. Change tokens, type, layout and markup; do not change handlers, state, data shapes or routes unless the user agrees.

Artifact: the preserve list and the current-state critique. Then continue at Gate 2.

## 2. Direction card

Read `references/worlds.md` and choose one world, or invent a narrower one. {{pro}}For narrow subjects, also read `references/niche-worlds.md`.{{/pro}}
Fill `templates/direction-card.md`: name, metaphor, palette by role, type pair with roles, spacing scale, motion language, signature moment, and three refusals.

Then run two tests and write the result in the card:
- **Swap test.** Replace the brand with a competitor's. If nothing about the design would need to change, it is generic. Redo the card.
- **House-style test.** Read `references/anti-slop.md`. If the card matches a convergent default (including this year's fashionable ones) and the brief does not earn it, change it.

Artifact: the direction card.

## 3. Vertical slice

Build the signature moment end to end first (real content, real states), then build outward. Set tokens as CSS custom properties before any component. Fonts: pick a chosen pair with a free source; never leave the display voice on the system default.

Artifact: a running slice you have rendered once.

## 4. Verify, bounded

Read `references/verify.md` (render loop and bug catalogue) and `references/accessibility.md`. One batched round:

1. Fresh load. Console must be clean.
2. Every section, at 1440 and 375 wide. Screenshot each.
3. `prefers-reduced-motion: reduce` on. Keyboard-only pass. Visible focus on every control.
4. Check for overlap and clipping (stamps, badges, sticky headers, long words, tables at 375).
5. Contrast of every text/background pair{{pro}}: `node scripts/contrast.mjs <fg> <bg>`{{/pro}}.

Fix everything the round found in one batch, then one confirming round, then stop. If you cannot render (no browser tool), say so and list what you could not check; do not claim it works.

Artifact: a pass/fail line per check above.

## 5. Handoff

Fill `templates/handoff.md`: what was built, what was rendered at which sizes, what could not be tested, what is placeholder, next steps. Be honest about the gaps.

## C1. Critique mode

Fill `templates/critique-report.md`: score each of hierarchy, type, colour, spacing, motion, accessibility, responsiveness, content, distinctiveness from 0 to 2 with the evidence you saw, list the top three defects in order of cost, and give a concrete fix for each (a value or a rule, not "improve contrast"). Do not rewrite the design unless asked.

## Read this when

| Trigger | Read |
|---|---|
| Choosing or inventing a direction (Gate 2) | `references/worlds.md` |
| The subject suits a narrow, object-like direction (ticket, receipt, specimen, board) | `references/niche-worlds.md`  | {{pro-line}}
| Anything looks familiar, safe or "AI-ish" | `references/anti-slop.md` |
| Starting verification, or something renders wrong | `references/verify.md` |
| Forms, focus, contrast, motion preferences, keyboard | `references/accessibility.md` |
| The brief is thin and you need to shape it | `references/briefs.md`  | {{pro-line}}
| Choosing structure for a known site type (SaaS, shop, docs, portfolio) | `references/site-types.md`  | {{pro-line}}
| Looking for a ready component or section to adapt | `references/patterns-index.md`  | {{pro-line}}
| Unsure what a design term means | `references/glossary.md`  | {{pro-line}}
| Writing any artifact | the matching file in `templates/` |
| Checking a colour pair | `scripts/contrast.mjs`  | {{pro-line}}

Load only what the trigger names. A typical task needs SKILL.md, one world, the anti-slop list and the verify file.

## Always-on rules

- Real content. No lorem ipsum, no "Feature One", no invented round-number metrics presented as fact.
- Text contrast 4.5:1 (3:1 for large text). Touch targets at least 44px. No horizontal scroll at 375px.
- Honour `prefers-reduced-motion`. Motion explains a state change or guides attention; nothing loops for decoration.
- Semantic landmarks, one `h1`, labelled controls, visible focus.
- Draw icons (inline SVG or one icon set). No emoji as icons.
- Never copy another site's code, text or assets. Learn the technique and rebuild it.
- Work inside the project directory. Do not install packages or fetch from the network unless the user asks.
