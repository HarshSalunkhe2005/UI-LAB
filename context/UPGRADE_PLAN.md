# UI Lab upgrade plan: from 5/10 to 15/15

Owner: Harsh. Started 30 Oct 2026. Planner/reviewer and builder work in separate sessions; the builder works phase by phase and stops for review after each one.

## 1. Where we are (honest audit)

What's strong:
- Real substance: 24 design worlds, 68 site teardowns, 54 signature moves, 21 finished reference sites, a verify loop and a bug catalogue. The judgement layer is better than anything on Agensi.
- The live site and the plugin packaging already exist.

Why it's a 5/10 as a *skill*:
1. **Not portable.** SKILL.md points at `C:\Users\Harsh\Projects\UI-Lab` and fetches from the live site. On someone else's machine half of it is dead links, and Agensi's security scan flags runtime network fetches ("skills should be self-contained").
2. **A directory, not a workflow.** The 63-line SKILL.md is mostly a table of where files are. It has no gates, no output contracts and no definition of done, so the agent skims it and falls back to defaults.
3. **Too big to load, too thin to follow.** It has 130+ patterns and 24 worlds, but no progressive disclosure: no tell-the-agent-exactly-which-file-to-read-when.
4. **No proof.** Nothing shows it beats a plain agent. No evals, no before/after.
5. **Loose ends.** The Hearth site is unregistered, the descriptions say both "130+" and "250+" patterns, and the license is UNLICENSED while the repo is public.

## 2. Competitive landscape (Agensi, 30 Oct 2026)

- Frontend & Web Apps has 512 skills. The top seller is "LLM becomes an Award Winning App & Site Designer" ($9.99, 86 uses, 4.8★). Its pitch is research the category first, then design, which is UI Lab's playbook with less depth.
- Others: Design Taste Critic, design-md-generator ($5, DESIGN.md + tokens), DesignOS Pro, Framesmith UI Director, Senior Designer Brain, UI Design Expert. Most are a single SKILL.md of opinions with no scripts, no tested examples and no evals.
- **Our edge to make visible:** real teardowns, worlds with exact tokens, runnable verification scripts, a bug catalogue, and measured before/after evals. Nobody else ships proof.

## 3. What Agensi needs (the listing spec)

- A zip with ONE top-level folder `ui-lab/` and `SKILL.md` at its root. No double nesting, no symlinks, no binaries, no `.DS_Store`/`Thumbs.db`.
- SKILL.md frontmatter: `name` (slug) + `description` that is trigger-based ("Use when the user asks to…", 3–5 trigger phrases). Valid YAML.
- Body: specific, actionable steps plus a defined output format. It must be self-contained, so it works with no external docs.
- Supporting files raise the price 2–3x: `references/`, `scripts/` (readable, commented, project-dir only, no installs, no network), `examples/` (input → expected output), and a README.md.
- The 8-point scan checks: prompt injection, exfiltration, dangerous commands, secrets, obfuscation (no minified or base64 code), network access, zip structure, SKILL.md validity. Then an AI review, then a human review (24–48 h).
- Must work in at least 2 agents (Claude Code + one other).
- Listing page: title, short pitch, price (one-time or subscription), tags, screenshots, an "example session". Guidance: $3–9 for a single skill, $12–25 for a comprehensive multi-file skill. The creator keeps 70%.
- Pricing/strategy decision for Harsh, NOT the builder: free "lite" + paid "pro", or one paid skill. The build should produce both variants from the same source so the decision stays open.

## 4. The 15/15 rubric (how we score it)

Each line is 1 point. "Proud" means all 15 are verifiably true.

**Portability and packaging**
1. The skill works from a clean machine with no repo checkout and no network (tested by installing the zip into a fresh `~/.claude/skills`).
2. A build script generates the zip from repo sources, with no hand-copied files; `npm run skill` builds and validates it.
3. It passes a local replica of all 8 Agensi scan checks (our own `validate-skill` script).

**Agent behaviour**
4. SKILL.md is a gated workflow (brief → research → direction card → slice → verify → handoff). Each gate has a required artifact, and the agent cannot skip one silently.
5. Progressive disclosure: SKILL.md is ≤ 250 lines, every reference is loaded on a named trigger, and a typical task loads ≤ 25k tokens of skill content.
6. Defined output contracts: direction card, critique report and handoff report each have a template in `templates/`.
7. Three modes: **Build** (new UI), **Redesign** (existing app, preserve-first, skin not rewire), **Critique** (scored audit of any UI with concrete fixes). The competitors each do only one.

**Taste and content**
8. Every world has exact tokens (CSS custom properties: palette roles, type scale, spacing, radius, motion durations/easings), a font pair with a free source, and three refusals.
9. An anti-slop catalogue: 30+ named AI-default patterns, each with "why it reads as AI" and "do instead", and with the machine-checkable ones checked by script.
10. Pattern library distilled for agents: the 40 most useful patterns as self-contained code (React+Tailwind and plain HTML/CSS), each with when-to-use and accessibility notes.

**Verification**
11. `scripts/audit-ui.mjs` (Node, zero dependencies): it scans a project's HTML/CSS/JSX for slop patterns, contrast failures in declared tokens, missing focus styles, system-font display type, no reduced-motion handling, and touch targets under 44px. It outputs a severity-grouped report.
12. A verify playbook with the bug catalogue, written so an agent with or without a browser tool can follow it.

**Proof**
13. An eval suite: 8 briefs plus 3 negative prompts in `evals/`. The baseline is a plain agent vs. the skill, with screenshots, scored blind against the rubric in `evals/RUBRIC.md`. The skill wins at least 7 of 8.
14. Three worked examples in `examples/`: brief → direction card → final code excerpt → audit report.

**Presentation**
15. The README, the live site's "Get the skill" page and the listing kit (title, pitch, tags, example session, screenshots, before/after) are ready to submit, with nothing placeholder.

## 5. Phases (the builder stops after each for review)

**Phase 0: Baseline and evals (do first; it tells us what actually matters)**
- Write `evals/briefs.md`: 8 briefs:
  - SaaS landing
  - analytics dashboard
  - developer portfolio
  - restaurant site
  - docs page
  - e-commerce product page
  - mobile app screen (web)
  - redesign of a deliberately generic page (provided in `evals/fixtures/`)
- Write 3 negative prompts (backend API, SQL query, bash script).
- Write `evals/RUBRIC.md`: 10 criteria scored 0–2, covering distinctiveness, hierarchy, type, colour, spacing rhythm, motion restraint, accessibility, responsiveness, content realism and bug-free.
- Run 3 briefs as a baseline with a plain agent (a subagent with no skill), build them as static HTML, and screenshot at 1440 and 375. Save the scores to `evals/results/baseline-*.md`.
- Deliverable: the eval harness plus baseline scores. No skill changes yet.

**Phase 1: Portable package skeleton**
- New folder `skill/ui-lab/`, the source of truth for the distributable:
  - `SKILL.md`
  - `README.md`
  - `references/`
  - `templates/`
  - `scripts/`
  - `examples/`
- `tools/build-skill.mjs`: copies/generates from `playbook/`, `src/meta.ts`, `src/references.ts` and the pattern sources into `skill/ui-lab/`, then zips to `release/ui-lab.zip` (plus a `release/ui-lab-lite.zip` variant). Excludes OS junk and verifies the structure.
- `tools/validate-skill.mjs`: the local replica of the 8 scan checks (frontmatter YAML, size, no URLs fetched at runtime, no secrets regex, no base64/minified blobs, no binaries, structure, no prompt-injection phrasing).
- `npm run skill` = build + validate.
- Deliverable: a zip that installs and triggers in a clean `~/.claude/skills` (test by copying to a temp HOME). The content can still be rough.

**Phase 2: The SKILL.md rewrite (the brain)**
- Gated workflow with three modes (Build / Redesign / Critique), and a "read this file when…" table in place of the location table.
- Templates: `brief.md`, `direction-card.md`, `critique-report.md`, `handoff.md`.
- Keep the voice tight; ≤ 250 lines.
- Deliverable: run 3 eval briefs with the new skill and compare to the baseline.

**Phase 3: References and patterns (the taste)**
- `references/worlds.md` + `niche-worlds.md` with exact token blocks.
- `references/anti-slop.md` (30+ entries).
- `references/typography.md` (15 vetted free font pairings with roles).
- `references/color.md` (palette-role method + contrast rules).
- `references/motion.md`, `references/accessibility.md`.
- `references/teardowns.md` (condensed 68 sites → technique index).
- `references/bugs.md` (from verify.md).
- `patterns/`: the top 40, self-contained, with React+Tailwind and HTML/CSS versions.

**Phase 4: Scripts (the proof machinery)**
- `scripts/audit-ui.mjs` (rubric item 11) and `scripts/contrast.mjs` (token pair checker).
- Zero dependencies, readable, commented, project-dir only, no network.
- Test them against the eval fixtures; the generic fixture must light up.

**Phase 5: Eval loop to 7/8**
- Run all 8 briefs, baseline vs. skill, blind-score, fix the weakest gates, re-run. Repeat until 7/8 wins and no negative prompt triggers.
- Write the three `examples/` from the best runs.

**Phase 6: Repo and site polish**
- README rewrite.
- A "Get the skill" page on the live site with before/after.
- Fix the Hearth loose end (register it or remove it).
- Make the pattern counts consistent everywhere.
- A11y + console-clean pass on the site.
- License: propose an option to Harsh, don't decide it.

**Phase 7: Listing kit (for Harsh to submit himself)**
- `release/LISTING.md`: title, one-line pitch, long description, tags, a suggested price with reasoning, an example session transcript, a screenshot list (taken from the eval runs), and a lite-vs-pro split proposal.
- The builder never creates an Agensi account or listing, and never submits.

## 5b. Amendments after Phase 0 (30 Oct)

The baseline scored 17/17/11 out of 20, so a plain modern agent is already decent at easy briefs. Its output also converges on one house style: cream ground, a heavy serif with one italic accent word, a red stamp/badge, a mono eyebrow. That's the new "AI look". So:
- **Win condition changes** to a blind pairwise preference. A fresh scorer subagent sees only screenshot pairs labelled A/B in random order, and the skill must be preferred on ≥ 7 of 8. Mechanical gates (console clean, no overflow, targets ≥ 44px, landmarks + h1, reduced motion, focus styles, no visual collisions) are pass/fail per run, and the skill must pass all of them. The /20 rubric stays as a diagnostic only.
- **Both arms run in the same environment.** For the skill arm, only the skill changes. Note any hooks that were active.
- **Anti-slop must include convergent defaults**, not just 2023 slop (purple gradients, emoji tiles). That means the 2026 editorial default above, the default dark dashboard and the bento grid. Rubric criterion 1 penalises the house style unless the brief earns it.
- **The skill's value is concentrated in four places:** rendered verification (defects nobody checked), hard briefs (dashboards, dense apps, redesigns), Critique/Redesign modes, and escaping the house style. Phases 2–5 prioritise these over adding more taste prose.
- **Two scales:** the eval rubric (/20 per run) and the project rubric (/15 overall).

## 5c. Status checkpoint (1 Nov 2026), paused here

Commits (all by HarshSalunkhe2005):
- `6b10226` P0 evals
- `4addd70` P1 package
- `216e70a` P2 SKILL.md
- `49a0c72` + `7a02fdb` P3 content
- `d33aeba` + `51a0953` P4 audit
- `659294b` P5 eval
- `bc62955` + `5f978a5` P5b enforcement

Results are in `evals/results/phase*.md`.

What exists now:
- **Package:** `skill/ui-lab/`, built by `npm run skill` into `release/ui-lab.zip` and `-lite.zip`. Both pass a 9-check replica of Agensi's scan. `npm run skill:test` runs the clean install plus tests.
- **SKILL.md:** about 140 lines, gated. Three modes (Build / Redesign / Critique), a house-style gate, a world-family + random roll, and an inline table of 12 patterns.
- **References:** 24 per-world token files plus `world-index`, anti-slop (40 entries, A–D), `dense-ui` and `fixes.md`.
- **Scripts:**
  - `audit-ui.mjs`: 36 static rules.
  - `verify.mjs`: one command that renders at 1440 and a true 375, checks 7 gates, writes `design/verify.md`, and exits non-zero on failure.
  - `contrast.mjs`
- **Token load:** a typical task loads about 14.6k tokens. CI caps it at 18k.

Scoreboard (blind, Opus + Sonnet judges):
- **P5:** 6 wins, 2 ties, 0 losses out of 8. Short of the 7/8 bar.
- **P5b re-eval:**
  - 01 SaaS: L, L, T. Fails the bar.
  - 07 mobile: L, W, T. Passes.
  - 06 control: W.
  - Gates: 7/7 on every run. Every agent runs `verify.mjs`.
- **Remaining weaknesses:**
  - Agents don't open most render slices, and the judged defects are in those slices.
  - Brief 01's three runs converge (off-white + near-black).
  - Plain Sonnet's editorial landing pages are strong.

**NEXT = Phase 5c.** The builder hit its usage limit before making any changes:
- (a) More `verify.mjs` gates: pathological wrap at 375, table cells under 60px or overflowing, text/image overlap, stranded partial bands, a highlight broken mid-phrase.
- (b) A contact sheet: one tiled image per width (`design/verify/sheet-375.png`, `sheet-1440.png`). The handoff must name one thing seen in each.
- (c) Ground roll after the world pick: {light neutral, dark, saturated, tinted mid}, limited per world.
- **Re-eval:** 01 ×3, 07 ×3, 06 ×1, with 2 judges each, plus diversity on 01. Bar: 01 and 07 each at least 2/3 non-losses, with all gates passing.

**5c progress (builder, 1 Nov 2026):** (a) three new gates + review items, (b) contact sheets, (c) ground roll are BUILT and tested; also fixed slices on smooth-scroll pages (they all showed the page top). NEXT: re-eval into `evals/runs/p5c/` (01 x3, 07 x3, 06 x1, judges, diversity), then `evals/results/phase5c.md`. If this is the latest state, the builder was cut off: check `git log` and `evals/runs/p5c/`.

After 5c, move on regardless of the score:
- **Phase 6, polish:**
  - Point the plugin at the built skill, since the old `skills/ui-lab/SKILL.md` still has local paths.
  - README.
  - A site page with before/after.
  - Hearth: register it or remove it.
  - Make the pattern counts consistent.
  - A license proposal.
- **Phase 7, listing kit:** `release/LISTING.md`. Agensi drafts go through the connector's `submit_skill` preview only, and are confirmed only by Harsh.
- **Proposed strategy:** a free Lite listing (free UI skills get 100–311 uses, paid ones top out at 88) plus Pro at about $12–15. The pitch: "beats a plain agent in blind tests". The payout is Zoneless (USDC), so check the tax side first.

Builder session: "UI LAB", Sonnet 5.5 medium. Keep it to ≤3 parallel subagents, and have it checkpoint before its usage limit hits.

## 6. Rules for the builder session

- Work only in `C:\Users\Harsh\Projects\UI-Lab`. Follow `CLAUDE.md`/`AGENTS.md` there.
- Commit at the end of each phase as `HarshSalunkhe2005 <nightfuryharsh@gmail.com>`. Plain messages with **no AI/Claude attribution anywhere** (commits, code, README, skill files). **Do not push** until Harsh says so.
- Stop and report after every phase:
  - what was done
  - what was verified, and how
  - the rubric items now true
  - open questions
- Don't start the next phase until the planner says go.
- Preserve-first: don't delete existing patterns/sites/playbook files; the distributable is generated from them.
- No new heavy dependencies. Scripts are Node built-ins only.
- If something in this plan is wrong once you're in the code, say so in the report instead of quietly deviating.
