# Phase 2 mini-eval: skill vs plain agent

Date: 2026-10-30. Briefs: 01 SaaS landing, 02 analytics dashboard, 08 redesign of the generic fixture.
Skill under test: `release/ui-lab.zip` (unpacked at `release/stage/pro/ui-lab/`), built from `skill/ui-lab/` at the Phase 2 commit; round 2 used the iterated SKILL.md (see below).

## Setup

- **Arms.** One Sonnet subagent per brief per arm, same environment as Phase 0 (design-lint PostToolUse hook from the impeccable plugin active for every arm; the repo `CLAUDE.md` attached to context). Exact prompts: `evals/prompts.md`.
- **Baseline arm = "baseline-free".** The Phase 0 baselines for 01 and 02 were told "do not run anything else", so they could not render or verify. That favours the skill arm, so all three baselines were re-run without that restriction ("build it the way you normally would, and check it however you normally would"). Phase 0 outputs are kept in `runs/baseline/`; the judge compared against `runs/baseline-free/`.
- **Skill arm.** Told the skill is installed and applies, given its folder, told to read SKILL.md first and load references only when its table says, and not to read other repo folders. Outputs in `runs/skill-r1/` and `runs/skill-r2/`, with each run's `design/` artifacts beside the page.
- **Judge.** A fresh Opus subagent per pair that sees the brief text and screenshots only: first-screen shots plus native-scale slices at 1440 and 375, assigned to A and B by a random draw, neutral file names, no access to source or to the answer key. (08 also got screenshots of the original page.) The key is `evals/results/phase2-judge-key.json`, written after the verdicts were in.
- **Mechanical gates** (`evals/gates.mjs` on `shoot.mjs` output): console clean at both widths; no horizontal overflow at 375; no interactive element under 44px at 375 (inline text links exempt); one `h1` and a `main` landmark; a `prefers-reduced-motion` rule; a focus style; no overlapping text boxes at either width. Collision hits are candidates; I checked the one that fired (a wrapped inline element, a false positive; the probe now compares per-line rects).

## Result

| Brief | Round | Winner (blind) | Margin | Skill gates | Baseline gates |
|---|---|---|---|---|---|
| 01 SaaS landing | 1 | **Baseline** | close | 7/7 (after probe fix) | 6/7 (13 targets under 44px at 375) |
| 02 Dashboard | 1 | **Skill** | clear | 7/7 | 4/7 (13 small targets, no `h1` or `main`, no reduced-motion rule) |
| 08 Redesign | 1 | **Skill** | clear | 7/7 | 6/7 (5 small targets) |
| 01 SaaS landing | 2 (SKILL.md iterated) | **Skill** | close | 7/7 | 6/7 |

Net after one iteration: **skill preferred on 3 of 3**, and **all skill runs pass all 7 gates** while every baseline run fails at least one. Round 1 on its own was 2 of 3.

## What was changed between rounds

Diagnosis of the round-1 loss on 01 (judge: skill page "too muted", "weak section contrast", "reads like a competent docs page") plus a pattern across all three round-1 skill runs: **they converged on one new house style** (cool grey/paper ground, ink plus a single vermilion accent, a grotesque with IBM Plex Mono labels, a "ledger" metaphor with hairline rules, left-aligned hero with a product fragment). The anti-slop alternatives menu had become the default.

Edits (SKILL.md Gates 2 and 5, `references/anti-slop.md`, `templates/direction-card.md`):
1. Gate 2 now requires **two candidate directions** that differ from each other, then a pick with a reason ("diverge, then pick").
2. Gate 2 adds **"different is not enough, it must be stronger"**: name the boldest visual element on the first screen and at least two places where the page changes rhythm (ground, density or scale). Restraint is a choice to spend on purpose.
3. Gate 5 check 10 adds a squint test for uniform, flat pages.
4. anti-slop gains **section D: defaults this procedure itself produces** (the grey + vermilion + mono + ledger recipe, austerity as the whole idea), with alternatives.

Round 2 on 01 changed direction visibly: a yellow highlighter ground, deep-green and coral bands, a heavy grotesque with a text-face numeral style, no mono, and a "collapsing tickets" hero object. Its direction card names candidate 2 as "rejected: D3/D5 territory, a ledger metaphor with hairlines", so the new section was read and used.

## Judge reports (verbatim)

Key for each: which letter was which arm.

### 01 SaaS landing, round 1. A = baseline, B = skill. Winner A (baseline)

> WINNER: A (close)
>
> REASONING: A commits to a "Monday edition" newsletter concept and carries it through the whole page. The masthead strip ("VOL. 1 — MONDAY EDITION / WRITTEN BY YOUR TICKETS"), the tilted sample digest card with its red SAMPLE stamp, and the quote marquee (desktop-0) together tell a PM what the product is before they read a word. Its hierarchy is the stronger of the two. The serif headline with the yellow-highlighted "what to build." lands the promise, and every section has a mono kicker plus a punchy serif H2 ("Counts you can argue with. Quotes you can't.", desktop-2), which makes the page easy to scan. The feature section shows the product instead of describing it: a volume-vs-revenue bar chart and a "same ask, many phrasings" collapse into "Export to CSV · 94 customers" (desktop-2) explain the core value better than any copy. Social proof is layered well: a large pull quote with a highlighted dollar figure, two smaller quotes, a stat row and a logo wall (desktop-3). The dark pricing band then gives a clear rhythm change with the yellow featured tier (desktop-3/4). B has the more intellectually honest content design. Its timeline of "All week / Sunday night / Monday, 8:00" with ticket artifacts (desktop-1/2) and the feature table with a "What it does not do" column (desktop-2) are excellent for skeptical PMs, and its mobile reflow of that table into stacked cards (mobile-3/4) is careful work. But B's visual layer is flat. Grey background, one grotesk, thin rules and boxed lists make the pricing and FAQ (desktop-3/4) read like a competent docs page rather than a marketing page. There is also little contrast between sections, so the page blurs together on scroll. Both mobile versions are clean with no clipping. A keeps more personality at 375 (mobile-1, mobile-5), while B's hero digest is well stacked (mobile-1).
>
> BIGGEST FLAW OF WINNER: The cream paper, Fraunces serif, highlighter and hard offset-shadow kit is applied everywhere (buttons, cards, pricing, stamp), so it edges toward costume. The CTA wording also drifts between "Get the first digest" and "Get your first digest free".
>
> BIGGEST FLAW OF LOSER: The visual identity is too muted to carry the strong copy. The all-grey page has weak section contrast and a sparse hero, so it feels generic and forgettable next to its own sharp content.
>
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because warm cream, a Fraunces display serif, a yellow highlighter swipe, a scrolling quote marquee and neo-brutalist offset shadows have become a recognisable house style for "not-generic" AI-built landing pages, even though A executes it well.

### 02 Dashboard, round 1. A = baseline, B = skill. Winner B (skill)

> WINNER: B
>
> REASONING: B puts the 7am question first. In B desktop-0 a red-ruled "Needs attention today (11)" panel sits in the top row next to the hero metric, ranked by passengers affected, and the two cancellations with "118 to rebook" / "74 to rebook" show in red. In A desktop-0 the "Needs attention" list is pushed to the bottom-right below the fold, under five equal-weight KPI tiles and three charts. B's oversized red "88%" with "2 pts below the 90% target" tells you in three seconds that the day is under target. A's "87.6%" is styled exactly like the other four tiles, so nothing stands out. B's charts are more considered. The load bars have a 95% threshold tick and the seats in absolute numbers ("10.8k/15.7k"), the delay chart darkens only its top cause, and the on-time line labels its dip ("76% · fog & wind") and marks today's partial point as hollow (desktop-1). A's charts use a rainbow of category colours that carry no meaning. A's load chart legend shows three colour states, but every bar is the same blue. Its trend chart has a large empty area below it (desktop-1). B's table flags rows needing attention with a red left rule, shows load as inline bars with red over 95% (07:45 at 97%), and adds a planned-versus-actual "Est." column. On mobile, B rebuilds the table as stacked cards with a sort dropdown and a "Needs attention only" toggle (mobile-2 to mobile-4), which work well. A's table at 375 is a clipped scroll box: the Vessel column is cut to "MV" and Load, Delay and Status are off-screen (mobile-2). B's warm paper palette, monospaced times and footnote defining "on time" make it feel built for this operator. A is the dark-navy SaaS template.
>
> BIGGEST FLAW OF WINNER: On mobile, B lists all 56 sailings in one very long column of cards, five or six screens deep, and the "Needs attention only" filter is off by default, so the default view buries the rows that matter.
>
> BIGGEST FLAW OF LOSER: A gives everything equal weight and pushes the "needs attention" list below the fold, so the ops manager can't tell at a glance what to act on, and the 375 table hides the load, delay and status columns.
>
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A. It is the stock dark-navy dashboard: a row of uppercase-labelled KPI cards, cyan accents, rainbow category bars and a soft area line chart, with nothing specific to ferry operations in its visual decisions.

### 08 Redesign, round 1. A = skill, B = baseline. Winner A (skill)

> WINNER: A
>
> REASONING: Both kept the full section order: hero, logos, features, testimonials, pricing, CTA, footer. Both also dropped the original's purple-gradient, centred, card-grid look instead of just recolouring it. A changed the most. Its hero (A/desktop-0) shows a real product moment: an annotated "Checkout conversion" chart marking "Release 4.18 shipped" and "-31% on mobile Safari", with Orbit's written note under it. That makes "AI insights" concrete, where B's orbit-ring graphic (B/desktop-0) is decoration with one floating stat. A's copy is also much more specific. "Six things Orbit does, and what each one saves you" lists features as ruled rows with a red "SSO and audit logs: Enterprise" caveat (A/desktop-2), and "Three plans. The price is the price." sits over a joined three-column pricing table (A/desktop-3). That reads like a considered editorial system with one red accent, tight condensed headlines and strict rules. A's testimonials work well too: pull quotes set large next to small attributions, with a deliberate stagger on Michael Chen. B has real craft. Its serif plus italic-accent headlines ("Know *why* the number moved.", "No *asterisks.*"), the inverted Pro column and the 01/02/03 section labels (B/desktop-1, B/desktop-3) are polished. But together they read like a now-familiar house style. B also has visible defects. "WEEKLY SIGNUPS" is clipped inside the small black circle (B/desktop-0, mobile-1), and on mobile "PRICING PAGE REWRITECONFIDENCE 91%" runs together into one line (B/mobile-1). A's mobile is clean throughout. The hero type reflows sensibly, the logos sit in a 2-column ruled grid and the pricing stacks without collisions (A/mobile-1 to mobile-4).
>
> BIGGEST FLAW OF WINNER: On desktop the hero chart is pushed to the bottom-right, so it leaves a large empty block top-right and gets cut off at the first fold (A/desktop-0). The Pro card's red top bar also knocks its title and price out of line with the other two columns.
>
> BIGGEST FLAW OF LOSER: The hero's central visual is decorative orbit dots instead of anything about the product. Its own label is clipped ("EEKLY SIGNUPS"), and its caption collides on mobile, so the most prominent element is also the most broken.
>
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. Cream background, a high-contrast serif with one italic rust-coloured word in each headline, mono eyebrow labels like "01 / FEATURES" and arrow-suffixed buttons are the stock "tasteful editorial" template many generated pages land on now.

### 01 SaaS landing, round 2 (iterated SKILL.md). A = skill, B = baseline. Winner A (skill)

> WINNER: A (close)
>
> REASONING: A explains the product in the first screen. In desktop-0, three real-looking ticket cards flow by connector arrows into a dark "Week 41 digest" panel with ticket counts, accounts and ARR. A PM gets the input, the transformation and the output before scrolling. The how-it-works sequence in desktop-1/2 keeps that concrete: the helpdesk selector says "90 days imported, 11,962 tickets", the three phrasings merge into "Bulk role assignment", and the Monday 8:00 email mock follows. The annotated digest in desktop-2/3 is the strongest section on either page. It is a real digest with A-D markers, and each marker explains a ranking decision ("Accounts first, tickets second", "Revenue next to every count"), which is exactly the trust argument a PM needs before taking a list into planning. Visually, A commits to a palette of mustard yellow, deep green, coral and near-black, with a heavy grotesk headline. Each section gets its own colour field, so the page scans well, and it doesn't read like a stock SaaS template. Pricing (desktop-4) is three tiers with a yellow middle column and a monthly/yearly toggle, and it is clear and confident. B is polished too. Its hero (desktop-0) has a tilted "Relay Weekly" newsletter card with a SAMPLE stamp, and the revenue-vs-volume bar chart in desktop-2 is a smart feature visual. But it is assembled from a very recognisable kit: Fraunces serif with an italic highlighted phrase, a cream paper background, mono eyebrow labels on every section ("HOW IT WORKS", "WHAT'S INSIDE", "PRICING", "QUESTIONS"), a scrolling quote marquee, offset drop-shadow buttons, a stats row and a fake logo strip (desktop-3). Both pages hold up on mobile. B's mobile pricing cards have cleaner separation (mobile-5/6), while A's three tiers sit flush together with no gap between them (A mobile-5/6), though they stay readable.
>
> BIGGEST FLAW OF WINNER: The coral testimonial band prints "Sample quotes shown as placeholder content for this page." in plain view (desktop-3, mobile-5), so the social-proof section reads as unfinished and can't ship as is.
>
> BIGGEST FLAW OF LOSER: Its look (cream paper, Fraunces, mono eyebrows on every section, marquee, stat row, fake logo wall) is a familiar editorial template, so it misses the brief's main ask to not look like every other AI-tool landing page, even though the craft is good.
>
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. The serif-plus-mono-eyebrow "editorial newsletter" styling, the "3.2 hrs / 412 / 1 in 3" stat row and the italic-logo trust strip are the current default house style of generated landing pages.

## Did the agents follow the gates?

Checked from each run's `design/` folder:
- **Gate 2 table present in every skill run**, with defaults, anti-slop matches, chosen direction and reasons, "5 of 5 axes changed" and a swap-test line. Round-2 01 also wrote two candidates and cited section D.
- **Gate 5 followed in practice.** Every skill agent rendered at 1440 and 375 (one measured 375 in an iframe because its headless screenshot was cropped at that width), ran one fix round and reported what was not tested (keyboard and reduced motion by code reading only, in two runs). All three round-1 runs and the round-2 run pass the mechanical gates; no baseline run does.
- **Baselines rendered less.** The three baseline-free agents each reported partial or no 1440/375 visual checks (one said the shared browser pane switched tabs mid-check), and none produced a verification record.
- **Cost.** Skill arm: 123k to 169k tokens, 24 to 41 tool calls, 3 to 8 minutes per page. Baseline-free: 96k to 108k tokens, 10 to 12 tool calls, 1.5 to 2.6 minutes. So roughly 1.3 to 1.8x tokens and 2 to 5x wall time.

## Honest limits

- **n = 1 per pair, one judge per pair, one judge model.** Two of the four verdicts were "close". This is a signal, not a measurement. The win condition (7 of 8) needs all eight briefs and ideally more than one judge or run per pair.
- **The round-2 win is tuned on the losing brief.** SKILL.md was edited in response to this pair, so round 2 is not an independent test of that edit. The edits are general (two candidates, boldest element, rhythm, section D), but the proper check is the other briefs re-run with the iterated skill (02 and 08 have not been re-run since the edit, and 03 to 07 have never been run).
- **Judges reward richness.** The round-1 judge preferred the baseline's heavier visual identity over the skill's austere page even while calling the baseline "more like a typical AI-generated page". The "typical AI page" answer went against the winner in 3 of 4 verdicts, so the judge prompt's "distinctiveness" criterion is not decisive on its own, and a judge prompt that weights it differently could flip results.
- **The skill arm knew the mechanical checklist.** Passing the gates is partly teaching to the test, which is also what the skill is for; but it means the gates cannot be read as evidence that the skill's pages are better, only that the skill reliably makes agents check.
- **Defects in the winning skill pages** (from the judges, unfixed): the round-2 01 page prints its own placeholder disclaimer on the page ("Sample quotes shown as placeholder content") and its mobile pricing tiers sit flush; round-1 02 lists all 56 sailings on mobile with the attention filter off by default. The first suggests a Gate 6 rule: disclose placeholders in the handoff, not in the shipped UI.
- **Convergence is still a risk.** The round-2 01 page (yellow highlighter, green, coral) is distinct from the round-1 trio, but a single run cannot show that the iterated skill stops all runs landing on the same new look. A cross-run diversity check (several runs of one brief, judged for similarity) belongs in Phase 5.
- **Same environment, not a bare one.** The design-lint hook ran in both arms and the repo `CLAUDE.md` was attached. Both arms saw it, so the comparison is fair, but absolute levels are higher than a bare agent would reach.
