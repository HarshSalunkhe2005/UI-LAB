# Phase 5b: enforcement and cuts, then the re-eval

Run 2026-10-31. The skill was rebuilt (commit `bc62955`), installed from the built `release/ui-lab.zip` into a scratch folder, and every run below used that install with the same discovery-style prompt as Phase 5 (the agent sees only the name and description). Sonnet builders, one Opus and one Sonnet blind judge per pair, A/B randomised per judge, same judge prompt as Phase 2. A pair is a skill win only if both judges pick the skill; a split is a tie; "non-loss" means win or tie. Baselines are the same pages as Phase 5 (the free-run baseline for 01).

## Scoreboard

**The acceptance bar was NOT met.** Bar: 01 and 07 each at least 2 of 3 non-losses, with every gate passing on every run.

| Brief | Run a | Run b | Run c | Non-losses | Bar (2 of 3) |
|---|---|---|---|---|---|
| 01 SaaS landing | LOSS (both close) | LOSS (Sonnet close) | TIE (both close) | **1 of 3** | **FAIL** |
| 07 mobile app | LOSS (both close) | WIN (both close) | TIE (both close) | **2 of 3** | pass |
| 06 e-commerce (control, one run) | WIN (both close) | | | 1 of 1 | no regression |

- **Gates: met.** All 7 skill runs pass all 7 gates (7/7) on the final probe, and `verify.mjs` agrees with the old harness on every page I cross-checked. Phase 5's gate failures were agents skipping the check; with one command, nobody skipped it.
- **Every agent ran `verify.mjs`** (2 to 10 invocations each, from the transcripts). Only 2 of 7 also ran `audit-ui.mjs` by hand, which is fine: `verify.mjs` runs the audit itself and all 7 audits are 0 critical, 0 warning, with 2 suggestions on one run.
- **Diversity on 01: not fixed.** Similarity 4 of 5, "one direction in three costumes" (same as Phase 5 round 0). Details below.
- Variance is high. The same skill and prompt gave 01 a loss, a loss and a tie, and 07 a loss, a win and a tie. Treat any single-run result in this report, including the 06 win, as a sample, not a measurement.

## What changed in the package (items 1 to 4)

1. **`scripts/verify.mjs`, one command for Gate 5.** Runs the audit, renders the page in a local Chrome or Edge at 1440 and in a true 375 px frame, measures the 7 gates, saves up to 12 slices per width to `design/verify/`, writes `design/verify.md` with the real numbers and a link to the fix for each failed gate, and exits 1 on a failure (2 when there is no browser, with a loud "NOT RENDERED" warning). No dependencies and no network: it drives the browser by command-line flags, not the debugging protocol.
2. **Inline pattern table in Gate 4**: 12 situations, 12 patterns. The other 20 patterns were moved out of the package to `skill/extras/patterns/` (kept in the repo, not shipped). `patterns-index.md` is no longer generated.
3. **`references/fixes.md`** replaces `bugs.md` and `verify.md`: one section per gate (the script links to it), then the solved-problems catalogue. Accessibility shrank to a one-page appendix of what the script cannot see. `teardowns.md` and `glossary.md` left the package (`skill/extras/references/`). The essentials of type, colour and motion are now in `world-index.md`, which 9 of 10 runs read.
4. **Convergence rule**: a cream or off-white ground with a serif display voice now needs a line of evidence from the brief, like keeping a house style. The random roll stays.

Source files in the skill went from 83 to 61. The typical Build token budget is **unchanged, about 14.6k tokens**: the cut files were never on the typical path, so this saved package size (and noise), not tokens. I did not fold `typography.md`, `color.md` and `motion.md` into every world file as proposed (see "Where I deviated").

Tests: `npm test` (15), `npm run skill:test` (validator 32, worlds 49, skill content 11, audit 58, verify 5) are green. New tests: the validator's narrow process-start allowance (it passes only for `scripts/verify.mjs`), `verify.mjs` on a good and a bad page (exit codes and named failures), and content checks that every packaged pattern is named in the Gate 4 table and every gate has a section in `fixes.md`.

## Why 01 still loses, and what the enforcement did and did not fix

The mechanical half worked. The judged half did not move, and the transcripts show why.

- **The script is run; the slices are not read.** Slices produced vs slices opened by the agent: 01 a 2 of 10, b 4 of 16, c 2 of 13; 07 a, b, c 2 of 2 each; 06 2 of 17. Every 01 and 06 agent said in its own report that it had not looked at the lower sections. The manual rows at the bottom of the log were left blank in all 7.
- **The defects the judges named are exactly the ones in the unopened slices:** a hero headline whose highlight breaks mid-phrase, a stats block stranded in half a yellow band, a before/after table that wraps to one word per line at 375, a digest table whose ARR values sit under the row numbers, an unreadable chip. None is something `verify.mjs` measures. Those are what separate "passes every gate" from "a reviewer would ship it".
- **Other judged flaws are taste, not defects:** on 01 the judges again call the skill's cream and serif editorial pages "more typical AI" in some pairs, and the neo-brutalist and Swiss runs "tiring" or "loud". No single style wins; the baseline wins on finish.

Recommendation (Phase 5c, not done): make the unread-slice problem mechanical, as the gate problem was. Two candidates: (a) add three more gates to the probe that catch these defect classes (a text block of more than about 5 words that wraps to fewer than 1.5 words a line at 375, a table cell under about 60 px wide, a band where one half of a two-column row holds under about 15% of the content), and (b) have `verify.mjs` build a contact sheet of the slices and refuse to exit 0 until the log's per-slice rows are filled in (cheap to fake, but it forces the agent to open the images). I would do (a) first.

## Diversity, brief 01 (three runs, fresh judge)

Key resolved after judging: X is run b, Y is run c, Z is run a.

| | Phase 5 round 0 | Phase 5 round 1 | Now |
|---|---|---|---|
| Similarity (1 to 5) | 4 | 3.5 | **4** |
| Verdict | one direction in three costumes | two directions | **one direction in three costumes** |

The three runs rolled different families and picked different worlds: a Broadsheet (Paper and Print), b Neo-Brutalist Print (Loud and Graphic), c Swiss Grid and Data Poster (Instrument and Spec). So the roll and the family rule do change the world. What stayed the same, per the judge: off-white ground with near-black ink in all three, a highlighter-marker accent (yellow or lime) in all three, a mock of the weekly digest card as the hero in all three with the same ranked-row anatomy, the same reassurance line under the CTA, the same four nav items in the same order, and a square "R" tile logo. Only c's giant "412 to 9" opener counted as a different idea.

Diagnosis: some of that is the brief (the product is a digest, so the digest card is the obvious hero), and some is the skill's own residue: all three runs interpreted "different world" as a new colour and type skin on the same layout. The agents also used judgement to skip families ("nothing fits a PM tool" for families 2, 4 and 5 in two runs), which weakens the roll. A rule that fixes this is structural, not prose: for example the direction card must name a layout grammar that differs from "headline left, product card right", and the verify script could flag two first screens that share that skeleton. I did not attempt it.

## Pattern and reference use (7 runs on the new package)

| File | Runs opening it |
|---|---|
| SKILL.md, references/anti-slop.md, references/world-index.md | 7 of 7 |
| scripts/verify.mjs | 7 of 7 (run) |
| a world file | 7 of 7 (worlds 1, 4, 6, 7, 12 and 15 across the runs) |
| patterns/pricing-plain.html | 3 of 7 (all three 01 runs) |
| patterns/faq-details.html | 2 of 7 |
| patterns/product-gallery.html | 1 of 7 (the 06 run) |
| templates/brief.md | 1 of 7 |
| references/fixes.md | 0 of 7 (no gate ever failed in a way that sent the agent there; the script's output named the fix inline) |

- Patterns were opened in 4 of 7 runs, against 1 of 10 in Phase 5. The inline table is what changed that. Pricing and FAQ are the two most-used; the other ten patterns were not reachable on these briefs (no table, form, toast or docs outline).
- `fixes.md` was never opened, so the "gate X failed, see fixes.md" link has not been exercised by a real failure yet.

## Where I deviated from the proposal, and why

- **Log file name.** The script writes `design/verify.md` (the name Gate 5, the handoff template and the earlier runs already use), not `design/verify-log.md`. One name, no migration.
- **Browser flags, not DevTools.** The package validator (the same checks the marketplace listing will face) forbids process starts, WebSocket and fetch in a package script. A script that starts a browser needs the first. I added a narrow allowance for exactly one file, `scripts/verify.mjs`, tested to stay closed for any other script, and avoided the other two by using command-line flags (`--dump-dom`, `--screenshot`, `--enable-logging`) instead of the debugging protocol. This is a real trade-off: the lite package has no scripts (so no `verify.mjs`) and a marketplace reviewer will see one script that starts a process. Worth a decision before the Agensi listing.
- **Colour, type and motion references not folded per world.** The three files are only read at a gate that routes to them, so they cost nothing unless opened. I put the shared essentials in `world-index.md` (read by 9 of 10 runs) instead of adding 24 near-identical blocks. If you want them cut from the package, it is a small follow-up.
- **`teardowns.md` and `glossary.md` left the package; `briefs.md` and `site-types.md` stayed**, because SKILL.md routes to them at Gate 1.
- **Two fixes landed while the re-eval was running**, applied to both the source and the installed copy: a separate browser profile per run (two agents verifying at once shared one profile and one got "measurement did not come back"; one agent reported it), a retry when no measurement returns, and the slice cap raised from 8 to 12 (a 01 page is about 9 screens at 375). Neither changes guidance. Run a and c of 01 had been started before them.

## Caveats

- n=1 per cell and the same two judge models; Sonnet judges Sonnet-built pages. A run-to-run spread of loss, loss and tie on the same prompt shows how noisy a single pair is.
- The control is one run. A win on 06 is evidence of no big regression, not proof.
- The judge marked its pick "close" on 11 of the 12 votes on 01 and 07, so most pairs are near coin-flips.
- Five Impeccable hook findings (cramped padding, cream palette, side-tab border) point at four packaged patterns I did not edit this phase (`toc-scrollspy`, `pricing-plain`, `product-gallery`, `form-field-errors`). They are marked attribution unknown; I left them for you to decide.
- Agents' own reports said things like "verification passed" while also saying they had not looked at most slices; I used the transcripts, the files and my re-runs for every number here.

## Appendix: judges' verbatim reasoning

Each block is the judge's final reply from its transcript; A and B are the judge's own letters, resolved against the key in the "picked" line. Round labels: r4a (run a, briefs 01 and 07), r4b (run b, brief 01), r4b7 (run b, brief 07), r4c (run c, briefs 01 and 07), r4ctl (control, brief 06).


### Run a (r4a)

#### 01-saas-landing

**opus judge: picked baseline (close)**

> WINNER: A (close)
> 
> REASONING: A's hero (desktop-0) has the clearer hierarchy. The three-line serif headline, with "what to build." set in italic on a yellow highlight, gives the promise in one beat. The single dark CTA with an offset red shadow is the obvious action, and the tilted "Relay Weekly" card with its "SAMPLE" stamp shows the actual product (ranked asks, counts, deltas, verbatim quotes) at a glance. The editorial "VOL. 1 — MONDAY EDITION" strap and the quote marquee band match the idea of a Monday newspaper for PMs, so the look feels made for this product. A's feature section (desktop-2) shows the product's value instead of only describing it: the revenue-vs-volume bar chart ($38k vs $210k) and the "same ask, many phrasings" collapse into a yellow "Export to CSV · 94 customers" row are both strong for PMs. In social proof (desktop-3), the large pull-quote with highlighted "61 tickets and $210k of renewals" plus the stat row is well paced. The dark pricing band (desktop-4), with a free tier and a clearly lifted "Most teams" card, scans fast. B has the more substantive how-it-works (desktop-2): real ticket snippets with highlighted phrases, then the grouped "Bulk export" card, then the email subject. Its definition-list features with small evidence callouts are also less template-like. But B's hero headline runs to four lines, and the highlight boxes break awkwardly across "Relay / reads it for you.", which muddies the main promise. On desktop-3, B's two stats ("4 hrs to 20 min" wrapping onto two lines, "11 min") sit stranded in the left half of the yellow band with a big empty right side. On mobile, both hold up. A's stacked cards (mobile-1 to mobile-6) are clean and roomy. B's digest header wraps clumsily ("Week of 19 / Oct", "1,284 tickets / read" on mobile-1), and the stats block again feels unfinished on mobile-5. Overall, A is the more finished and confident piece, while B has the better product storytelling in the middle.
> 
> BIGGEST FLAW OF WINNER: A leans on familiar landing-page tropes (scrolling quote marquee, bento feature grid, three-stat row, fake logo wall, offset-shadow neo-brutalist buttons), so beyond its strong hero it partly reads like a house style.
> 
> BIGGEST FLAW OF LOSER: B's hero headline overloads two ideas into four lines, with highlight boxes breaking mid-phrase, and its stats block ends up stranded and half-empty in the yellow band, so the top and the proof section look less resolved than the rest.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its Fraunces-plus-Inter cream/red/yellow pairing, marquee strip, bento cards, stat trio and placeholder logo wall are the recognizable patterns of the current generated-landing-page house style, while B swaps them for a definition-list feature section and in-context ticket artefacts.

**sonnet judge: picked baseline (close)**

> WINNER: A (close)
> 
> REASONING: A has the more distinctive concept, a Monday newspaper-edition idea. A/desktop-0 shows a mono "VOL. 1 — MONDAY EDITION" strip, a slightly tilted digest card with a hard shadow and a "SAMPLE" stamp, and a dark ticker of real customer phrasings. The headline mixes bold Fraunces-style serif with a yellow-highlighted italic "what to build." Those details are hard to mistake for a generic AI-tool template. The hero in A has one clear primary CTA plus a quiet secondary link. The sample digest is credible and scannable, with ranked items, counts and trend arrows. A/desktop-2 backs this up with a feature section that shows real mechanisms: revenue-weighted bars next to ticket counts, and messy phrasings merging into "Export to CSV · 94 customers". A/desktop-3 and A/desktop-4 have strong social proof (a pull quote with a highlighted figure, avatar cards, big stats, a logo row). Pricing sits on a dark band with the middle "Team" tier in yellow, and the FAQ is a tidy two-column layout. The warm cream, ink, red and yellow palette is cohesive and a bit editorial. A's mobile (mobile-0 to mobile-5) stacks cleanly. The only wrinkle is that the sample card falls below the first mobile screen. B is also polished and sensible. Its hero card with progress bars (B/desktop-0) and its dark-green "from ticket to page" section with ticket, group and email panels (B/desktop-1, B/desktop-2) are good. However, B's hero headline wraps its yellow highlight awkwardly ("Relay / reads it for you."). Its social-proof block on a full yellow slab (B/desktop-3) has a lopsided stats row that leaves the right half empty, and "4 hrs to 20 min" wraps badly. B's FAQ heading breaks across the desktop-4/desktop-5 slice boundary and leaves a large empty left column, and its feature section has a big dead area on the left (B/desktop-2, B/desktop-3). B's pricing and FAQ are more generic. A has the more memorable identity and fewer layout flaws.
> 
> BIGGEST FLAW OF WINNER: The "What's inside" feature grid is a bit boxy and repetitive (heavy bordered cards), and on mobile the hero's sample digest card sits below the fold, so the first screen is text only (A/mobile-0).
> 
> BIGGEST FLAW OF LOSER: B has several visible layout weaknesses: the lopsided yellow testimonial/stats slab with an awkward "4 hrs to 20 min" wrap and an empty right half, the clumsy highlight wrap in the headline, and a large dead left column beside the feature list and FAQ.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. It follows the familiar big-serif-headline, dark-green-panel, yellow-accent and pill-toggle-pricing SaaS pattern, and it has fewer product-specific touches than A's newspaper-edition conceit.

#### 07-mobile-app-screen

**opus judge: picked baseline (close)**

> WINNER: A (close)
> REASONING: A covers every part of the brief clearly. In A/mobile-0, the dark streak card puts the 40% "2 of 5" progress ring next to the 12-day streak, so both live values the toggle updates are in one place. A's week strip (A/desktop-0) uses filled green checks for Monday to Friday, an outlined "31" for today with a partial progress arc, and a faded "1" for tomorrow, so the history matches the streak at a glance. The habit list shows a mixed state, with "Drink 2L water" and "Morning run" struck through on a tinted card and the others empty. That previews the toggle behaviour without any interaction, and "3 left" agrees with the ring. A's typography is well built: a serif "Good morning" and "12", a clean sans for list items, even 70px rows, and five habits visible above the tab bar at 375 (A/mobile-0). B is bolder and more distinctive. The coral header, the huge "11" with its flame and the navy tab bar in B/desktop-0 feel more like a branded consumer app. But B's week strip shows Monday to Friday as hollow coral rings, which look like "not done" next to an 11-day streak. That is a real misreading for a habit tracker. B's hero block also takes up nearly 40% of the mobile screen (B/mobile-0), so only three habits fit above the tab bar, and a fourth card is cut off behind it. B's "0 of 6" empty ring makes the first view feel inert rather than showing progress.
> BIGGEST FLAW OF WINNER: The cream, deep green and serif "wellness" palette is safe and familiar, so A looks polished but not especially ownable for a brand called Tally.
> BIGGEST FLAW OF LOSER: The week strip shows past days as hollow rings that read as missed, which contradicts the 11-day streak and weakens the screen's core message.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its muted cream and forest-green palette with a serif greeting, a dark gradient hero card and pastel icon tiles is a very common generated "calm wellness app" house style, while B makes a riskier, more specific colour and type choice.

**sonnet judge: picked baseline (close)**

> WINNER: B (close)
> REASONING: B's desktop-0 shows a calm, considered system: cream background, deep green hero card with a progress ring ("40%, 2 of 5") beside "12 days" in a serif numeral, and a "Good morning" serif headline. Together these read as a product with a voice, not a template. The week strip in B uses filled green check circles for completed days, with today ringed and tomorrow faded. That reads at a glance, while A's strip uses tiny orange rings that are hard to tell apart. B also demos the interaction state: two habits are checked and struck through with a tinted card, so the live toggle is visible in the screenshot. B's mobile-0 and mobile-1 show five habits fully visible above a clean tab bar with label text, and the tab bar does not cut into any card. A is bolder and has a distinctive coral and navy palette with a huge "11" streak numeral. But in A's desktop-0 and mobile-0, the third habit card is clipped by the dark tab bar after only three habits. The hero block is tall and heavy, and it pushes the actual task list down. A's "0 of 6" progress pill and the empty ring look dead because nothing is checked, so it feels less like an app in use. A's navy tab bar is a nice touch, and its flame icon is charming but crude. B's hierarchy is clearer: greeting, then streak and progress, then week, then habits. Its phone frame with a dynamic island and home indicator adds app-like polish.
> BIGGEST FLAW OF WINNER: The dark hero card has a muddy brown glow in its upper right corner that looks slightly smudged, and the streak and ring are crowded into one card, so the 40% ring competes with the 12-day number.
> BIGGEST FLAW OF LOSER: The oversized coral hero takes up nearly half the first screen, so only about two and a half habits are visible before the tab bar clips the third card, and the tiny orange week-strip rings carry little information.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because the cream and forest-green palette, serif display headline, "Good morning" greeting and dark gradient stat card with a soft glow are a very familiar generated "wellness app" house style. A's saturated coral and navy chunky look is less of a default.

### Run b, brief 01 (r4b)

#### 01-saas-landing

**opus judge: picked baseline**

> WINNER: A
> 
> REASONING: A commits to a "Monday edition" newspaper idea and carries it all the way through: the mono "VOL. 1 — MONDAY EDITION" strip, the large Fraunces-style serif hero with "what to build." in italic on a highlighter bar, and a tilted digest card stamped "SAMPLE" (desktop-0). It feels made for this product, and it suits PMs who read a weekly email. The feature section (desktop-2) shows the product's value instead of describing it: the revenue-vs-volume bar chart ($38k vs $210k at stake) and the messy phrasings folding into "Export to CSV · 94 customers" are the clearest product explanations on either page. Social proof in A (desktop-3) has a good hierarchy: one large pull quote with highlighted numbers, two smaller quotes, a row of stats and a logo row. Pricing goes on a dark band with a yellow featured tier (desktop-3/4). The type pairing and the cream/red/yellow palette stay consistent all the way to the red closing CTA (desktop-5). A's mobile pages are clean: the digest card restacks so the counts sit under each item, pricing cards stack well, and I saw no clipping (mobile-1, mobile-5, mobile-6). B is bold and confident too: its lime/electric-blue neo-brutalist look, the email-capture hero, the "What stops being your job" before/after table (desktop-2) and the persona-named pricing tiers are all smart. But B has a clear mobile defect: in the before/after table, the struck-through "Before" text is squeezed into a column about one word wide, so it stacks one word per line (mobile-3, mobile-4), and "With Relay:" runs into the text after it with no space. B's lime highlight blocks in the hero are also uneven, with ragged right edges behind each line (desktop-0).
> 
> BIGGEST FLAW OF WINNER: The 3-up how-it-works and 5-card feature grid sit inside heavy equal-weight bordered boxes, so once you scroll past the hero the middle of the page gets a bit uniform and boxy.
> 
> BIGGEST FLAW OF LOSER: On mobile, the before/after table breaks: the "Before" text wraps one word per line in a very narrow column, so the section is long, broken-looking and hard to read (mobile-3, mobile-4).
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. Neo-brutalist hard drop shadows, lime-and-electric-blue blocks and an all-heavy grotesk are a house style that has become common, whereas A's editorial newspaper idea is specific to a weekly digest.

**sonnet judge: picked baseline (close)**

> WINNER: B (close)
> 
> REASONING: B reads as a considered editorial product for PMs. The serif headline "Your customers already told you what to build" has a yellow-highlighted italic, and the tilted "SAMPLE" digest card (B desktop-0) shows quotes, counts and deltas. The black ticker of real customer phrasings under the hero is a smart touch. The page stays disciplined: cream, ink, one red and one yellow accent. The mono eyebrows, outlined step numerals (desktop-1) and a features section with a revenue-weighted bar mini-chart and a "can i get this as excel" folding demo (desktop-2) make features concrete. Social proof is the strongest of the two, with a pull quote, highlighted "$210k of renewals", stats and a logo row (desktop-3). Pricing is a clear three-tier layout on dark with the middle tier highlighted, and the FAQ and red CTA band close the page cleanly (desktop-4/5). A's hero (desktop-0) is bold: a neo-brutalist lime highlight, a hard-shadow digest card and a blue band. But its saturated blue, lime and heavy grotesque on every section feels loud and monotonous for a 50-500 person PM audience. A's before/after table also breaks on mobile (mobile-2/3). The struck-through "Before" text wraps one word per line in a narrow column, so each row is a tall, ugly stack. A's mobile hero also pushes the digest card below the fold, and the "Talk to us" tier price is oversized (mobile-5). B's mobile holds up: the sample card is in view by the first scroll (mobile-1), the cards stack cleanly and nothing is clipped.
> 
> BIGGEST FLAW OF WINNER: It leans on a familiar warm-cream-plus-serif "editorial" house style, and the long stack of bordered boxes makes the feature and how-it-works sections feel a bit samey.
> 
> BIGGEST FLAW OF LOSER: The mobile before/after comparison collapses into a one-word-per-line strikethrough column (A mobile-2/3), a clear visible defect, and the loud blue/lime/black palette is tiring over the whole page.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A. The neon-lime highlighter, hard offset-shadow boxes and saturated blue sections are the stock neo-brutalist "make it not look like AI" template. B's tilted newsletter card, ticker of real customer phrasings and serif voice feel more specific to the product.

### Run b, brief 07 (r4b7)

#### 07-mobile-app-screen

**opus judge: picked skill (close)**

> WINNER: A (close)
> REASONING: A has a real point of view for a habit tracker. In desktop-0 and mobile-0, the arched sunset illustration with sprouting plants, the "Days growing / 11 in a row" hero and the "Sow today" section header turn streaks into a growing garden, so it feels made for Tally rather than reskinned. Its hierarchy is strong. The heavy black "Today" title, the oversized "11", and the ink-outlined cream cards on a warm tan background read as a cohesive retro-print system. The habit list (mobile-0) scans well: big check circles on the left, per-habit "10 DAYS / 11 DAYS" streak counts on the right, and a segmented "2 of 5" pill meter that shows progress at a glance. The week strip uses filled, half-filled (29, 31) and dashed (1) states, so partial and future days are both easy to read. B (desktop-0, mobile-0) is clean and competent. It has a dark streak card with a 40% ring, a flame plus "12 days", a check-filled week strip, soft icon tiles on its habit cards and a light tab bar with a home indicator, and it fits all five habits above the tab bar on mobile-0. But B is the familiar wellness-app house style: muted sage green, a serif greeting, rounded white cards and a blurry orange glow blob in the hero card. Nothing in it is specific to this product. Both read as apps rather than web pages, with notch, status bar and fixed tab bar. A's warmer craft and distinctiveness edge out B's slightly smoother polish.
> BIGGEST FLAW OF WINNER: The dark tab bar cuts the "One DSA problem" row in half on desktop-0 and leaves the fifth habit hidden on mobile-0, and the heavy strikethrough over the bold titles of checked habits looks clumsy and hurts legibility.
> BIGGEST FLAW OF LOSER: It is a generic sage-and-cream template with a decorative glow blob and nothing to identify it as Tally, and its "alive." widow in the desktop-0 streak card shows weak text fitting.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because its muted green palette, serif "Good morning" over a dark gradient hero card with a progress ring and glow, and uniform rounded icon-tile list cards are the stock look of generated wellness-app screens.

**sonnet judge: picked skill (close)**

> WINNER: A (close)
> REASONING: A is a considered design for this product. Its garden metaphor shows up in the arched sunrise-and-sprouts illustration (A desktop-0), the "Days growing" streak label, "Sow today" and the Garden tab. Its terracotta, forest green and cream palette is distinctive and uses very strong type: a heavy grotesque "11" and "Today" paired with a serif secondary line. The hierarchy is clear in A mobile-0. The big streak numeral leads, then the week strip with its filled, half-filled and dashed-future day states, then the habit list with a 2-of-5 segmented progress bar. Each habit row has a large, easy-to-hit check circle and a per-habit day count on the right, which makes the rows scannable. A's dark tab bar with a green underline on Today reads as native app chrome. B is clean and competent (B mobile-0). It has a dark streak card with a 40% ring, a tidy week strip, icon tiles in the habit cards, and all five habits visible on a 375px screen. But it is the familiar polished-wellness-app template: dark green hero card with a glow, serif greeting, rounded white cards, pastel icon tiles and a pill tab bar. On desktop (B desktop-0) the home-indicator bar also sits on top of the tab labels, a minor defect. The greeting says "Good morning" while the status bar reads 9:41, which is a small coherence lapse. A's weaknesses are density and fit. At 375px the streak card is tall, so only about 3.5 habits are visible above the tab bar, and the fourth row is cut off. The "Sow 2 more to make it 12" copy is slightly odd. Even so, A's craft and identity outweigh B's better above-the-fold content.
> BIGGEST FLAW OF WINNER: The tall streak card and week card push the habit list down, so the fourth habit is clipped and the fifth is hidden behind the tab bar on first view, which weakens the core check-off task.
> BIGGEST FLAW OF LOSER: It is a generic wellness-app template (dark hero card with a glow, serif greeting, rounded white cards with pastel icon tiles) with little that is specific to Tally.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because its dark green gradient hero card, serif-plus-sans pairing, pastel icon tiles and soft rounded cards are the stock premium-wellness look.

### Run c (r4c)

#### 01-saas-landing

**opus judge: picked baseline (close)**

> WINNER: A (close)
> REASONING: A's "Monday edition" newspaper idea runs through the whole page: the masthead strip "VOL. 1 — MONDAY EDITION" and the tilted "RELAY WEEKLY" sample card with its SAMPLE stamp (desktop-0) show the product before any copy explains it. That suits PMs who live in their inbox. Its hierarchy is clean and easy to scan. The hero has one dark primary button plus a quiet text link. How-it-works is three numbered panels (desktop-1/2). The feature grid has small built-in demos, a revenue-vs-volume bar chart and a phrasings-collapse stack (desktop-2). Social proof is a big highlighted quote with stats and logos (desktop-3), and pricing sits on a dark band with a yellow "MOST TEAMS" tier that stands out clearly (desktop-4). It is the only candidate where I saw every required section, including a full four-column footer (desktop-5). B has the stronger opening hook: the "412 → 9" hero in acid-lime (desktop-0) is memorable and on-message. But its digest table has a defect. The "ARR asking" column header sits over account counts, while the $412k/$288k ARR values wrap under the row numbers on the left (desktop-1). B's "Group" step also has an unreadable lime "61" chip (desktop-2, mobile-3). B's pricing gives both paid tiers the same "Start free" button, and no footer appears in either desktop-5 or mobile-6, so the brief's footer requirement is unconfirmed at best. On mobile, A reflows well: the sample card stacks its counts under each item (mobile-1) and the pricing cards stay roomy (mobile-5/6). B's mobile digest quietly drops the ARR column (mobile-1/2), and B's two-column section headers leave large empty right halves on desktop (desktop-2/3).
> BIGGEST FLAW OF WINNER: The cream paper, serif display type and yellow highlighter-swipe palette is a well-worn "editorial indie SaaS" look, so A is less distinctive than its concept deserves.
> BIGGEST FLAW OF LOSER: The hero's sample digest table is broken: the ARR values sit under the row numbers instead of in the "ARR asking" column, and that undercuts the "every number is trustworthy" pitch right where it matters most.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because cream background plus Fraunces-style serif, yellow highlight underline, mono eyebrow labels and boxed card grids is a currently common generated aesthetic, while B's huge numeric hero and lime-on-black grid feel more like one specific art-directed choice.

**sonnet judge: picked skill (close)**

> WINNER: A (close)
> 
> REASONING: A's desktop-0 and desktop-1 open with a huge "412 → 9" lockup (tickets read versus distinct asks). Under it sits a headline, "Every Monday, the nine things customers actually asked for", and a ranked digest table. It shows the product's output before the reader scrolls, and few tools in this category open that way. The ink, acid-lime and paper palette, hairline grid and tight grotesque suit PMs and feel considered rather than templated. desktop-2 handles how it works well. Three rows (Connect, Group, Deliver) each pair a headline with a concrete artifact, including real ticket IDs and quotes collapsing into one line. desktop-3 turns the feature section into a scannable ruled list, and the lime testimonial slab gives the page a strong rhythm. The pricing cards, FAQ and closing CTA in desktop-3 to desktop-5 are clean. A's mobile-0 to mobile-6 stack without overlap and the digest table reflows sensibly. B (desktop-0 to desktop-5) is very polished and complete: the headline, tilted "SAMPLE" digest card, ticker, "what's inside" bento and pricing are all competent. But the cream paper, Fraunces-style serif, terracotta and mustard, mono eyebrows and offset-shadow buttons are the current "warm editorial AI landing" look. A's flaws are real but smaller than B's sameness. The hero email form falls below the fold on desktop-0, the ARR column in the table wraps awkwardly, and there is a dead right-hand area beside the 412 → 9 lockup. I found the choice close because B is the safer, more cleanly executed page.
> 
> BIGGEST FLAW OF WINNER: The hero's primary action (email field) is cut off at the bottom of the first desktop screen, and the digest table's ARR column wraps awkwardly beneath each request title, which looks unfinished.
> 
> BIGGEST FLAW OF LOSER: B reads as a familiar cream, serif and terracotta editorial template, so it is polished but not clearly distinct from other recent "considered" SaaS pages.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because its cream background, display serif with italic yellow-highlighted phrase, mono small-caps eyebrows, tilted sample card, "most teams" yellow pricing card and red CTA band are the stock tasteful-AI-editorial recipe.

#### 07-mobile-app-screen

**opus judge: picked baseline (close)**

> WINNER: A (close)
> REASONING: A is clean and has no visible defects. In desktop-0 the device frame is centred on a warm neutral backdrop, and the dark streak card puts a progress ring ("40%, 2 of 5") next to a large serif "12 days" with a flame, so streak and progress read in one glance. The week strip in A (desktop-0, mobile-0) is simple and correct: Monday to Friday are filled checks, Saturday the 31st has a partial progress ring, and Sunday shows "1" for November 1. A's habit list shows the toggle states, with completed rows tinted mint, struck through, and given a filled green check (Drink 2L water, Morning run), while open rows have empty circles. The 1-of-5 check-off model is easy to understand. In mobile-0 the cards fill the width with comfortable 20px gutters, and the four-tab bar with the active green "Today" feels native. B is the more distinctive, brand-led concept: the yellow brutalist streak card, the tilted "4 TO LOCK DAY" sticker, the six-segment tally bar and the hard offset shadows (desktop-0, mobile-0) suit the name "Tally". But B has visible correctness and finish problems. Its week strip labels Sunday "32" instead of 1, the giant outlined "TALLY" wordmark is clipped off the top-left of the desktop canvas, and the red active-tab indicator overlaps the last habit card above the tab bar (desktop-0 and mobile-0). B also opens at 0/6 with every box empty, so the screenshots don't show any checked-off state, and its monospace subtitles ("Bottle by the desk") are small and low-contrast on mobile.
> BIGGEST FLAW OF WINNER: A is well made but close to a stock wellness-app template (dark hero card, progress ring, green checks, cream cards), so it has little identity specific to Tally.
> BIGGEST FLAW OF LOSER: B's week strip shows an impossible date, "32", after Sat 31 Oct, which is a correctness bug a reviewer would notice right away on a screen built around dates and streaks.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its serif greeting, dark gradient stat card with a ring and mint-checked rounded cards are the default "calm habit app" look, while B commits to an unusual brutalist tally aesthetic.

**sonnet judge: picked skill (close)**

> WINNER: B (close)
> REASONING: B reads as a considered design for a product called "Tally", while A reads as a stock wellness-app template. In B's desktop-0 and mobile-0 the tally idea runs through the whole screen. The "DONE TODAY 0/6" row has six segmented boxes, the "4 TO LOCK DAY" sticker is tilted, and the week strip uses per-day fill bars, with a hatched Thursday and a dashed outlined future day. The "TAP TO TALLY" label and the large outlined "TALLY" wordmark in the desktop frame reinforce that idea. B's hierarchy is strong. The giant "12" on the yellow card sits above small mono labels, and its hard-shadow cards, heavy borders, orange offset shadow and tab-bar indicator give it a strong, consistent voice. A is clean and well crafted: the serif "Good morning", the dark streak card with its 40% ring, and the green checked rows are readable. A's mobile-0 also shows five habits above the tab bar, against B's three. But A's cream/forest-green palette, rounded cards and ring progress are the familiar habit-app look and show little point of view. A has a minor craft slip. The Sunday circle is pale, and the Saturday ring has a stray green arc at its right edge. B has real defects. The week strip ends on "32" for a Sunday after Saturday 31 Oct, which is a visible logic error. B's tab-bar active indicator also sits oddly, as a red slab that bleeds up into the last habit card in desktop-0 and mobile-0. Even so, B is the one a reviewer would remember and ship after fixing the date.
> BIGGEST FLAW OF WINNER: The week strip shows "32" for the day after 31 Oct, and the red tab-bar indicator overlaps the bottom edge of the habit list.
> BIGGEST FLAW OF LOSER: A looks like a generic green wellness-app template with no visual idea tied to "Tally", and the stray ring arc on the Saturday dot looks slightly off.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its warm cream and forest-green palette, serif greeting, dark hero card with a progress ring and soft rounded cards are the default polished habit-app look.

### Control, brief 06 (r4ctl)

#### 06-ecommerce-product-page

**opus judge: picked skill (close)**

> WINNER: A (close)
> 
> REASONING: A's first screen (desktop-0) has a clear point of view. The heavy condensed "ATLAS 38" headline, the orange gallery stage with a ghosted "ATLAS" wordmark behind the navy bag, and the "Harbourline" orange/navy palette feel designed for this product, not pulled from a template. The buy box in A desktop-1 is well ordered: colour pills with names, back-panel sizes with cm ranges and a fit note, then quantity plus a strong orange "Add to bag", a green dated ship promise ("ships in 2 days, by Monday 2 Nov") and three trust icons. A's "What's in the bag" (desktop-2, mobile-3) is the strongest single section on either page. The dark band, numbered cutaway illustration and the zone list with litre values read cleanly, and it adds an "In the box" note. A's reviews (desktop-3) include an honest 3-star review and a fit slider, and its shipping block splits Delivery / Duties and tax / Returns into crisp tables, with Returns inverted for emphasis. That answers the trust brief directly. B is clean and competent and adds useful trust items (payment chips in desktop-1, an FAQ accordion in desktop-4), but it has more visible defects. On mobile (mobile-0) the "Airline carry-on approved" badge covers the top of the bag illustration. Its bag-zone diagram (desktop-2) has overlapping, crowded boxes ("3 Laptop" sits inside "1 Main", and the side "5" pockets cut through the outline), and the zone list floats with dead space above it. Its shipping cards (desktop-3/4) also end at uneven heights with empty bottoms. On mobile, A keeps title, rating and price above the gallery and both pages use a sticky add-to-cart bar, but A's specs, zones and shipping tables reflow more legibly (A mobile-2, mobile-5).
> 
> BIGGEST FLAW OF WINNER: The all-caps condensed display headings ("KEY SPECS", "SHIPPING & RETURNS") are shouty and repeated on every section, so the page feels louder and less premium than its careful content deserves.
> 
> BIGGEST FLAW OF LOSER: The bag-zone diagram is cluttered, with labels and compartments overlapping, and the trust badge covers the bag on the mobile hero; both look unpolished on a page meant to feel trustworthy.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because the serif-headline-plus-Inter body, muted green CTA, icon-bullet trust list, payment-chip row, three equal icon cards and FAQ accordion follow the stock DTC Shopify-style product-page template almost point for point.

**sonnet judge: picked skill (close)**

> WINNER: A (close)
> REASONING: A has a clear point of view. In A's desktop-0 and desktop-1 the condensed display type for "ATLAS 38" and the big terracotta hero panel with a ghosted "ATLAS" wordmark make the bag the focus. The navy backpack against orange has strong contrast, and the colour swatches, size pills and rust "Add to bag" button are easy to find. The dark "What's in the bag" section (A desktop-2) has a numbered cutaway whose callouts match the litre-labelled list. Its numbers are legible and nothing in it overlaps. The key specs mix big display numerals (38 L, 1.38 kg, 16", 10 yr) with a clean table, which reads faster than B's plain boxes. The reviews (A desktop-3) have a star distribution and a fit meter, and one review is a 3-star "heavier than it looks". That makes the page more believable. On mobile (A mobile-0 to mobile-6) the sticky price and Add bar works, the dark and cream sections alternate well, and the sections stay readable. B (desktop-0 to desktop-4) is also solid, with an easy-to-use buy box, a payment-badge row and an FAQ accordion. But its cream, serif-headline, forest-green look is the standard "sustainable DTC" template, and its gallery has a big shield badge. In B's mobile-0 that badge covers the top of the bag illustration, and in B's desktop-2 the "What's in the bag" diagram has the side "5" pockets overlapping the main zone. B's gallery also has weaker contrast, with a navy bag on pale grey.
> BIGGEST FLAW OF WINNER: The mobile sticky "Add to bag" bar sits over the Colour selector area in the mobile screenshots and duplicates the in-page button. The desktop "What's in the bag" section also leaves the orange cutaway oddly placed beside a long list.
> BIGGEST FLAW OF LOSER: The "Airline carry-on approved" shield badge is huge, and on mobile it covers the top of the bag illustration. Together with the generic cream, serif and green styling, this makes the hero feel templated and weak.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. Its serif headings, soft cream background, forest-green accent, rounded white cards, trust-badge row and "Pairs well with" cards are the default look for a sustainable DTC page.

