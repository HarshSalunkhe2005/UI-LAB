# Phase 5: eval loop to the win condition

Run 2026-10-30 to 2026-10-31. Skill installed from the built `release/ui-lab.zip` (discovery style: the agent sees only name and description). Screenshots, gate data and audit reports are in `evals/runs/p5` (round 0), `p5r2` (round 1) and `p5r3` (round 2). Judges: one Opus and one Sonnet per pair, blind, A/B randomised per judge, same prompt as Phase 2. A pair is a skill win only when both pick the skill; a split is a tie.

## Final scoreboard

**The win condition was NOT met.** Required: skill wins at least 7 of 8 AND all 7 mechanical gates on every skill run.

| Brief | Round 0 | Round 1 | Round 2 | Counted result |
|---|---|---|---|---|
| 01 SaaS landing | LOSS (both close) | LOSS (Opus close) | TIE (Opus skill, Sonnet baseline, both close) | **TIE** (latest skill) |
| 02 analytics dashboard | WIN | not re-run | not re-run | **WIN** (round 0 skill) |
| 03 developer portfolio | WIN | not re-run | not re-run | **WIN** (round 0 skill) |
| 04 restaurant | WIN | not re-run | not re-run | **WIN** (round 0 skill) |
| 05 docs page | TIE | WIN | WIN | **WIN** |
| 06 e-commerce | WIN | not re-run | not re-run | **WIN** (round 0 skill) |
| 07 mobile app | WIN | WIN | TIE (Opus baseline, Sonnet skill, both close) | **TIE** (latest skill) |
| 08 redesign | WIN | not re-run | not re-run | **WIN** (round 0 skill) |

- **Judged: 6 wins, 2 ties, 0 losses on the latest evidence. Needed 7.**
- If you count the best result per brief instead (07 as a win from rounds 0 and 1), it is 7 of 8. I do not count it that way. Round 2 is the newest skill text and it tied, the runs are n=1, and picking the best run per brief is a selection effect. Read it as "6 to 7 of 8, within noise of the bar".
- **Gates:** in round 0, 7 of 8 skill runs pass all 7 gates (01 fails one: a 32 px link). The latest round-2 run of 07 fails the one-h1-and-main gate, and the round-1 runs of 05 and 07 failed gates too. So the gate half of the condition also fails.
- **Nothing was ever a clear loss to a Sonnet baseline on 02 to 08 in round 0.** The one repeat loser is 01, which is also the brief where the baseline is strongest (a cream editorial page).
- **Why 07 regressed (it won in rounds 0 and 1):** this is run-to-run variance in what the agent built, not a documented skill change. The round-2 07 agent skipped the audit, the 375 probe and the verify files, and reported that it did. The gate then failed it on the one-h1-and-main check.

## What the iteration rounds did (honest log)

Cap was two rounds of general fixes. Both were used.

**Round 0 diagnosis.** The skill lost 01 and tied 05 on craft defects (a headline that wrapped to five ragged lines, half-empty bands, per-line code boxes), a small-target miss on width only, and agents not viewing every slice. Four of the ten skill runs opened the world 23 (thermal receipt) file, and the "Quick pairing examples" table in `world-index.md` was a likely cause.

**Round 1 fixes (general, no per-brief text):**
- `templates/viewport-probe.html`: a no-network probe that loads the page in a real 375 px frame and slices it into phone screens. Headless Chrome cannot go below about 500 px, so before this the agents could not truly test 375.
- Gate 2 now rolls a number and draws two candidates from different world families; the pairing-examples table is removed.
- First-screen and balance checks (checklist items 11 and 12) and new bug rows.

Result: 05 improved (tie to win, twice). 01 lost again. 07 stayed a win. But the 05 and 07 round-1 runs failed gates because the agents skipped the audit.

**Round 2 fixes:**
- Mandatory Evidence fields in `templates/verify-log.md` (audit line, 375 measurement block, one line per slice viewed) and Gate 5 text asking for pasted real output.
- The roll uses a random number (`$RANDOM`, nanoseconds), not the whole-second clock, because two runs started in the same second drew the same roll.

Result: 01 went from loss to tie, 05 won again and passed all 7 gates, 07 tied and failed a gate. **Regression: 07, win to tie.**

**What did not work.** The Evidence fields did not make the agents run the steps. In round 2, 01 and 07 reported that they skipped the audit script, did not write the verify and handoff files, and looked at only the first screen; 05 skipped the audit. The skill's procedure is advice a subagent can ignore. I could not fix that with more prose without breaking the plan's rule, so I stopped. The next lever is a mechanism, not text: for example a `scripts/gate-check.mjs` that refuses to print the handoff until the audit and probe outputs exist, or having the harness run the audit itself. That is a Phase 6 decision.

## Mechanical gates and audit counts

Gate failures show which gate. "Small" counts interactive elements under 44 px at 375. Baseline pages for 01, 02 and 08 are the Phase 2 `baseline-free` pages.

| Brief | Skill audit (crit/warn/sugg) | Baseline audit | Skill gates | Baseline gates |
|---|---|---|---|---|
| 01-saas-landing | 0/0/0 | 0/1/3 | 6/7 (targets >= 44px at 375 (1 small)) | 6/7 (targets >= 44px at 375 (13 small)) |
| 02-analytics-dashboard | 0/0/0 | 0/5/0 | 7/7 | 4/7 (targets >= 44px at 375 (13 small); one h1 and a main landmark; reduced-motion rule present) |
| 03-developer-portfolio | 0/0/0 | 0/0/2 | 7/7 | 6/7 (targets >= 44px at 375 (7 small)) |
| 04-restaurant-site | 0/1/2 | 0/9/4 | 7/7 | 5/7 (targets >= 44px at 375 (6 small); one h1 and a main landmark) |
| 05-docs-page | 0/0/0 | 0/4/0 | 7/7 | 6/7 (targets >= 44px at 375 (18 small)) |
| 06-ecommerce-product-page | 0/1/2 | 0/0/0 | 7/7 | 6/7 (targets >= 44px at 375 (8 small)) |
| 07-mobile-app-screen | 0/0/0 | 0/3/1 | 7/7 | 7/7 |
| 08-redesign-generic-page | 0/0/0 | 0/1/2 | 7/7 | 6/7 (targets >= 44px at 375 (5 small)) |

Round 1 and 2 re-runs (skill only):

| Run | Audit | Gates |
|---|---|---|
| p5r2/skill/01-saas-landing | 0/0/0 | 7/7 |
| p5r2/skill/05-docs-page | 0/2/0 | 6/7 (targets >= 44px at 375 (11 small)) |
| p5r2/skill/07-mobile-app-screen | 0/1/0 | 6/7 (one h1 and a main landmark) |
| p5r3/skill/01-saas-landing | 0/0/0 | 7/7 |
| p5r3/skill/05-docs-page | 0/0/0 | 7/7 |
| p5r3/skill/07-mobile-app-screen | 1/1/1 | 6/7 (one h1 and a main landmark) |


Skill passed all gates on 7 of 8 round-0 runs; the baseline passed all 7 on 1 of 8. Audit-ui found no critical issues in either arm. The skill's pages are generally cleaner on warnings (6 of 8 round-0 skill pages have 0/0/0 against 1 of 8 baseline pages), but the audit is a static linter and does not see layout defects, which is where the skill's two non-wins came from.

## Negative prompts (discovery path)

Prompts: N1 a backend API task, N2 a SQL query task, N3 a bash script task. Skill installed, the agent sees only the name and description.

- **Result: 3 of 3 answered without triggering the skill and without reading any file in the skill folder** (checked in each transcript).
- **What this can and cannot show.** It tests whether an agent that sees the description chooses to open the skill. It does not test Claude Code's own skill matcher, nor how the description competes with other installed skills and plugins, nor prompts that are borderline (for example "style my CLI output", "make this email template"). Those are the cases that would reveal false triggers and are not covered. With n=3 clear non-UI prompts, the claim is only "no false trigger on obviously unrelated work".

## Diversity (brief 01, three runs, fresh judge)

| Round | Similarity (1 to 5) | Verdict |
|---|---|---|
| Round 0 | 4 | "one direction in three costumes": two of three were the same dark receipt world, all three shared a split hero with a ranked digest card |
| Round 1 (after the family roll) | 3.5 | "two directions, not three": one loud brutalist blue page, and two calm cream-and-cobalt pages that are close to the same page |

- Shared defaults the judge named, both rounds: a split hero with a ranked weekly digest card, the nav copy, "Every Monday" framing, a yellow or amber highlighter, the same sample asks (CSV export, SSO, bulk edit), "Zendesk, Intercom, Help Scout" under the CTA.
- Note that the digest-card hero comes largely from the brief itself (the product is a digest), so some of this convergence is the brief, not the skill. The cream-and-cobalt pair is a skill-level convergence.
- **After the round-2 random-number roll I did not re-run the three-run test.** Time and usage limit. So the roll fix for convergence is unverified. The one round-2 run I have (01) chose Broadsheet (a cream editorial page), which is again in the family the judges call "typical".

## Pattern and reference use (from transcripts, 10 skill runs)

Opened by how many of 10 runs:

| File | Runs |
|---|---|
| SKILL.md | 10 |
| references/anti-slop.md | 9 |
| references/world-index.md | 9 |
| scripts/audit-ui.mjs | 7 |
| references/worlds/23-thermal-receipt.md | 4 |
| scripts/contrast.mjs | 3 |
| references/worlds/20-nautical-chart.md | 3 |
| patterns/INDEX.md | 2 |
| references/worlds/12-broadsheet.md | 2 |
| patterns/faq-details.html | 1 |
| references/dense-ui.md | 1 |
| references/worlds/09-departures-board.md | 1 |
| references/worlds/14-museum-placard.md | 1 |

- **Only 5 of 24 world files were ever opened** (23, 20, 12, 9, 14). **Only 1 pattern file in 10 runs** (faq-details). INDEX.md was read twice and led to one pattern.
- Never opened in any run: 19 world files, the other ~130 patterns, `references/color.md`, `typography.md`, `motion.md`, `accessibility.md`, `bugs.md`, `verify.md`, `teardowns.md`, `briefs.md`, `site-types.md`, `glossary.md`, `templates/`, `scripts/` other than audit and contrast. (The templates are copied, not read as files, so the transcripts may under-report them; `verify.md` and `bugs.md` may be skipped only because the checklist text lives in SKILL.md.)
- **Phase 6 cut candidates:** the unread world files are not dead weight by themselves, because `world-index.md` is read and routes to them, but the 130 patterns and the long references are candidates to cut or merge, starting with those never reached from INDEX. Suggested rule: cut or fold any pattern that a build of 8 diverse briefs never opens unless a world file points to it. And consider making the six family files the unit (opened per family), since agents pick 2 of 24 and open 1 to 2.

## Examples

`skill/ui-lab/examples/` now holds three worked examples from the best round-0 skill runs: 02 ferry dashboard, 04 restaurant, 08 redesign. Each has the brief, the Gate 2 table, the direction card with the token block, a code excerpt, the real audit output and a screenshot described in text. No binaries. Examples README updated. The 08 example records a real defect (annotation text over the orbit line) so the example stays honest.

## Caveats

- n=1 build per pair per round; the same two judge models, and Sonnet judges Sonnet-built pages. One judge pair is a noisy signal, and several of the "close" calls could flip.
- I tuned the skill on the losing briefs (01, 05, 07), so those results are less independent than 02, 03, 04, 06, 08, which were never re-run against the final skill text.
- The baseline arm for 01, 02 and 08 reuses the Phase 2 pages, built before the harness probe was changed. The probe was refined during Phase 5 (it now ignores fixed overlays, collapsed accordions and clipped or transparent elements), so gate numbers for the Phase 0 and Phase 2 baselines are not strictly comparable with these. I report the numbers above with the final probe on all pages.
- The baseline agents could render pages less well than the skill arm could once the probe existed (it was only in the skill package). Part of the 05 improvement is that tool, not the design guidance.
- Judges consistently call the cream-serif editorial baseline "more typical AI-generated" and still prefer it on craft. So the distinctiveness argument and the preference result point in opposite directions on 01, and the judge prompt weights craft.
- The negative-prompt test only uses obviously unrelated prompts.
- Several skill-arm agents reported "done" while skipping steps they were asked to do. I used the files and my own re-runs, not their reports, for every number above.

## Where the plan looks wrong

- The win condition needs a rule that agents follow a procedure. They do not reliably follow it, so a 7/7 gate bar on every run depends on luck unless a script enforces it.
- "Win only if both judges pick the skill" makes a coin-flip judge pair a tie 50% of the time, so 7 of 8 is a hard bar to hit on n=1.

## Appendix: judges' verbatim reasoning

Each block is the judge's final reply as extracted from its transcript. The A and B letters are the judge's own; the "picked" line resolves them against the key.


### Round 0 (skill as first built)

#### 01-saas-landing

**opus judge: picked baseline (close)**

> WINNER: A (close)
> REASONING: A's hero (desktop-0) has a clear promise ("Your customers already told you what to build."), one dominant black CTA with a secondary text link, and a "Relay Weekly" sample card that shows the product's real output, with ranked asks, counts, trend arrows and customer quotes. The newspaper framing ("VOL. 1 — MONDAY EDITION" strip, Fraunces-style serif, quote marquee) runs consistently from hero to footer, so the page reads as one considered system. The feature section (desktop-2) shows instead of tells: revenue-vs-volume bars and the "same ask, many phrasings" collapse into "Export to CSV · 94 customers" speak directly to a PM's real problem. Social proof (desktop-3) has good hierarchy: one big pull quote with highlighted numbers, two smaller cards, a stats row and a logo strip. Pricing (desktop-4) clearly marks the recommended Team tier in yellow with a "MOST TEAMS" tag. Mobile (mobile-1 to mobile-6) stacks cleanly with no clipping. B has sharper copy and one standout idea, the capability/limit table (desktop-2), which is honest and fits a skeptical PM audience. But its layout craft is weaker. The desktop hero headline (B desktop-0) breaks badly: "what" sits alone on a line, and the lime highlight block wraps awkwardly around "for." The main testimonial (desktop-3) is set in huge type crammed into a narrow left column, leaving about two-thirds of the dark band empty, so it reads as a layout bug. B's pricing (desktop-4) gives no tier visual priority, and no footer shows up in the desktop slices, only a CTA band ending in a rule (desktop-5).
> BIGGEST FLAW OF WINNER: The social proof leans on generic padding (a row of round-number stats and a strip of made-up wordmark logos), and the 3-up and 2+3 bordered card grids feel more templated than the rest of the editorial system.
> BIGGEST FLAW OF LOSER: The desktop testimonial in desktop-3 is a towering, narrow column of oversized text with a large empty area beside it, and together with the awkward hero line breaks it makes the page look unfinished at 1440.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A. Its cream background, serif display face, yellow highlighter underline, scrolling quote marquee, stats row, logo strip and bento feature cards are a recognisable current "editorial AI landing page" recipe, whereas B's receipt motif and capability-vs-limit table are less formulaic despite its execution flaws.

**sonnet judge: picked baseline (close)**

> WINNER: B (close)
> REASONING: B's desktop-0 puts the promise "Your customers already told you what to build" next to a tilted sample digest card, with one dominant dark CTA and a quiet secondary link. The whole hero fits in one screen, and the dark quote ticker below it adds a bit of motion and voice. A's desktop-0 is more daring, with a lime-on-charcoal receipt that has working segment tabs. But its headline wraps to six huge lines and pushes the email field and the receipt down to the fold edge. B's sections follow a steady rhythm: how it works, then a "What's inside" feature grid with a real revenue bar chart and a phrasing-merge demo (desktop-2). Then come a testimonial, stats and logos (desktop-3), pricing on a dark band, and an FAQ. B's pricing (desktop-4) is clear: the yellow, offset-shadow "Most teams" Team tier is an obvious focal point. A's three pricing cards are equal in weight and have empty space above the buttons (desktop-3). A's roadmap testimonial (desktop-2) is squeezed into a narrow left column of about 12 words per line, with the right half of the band blank. That reads as a layout defect, and A's social proof is otherwise thin, with no logos or stats. B's mobile is tidy: the sample card sits right under the hero in mobile-1, and stacked cards and pricing are clean through mobile-6. A's mobile-0 shows no product visual until you scroll, though its capability/limit list is a good mobile adaptation. B also ships a full footer and a closing red CTA band, while A's footer was not visible in the screenshots I reviewed.
> BIGGEST FLAW OF WINNER: The cream, serif and terracotta editorial look with a fake-logo strip and stat row is a now-familiar premium-SaaS house style, so it is polished but less ownable than A's concept.
> BIGGEST FLAW OF LOSER: A's oversized hero headline and the narrow, half-empty roadmap testimonial column feel unbalanced, and its social proof and pricing hierarchy are weaker.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because the warm cream palette, Fraunces-style serif headlines, mono eyebrow labels, highlighter underline, stats trio and invented customer logos match the current default "tasteful editorial" template. A's receipt metaphor and its "capability vs limit" table are more specific to this product.

#### 02-analytics-dashboard

**opus judge: picked skill**

> WINNER: A
> 
> REASONING: In A desktop-0, the 82.1% on-time rate gets its own dark panel and the line "Below the 90% target by 7.9 pts" sits right under it, so the 7am question is answered in one glance. The other KPI cards stay lighter, which keeps the hierarchy clear. A's charts explain themselves: the on-time line marks the 26 Oct 42% dip with a callout and uses hollow dots for days below target. The load chart puts a magenta peak tick on each route, which shows routes that averaged under 80% but hit capacity on some sailings. That is a real ops insight B's plain average bars miss. A's sailings table puts attention reasons right in the row ("Bow thruster fault, engineer aboard, ETA to berth +30", "62 to rebook"), adds inline load bars and a left accent stripe, and has a Needs attention / All sailings toggle, so the table and the triage list are the same thing. A's cream-and-navy palette, serif numerals and contour texture feel made for a ferry operator, and colour is used sparingly (magenta only for problems). On mobile (A mobile-0 to mobile-3), A re-thinks the table as sailing cards with a sort control and puts the sailings right after the headline KPI, which is the right priority on a phone. B (desktop-0/1) is dense and competent, with a separate Needs attention rail and a sortable table. But it is the standard dark-slate dashboard: rainbow cause bars with no meaning behind the colours, and a load chart where every bar is the same blue even though it has a three-colour legend. B on mobile (mobile-1/2) just shrinks the desktop table, so the Vessel column clips at "MV" and the table needs a horizontal scroll inside a scroll box. The Needs attention list is pushed to the very bottom and its last card is cut off.
> 
> BIGGEST FLAW OF WINNER: The mobile layout pushes all three charts and the secondary KPIs below a very long list of sailing cards, so you have to scroll a long way to reach the trend and delay-cause views.
> 
> BIGGEST FLAW OF LOSER: Its mobile view squeezes the wide sailings table into a clipped inner scroll box (the Vessel column cuts off at "MV") and leaves the Needs attention list last, so the most important 7am info is the hardest to reach on a phone.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. It is the stock dark-navy dashboard with uppercase small-caps card labels, a row of five equal KPI tiles, and arbitrary rainbow pastel bars, a template look with nothing specific to a ferry operator.

**sonnet judge: picked skill**

> WINNER: B
> REASONING: B has a clear point of view for a ferry operator: a warm cream paper palette, a serif italic wordmark with compass mark, and an ink-navy hero on-time tile with contour-line texture. Its hierarchy is deliberate. The 82.1% hero number dominates desktop-0, and the secondary KPIs are quieter. B also writes insight into every chart subtitle ("Lowest 26 Oct at 42% (fog & weather)", "R4 runs fullest at 80%..."). That answers what the 7am ops manager actually wants to know. The load chart shows a peak tick against average fill, and the 95%+ peaks are flagged in magenta. The sailings table is built around the manager's job: it defaults to "Needs attention (10)" with a toggle to all 34. Each row has status pills with icons, an inline load bar, and a plain-language note such as "Master off sick, no relief crew". On mobile, B turns the table into stacked cards with a sort control and collapses the filters into a "Filters" bar. That is a real mobile design, though it pushes the charts far down the page. A is a competent dark dashboard, but it is the familiar KPI row plus three cards on a navy background with default-blue bars. Its desktop-0 table is cut off at the fold, and the Needs Attention list sits beside it instead of being integrated. On A's mobile, the sailings table is clipped at the right edge: the Vessel column is cut to "MV" and the Load, Delay and Status columns are unreachable without scrolling. A's load bars also sit at 69-79% in near-identical blue, so the chart gives little signal.
> BIGGEST FLAW OF WINNER: On mobile the charts fall to the very bottom, below a long stack of sailing cards, and the three desktop charts are crowded, with the on-time chart's "26 Oct 42%" label overlapping the line and the dense delay-cause rows looking a little sparse.
> BIGGEST FLAW OF LOSER: On mobile the sailings table is horizontally clipped (the Vessel column shows only "MV" and later columns are cut off), and the desktop table is truncated at the fold, which undermines the core "which sailings need attention" task.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its dark navy cards, uppercase-label KPI row and default blue/orange/teal bar palette are the stock "analytics dashboard" template with no product-specific character.

#### 03-developer-portfolio

**opus judge: picked skill (close)**

> WINNER: B (close)
> REASONING: B's hero (B/desktop-0) takes a risk that fits the brief. An interactive contour-depth map with a tide slider and a plain-text readout ("1 contour shaded, under 6 m there") shows data-viz and accessibility thinking right away, where A's hero only states it. B's palette of cream, deep navy and pale blue, with a single magenta-pink accent, plus the Crimson Pro / Public Sans pairing, feels like a considered identity. A (A/desktop-0) uses a dark background, mono uppercase labels, a green italic serif accent and "01 / SELECTED WORK" numbering, which is a very familiar house style. B's project rows (B/desktop-2) follow the brief exactly, with PROBLEM, WHAT I DID and OUTCOME every time. Each outcome has the key number in pink and a small before/after bar chart, so the four case studies are easy to scan and compare. A's case studies (A/desktop-2, desktop-3) have richer bespoke figures (windowed grid, chart with its data table, reconciliation diagram, issue bar chart) and tinted outcome callouts, which is real craft and its strongest asset. But A labels "what I did" and has no matching "outcome" label, and on mobile those figures shrink to unreadable micro-text (A/mobile-2, mobile-4). The copy in both is dry and confident, but B's "Have a slow table?" contact and "I do not do logo work, marketing sites or anything that needs a carousel" (B/desktop-3, desktop-4) carry her voice slightly better. On mobile, B keeps all four nav links visible and stacks cleanly (B/mobile-0 to mobile-5). A's mobile nav visibly drops CONTACT (A/mobile-0), a real navigation defect. A's desktop hero also leaves a large dead area at top right above the spec table (A/desktop-0).
> BIGGEST FLAW OF WINNER: The bathymetry/tide map is only loosely related to Mira's actual work, and its readout says "Tide 0.0 m" while the slider sits mid-track, a visible inconsistency on the first screen for someone selling precision.
> BIGGEST FLAW OF LOSER: On mobile the nav drops the Contact link and the project figures shrink to illegible text, which undercuts a portfolio built on accessibility.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because the dark background, mono uppercase eyebrows, "01 / SECTION" numbering, green italic serif accent words and bordered tech-tag chips are the stock "tasteful developer portfolio" look.

**sonnet judge: picked skill**

> WINNER: A
> 
> REASONING: A has a clear point of view. It uses a cream, navy and pale-blue palette, a Crimson-style serif headline, and a hero with a working bathymetric contour map and "Tide" slider (desktop-0). The map is a precise, slightly odd object that fits the "data-heavy, quietly confident" brief. Each of the four projects in desktop-1 and desktop-2 has labelled Problem, What I did and Outcome blocks. The outcome is set larger, with the key figure picked out in pink and a Before/After bar beneath it (2,100 ms vs 90 ms, 212 vs 9). That makes the page easy to scan and quantifies the results rather than just stating them. The copy is dry and specific, for example "Day rate on request. I do not do logo work, marketing sites or anything that needs a carousel." The About section has a stat grid and the Services section is a clean three-row table with scope and timing (desktop-3). The contact section is strong ("Have a slow table?" with a large email address, desktop-4). B is competent: figures and captions per project, green outcome bands, and a clear 01-04 section system. But its hero in desktop-0 and desktop-1 leaves a large empty block above the spec table on the right, which looks like a missing visual. Its dark, monospace-label, green-accent look is the familiar developer-portfolio style. On mobile, B's nav drops Contact (mobile-0 shows only Work, About and Services). A's mobile layout stacks cleanly and keeps all four nav links, though its nav wraps onto a second row.
> 
> BIGGEST FLAW OF WINNER: The hero's interactive map has no obvious link to the projects, and on mobile the nav wraps onto a second row and the map sits below the buttons, so the first screen is text-heavy.
> 
> BIGGEST FLAW OF LOSER: The desktop hero has a large unexplained empty area to the right of the headline, and the page as a whole reads like a standard dark developer-portfolio template, with only the thin mono-label styling setting it apart.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because the near-black background, mint-green accent, italic serif emphasis in the headline, mono "01 / SELECTED WORK" labels, "Fig. 1" captions and tag chips are a very common generated-portfolio look.

#### 04-restaurant-site

**opus judge: picked skill**

> WINNER: A
> REASONING: A has the stronger sense of one specific place. The hero in desktop-0 puts the hearth inside topographic contour lines with a compass and a "Hearth, tonight 480°C" card, and the Find Us map in desktop-3/4 is drawn as a nautical chart with harbour soundings and a pontoon, so the coastal-town idea runs through the whole page instead of being only stated in copy. A's menu (desktop-2) shows all four courses at once in a two-column grid with clear serif dish names, right-aligned prices and one-line descriptions. That is easy to scan and makes you hungry. In B (desktop-2/3) the menu sits behind tabs, so only the starters are visible and mains, desserts and drinks are hidden one click away. A's colour blocking works as wayfinding: cream for the story, pale sea-blue for the menu, navy for hours, ember orange for reserve. In B nearly everything is a near-black brown, so the sections run together. A's private-dining section (desktop-4/5) adds a small floor plan of the long table beside the hearth, which is a thoughtful touch. The hours table marks today's row and gives each day a note ("Wood-splitting day", "Long lunch, last fire"). B has real strengths: the high-contrast Didone/italic type, the food-name marquee and the brick-hearth illustration with a fish on the grill (desktop-1/2). But it shows defects. The date field has a red error border before anyone has touched the form (desktop-4, mobile-5). On mobile the menu tabs wrap so "Drinks" falls onto its own line under a misplaced active underline (mobile-2/3). The mobile hero has a large empty band at the top with the flame pushed behind the CTAs (mobile-0), and there is no Book button in the mobile header.
> BIGGEST FLAW OF WINNER: The hero's contour elevation labels ("322 138 6") are clipped at the right edge of the viewport (desktop-0, mobile-0), and on mobile the hours table drops its per-day notes column.
> BIGGEST FLAW OF LOSER: The tabbed menu hides most of the food and breaks on mobile ("Drinks" wraps under a misplaced underline), and the reservation date field shows an error state on load.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. It uses the familiar dark-luxe formula throughout: a short-rule eyebrow label over every section, a headline with one italic accent-coloured word ("Come hungry.", "Save a seat by the fire."), a three-number stat row and a centred footer.

**sonnet judge: picked skill (close)**

> WINNER: B
> 
> REASONING: B has one specific idea. The hero in B desktop-0 is a topographic contour map around a small hearth, with a compass, soundings and a "480 °C" hearth readout. That reads as a coastal wood-fire place, not a template. The idea carries through the page. B desktop-3 and desktop-4 use a nautical-chart map with fathom soundings, a "Saturday / Today" highlighted row in the hours, and a private-dining diagram called "twelve at the long table". B's palette changes section by section: navy, cream, pale blue, an orange reservation band, then navy again. That makes the page easy to scan, and the full menu is readable at once. B desktop-2 shows all four menu categories (starters, mains, desserts, drinks) in two columns with clear prices and short, appetising descriptions ("Whole turbot, brown shrimp butter £68"). The menu reads like a real, tightly written one. A hides the menu behind tabs. A desktop-2 and desktop-3 show only Starters, so mains, desserts and drinks are not visible and the menu sells less. A is polished but familiar: dark background, orange accent, large serif with italic orange "& Ember", a flame illustration, and a marquee strip of dish names. It is nicely made but closer to a standard moody-restaurant look. A also has big dead spaces, such as the empty hero above the headline on mobile-0 and the large gaps in desktop-4. A's mobile hero (mobile-0) crops the flame behind the buttons, which looks accidental. B's mobile (mobile-0, mobile-4) stacks cleanly, with a readable menu and an hours table that keeps its structure. B's mobile hero shrinks the artwork and leaves a cut-off card at the bottom. A's reservation form, with guest-number chips, is a nice touch. B's orange form band is a stronger focal point and the private-dining section is richer.
> 
> BIGGEST FLAW OF WINNER: The hero's decorative contour map is busy, with the headline sitting over lines and a clipped "68" label at the right edge, and the mobile hero is cramped and cropped.
> 
> BIGGEST FLAW OF LOSER: The tabbed menu shows only Starters by default, so the main sell of the page (mains, desserts, drinks) is hidden, and several sections sit in large empty dark areas.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its dark charcoal-and-orange scheme, serif display with italic orange accent, flame illustration and dish-name marquee follow the usual "moody restaurant" template.

#### 05-docs-page

**opus judge: picked baseline (close)**

> WINNER: B (close)
> 
> REASONING: B's code blocks render cleanly as continuous syntax-highlighted panels (B desktop-1, desktop-2), while A's code blocks show a background box drawn behind each individual line (A desktop-0, desktop-1, desktop-4). That looks like inline-code styling leaking into the pre blocks and reads as a rendering bug on every example. A is the more distinctive and considered design: the serif display/body type, warm near-black ground, teal links and amber gotcha callout feel like a real product brand (A desktop-0, desktop-1), and its token table goes further with a fuller set plus an Escaping group (A desktop-3). A's mobile token table drops the Output/Example column entirely (A mobile-2, mobile-3), so on a phone the reference loses the column readers most need. B's mobile table also drops its Example column (B mobile-2), so neither handles that well. B's left nav nests the current page's sections under the active item and the "On this page" outline is easy to scan (B desktop-0), and on mobile it gives separate "Menu" and "On this page" disclosures plus "#" heading anchors (B mobile-0, mobile-1), which is better for finding things than A's single combined accordion (A mobile-0). B's tokens are styled as blue code chips (B desktop-2, desktop-3), so the token column is quick to scan. B's gotcha callout sits right after the first example where it matters (B desktop-1). B has smaller craft slips: a visible inner scrollbar on the left nav (B desktop-0), a "(rolled over)" comment pushed to the panel edge in the strict-mode block (B desktop-2), and prev/next cards slightly wider than the content column (B desktop-4). Overall, B's defects are minor and A's line-box bug runs through the whole page, so a reviewer would ship B and wish it had A's personality.
> 
> BIGGEST FLAW OF WINNER: It is visually generic (Inter on dark slate with blue accents, like a GitHub/Vercel docs clone), and on mobile its token table drops the Example column.
> 
> BIGGEST FLAW OF LOSER: Every code block draws a separate highlighted box behind each line, which looks broken and hurts how the code reads, made worse by the mobile token table losing its Output column.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because its dark slate, Inter, blue-accent, rounded-card look is the default docs house style, while A made deliberate serif and warm-palette choices.

**sonnet judge: picked skill (close)**

> WINNER: B (close)
> REASONING: B has a considered identity: a serif display and body face, a warm near-black ground, a teal accent and heavy rules above major headings. It reads like a product with a point of view, where A reads as the familiar GitHub-dark docs template. In B desktop-0 the left nav is grouped by task (Working with dates, Time zones, Localisation), the right outline has real hierarchy with a teal active marker, and the metadata strip (reading time, version, updated date) is neat. The B gotcha (desktop-1/2, titled "MM is month, mm is minute") is the more useful gotcha for a date library. B's token table (desktop-2/3) is complete: it includes hh and the [text] escape row, and it has a caption plus grouped rows. The B code blocks put the Copy button in a ruled cell, with a copy icon. A's page is clean and well built: its token table with pill-styled tokens, the breadcrumb, the "On this page" outline and the prev/next cards are all competent, and its gotcha callout is clear. A's weaknesses are generic styling, an outline that sits empty below the fold, and a left nav that is clipped at the bottom of the first viewport. B has defects too. The inline-code and syntax highlighting in its code blocks draw a boxed background behind each token run, which looks patchy and noisy (desktop-0, desktop-3). The B gotcha callout is narrower than the content column (desktop-1). On mobile both collapse the nav into a disclosure, and both code blocks scroll horizontally. B's mobile body text is larger, and its single "Docs menu and page outline" disclosure is a good consolidation. A's mobile-1 and mobile-2 also clip code lines without any visible scroll cue. Overall B is the more distinctive and more thorough reference page despite the patchy code styling.
> BIGGEST FLAW OF WINNER: The code blocks have patchy per-line and per-token background boxes that look noisy, and the gotcha callout does not span the full column width.
> BIGGEST FLAW OF LOSER: A is a generic GitHub-dark docs template with little personality, and its left nav is cut off at the bottom of the first viewport.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its Inter-style sans on a dark grey ground with blue pill accents and a rounded-card table is the default docs-template look.

#### 06-ecommerce-product-page

**opus judge: picked skill (close)**

> WINNER: A (close)
> REASONING: A's buy box (desktop-0/1) is clear and easy to buy from. The stock line "In stock. Ships in 2 days" sits right under the price, the back-length options carry torso ranges plus fit advice, and the "Your order so far" receipt in a monospace font (desktop-1, mobile-2) adds up shipping, returns and the total before tax. That receipt is a distinctive, trust-building touch built for this product. A's dark "What is in the bag" panel (desktop-2, mobile-3) uses a proportional stacked bar (24/8/4/2 L) that shows the 38 L split at a glance, plus an "Also in the box" list, and it holds together at 375 wide. Its reviews (desktop-3) and the three-column shipping/returns/repairs table are well organised and scannable, and the related products row (desktop-4) uses a palette that matches the colourways. B is very polished: serif headings, four big-number spec cards (desktop-1/2, mobile-2) and the full set of trust items (payment badges, review dates). But its visible defects are worse. The "Airline carry-on approved" shield badge covers the top of the bag illustration on mobile-0/1 and crowds the handle on desktop-0. The "What's in the bag" zone diagram on desktop-2 leaves a large empty band above the zone list, and its overlapping zones (laptop inside main, side pockets pushed out past the bag outline) read as muddled. B's unverifiable "approved" badge and its stack of icon trust cards also feel more generic than A's receipt and fit-measuring copy. A has a large dead area to the left of Key specs (desktop-2) and empty space under the gallery (desktop-1), but those are spacing issues, not broken parts.
> BIGGEST FLAW OF WINNER: The ATLAS 38 label on A's main bag illustration is clipped at its right edge (desktop-0, mobile-0), and the Key specs section leaves a large empty left column, so the page feels unfinished in places.
> BIGGEST FLAW OF LOSER: B's oversized "Airline carry-on approved" badge sits on top of the product illustration on mobile, hiding the top of the bag in the most important image on the page.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because a serif-display-plus-Inter pairing, rounded white cards everywhere, a three-up row of icon cards for shipping/returns/repair, and a generic shield "approved" badge make up a familiar DTC template.

**sonnet judge: picked skill (close)**

> WINNER: B close
> REASONING: B reads as a more considered, product-specific design. Its heavy grotesque headings ("Atlas 38", "Key specs", "Reviews") and the monospace "Your order so far" receipt block in desktop-1 give it a distinct voice. That block makes cost and returns visible at the point of purchase, which supports the trust goal. Its rust Add-to-cart button stands out strongly against the cool navy bag illustration and the cream page. The dark "What is in the bag" panel in desktop-2, with a proportional litre bar, big 24 L / 8 L / 4 L / 2 L figures and an "Also in the box" list, is the most memorable section of either page. Its reviews (desktop-3) are clean, with rating percentages, a fit slider and a "94% say it fit" line. A's strengths are its gallery with a "Airline carry-on approved" badge, an interactive zone diagram, spec cards, and a thorough reviews and shipping layout. But A's serif-headline, green-CTA, white-card look feels like a familiar sustainable-DTC template. A's gallery badge in desktop-0 and mobile-0 covers the top of the bag, and its "What's in the bag" diagram in desktop-2 has awkward overlapping side-pocket "5" shapes and a large empty area. A's desktop spec section is also split awkwardly between stat cards cut across slices and a table. On mobile, both pages have a sticky bottom bar with price and Add to cart. A's mobile pages are tidy, but its bar overlaps the title mid-scroll (mobile-1). B's sticky bar does the same (mobile-1) and its size buttons stack full-width, but B's mobile receipt, specs, dark panel and reviews all stay legible.
> BIGGEST FLAW OF WINNER: The main bag illustration is small and sits in a large empty gallery area (desktop-0), and the sticky mobile bar covers the title and description as you scroll (mobile-1).
> BIGGEST FLAW OF LOSER: The "Airline carry-on approved" badge overlaps the top of the hero bag illustration, and the "What's in the bag" diagram has clipped, overlapping side-pocket shapes beside a half-empty column (desktop-2).
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its serif-headline, soft-green, rounded-white-card layout with icon-topped shipping cards, a badge with a shield icon and a payment-logo row is a generic, polished DTC template.

#### 07-mobile-app-screen

**opus judge: picked skill (close)**

> WINNER: B (close)
> REASONING: B has a real concept behind it. In B/desktop-0 and B/mobile-0, the amber streak card pairs a huge heavy "11" with a hand-drawn tally-mark glyph, which ties directly to the product name "Tally" and makes the streak the clear hero of the screen. B's week strip (B/mobile-0) shows day names and dates, and today (Fri 30) gets a highlighted pill and a partial progress ring, so you can read the week at a glance. B's segmented progress bar under "Habits / 2 of 5 done" connects nicely to the five habit rows below it. Completed rows in B are tinted olive cards with lime checks and strikethrough text, which separates done from not-done well on the dark background. A is very well crafted: the serif "Good morning" headline, cream background, the dark streak card with its 40% ring, and full-check week dots (A/desktop-0, A/mobile-0) are all clean and fit together. But A reads as the familiar calm-wellness template: sage green, cream, a serif greeting, ring plus big number. The blurry brown glow in the top right of A's streak card looks like a smudge rather than a deliberate accent. On mobile, A fits all five habits above the tab bar while B cuts off at four, a small usability point in A's favour. Both have proper device frames, status bars, home indicators and tab bars, so both feel like apps rather than web pages.
> BIGGEST FLAW OF WINNER: B uses two accents (amber for the streak and active tab, lime for checks and the week rings), so the palette is a little split, and the outlined lime rings for completed past days are weaker as "done" markers than filled checks would be.
> BIGGEST FLAW OF LOSER: A is polished but generic, and its muddy brown radial glow on the streak card looks like a rendering stain rather than a designed detail.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because the cream background, sage green, serif "Good morning" greeting and progress-ring-plus-streak card is the default look generated wellness and habit apps tend to land on.

**sonnet judge: picked skill (close)**

> WINNER: B (close)
> REASONING: In B's desktop-0 and mobile-0, the oversized "11" in near-black on a saturated amber card, paired with a tally-mark motif, gives the Today screen an unmistakable focal point and ties directly to the product name "Tally". The week strip in B shows full day names with date numbers and a highlighted current-day pill with a partial ring, and the segmented 5-part progress bar under "Habits" gives a clear at-a-glance read of "2 of 5 done". The lime-on-dark palette is a distinct identity and the strikethrough plus tinted completed rows read clearly against the unchecked ones. A's mobile-0 is polished and well-crafted, with a serif "Good morning", a dark-green streak card with a progress ring, and tidy habit cards. However, the cream-and-forest-green wellness look with serif headline is a familiar habit-app template. A's week strip uses single-letter day labels (M T W T F S S) and shows the Sunday placeholder "1" faintly, which is less scannable. A's streak card text is smaller and the "40%" ring competes with "12 days" for attention. A also has a 4-tab bar with Habits and Profile, which feels app-like, while B has 3 tabs, which is leaner but fine. In B's mobile-0 the bottom tab bar is clean and the fourth habit card ("Walk 8,000 steps") is cut off by the tab bar, which reads naturally as scrolling content. Both are free of overlap or broken layouts, and both device frames on desktop look convincing. B's stronger hierarchy and more ownable concept edge out A's more conventional polish.
> BIGGEST FLAW OF WINNER: The tally-mark graphic on the streak card is faint and partly obscured by the strike line, and the dark lime-on-black scheme has some low-contrast secondary text (subtitles and the future-day circles).
> BIGGEST FLAW OF LOSER: A reads as a generic wellness-app template (cream background, forest green, serif greeting), with a week strip of single-letter labels and a "40%" ring that dilutes the streak as the hero.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because the cream/sage-green palette with serif display heading and soft rounded cards is the common house style for habit and wellness UIs, with nothing tied specifically to "Tally".

#### 08-redesign-generic-page

**opus judge: picked skill (close)**

> WINNER: B (close)
> 
> REASONING: Both redesigns drop the purple-gradient template and use the same strong "Know why the number moved" idea. B commits harder to a brand. The saturated yellow hero with "moved." reversed out in a black block (B desktop-0) is memorable and still reads instantly. The ink/cream/cobalt palette carries through the black testimonial band (desktop-2/3) and the blue CTA (desktop-4). B's features section (desktop-2) is the most scannable part of either page: a three-column table of name, plain explanation and a bold proof point ("Sub-second on 100M rows", "Minutes to connect, not sprints"). AI Insights is highlighted in yellow as the lead feature, which suits an analytics buyer. B's pricing (desktop-3) adds a one-line "who it's for" to each plan and keeps the Pro column clear in yellow with a filled CTA. A is the more refined of the two in pure typographic craft. Its condensed serif with rust italics ("why", "guessing.", "No asterisks."), the numbered feature rows (desktop-2) and the large pull-quote testimonial show care. But the cream + editorial serif + mono eyebrow ("01 / FEATURES", "INSIGHTS ENGINE V3 IS LIVE") formula feels like a familiar house style, not something made for this product. A also has visible defects: the "WEEKLY SIGNUPS" label is clipped inside the small black orbit disc (desktop-0/1, mobile-1). On mobile the caption runs together as "PRICING PAGE REWRITECONFIDENCE 91%" (mobile-1). B's mobile is clean and well stacked throughout (mobile-1 to mobile-5), with large tap targets and the feature table collapsing cleanly into blocks.
> 
> BIGGEST FLAW OF WINNER: In the hero spiral chart, the "Traced to one referral campaign" and "Now" labels are crossed by the orbit lines (desktop-0, mobile-0). The yellow AI Insights box also sticks out past the grid edges the other feature rows line up to (desktop-2).
> 
> BIGGEST FLAW OF LOSER: The hero's key data element is broken: "WEEKLY SIGNUPS" is clipped in the orbit disc on every viewport, and the mobile caption collides into "REWRITECONFIDENCE".
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because cream background + condensed serif with italic accent word + monospace numbered eyebrows ("01 / FEATURES") is now a stock "tasteful editorial" pattern that AI-generated pages reach for by default.

**sonnet judge: picked skill (close)**

> WINNER: A (close)
> REASONING: A has a committed, product-specific identity. Desktop-0 shows a saturated yellow hero with a huge tight grotesque headline, a black-highlighted "moved." and a spiral trace chart annotated "Week 9: sign-ups +38%". The chart is the product's actual story (cause traced to a campaign), not a decorative graphic. The pairing of yellow, ink black, cream and cobalt blue holds across hero, dark testimonials (desktop-2/3), pricing and the blue CTA (desktop-3/4), so the page has a strong, memorable rhythm. Features in desktop-2 are a scannable ruled list with a highlighted "AI Insights" lead row and a right-hand proof point per feature ("Sub-second on 100M rows"). That is strong information design, and the copy is concrete. Mobile (A mobile-2 to 5) stacks cleanly and stays readable. Pricing is bordered and clear, with the yellow Pro card and its black button on top. B is elegant: desktop-0 has a serif headline with an italic "why", and the orbit graphic with a +18.4% core fits the Orbit name. It reads as a polished editorial template. But the hero graphic's centre label "WEEKLY SIGNUPS" is clipped by the circle (desktop-0, mobile-1), and the mobile caption collides ("REWRITECONFIDENCE 91%" in mobile-1). The orbit is also too faint to carry the hero, and the thin condensed serif is weaker in hierarchy than A's bold type. A's flaws are smaller: the hero chart label overlaps the arc ("Traced to one referral campaign" is struck through by the ring) and the headline is very heavy. The unmistakable, ownable look puts A ahead, though B is the more refined and safer one.
> BIGGEST FLAW OF WINNER: The hero chart's annotation text runs into the orbit rings (and the "Now" label sits on a line), so the key visual has a visible overlap defect and the 'moved.' headline is cramped against the chart on narrow desktop.
> BIGGEST FLAW OF LOSER: The hero orbit graphic has a clipped "WEEKLY SIGNUPS" label inside the central circle and, on mobile, its caption collides ("REWRITECONFIDENCE 91%"), which undercuts the focal visual.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because the cream background, condensed serif headline with a terracotta italic accent word, mono eyebrow labels ("01 / FEATURES") and the dark closing CTA are the now-familiar "editorial AI" house style.

### Round 1 re-run

#### 01-saas-landing

**opus judge: picked baseline (close)**

> WINNER: B (close)
> REASONING: B's hero (B/desktop-0) pairs a confident editorial serif headline, "Your customers already told you what to build", with a tilted "Relay Weekly" newsletter card that shows the actual product: ranked asks, counts, week-over-week deltas and verbatim quotes. A PM gets the value before scrolling. The "Vol. 1 — Monday Edition" masthead, the ticket-quote marquee and the outlined serif step numerals (B/desktop-1, B/mobile-2) carry a newspaper/digest concept through the whole page, so it feels designed for this product. The feature section in B/desktop-2 earns its space with real mini-visuals: a revenue-vs-volume bar chart and a "same ask, many phrasings" fold-down. The social proof in B/desktop-3 is strong, with a large pull quote, highlighted figures, stats and a logo row. A is bolder and arguably more memorable, and its "one line of the digest, taken apart" annotated breakdown (A/desktop-2) is the single best idea on either page. But A has visible craft defects. The yellow highlight block in the hero headline crowds and clips the white "Stop reading tickets." line above it, so the descenders of "reading" collide with the box (A/desktop-0, A/mobile-0). The A/B/C callout badges sit on top of "94 tickets" and truncate it to "94 ticke" on both desktop and mobile (A/desktop-2, A/mobile-3). A's pricing has no recommended tier, and its three identical outlined buttons weaken the decision. B's pricing highlights the Team tier ("Most teams", yellow card) and offers a free tier. On mobile, B reflows cleanly: the sample card stacks numbers under each item and the pricing cards are readable. A's mobile is solid apart from the overlap bugs carried over from desktop.
> BIGGEST FLAW OF WINNER: The warm cream, serif and accent-highlight editorial palette, while well executed, is a fairly familiar "tasteful indie SaaS" look, and its hero card's skewed rotation slightly softens the crispness of the data.
> BIGGEST FLAW OF LOSER: Overlap defects in the most important places (the hero headline highlight crowding the first line, and the annotation badges covering "94 tickets") make A look unfinished despite its strong concept.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because its cream-paper, Fraunces-style serif, mono eyebrow labels and yellow-underline-highlight formula is a now-common generated "editorial" house style, while A's electric blue and yellow neo-brutalist treatment and annotated digest anatomy feel less templated.

**sonnet judge: picked baseline**

> WINNER: B
> REASONING: B's hero is clean and clear: a large serif headline "Your customers already told you what to build" with a highlighted italic phrase, one dark primary button, and a tilted "Relay Weekly" sample digest card (desktop-0) that shows the product's output right away. A's hero headline has a visible defect. In desktop-0 and mobile-0, "Stop reading tickets." collides with the yellow highlight blocks, and the descenders and line tops overlap, so the main promise looks broken. A's "taken apart" annotated digest (desktop-2, mobile-3) also has defects: the A-F callout bubbles cover the "94 tickets" text, which is clipped to "94 ticke". B keeps one editorial system throughout: a newsletter "Vol. 1 Monday edition" strip, mono eyebrows, a ticket-phrase marquee, and Fraunces/Inter type. The cream, ink, red and yellow palette feels made for a digest product. B's feature section (desktop-2) uses small demos, including a revenue-vs-volume bar chart and messy phrasings folding into one request, which are more informative than A's. B's social proof (desktop-3) has a pull quote, avatar cards, big stats and a logo row. Its pricing has a highlighted middle tier, and its FAQ shows an open answer. A is bold neo-brutalist blue and yellow with strong contrast, and its FAQ and pricing are tidy. But its heavy black headings and offset shadows feel more like a familiar style, and its desktop sections have large empty areas on the right. B's mobile layouts (mobile-0 through mobile-6) stack cleanly with comfortable spacing. A's mobile has the same hero overlap and the same clipped callout bubbles.
> BIGGEST FLAW OF WINNER: The marquee strip and the stacked, near-identical bordered cards in "How it works" and "What's inside" lean on a trendy editorial-startup template, and the "How it works" numerals are faint outline glyphs.
> BIGGEST FLAW OF LOSER: The hero headline's lines and yellow highlight blocks overlap and clip each other on both desktop and mobile, and the callout bubbles on the annotated digest cover its text.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because the warm cream palette, serif display headline, mono eyebrows and ticker strip are the current default "editorial" house style, whereas A's saturated blue and yellow brutalism is rarer for a B2B tool, even with its bugs.

#### 05-docs-page

**opus judge: picked skill**

> WINNER: A
> 
> REASONING: A comes across as a designed product. The black-on-yellow identity carries through the logo, the active nav item, the outline highlight and the gotcha callouts (desktop-0, desktop-2), and the very heavy H1 with ruled section dividers makes the long page easy to scan. It also covers the brief more fully: a "Find a token" filter with a 25-token count sits above the table (desktop-3); there are two clear, high-contrast gotchas (day/month order and MM vs mm, desktop-2 and desktop-4); there is a separate "Store ISO, display local" tip (desktop-5); and the prev/next cards are large and well balanced. Its table has a "Works in" column showing parse/format support and real example values, which suits this audience. On mobile, A restacks each token row into token, output, meaning and "Works in" (mobile-3, mobile-4), so nothing is lost. B is clean and competent (desktop-0): a filter box in the nav, a scrollspy outline, a tidy grouped token table with tinted token chips (desktop-2). But it is a generic dark docs theme with little product character. B also has small craft slips. The inline comments in the code blocks don't line up (desktop-2: "// true (rolled over)" runs right to the block edge, and the format() comments are misaligned). The prev/next cards are wider than the content column (desktop-4). Its mobile table drops the Example column completely (mobile-2, mobile-3). B does have the stronger mobile header, with Menu plus a collapsible "On this page" (mobile-0), but A has the same pattern. Overall, A serves both reading and finding better and looks more considered.
> 
> BIGGEST FLAW OF WINNER: The table text has stray spaces before punctuation throughout ("Four-digit year .", "Hour , 24-hour clock ,", "parse , format" in desktop-3 and mobile-4), and the outline highlights "Handling invalid input" while the page is still at the top (desktop-0), so the text looks broken and the scrollspy is wrong.
> 
> BIGGEST FLAW OF LOSER: It is a familiar dark docs template with no identity of its own, and on mobile it quietly drops the Example column from the token table.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. Its near-black palette, blue accent, uppercase small-caps nav labels, rounded bordered cards and amber left-border callout are the default dark docs look that generated pages tend to reach for.

**sonnet judge: picked skill**

> WINNER: B
> 
> REASONING: B reads as a designed product, while A reads as a dark docs template. In B desktop-0, the heavy black rule above the huge grotesque H1, the yellow active-nav block and the "Applies to / Reading time / Updated" meta strip give it a clear identity and a strong hierarchy. Its code blocks (desktop-0, desktop-1) have a full-height Copy button and a sharp black panel, and they are easy to spot while scrolling. B's Gotcha callouts (desktop-2 and desktop-4) are loud yellow boxes with a warning icon, which is the right weight for a gotcha. B's token table (desktop-3, desktop-4) is the most useful part of either page: it has a "Find a token" filter, a 25-token count, grouped sections, a "Works in parse/format" column, and a 14-Mar-2027 example for every token. On mobile B collapses the table into stacked rows (mobile-3 to mobile-5) that stay readable, and its Menu button and "On this page" disclosure are clear. A is clean and competent, but it is the familiar GitHub-dark docs look with a blue accent and a low-contrast outline (desktop-0). Its token table is fine (desktop-2), but it has fewer columns and no search. On mobile A's code blocks clip with no visible scroll cue (mobile-0, mobile-1), and its token table drops the Example column entirely (mobile-2, mobile-3). A's gotcha callout is a muted brown box that is easy to skim past.
> 
> BIGGEST FLAW OF WINNER: The "On this page" outline and the sidebar sub-nav both show "Handling invalid input" as active on the very first screen (desktop-0), which looks like a scroll-spy bug, and the token table's grey panel breaks out of the content column.
> 
> BIGGEST FLAW OF LOSER: It is a generic dark GitHub-style docs template with low-contrast secondary text, a muted gotcha callout, and a token table that loses its Example column on mobile.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A. It uses the stock dark-slate, blue-accent docs layout with a filter box and a collapsed "On this page" disclosure, and it has no distinctive typographic or colour idea.

#### 07-mobile-app-screen

**opus judge: picked skill (close)**

> WINNER: B (close)
> REASONING: B has a clear concept for Tally. In B/desktop-0 the streak card is a sprout under a glass dome, the progress bar reads "2 of 5 sown today", and the Today tab icon is a seedling, so the gardening idea runs through the whole screen and doesn't feel like a skin. B's type has real character: a heavy grotesk for "Today" and the huge "11", with a warm serif for the secondary lines ("Finish all 5 today to make it 12.", "10 day run"). The per-habit colour coding (blue water, rust book, green walk) in B/mobile-0 makes the list easy to scan, and each habit's own run count adds useful information. B's week strip (B/desktop-0) shows day names, dates, partial rings for Thu and Sat, and a boxed Sat cell, so it says more than A's row of identical solid checks. A is very clean and well spaced. A/mobile-0 shows all five habits above the tab bar, the dark streak card with its 40% ring is legible, and the tinted rows for completed habits are a nice touch. But A is the familiar wellness-app look: a forest-green and cream palette, a "Good morning" serif heading, a dark hero card with a progress ring, and green check circles. It would pass for almost any habit app. B does pay for its hero: in B/mobile-0 only three habits are fully visible and the fourth is clipped by the tab bar. "Today: 2 of 5 habits done." also repeats the card's "2 of 5 sown today". On balance, B feels like a product with a point of view, while A feels like a polished template.
> BIGGEST FLAW OF WINNER: The tall streak hero and the extra week-summary line push the habit list low, so at 375 wide only three habits are visible before the tab bar cuts off the fourth.
> BIGGEST FLAW OF LOSER: It is generic: the dark card with a progress ring, the green check circles and the cream "Good morning" layout give Tally no identity of its own.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its muted green and cream palette, "Good morning" serif greeting, dark hero card with a progress ring and uniform rounded habit cards are the standard default layout for this kind of brief.

**sonnet judge: picked skill (close)**

> WINNER: B (close)
> REASONING: B has a clear concept that fits the product. The streak card uses a terrarium dome with a sprout, "2 of 5 sown today" wording, and five segmented progress pills, so the habit-growing idea carries through the whole screen. The type pairing is bold and distinctive: heavy sans for "Today" and the large "11", with a serif for supporting copy. The habit rows use individually coloured icon circles (blue, rust, green) and hairline dividers, which gives it a confident editorial feel (desktop-0). The week strip in B shows partial-progress rings for each day with full weekday labels and dates, so Thursday's incomplete state is readable at a glance (mobile-0). A is polished but reads as a familiar wellness-app template. It has a dark card with a progress ring, a pale green palette, and card-style rows with generic outline icons. A's hierarchy is clear and its week strip is clean, but the streak card has a faint orange glow and the "12 days" number competes with the 40% ring. In A's mobile-0 the fifth habit is fully visible above the tab bar. In B's mobile-0 and desktop-0 the next row is cut off behind the tab bar, which is normal scrolling but loses a bit of content on first view. B's tab bar has an active pill and only three tabs, which is easy to tap. A has four tabs and looks more standard. The Sunday cell and the "Today: 2 of 5 habits done." line in B are slightly redundant.
> BIGGEST FLAW OF WINNER: The "Today: 2 of 5 habits done." serif line under the week strip repeats the streak card's progress, and the habit list is cramped, with only two and a half rows visible above the tab bar on first view.
> BIGGEST FLAW OF LOSER: The design is a generic dark-green wellness-app template, and the streak card carries two competing focal points (the 40% ring and the large "12 days").
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because the dark green hero card with a progress ring and a soft glow, the rounded white cards and the standard icon tab bar are the usual habit-app template look.

### Round 2 re-run (01, 07)

#### 01-saas-landing

**opus judge: picked skill (close)**

> WINNER: A (close)
> 
> REASONING: Both use the same editorial idea (cream paper, heavy serif, yellow highlighter, a sample digest card in the hero), so the decision came down to restraint against template habits. A's hero (A/desktop-0) has one promise and one action: an email field plus "Send me a sample digest". Its digest card uses real-looking evidence (ticket #48213, "9 on annual plans over $20k", ranked bars), which speaks directly to PMs at 50-500 person companies. A's dark green "how it works" band (A/desktop-1, A/desktop-2) is its best section: each step has a small piece of product UI ("Connected/Synced" rows, a grouped "Bulk export (41)" bucket with a struck-through "not a request" line, an email header that says "Mon 8:00"), so it shows the product instead of describing it. The features (A/desktop-2) are set as an editorial two-column ledger ("Ranked by money, not by noise", "Bugs kept out of the roadmap"), which reads well and avoids the usual card grid. Pricing (A/desktop-3) puts the plans in one continuous band with the middle tier flooded yellow, which is bolder than B's three boxed cards. B is the more complete conversion page: it has a CTA in the nav, a closing red CTA band (B/desktop-5), and a stat row with a logo wall (B/desktop-3). Its "Counts you can argue with. Quotes you can't." bento grid with revenue-vs-volume bars (B/desktop-2) is also strong. But B relies on familiar devices: mono uppercase eyebrows on every section, a scrolling quote marquee, a tilted card with a "SAMPLE" stamp, offset-shadow buttons, avatar initials, a three-stat row, a "MOST TEAMS" badge and green checkmark lists. On mobile both stack cleanly with no clipping. B's mobile nav keeps a visible CTA (B/mobile-0), while A's mobile header spends two lines on tagline text above the headline (A/mobile-0). A is the more considered design for this specific product, though B would probably convert slightly better as built.
> 
> BIGGEST FLAW OF WINNER: A gives the user no persistent or closing call to action (no nav button and no final CTA band), and its feature and FAQ sections leave a large empty left column on desktop (A/desktop-2, A/desktop-4).
> 
> BIGGEST FLAW OF LOSER: B piles on stock landing-page devices (marquee, mono eyebrows, stat trio, logo wall, badge-plus-checkmark pricing cards), so despite good copy it reads as a polished house style rather than a design made for Relay.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because it uses the full kit of current AI-landing-page devices (ticker marquee, monospace section eyebrows, tilted "SAMPLE" stamp, offset-shadow buttons, three big stats plus a fake logo row, "MOST TEAMS" badge).

**sonnet judge: picked baseline (close)**

> WINNER: B (close)
> REASONING: B's hero (desktop-0) gives one clear promise, "Your customers already told you what to build", with a single dark primary button, a secondary link and a tilted sample-digest card. The card carries real ranked asks, counts and quotes, and the quote ticker below it reinforces the "what customers are asking" idea. B's sections each have their own visual device. The how-it-works section uses three numbered cards with helpdesk chips. The features section (desktop-2) has a revenue bar chart and a "same ask, many phrasings" demo. Social proof (desktop-3) combines a pull quote, two avatar cards, a stat row and logos. Pricing is three cards with a clearly lifted yellow "Most teams" tier. The FAQ has one item open, and the page ends on a red CTA band and a dark footer. On mobile, B stacks cleanly: the nav CTA stays in the header, the hero card follows the button, and the pricing cards are full width with no clipping (mobile-4, mobile-5). A is strong and more austere. Its heavy serif hero and ink-offset digest card are confident. However, the "R elay" logo has a visible gap in every screenshot, and the five-line hero headline is stacked and ragged. The how-it-works block (desktop-1, desktop-2) is dense text on dark green with no visual hierarchy beyond three columns. The features section leaves a large empty area under its left heading. A's mobile pushes the digest card below the fold (mobile-0), the nav drops to only Pricing and FAQ with no CTA, and the page has no closing CTA. A's pricing and testimonial work is good, but B reads as the more finished, scannable and complete page.
> BIGGEST FLAW OF WINNER: The cream, yellow and red palette with a Fraunces serif, mono eyebrow labels, bordered cards and a tilted sticker is a recognisable editorial house style, so the distinctiveness is polished but not unusual.
> BIGGEST FLAW OF LOSER: The logo renders with a gap ("R elay") and the hero headline breaks into five ragged lines, which makes A's first screen and brand mark look unrefined, and the page has no closing CTA.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because its uniform bordered feature cards, mono uppercase eyebrows, tilted "SAMPLE" sticker, ticker strip, avatar-initial testimonials, tiered cards with a highlighted middle plan and final CTA band follow the standard generated landing-page template, while A's dense typographic layout is less formulaic.

#### 07-mobile-app-screen

**opus judge: picked baseline (close)**

> WINNER: A (close)
> REASONING: A's desktop-0 reads as a calm, finished product. The cream frame, a dark hero card that pairs the 40% "2 of 5" progress ring with a large serif "12 days" streak, and a quiet "Today's habits / 3 left" header give a clear top-to-bottom order. Its done states work well: completed rows (Drink 2L water, Morning run) turn a soft mint with filled green checks and a light strikethrough, so they stay readable while clearly marked done. In mobile-0, A's week strip with filled checks for M–F and an outlined "31" for today is easy to scan. The tab bar (Today/Habits/Stats/Profile) and home indicator make it feel like a native app. B (desktop-0, mobile-0) is the more distinctive of the two. It uses a chunky neo-brutalist style with hard drop shadows, a sprout illustration in the streak card, tinted icon tiles per habit and a "2 of 6" progress bar, and it does have personality. But B's mustard-on-mustard palette is heavy and lowers contrast around the cards. The thick black strikethrough on "Drink 2 L of water" and "Read 20 minutes" makes completed items harder to read. B's sprout panel is mostly empty green space, so the streak card feels lopsided. B's data also contradicts itself: in the week strip, Wednesday 28 is only partly complete, yet the streak says 11 days. A's numbers agree with each other (5 full days, 12-day streak, 2 of 5 done today), and its type and spacing are more refined throughout. That makes A the safer screen to ship, even though B is the bolder concept.
> BIGGEST FLAW OF WINNER: It is close to a familiar "premium wellness app" template (dark hero card, progress ring, serif greeting, cream background), so it lacks a memorable identity for Tally.
> BIGGEST FLAW OF LOSER: The heavy mustard palette and thick black strikethroughs hurt contrast and readability, and the partial day on 28 in the week strip conflicts with the 11-day streak.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because the dark rounded hero card with a progress ring, the serif "Good morning" over a muted cream background, and the mint check-off rows are a very common generated "polished wellness app" look.

**sonnet judge: picked skill (close)**

> WINNER: B (close)
> REASONING: B has a point of view for a habit tracker. In desktop-0 and mobile-0 the "11 days" numeral is huge and chunky, and a small sprout illustration sits beside it, so the streak reads first and fits the product. The hard-shadowed cream cards, thick outlines and per-habit colour tiles (blue water, yellow book, coral run, green stretch) make habits quick to scan and feel like a deliberate system. The "2 of 6" label with a progress bar under "Today's habits" gives live progress a clear home. B's week strip shows dates and distinct states: filled, partial ring on the 28th, a ringed today, and a dashed future day. That tells the story of the week better than A's strip. A is cleaner and very polished: the dark green streak card with a progress ring, the serif "Good morning", and mint-tinted completed rows are all well crafted (mobile-0). But that dark card with a glow, serif greeting, pastel rounded cards and monochrome green icons is the familiar premium-wellness template. A's week strip is just identical green check circles with no dates, which carries less information. In A the "Saturday 31" ring looks slightly broken at its edge, and the streak card is busy with ring, number and copy competing. B's mobile view has a four-row-plus-peek list, with the next row cut off by the tab bar as a scroll cue. A shows five habits, with the fifth partly cut off by the tab bar. B's tab bar has a clear filled active pill, though only three tabs.
> BIGGEST FLAW OF WINNER: The sprout illustration is cropped awkwardly in the right panel of the streak card, with the soil cut off, and the tan-on-tan palette is heavy and slightly muddy.
> BIGGEST FLAW OF LOSER: A reads as a generic dark-green, serif, pastel-card wellness template, and its week strip is a row of identical check circles with no dates or partial states.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because the dark gradient hero card with a glow, serif headline, soft rounded cards and sage-green palette are the default polished "AI app" look.

### Round 2 re-run (05)

#### 05-docs-page

**opus judge: picked skill**

> WINNER: B
> REASONING: B treats this as a page built for reading. The tightly tracked display headline, numbered section markers (01–06) and full-width black rules make the structure easy to scan (desktop-0, desktop-2), and its Overview puts the whole API in one sentence and one code block before the detail. B's token table is the most useful thing on either page. It has its own filter box with a "21 tokens" count, a "locale" tag on tokens that change by locale, and monospaced examples, all built on one stated reference date (desktop-3, desktop-4). B also keeps all three table columns on mobile (mobile-3, mobile-4), while A drops the Example column at 375 wide (mobile-2, mobile-3). B's gotcha callouts use a hard red rule with a mono label like "GOTCHA: MM IS NOT MM", and they sit right where the mistake happens (desktop-2, desktop-4), so they feel specific to the content. A's single amber callout looks like a generic admonition (A desktop-0). A is competent and readable. It has a breadcrumb, a nested nested left nav, an outline, and a grouped token table on GitHub-dark surfaces. But it looks like a default docs template, and it has a visible defect: in the Strict mode block, the "(rolled over)" comment runs into the right edge of the code box (A desktop-2). On A's prev/next row, the two cards extend past the right edge of the content column (A desktop-4). On mobile, both pages clip long code lines at the right edge. B's mobile also has a clear bordered "On this page" box and a prev/next row split by a rule (mobile-0, mobile-5).
> BIGGEST FLAW OF WINNER: At the top of the page, B's on-this-page outline highlights "Format tokens" rather than "Overview" (desktop-0), which tells the reader they are somewhere they are not.
> BIGGEST FLAW OF LOSER: A looks like an off-the-shelf GitHub-dark docs theme with nothing particular to Quill, and its code-comment overflow and misaligned prev/next cards undercut its polish.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A. Its dark slate-and-blue palette, rounded cards, amber warning box and standard three-column docs layout look like the default an AI produces for "documentation page."

**sonnet judge: picked skill**

> WINNER: A
> 
> REASONING: A reads as a designed page for this product. It has heavy black rules, red mono eyebrows ("GUIDES · DATES"), a tight display-weight title, and red numbered section markers (01 to 06) that make the page easy to scan (desktop-0, desktop-1). Its left nav has clear START / DATES / REFERENCE / MORE groups with a strong active row. The right outline nests sub-sections and marks the current one with a red bar (desktop-0). Its token table is the most useful part of either page. It has a "Filter tokens" input, a "21 tokens" count, grouped rows (Year, Month, Day, Time, Zone and epoch), and small "locale" badges. It also carries an Example column that survives at 375px (desktop-3, mobile-3, mobile-4). A has two red-bordered gotcha callouts with mono labels, and a bordered prev/next block (desktop-5). B is clean and competent, but it is a familiar dark GitHub/Docusaurus-style template with rounded cards, blue links and an amber callout (desktop-0, desktop-4). Its tokens table is plain. On mobile it drops the Example column entirely (mobile-3), which loses information in the most reference-like section. B does have nice touches, such as the "On this page" disclosure and the heading anchors (mobile-0). A's mobile "Menu" button and "On this page" box are also fine, and both pages clip long code lines at 375px. Overall A is more distinctive, has more reading and finding features, and has better hierarchy.
> 
> BIGGEST FLAW OF WINNER: The heavy black rules, tight tracking on huge headings and the stark white page give it a somewhat harsh look, and the page lacks a dark mode and has some tight heading letter-spacing.
> 
> BIGGEST FLAW OF LOSER: It looks like a generic dark documentation template, and its mobile token table silently drops the Example column.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because the dark-grey GitHub-style palette, rounded cards, blue accent links and amber warning callout are the default house style for generated docs pages.

