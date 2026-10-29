# Baseline results (no skill)

Date: 2026-10-30. Rubric: `evals/RUBRIC.md` (10 criteria x 0-2, total /20).
Agent: one Sonnet 5.5 subagent per brief, told not to read any UI Lab file, not to use the `ui-lab` skill, not to fetch the live sites. Output: single-file static HTML in `evals/runs/baseline/<brief>/index.html`. Not rendered by the agent before handing back.
Screens: `evals/shoot.mjs` (headless Chrome over CDP): `shot-1440.png`, `shot-375.png` (full page), `fold-1440.png`, `fold-375.png` (first viewport), `report.json` (mechanical checks).

## Scores

| # | Criterion | 01 SaaS landing | 02 Dashboard | 04 Restaurant |
|---|---|---|---|---|
| 1 | Distinctiveness | 2 | 1 | 2 |
| 2 | Hierarchy | 2 | 2 | 2 |
| 3 | Typography | 2 | 0 | 2 |
| 4 | Colour | 2 | 1 | 2 |
| 5 | Spacing and rhythm | 2 | 1 | 2 |
| 6 | Motion restraint | 1 | 1 | 1 |
| 7 | Accessibility | 1 | 1 | 1 |
| 8 | Responsiveness | 2 | 1 | 2 |
| 9 | Content realism | 2 | 2 | 2 |
| 10 | Bug-free | 1 | 1 | 1 |
| | **Total /20** | **17** | **11** | **17** |

Reference point: the deliberately generic fixture (`evals/fixtures/generic-landing`) is not scored here; it exists for brief 08.

## Evidence

**01 Relay (17).** Editorial look: cream paper, ink, one red, Fraunces display with italic emphasis, mono labels, hard offset shadows, a rotated "sample digest" card as the hero object. Clear path (issue tag, headline, one primary button). Copy is specific ("Every. Friday.", ARR-weighted themes, 41% deltas). At 375 the hero re-stacks sensibly and the CTA goes full width. Defects: "MON 12 OCT" in the digest card header collides with the SAMPLE stamp at 1440 and 375; a looping ticker runs for decoration (reduced-motion rule exists); 17 interactive elements under 44px at 1440 (13 at 375), mostly nav and FAQ rows. Console clean, no overflow, all four landmarks, one h1.

**02 Harbor (11).** Competent ops dashboard: five KPI tiles, load-vs-capacity bars with a target tick, delay-cause donut, daily on-time line, sortable table, attention list. Data is dense and hangs together (56 sailings, 12 flagged). Weak spots: system-ui only, no type scale beyond size/weight; dark slate plus blue/amber is the default dashboard palette; no `h1`, no `header` or `footer` landmark, no reduced-motion rule, 16 small targets. At 375 the table is clipped to five columns inside its container (Status, Delay, Load hidden unless it side-scrolls), so the page's main object is largely unusable on a phone; the rest stacks cleanly. Console clean.

**04 Salt & Ember (17).** Dark charcoal and ember orange, Fraunces plus Instrument Sans, a drawn fire as hero object, an arched fish-on-a-plate panel, specific place and people (Polvane Quay, the Old Net Shed, a tip jar, closed all January), menu in tabs, today's hours highlighted, reservation form, private dining table. 375 is a proper re-layout. Defects: hero paragraph runs under the flame illustration at 1440 ("people who can" touches it); ticker loops; 8 small targets at 1440 (4 at 375); the date field is a bare native input styled dark. Console clean, all landmarks.

## Mechanical checks (report.json)

| | consoleErrors 1440/375 | hOverflow 375 | smallTargets 1440/375 | landmarks (header,nav,main,footer) | h1 | fonts (h1/h2/body) | reduced-motion rule | focus rule |
|---|---|---|---|---|---|---|---|---|
| 01 | 0 / 0 | no | 17 / 13 | all | 1 | Fraunces / Fraunces / Inter | yes | yes |
| 02 | 0 / 0 | no | 16 / 16 | main, nav only | 0 | none / system-ui / system-ui | no | yes |
| 04 | 0 / 0 | no | 8 / 4 | all | 1 | Fraunces / Fraunces / Instrument Sans | yes | yes |

## What the baseline tells us

1. **The baseline is strong on landing-page-type briefs.** 17/20 on two of three. The "plain agent" does not produce purple-gradient slop when the brief says "should not look like every other AI-tool page" or "feel like one specific place". Fraunces plus a warm palette is itself becoming the default tell, though the rubric as written rewards it.
2. **The reliably weak areas are the same on all three:** accessibility (target sizes, landmarks, reduced motion), decorative looping motion (ticker), and unrendered defects (overlap, clipped table). None were visually checked by the agent, so these are the skill's real opening: a verify gate and an audit script, not more taste.
3. **The dashboard is where taste content would matter.** System fonts, default dashboard palette, phone-unusable table: 11/20.
4. **To beat 17/20 by 3 points (the plan's win condition) is not possible** on briefs like 01 and 04: the ceiling is 20 and distinctiveness is already 2. See the report to the planner for the proposed fix.

## Caveats on this baseline

- **Not fully plain.** The subagents ran inside this environment, where a design-lint PostToolUse hook (impeccable plugin) comments on every HTML write. Agent 01 reported fixing a contrast finding because of it; agent 02 saw findings and left them. The repo's `CLAUDE.md` was also attached to their context (agent 02 said it ignored it). Neither is the `ui-lab` skill, but the baseline is somewhat better than a truly bare agent. For Phase 5, run both baseline and skill arms in the same environment, or disable the hook for both.
- **Scored by the builder, not blind.** The scorer (this session) also set up the briefs and saw the run names. A blind pass needs a separate scorer that sees only the screenshots.
- One run per brief; no variance estimate.
- Google Fonts load needs network at render time; the screenshots were taken online.
- Harness note: pages with `scroll-behavior: smooth` leave a naive screenshot mid-scroll; `shoot.mjs` now forces `auto` before scrolling. Full-page captures of sticky headers should be read together with the `fold-*` shots.

## Re-score under the revised criterion 1 (Phase 1)

`RUBRIC.md` criterion 1 now penalises convergent house-style defaults unless the brief earns them. Applying it to the same runs (other criteria unchanged):

| Brief | Defaults present | Criterion 1 | Total /20 |
|---|---|---|---|
| 01 SaaS landing | editorial house style (cream, heavy serif with italic accent word, mono eyebrow, red SAMPLE stamp, hard shadows, ticker), numbered section labels | 2 to 0 (the brief says "not like every other AI-tool page", which this style now is) | 15 |
| 02 Dashboard | default dark dashboard (navy/slate, blue and amber, donut, KPI row) | 1 to 0 | 10 |
| 04 Restaurant | serif plus warm orange on charcoal, ticker; partly earned by a wood-fire kitchen | 2 to 1 | 16 |

The original table above is kept as scored at the time.

## Note added in Phase 2

`shoot.mjs` was refined after these scores were written: inline text links are now exempt from the 44px target count, collapsed accordion content and clipped text no longer count as visible, and slice crops were added. `report.json` and the screenshots for these three runs were regenerated, so some mechanical numbers differ slightly from the table above (for example the restaurant's small targets at 375 are now 2, not 4; the SaaS and dashboard counts are unchanged). The scores themselves were not revised.
