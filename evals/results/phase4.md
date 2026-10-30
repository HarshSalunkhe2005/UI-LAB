# Phase 4: scripts (the proof machinery) and the token budget

Date: 2026-10-30.

## 1. Token budget (carried over from the Phase 3 review)

Changes: the two world files became one file per world (`references/worlds/NN-name.md`, 24 files averaging about 360 tokens). Gate 2 reads only `references/world-index.md` (families, one-liners, fits and never-for, plus the token vocabulary and the file path of each world); Gate 3 opens only the two candidate worlds. `patterns/INDEX.md` was cut to one line per pattern (3.7k tokens down to 1.5k). Gate 4 now says "before writing any section or component, check `patterns/INDEX.md` for a match and adapt it, and note in `design/direction.md` which patterns you adapted".

Measured by `node tools/skill-budget.mjs` (bytes / 4, from the built pro package):

| Scenario | Tokens |
|---|---|
| Typical Build (SKILL.md, anti-slop, world index, two worlds, four templates, verify, patterns index, two patterns) | **13,220** (was 20k to 25k) |
| Dashboard or dense UI (typical plus dense-ui) | 14,587 |
| Build with type, colour and motion detail (typical plus typography, color, motion) | 16,913 |
| Critique or Redesign | 11,347 |

The target of 18k for a typical task is met with 4.8k to spare; `npm run skill` now fails if the typical Build exceeds it.

## 2. `scripts/audit-ui.mjs`

514 lines, Node built-ins only, read-only, no network, no `child_process`. The validator's own scan passes it; that scan caught one `RegExp.exec` call that I had to restructure. Input: a file or folders of HTML, CSS, JSX, TSX, Vue and Svelte. Output: critical, warning and suggestion groups with `file:line`, the anti-slop id, a one-line fix and a "heuristic" tag where the check is pattern-matching. Flags: `--json`, `--fragment` (skip page-level rules), `--no-heuristics`, `--rules`. Exit 1 on any critical, 2 on usage error. It has a small HTML tree parser and a CSS parser (rules, at-rules, keyframes), resolves `var()` tokens, and reuses `contrast.mjs` (now importable).

36 rules. Every anti-slop row that was marked "planned" is implemented and the markers are flipped to `audit: <rule>`:

| Group | Rules |
|---|---|
| Accessibility and basics (critical) | `zoom-blocked`, `viewport-meta`, `html-lang`, `img-alt`, `input-label`, `no-focus-style`, `contrast-fail` (declared pair under 3:1, including token role pairs) |
| Accessibility (warning) | `contrast-low`, `h1-count`, `no-main`, `icon-button-name`*, `outline-none`, `no-reduced-motion`, `infinite-animation`*, `small-target`* (declared height, or estimated from padding), `tiny-text` |
| Design defaults (A and B in anti-slop) | `purple-gradient`* A1, `gradient-text` A2, `emoji-icon` A3, `identical-cards`* A4, `glow-hover-lift`* A5, `trusted-by`* A7, `backdrop-filter`* A8, `repeated-reveal`* A9, `nested-containers`* A12, `generic-copy` A13, `lorem-ipsum` A14, `italic-serif-accent`* B1, `mono-eyebrow`* B2, `rotated-stamp`* B3, `marquee`* B4, `numbered-label`* B5, `system-fonts-only`* C6, `inter-only`* A10 |
| Other | `no-nav`, `vh-100` |

\* regex or structure level, labelled heuristic in the output.

Not detectable statically (left `manual` or render-only in the catalogue): table clipping at 375, colour as the only signal, collisions and overlap, contrast over images or overlays, whether a grid is a bento grid, centred-everything layouts. The audit says so at the foot of every report.

## 3. Tests (`tools/tests/audit-ui.test.mjs`, 58 checks; part of `npm run skill:test`)

- A clean page yields zero findings. Each of the 36 rules fires on a minimal snippet with the problem, and a test asserts every rule has a positive test, a severity, a fix and a valid anti-slop id.
- Negatives that must not fire: `<em>` set to `font-style: normal`, a desktop-only 32px button with a 44px mobile override, wrapped or `aria-label` labels, `em` font sizes, star and hamburger glyphs.
- JSX: missing alt, lorem ipsum, and Tailwind gradient-text and purple-gradient utilities.
- Real pages, surfacing the known issues:
  - Orbit fixture: 1 critical, 13 warnings, 8 suggestions. The 12 expected rules all fire (no focus style, no reduced motion, no `main`, purple gradient x4, gradient text x2, low contrast, emoji icons x4, generic copy, Inter only, hover lift, "trusted by", identical icon cards).
  - Baseline 01: `italic-serif-accent` B1, `mono-eyebrow` B2, `rotated-stamp` B3, `marquee` B4, `numbered-label` B5, `glow-hover-lift`, `small-target`, plus `identical-cards`.
  - Baseline 02: `h1-count`, `system-fonts-only`, `tiny-text` x4, `small-target` x2, `contrast-low` x4. The plan expected "no h1 or main" on 02; 02 does have a `main`, only the `h1` is missing, and the audit reports exactly that.
  - Baseline 04: `italic-serif-accent`, `marquee`, `backdrop-filter`, `tiny-text`.
- Cleanness: the 32 patterns (with `--fragment`) and the five skill-built pages in `evals/runs`.
- CLI exit codes, `--json`, `--rules`, `--no-heuristics`; and in `test-skill-install.mjs` the shipped script runs from a temp HOME under Node's permission model with read access to the skill folder and one project folder only.

## 4. False-positive numbers (measured)

On the 32 patterns plus the 5 skill-built pages (37 files, all audited after tuning): **8 findings in total, 0 critical**.

| Finding | Verdict |
|---|---|
| `vh-100` in `count-up-tabular`, `sidebar-app-shell` and the round-1 dashboard (3) | true |
| `tiny-text` 11px chart axis labels in the redesign page | true |
| `repeated-reveal` (13 elements) in the redesign page | true |
| `system-fonts-only` across the pattern folder | true by design (patterns use neutral system fonts on purpose; the folder is audited as one project) |
| `small-target` for `aside a` in `toc-scrollspy` (about 33px estimated from padding) | false positive at 375: the sidebar is hidden below 820px (a desktop-only element) |
| `small-target` for `.sail th button` at 36px in the round-1 dashboard | disputable: true at desktop, not present at 375 (the runtime gate passed there) |

So 6 of 8 are true and 2 heuristic `small-target` findings are wrong or disputable. **2 of 37 files (5%) carry a debatable finding, and 0 of 37 carry a critical false alarm.** No static finding contradicts a runtime gate pass except those two.

False positives found during tuning and fixed (each is now a negative test):
- The purple-gradient detector missed the fixture's #667eea (hue 229) gradient until the range was widened, with a guard that needs one true purple stop.
- `nested-containers` flagged a button inside a card.
- `small-target` matched an svg inside a `summary`; it is now judged on the last compound selector.
- `em`-based `font-size` was read as `px`.
- A token named `--accent-text` (the accent used as text colour) was read as text-on-accent and produced a bogus 1.09:1 failure.
- `italic-serif-accent` fired where `em` was reset to `font-style: normal`, and pooled serif faces across unrelated pages.
- Star and hamburger glyphs counted as emoji.
- Pseudo-element glyphs counted as tiny text.
- `no-nav` fired on single-screen apps with few links.

Not measured: false negatives on pages outside this set. The recall figures above are on pages whose issues I already knew, so they are an upper bound.

## 5. SKILL.md changes

- Gate 5 Path A: run `scripts/audit-ui.mjs` as a second pair of eyes (what it catches that a screenshot hides; fix every critical and warning; confirm heuristics in the render).
- Gate 5 Path B: run it, fix criticals and warnings, and state in the handoff that it is a static lint that cannot see layout, collisions, images, overlays or the 375 px view; a clean audit is not a pass of the checklist.
- Gate R step 2 and Gate C: run it on the source first to seed the critique, quoting `file:line` and the anti-slop id as evidence, and do not copy heuristic findings in unchecked.
- The read-this-when row for the script is updated. These additions sit in `{{pro}}` spans because `scripts/` is pro-only; lite keeps the checklist without the script. SKILL.md is 135 lines.

## 6. Not done and caveats

- The audit is pro-only. If you want it in lite (it is the strongest proof artefact), that is one line in `LITE_EXCLUDE` plus removing the `{{pro}}` markers around it.
- It lints source files, not a running app: server-rendered or CSS-in-JS styling is mostly invisible to it, and for JSX it applies line-level rules only.
- `small-target` estimates height from padding when no height is declared. That is the weakest heuristic here and the one most likely to be wrong.
- Phase 5 should measure whether agents act on audit findings, and whether they over-trust the heuristic ones.
