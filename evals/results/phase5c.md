# Phase 5c: layout gates, contact sheets, ground roll, then the re-eval

Run 2026-11-01 (builder resumed after the usage limit). Skill built at commit `57ed491`, installed from the built `release/ui-lab.zip`, and every run used that install with the same discovery-style prompt as Phases 5 and 5b. Sonnet builders, one Opus and one Sonnet blind judge per pair, A/B randomised per judge, same judge prompt as Phase 2. A pair is a skill win only if both judges pick the skill; a split is a tie; "non-loss" is a win or a tie. Baselines are the same pages as Phase 5b.

## Scoreboard

**The acceptance bar was NOT met, and 07 got worse.** Bar: 01 and 07 each at least 2 of 3 non-losses, with all gates passing on every run.

| Brief | Run a | Run b | Run c | Non-losses | Bar (2 of 3) |
|---|---|---|---|---|---|
| 01 SaaS landing | LOSS | TIE (both close) | LOSS (Opus close) | **1 of 3** | **FAIL** (same as 5b) |
| 07 mobile app | TIE (both close) | LOSS | LOSS (both close) | **1 of 3** | **FAIL** (was 2 of 3 in 5b) |
| 06 e-commerce (control, one run) | WIN (both close) | | | 1 of 1 | no regression |

- **Gates: met.** All 7 skill runs pass all 7 gates, and also pass the three new gates (after their own fix rounds, see below). Every agent ran `verify.mjs`.
- **Diversity on 01: not fixed.** Similarity 4 of 5, "one direction in three costumes", the third measurement in a row at 4 or 3.5.
- **Across 5b and 5c together (six runs each, same skill family, same baselines):** 01 has 2 non-losses of 6 (L, L, T, L, T, L), 07 has 3 of 6 (L, W, T, T, L, L). On these two briefs there is no evidence the skill beats plain Sonnet, and on 01 there is evidence it loses. It won all six other briefs in Phase 5 (02, 03, 04, 05, 06, 08) and the control again here.
- As agreed, this is the end of the loop: the next phase proceeds regardless of the score.

## What was built

1. **Three new gates in `verify.mjs`** (the log now has 10, plus labelled review items):
   - **No one-word-per-line wrapping** (a block of 5 or more words that averages under 1.5 words per line, at 1440 and at 375).
   - **Tables fit at 375, cells at least 60 px** (a table wider than the screen outside a scroll wrapper, or a cell with words under 60 px wide).
   - **No headline highlight split across lines at 1440** (a background behind inline text in an h1 to h3 that wraps).
   - **Review items, not gates** (heuristic, labelled with a slice number): a band more than twice as tall as its content, and text lying over an image or figure.
2. **Contact sheets.** `verify.mjs` writes `design/verify/sheet-375.png` and `sheet-1440.png`, every slice tiled small with its number and the headings in it, and ends with "Open these 2 images before writing the handoff". Gate 5 and the handoff template now ask for one concrete thing seen in each sheet.
3. **Ground roll.** After the world is picked, a second roll chooses a ground treatment (light neutral, dark, saturated colour field, tinted mid-tone), limited by a **Grounds** line in every one of the 24 worlds. The direction card has a Rolls line to record both numbers.
4. **A bug found and fixed on the way:** on pages with `scroll-behavior: smooth`, every slice since Phase 5b showed the top of the page (the scroll was still in motion when the picture was taken). That is very likely why agents said they had seen "mostly the top". Fixed; the slices and sheets now show the real sections.

Tests: `npm run build`, `npm test` (15), `npm run skill:test` (validator 32, worlds 49, skill content 12, audit 58, verify 7) are all green.

**Calibration of the new gates** (run on about 20 existing pages before they were wired in): they caught the judged defects they were designed for (b's before/after table at one word per line in 5b; the hero highlight split on 5b's b and on Phase 5's and 5b-round-1's losing 01 pages) and fired on none of the eight pages that had won their judging (02, 03, 04, 05, 06, 07, 08 skill pages). One label-over-svg false positive and three band hits on baseline pages are why the band and overlap checks are review items, not gates.

## Did the enforcement change what the agents did?

Yes for process, not for the judged outcome.

- **The gates fired and were obeyed.** All three 01 agents hit the new wrap gate (a and b on their FAQ heading, c on another block) and fixed it before finishing, and all three finished at PASS.
- **Looking became cheap and everybody looked.** All 7 agents opened the contact sheets (1 to 3 image reads each), against 2 to 4 slices opened out of 10 to 17 in 5b. None opened a single slice, and none filled in the manual rows at the bottom of the log.
- **It did not find the defects the judges then named.** In 01 run a the headline's highlight bar cuts off the line above it, and the desktop footer links wrap one word per line; in run c the black highlight bar collides with the lines above and below. The new highlight gate checks that a highlighted phrase wraps, not that its box overlaps the neighbouring line, and the wrap gate ignores short link text (fewer than five words). On 07 the judged flaws are taste and finish (orphaned words in subtitles, an underlined active tab, heavy outlines, cramped spacing at 375).

## Why the score did not move

- **The baseline wins on finish.** On both briefs the judges' reasons for choosing the baseline are polish: a dark streak card with a progress ring on 07, a cream editorial hero on 01. The skill's pages are more distinctive and more specific to the product, and the judges say so, and then still choose the cleaner page.
- **Distinctive worlds cost craft on short briefs.** All three 07 runs picked World 15 (Seed Packet) and got heavy outlines and tight spacing. On a one-screen app a familiar well-finished template beats an unusual one.
- **Convergence persists.** In 01, runs a and c both chose World 4 (Neo-Brutalist Print), differing only in ground colour (grey, yellow); the diversity judge scored that pair 5 of 5. The ground roll did change the grounds (grey, sage, yellow, where 5b had three off-whites), so that part worked, and the headline idea and the digest-card hero are shared by all three: the judge's verdict is again one direction in three costumes. The agents also use judgement to skip worlds the roll gives them.
- **Noise.** The same prompt and skill give a loss, a tie and a win on one brief in different runs, and 7 of the 12 votes on 01 and 07 were marked close.

## What I would do next (not done)

1. Stop tuning against 01 and 07. Two phases of enforcement have fixed the process failures and produced no judged gain on these briefs; more gates will not close a polish gap that is partly taste.
2. If one more gate is wanted: a highlight box that overlaps the neighbouring line (compare the rectangles of the box with the lines above and below), and wrap detection for short link lists. Both would have caught a named defect in 01.
3. Say in the listing what the evidence supports: the skill wins on specific, dense or structured briefs (dashboard, restaurant, redesign, shop, docs, portfolio) and is not better than plain Sonnet on generic marketing and mobile-app screens.

## Diversity, brief 01 (three runs, fresh judge)

Key resolved after judging: X is run a, Y is run b, Z is run c.

| | 5 round 0 | 5 round 1 | 5b | 5c |
|---|---|---|---|---|
| Similarity (1 to 5) | 4 | 3.5 | 4 | **4** |
| Worlds picked | two receipt-style pages | a cream and cobalt pair | 12, 4, 7 (a, b, c) | 4, 12, 4 (a, b, c) |
| Verdict | one direction | two directions | one direction | **one direction** |

Pairs: X-Y 3, X-Z 5, Y-Z 3. Shared in all three, per the judge: the same headline idea ("your tickets already say what to build next"), a mock weekly digest card in the hero with ranked asks and week-on-week change, a customer quote with a ticket number inside it, the same nav, a "get a sample digest" action, and a tinted full-bleed ground. The part that is the brief's own content (a digest) will always repeat; the part that is the skill's (the layout skeleton, the world choice) still does.

## Process notes and deviations

- Four agents were briefly running at once, once, when I launched two judges together; I held further launches until two finished.
- I did not ask the agents to avoid the review items, and none of the runs hit them.
- The impeccable hook raised findings on some run outputs (contrast, gray on color, clipped overflow); the agents reported them as untriaged or false positives and I left the eval outputs alone, as before.
- Agent reports said "PASS" while saying the manual rows were unfilled; the numbers above come from the transcripts, the files and my own re-runs.

## Appendix: judges' verbatim reasoning

A and B are the judge's own letters, resolved against the key in the "picked" line. Labels: p5ca, p5cb, p5cc are 01 runs a, b, c; p5c7a, p5c7b, p5c7c are 07 runs a, b, c; p5cctl is the 06 control.


### 01 run a (p5ca)

#### 01-saas-landing

**opus judge: picked baseline**

> WINNER: B
> REASONING: B's hero (B/desktop-0) has a headline set in a tight editorial serif with "what to build." in italic over a yellow marker. The sample digest card, with numbered red ranks, counts, trend arrows and a "SAMPLE" stamp, tells a PM exactly what they will get, and the "VOL. 1 — MONDAY EDITION" masthead carries the newsletter idea through the whole page. The scrolling band of real customer questions under the hero, and the "Same ask, many phrasings" card that turns "can i get this as excel" / "download table pls" into "Export to CSV · 94 customers" (B/desktop-2), show the product's core value instead of just stating it. B's social proof (B/desktop-3) is well layered: one large serif pull quote with "$210k of renewals" highlighted, two smaller quotes with avatars, a stats row and a wordmark strip. B's pricing sits on a dark band with a yellow "MOST TEAMS" middle tier (B/desktop-4), and the red closing CTA and four-column footer (B/desktop-5) are clean, with no defects I could find. A has strong content: the before/after rows in "What changes in how you plan" (A/desktop-2) are the best feature framing on either page, and its FAQ answers the right PM objections. But A's craft has visible faults. The lime highlight box behind "build next." cuts off the bottom of "what to" on desktop (A/desktop-0) and of "say" on mobile (A/mobile-0). The footer links are squeezed so tightly that "How it works" and "What you get" wrap one word per line (A/desktop-5). The blue testimonial band (A/desktop-3) shows a lot of empty space next to its three stats. On mobile both stack cleanly, but B's hero reads better at 375 (B/mobile-0), while A's opens on a clipped headline.
> BIGGEST FLAW OF WINNER: The two small quote cards beside the main testimonial and the outlined feature cards lean toward a familiar "warm cream editorial" SaaS look, so the middle of the page is less distinctive than its hero.
> BIGGEST FLAW OF LOSER: The highlight box behind A's hero headline cuts off the lines above it at both desktop and mobile widths, so the first thing a visitor sees has a visible defect.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, narrowly: its cream background, Fraunces-style serif, small red mono eyebrow labels and scrolling quote band are a pattern seen on many recent generated pages, while A's brutalist lime-and-electric-blue look with hard offset shadows is less common, even though it is less polished.

**sonnet judge: picked baseline**

> WINNER: B
> REASONING: B's hero (B desktop-0) lands a clean promise, "Your customers already told you what to build", with an italic serif highlight and one dominant dark CTA. A secondary "See how it works" link sits beside it, and the sample digest card carries a SAMPLE stamp. The "Vol. 1 Monday edition" strip and the ticker of real customer phrasings fit a product that sends a weekly digest, which makes the page feel designed for Relay. A's hero has a visible defect at both widths (A desktop-0, A mobile-0). The "what to" line of the giant headline is cut off by the lime highlight block on "build next", and on mobile "say" is clipped too. A's desktop-1 also shows the hero digest card faded out, which looks like a scroll animation stuck mid-state. B's craft is consistent: Fraunces-style serif headlines, mono eyebrows, a cream, red and yellow palette, and the 94/61/47 numbers plus bar chart in "What's inside" (B desktop-2) show real product content. B's pricing (B desktop-4) uses a dark band with a highlighted yellow Team tier, and its CTA band and footer are tidy. A has strong content ("Before / With Relay" rows, the blue testimonial band), but its loud neo-brutalist styling is heavy and its desktop footer (A desktop-5) is broken. The link columns wrap to "How it works" stacked one word per line and are misaligned under the headings. B's mobile pages stack cleanly with no overlap. A's mobile pricing is acceptable but the Enterprise card (A mobile-5) has an oversized "Talk to us" heading that competes with the tier name.
> BIGGEST FLAW OF WINNER: The testimonial section has real-looking quotes and names, but the fake logo wordmark row and the ticker are small and decorative, so the page's social proof is weaker than it looks.
> BIGGEST FLAW OF LOSER: The hero headline is visibly clipped (lime highlight overlaps the "what to" line, and "say" is cut on mobile), and the footer link columns collapse into misaligned, word-wrapped text.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because the heavy black borders, offset shadows, lime plus electric-blue palette and oversized grotesk headings read as a familiar neo-brutalist template, and it has the visible overlap and footer bugs that go with one.

### 01 run b (p5cb)

#### 01-saas-landing

**opus judge: picked skill (close)**

> WINNER: B (close)
> 
> REASONING: Both pages lean on an editorial "newsletter" idea, but B carries it with more restraint and makes the product itself the hero. In B desktop-0 the digest mock is a real data table (tickets, accounts, change, ARR) with a cited ticket quote, which is exactly what a PM at a 50-500 person company would want to judge. A desktop-0 has an equally strong headline and a charming tilted "SAMPLE" card, but it also piles on a mono edition bar, a yellow highlighter, offset red shadows and a marquee ticker. B's how-it-works (desktop-1/2) pairs each step with a concrete artifact: help desk chips, three phrasings collapsing into "One request: bulk export, 212 tickets / 41 accounts", and the Monday 08:00 email subject. That reads as considered product storytelling, not a set of numbered cards. B's feature section (desktop-3) is a scannable three-column spec table of claim, explanation and evidence, a calmer and more credible format than A's grid of bordered boxes in desktop-2. B's oxblood testimonial band (desktop-3) gives social proof real typographic weight. A's proof section (desktop-3) leans on stock moves: invented stats ("412 product teams", "1 in 3 roadmaps") and a row of fake wordmark logos. On mobile both stack cleanly. B's digest table reflows sensibly by dropping the Accounts column (mobile-1), and its pricing tiers stack as one bordered unit (mobile-4/5). A's mobile is also solid and its hero CTA is stronger (mobile-0). A does deserve credit for a free tier, a closing CTA band (desktop-5) and a cleaner primary action. That is why this is close.
> 
> BIGGEST FLAW OF WINNER: The first feature row in B desktop-2/3 ("Ranked by customers, not by who shouted last") is set much larger than the rows below it and wraps to four lines, which breaks the rhythm of the spec table; the page also lacks a closing CTA before the footer.
> 
> BIGGEST FLAW OF LOSER: A stacks too many decorative tropes (yellow highlighter, offset shadow buttons, mono eyebrows, quote marquee, tilted stamp, fake logo row, round-number stats), so the page feels busy and trend-driven rather than focused on the PM's decision.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because cream paper with Fraunces, a highlighter-underlined italic phrase, mono uppercase eyebrows, neo-brutalist offset shadows, a scrolling quote ticker and a three-stat row is a now-familiar generated "editorial" house style (its footer even says "Set in Fraunces and Inter").

**sonnet judge: picked baseline (close)**

> WINNER: A (close)
> 
> REASONING: A's desktop-0 hero carries a real promise ("Your customers already told you what to build") with a yellow-highlighted italic accent. It has one dominant dark CTA, and a tilted "RELAY WEEKLY" sample card with a SAMPLE stamp that shows the product's output right away. The "VOL. 1 - MONDAY EDITION" strip and the black quote ticker give it a newspaper/digest voice that fits the product, and the cream, red and yellow palette is uncommon for AI-tool pages. In desktop-2, the features section is varied. There is a revenue-vs-volume bar chart and a "same ask, many phrasings" stack that collapses into one yellow result. Both show the product logic instead of just describing it. desktop-3 gives social proof depth: a large pull quote with a highlighted stat, two smaller quotes, a stats row, and logos. desktop-4 has the yellow featured pricing tier with a "MOST TEAMS" tag and a clear price hierarchy, and desktop-5 ends on a strong red CTA band. Mobile for A is solid, with a full-width CTA, stacked numbered steps, and pricing cards that read cleanly. B is also well made. Its sage and forest-green palette, the table-style digest card in desktop-0, and the editorial list of features in desktop-2 are credible and mature. But B is more uniform: the hero CTA is an email field with a small button, the headings are large serif everywhere, and the how-it-works and pricing sections are plainer. B's pricing in desktop-4 gives no visual cue for the recommended tier, and its mobile-4 and mobile-5 pricing cards are stacked flush with cramped borders. The hero preview in mobile-0 also falls below the fold, so A's comparable card looks richer.
> 
> BIGGEST FLAW OF WINNER: The "see how it works" and quote-ticker device plus the offset-shadow, stamp and highlighter flourishes edge toward a trendy neo-brutalist house style, and the how-it-works step numerals are rendered as faint outlined glyphs with weak contrast.
> 
> BIGGEST FLAW OF LOSER: B's pricing section (desktop-4 and mobile-4/5) has no highlighted recommended tier and uses a flat three-box grid with low-contrast sage-on-sage text, so the key conversion section is the least scannable part of the page.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because its large serif headline on a muted tinted background, the evenly weighted editorial sections, and the plain three-column pricing grid follow the now-common "tasteful editorial" template with fewer product-specific visual ideas than A.

### 01 run c (p5cc)

#### 01-saas-landing

**opus judge: picked baseline (close)**

> WINNER: B (close)
> REASONING: B's hero (B/desktop-0) has the clearest hierarchy of the two. The serif headline ends on the highlighted italic "what to build.", there is one dominant dark CTA with a quiet secondary link, and a tilted "Relay Weekly" sample card with a SAMPLE stamp shows the actual product a PM would receive. The newspaper framing ("VOL. 1 — MONDAY EDITION" strip, quote ticker of real-sounding customer asks) suits a weekly digest and reads as considered for PMs. B's feature section (B/desktop-2) earns its space with small proof visuals: revenue-at-stake bars and the "can i get this as excel" phrasings folding into "Export to CSV · 94 customers". Its social proof (B/desktop-3) is complete, with a large highlighted pull quote, two smaller quotes, a stats row and a logo strip. Pricing (B/desktop-4) has a clearly flagged "MOST TEAMS" tier on a dark band, and the red closing CTA band and footer (B/desktop-5) finish the page properly. B's mobile slices stack cleanly with no clipping, and the sample digest and pricing cards stay readable at 375. A is the bolder and more distinctive design: the yellow/black/blue brutalism, the digest table in the hero and the step rows pairing each step with real ticket snippets (A/desktop-2) are strong, and its copy is very specific. But A's hero headline has a visible defect: the black "ALREADY WROTE" band covers the bottom of "YOUR TICKETS" and the top of "YOUR ROADMAP." (A/desktop-0, A/mobile-0). The step tags show stray off-colour letters ("ALL WEEK", "MONDAY" in A/desktop-2). Its layouts also leave big dead areas: the empty left column under the trend chart (A/desktop-3) and the empty right half beside the "11 hrs" stat (A/desktop-4). On mobile, A's "Talk to us" wraps awkwardly at display size (A/mobile-6), and A's mobile slices end at pricing, so its FAQ and footer could not be checked on mobile.
> BIGGEST FLAW OF WINNER: The cream-plus-Fraunces editorial look, with mono eyebrow labels, bento feature cards, a stats row and a logo strip, is a familiar house style that lowers its distinctiveness against the brief's "don't look like every other AI-tool landing page."
> BIGGEST FLAW OF LOSER: The hero headline's black highlight band visibly overlaps and clips the lines above and below it, a craft defect in the most important spot on the page.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because its warm cream background, serif headline with a highlighted italic phrase, small red mono eyebrow labels, bento cards, three-stat row and invented-logo strip match a very common generated "editorial" template, while A's loud brutalist system is rougher but more its own.

**sonnet judge: picked baseline**

> WINNER: A
> 
> REASONING: A turns the product itself into the design idea. The digest is a Monday newspaper edition, with the "VOL. 1 — MONDAY EDITION" strip and a tilted "RELAY WEEKLY" sample card carrying a SAMPLE stamp (desktop-0). The headline "Your customers already told you what to build." has a highlighted italic payoff and a single clear CTA, "Get your first digest free". The mock digest shows ranked items, counts and verbatim quotes, which tells a PM exactly what they will receive. The quote marquee under the hero and the "Counts you can argue with. Quotes you can't." feature section (desktop-2) back this up. That section has a revenue-weighted bar chart and a "same ask, many phrasings" collapsing demo, so the claims are demonstrated rather than listed. Serif display type, mono labels and a restrained cream/ink/red/yellow palette stay consistent from top to bottom. The pricing section is a dark band with a highlighted Team tier, and the red closing CTA and footer read cleanly (desktop-3 to desktop-5). Mobile is tidy, with a single column, an intact sample card and no clipping (mobile-1 to mobile-6). B is bold and memorable but has a visible defect: in the desktop hero (desktop-0 and desktop-1) the black highlight bar on "ALREADY WROTE" collides with the lines above and below. It slices the bottoms of "YOUR TICKETS" and the tops of "YOUR ROADMAP", and the words are stacked too tightly. B also flips between yellow, black, blue and cream bands, and its large empty areas (desktop-5 top, the blue testimonial section) feel less controlled. On mobile B's hero highlight boxes look fragmented (mobile-0).
> 
> BIGGEST FLAW OF WINNER: The three "how it works" cards and the feature cards are text-heavy and visually similar, with large numerals as the only differentiator, so the middle of the page is less scannable than the hero.
> 
> BIGGEST FLAW OF LOSER: The hero headline's black highlight bar overlaps and clips the adjacent lines of the oversized type, so the first thing a visitor reads looks like a rendering bug.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. The yellow/black/electric-blue neo-brutalist look with hard offset shadows and all-caps display type is a now-common generated house style, and its section pattern of stacked colour blocks with cards is generic. A's newsletter-edition concept is more tied to the product.

### 07 run a (p5c7a)

#### 07-mobile-app-screen

**opus judge: picked baseline (close)**

> WINNER: B (close)
> REASONING: B reads as a finished, shippable app. In B desktop-0 and mobile-0 the dark streak card pairs a 40% progress ring ("2 of 5") with a big serif "12 days", so streak and today's progress sit together in one clear hero. B's week strip (mobile-0) shows the history at a glance: filled check discs for M to F, an outlined "31" with a partial arc for today, and a muted future day. B also shows the check-off interaction on screen: "Drink 2L water" and "Morning run" are struck through on tinted rows with filled green checks, and the "3 left" counter agrees with them. A is the more distinctive concept: the sprouting-seed streak tile, the tally-mark logo, the sage-and-cream palette and the colour-coded habit icons in A desktop-0 feel made for this product. But A's craft is heavier. Thick dark outlines on every card make the screen look cartoonish and cramped, and on mobile-0 the cards nearly touch the edges, with the week strip packed tight. A's starting state ("0 of 6", an empty progress bar, every circle unchecked) never shows a completed habit, so a reviewer can't see the core interaction in any shot. Its secondary copy ("Sow: all day, 4 glasses by noon") is in an odd serif with a strange "Sow:" prefix. In A mobile-1, "Ten minutes of stillness" is clipped behind the tab bar with no fade. B's bottom row also runs under its bar, but B's softer surfaces handle that more gracefully. Overall, B has the stronger hierarchy and polish, while A has the stronger idea but rougher execution.
> BIGGEST FLAW OF WINNER: The dark hero card with a blurry orange glow, the serif "Good morning" greeting and the avatar circle make it feel like a stock wellness-app template rather than something specific to Tally.
> BIGGEST FLAW OF LOSER: The heavy black outlines on every card and the cramped spacing at 375px make the screen look clunky, and the all-unchecked starting state never shows the check-off interaction working.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because the "Good morning" serif greeting, the dark gradient-glow stat card with a progress ring, the pale-mint icon tiles and the four-tab bar with a Profile tab are the familiar default look for a premium habit app.

**sonnet judge: picked skill (close)**

> WINNER: B (close)
> REASONING: B reads as a considered design for this product, while A is the more polished but more familiar one. In B's desktop-0 and mobile-0, the tally-mark logo, the sprout-in-soil streak tile, the "Sow:" subtitles and the heavy dark outlines on cream cards over sage give it one coherent garden-and-tally idea. The streak tile ("11 day streak, finish 3 more to keep it growing") ties the metaphor to the core mechanic. The week strip uses partial progress rings per day, and today is a dark pill. That shows per-day completion rather than simple done/not-done, which suits a habit tracker. The "0 of 6" counter with a progress bar sits directly above the habit list. Each habit has a distinctively coloured icon tile and a large, thumb-friendly check circle. A's mobile-0 is clean and well crafted: a serif "Good morning", a dark hero card with a 40% ring and a "12 days" flame, a check-dot week strip, and tinted completed cards with strikethrough. But the dark green hero card, cream background, serif headline and rounded white cards are the standard wellness-app look. A's tab bar has four items and fits comfortably, which is a small plus over B. In B's mobile-0 the last visible habit sits tight against the tab bar, and some of the partial week rings (28, 31) look ambiguous without checkmarks. Even so, B has more personality and is the more memorable app.
> BIGGEST FLAW OF WINNER: The week-strip rings in mobile-0 show partial progress with no checkmarks or legend, so it is unclear which days were fully completed, and the sprout tile is a large box with a small illustration.
> BIGGEST FLAW OF LOSER: A's visual language is a generic dark-hero-card wellness template that could belong to any habit app, and the 40% ring duplicates the progress already conveyed by the "3 left" count and the card states.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its dark gradient hero card with a glow, serif heading and soft rounded white cards in a sage and cream palette is the default polished-app look.

### 07 run b (p5c7b)

#### 07-mobile-app-screen

**opus judge: picked baseline**

> WINNER: A
> REASONING: A (desktop-0, mobile-0) reads as a finished native app. The dark streak card puts the 40% progress ring next to a large serif "12 days" with a flame, so streak and progress can be read together at a glance, which fits the brief directly. Its week strip in mobile-0 is easy to read: filled green checks for days done, an outlined ring for today (31) and a faded future day. Habit rows are spaced evenly, each with a soft tinted icon tile and a short one-line subtitle ("Before 9 pm", "3 lines is enough"). Done rows get strikethrough plus a pale green fill, so state is obvious. The 4-tab bar with a home indicator and the "Good morning" serif greeting make it feel like an app rather than a web page. B (desktop-0, mobile-0) has more personality: an italic serif date, "11 days already sown" copy, and multicolour icon tiles (blue water, tan book, pink stretch). Its execution is weaker, though. Subtitles wrap to awkward orphans ("bottle by 4 / pm", "if the sky / allows"), and the active "Today" tab label is underlined like a hyperlink, which breaks the native feel. The week-strip rings in B are partial arcs that are hard to tell apart at a glance (28 vs 30 vs 31). The streak copy "Finish 2 more" sits awkwardly beside "4 left" and "2/6", so the user has to work out what keeps the streak alive. The saturated flat green card and mixed icon colours also feel less coherent than A's restrained palette. Neither candidate shows clipping or overlap beyond the expected scroll cut-off behind the tab bar.
> BIGGEST FLAW OF WINNER: The palette and layout (dark hero card with a warm radial glow, sage greens, serif greeting) are polished but safe, so A feels more like a well-made template than a distinctive identity for Tally.
> BIGGEST FLAW OF LOSER: Wrapping subtitles with orphaned words and a hyperlink-style underline on the active tab make B look like a web page squeezed into a phone frame.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its dark gradient-glow hero card, muted sage-and-cream palette and serif "Good morning" greeting are a very familiar generated wellness-app house style.

**sonnet judge: picked baseline**

> WINNER: A
> REASONING: A has a clear hierarchy. The serif "Good morning" greeting leads into a dark forest-green streak card (desktop-0). That card holds a 40% ring ("2 of 5"), a large "12 days" with a flame, and a warm radial glow. The card reads as the hero, and the instruction "Finish all 5 to keep your streak alive" is easy to scan. The week strip uses simple filled check circles for completed days, a ringed "31" for today and a faded "1" for tomorrow, so the state of the week is obvious at a glance. In mobile-0, A's habit cards are consistent: tinted icon tiles, strike-through and a green tint on completed rows, and open circles on pending ones. The four-tab bar (Today, Habits, Stats, Profile) is neatly spaced and labelled, and the active tab is highlighted. The warm cream and green palette with the serif display face feels deliberate for a habit app. B is competent but busier. Each habit gets a different saturated icon colour (blue, amber, green, pink), the body copy is set in a serif that clashes with the sans headings, and the subtitles wrap to two lines. B's tab bar has only three tabs, and the "Today" label is underlined in a way that looks like a link, with the underline clipping the text in desktop-0. B's week strip is also ambiguous: six identical partial rings give little sense of which days were completed. A has a minor wart in the week strip, where the "31" ring has a small arc artifact. On the other hand, A's frame is cleanly composed with no cramped or overlapping parts.
> BIGGEST FLAW OF WINNER: The week strip's "31" ring shows a slight arc artifact, and the cream-and-green look is a bit safe and "wellness-app" generic.
> BIGGEST FLAW OF LOSER: The habit rows mix a serif subtitle font with a sans title font and give each icon a different saturated colour, so the screen feels noisy. The tab bar's "Today" label is underlined and clipped, and the six identical partial rings in the week strip are hard to read.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B, because its mixed serif/sans text, rainbow icon tiles and quirky copy ("11 days already sown") look like a stack of decorative choices rather than one considered system.

### 07 run c (p5c7c)

#### 07-mobile-app-screen

**opus judge: picked baseline (close)**

> WINNER: A (close)
> REASONING: A (desktop-0) has the more refined app feel. The dark streak card puts a 40% progress ring next to a large serif "12 days" with a flame, and a warm glow in the corner, so the two key metrics read together at a glance. A's week strip of filled check circles with a ringed "31" for today is simple and scannable, and the habit rows show completed state clearly: tinted green background, strikethrough title and a filled check (Drink 2L water, Morning run). That gives the check-off interaction a convincing visual payoff even in a static frame. A's palette (cream, deep green, a touch of ember) and its serif-plus-sans pairing ("Good morning", "12") feel considered and calm, and it holds together at 375 (mobile-0), where all five habits fit above a clean 4-tab bar. B has more personality: a tally-mark logo, an italic serif motivational line, a bordered calendar week grid with dates, and saturated blue/red/yellow icon tiles. But it reads less polished. The italic serif body copy mixed with sans titles feels inconsistent, and the habit subtitles wrap awkwardly ("11 day / streak" orphan on its own line in every row, desktop-0 and mobile-0). B's primary-colour icon tiles clash with the forest-green card, and the screenshots only show a 0/5 empty state, so there is no evidence of the completed-habit treatment. B's dark 3-tab bar is chunky, and at 375 the fourth habit card is cut off behind it with no visible scroll affordance (mobile-0). Overall A looks like a shipped product; B has good ideas but rougher execution.
> BIGGEST FLAW OF WINNER: A's cream, deep-green and serif "wellness" palette, with a ring-plus-streak hero card, is a fairly familiar habit-app look, so it is safe rather than distinctive for Tally.
> BIGGEST FLAW OF LOSER: B's habit subtitles wrap clumsily, leaving "streak" orphaned on its own line in every row, and its mix of italic serif body copy with primary-colour icon tiles looks inconsistent and unrefined.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its cream background, muted green, serif greeting, glow-accent dark hero card and pastel icon tiles match a very common generated "premium wellness app" template, while B's tally logo and calendar grid show more product-specific choices.

**sonnet judge: picked baseline (close)**

> WINNER: A (close)
> REASONING: In A's desktop-0 the phone frame sits on a warm beige backdrop. Inside, a dark green hero card pairs a progress ring (40%, 2 of 5) with a large serif "12 days" and a flame, and it reads in one glance. The week strip below uses small, clearly coloured dots: filled green checks for past days, an outlined "31" for today, and a faded "1" for tomorrow. The habit rows in mobile-0 are well spaced. Each has a tinted icon tile, a bold title with a quiet subtitle, and a right-aligned check. Done rows get a pale green fill and strikethrough, so completed and pending states are easy to tell apart. The palette (green, cream, one orange accent) and the serif and sans pairing feel cohesive. The tab bar has four tabs with a clear active state and sits flush at the bottom. B has a bold "Today" header and a strong flat green streak card with a huge "11". But its habit icons are saturated blue, red and yellow squares that clash with the green system. Its subtitles are in a serif that looks like a default fallback, which makes the type feel mixed. The ring in B's hero is faint and the "0/5" state is a bit dead. B's week strip is a boxed table with a half-filled Wednesday dot, which is a nice detail but visually heavy. B's tab bar is a dark slab with a pill highlight and only three tabs. A feels more like a native app and its craft is more consistent.
> BIGGEST FLAW OF WINNER: The overall look (cream background, forest green, soft rounded cards, serif greeting) is a familiar wellness-app style, and the "31" today ring in the week strip looks slightly clipped or crowded.
> BIGGEST FLAW OF LOSER: The random primary-colour icon tiles and the mismatched serif body text break the visual system and make it look unfinished, and the dark tab bar feels heavy and cramped.
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its beige, forest-green, rounded-card "calm wellness" look with a serif headline and a gradient-glow hero card is the stock look generated apps tend to default to.

### 06 control (p5cctl)

#### 06-ecommerce-product-page

**opus judge: picked skill (close)**

> WINNER: A (close)
> REASONING: A looks like a design made for this product. The sage, cream and dark-green colour blocking, the serif display type and the arched gallery frame (desktop-0) give it a brand voice, while B uses a familiar Inter-on-off-white storefront look. A's "What's in the bag" section (desktop-2) is the strongest single idea on either page: a proportional capacity bar (Main 24 L / Front 6 L / Shoes 5 L / 3 L) sits above four compartment columns and "Fits comfortably" chips, so 38 L becomes something you can picture. B's zone diagram (B desktop-2) is also good, but its list floats in the right column with dead space above it. A's buy box is tight and easy to scan: price, colour swatches, back-length cards with torso ranges, a large rust "Add to bag", then three trust lines with a concrete dispatch date (desktop-1). B matches it for trust and arguably beats it, with the announcement bar, payment badges and shipping tiers with prices (B desktop-1, desktop-3/4). A's reviews (desktop-3) have more personality: the headline "Carried through 312 airports", a 4.7 numeral, a distribution chart, a fit slider, and three specific reviews including a believable repair story. A's shipping section combines a numbered delivery timeline with a returns accordion, which reads more considered than B's three equal icon cards (B desktop-3). On mobile both have a sticky price + CTA bar and reflow cleanly (A mobile-1, B mobile-1). B's "Airline carry-on approved" badge sits over the top of the backpack illustration at 375 wide (B mobile-0), which looks clumsy in the hero. A has small text defects that need fixing, listed below, but they are quick fixes. B is very competent but generic.
> BIGGEST FLAW OF WINNER: Polish bugs in the most visible spot: the rating link renders as "4.7from312reviews" with no spaces, and the last breadcrumb item sits higher than the others (desktop-0, mobile-1). The mobile capacity bar also drops the labels on its three small segments (mobile-2).
> BIGGEST FLAW OF LOSER: It reads like a generic Shopify-style template (Inter, white rounded cards, equal three-column icon cards), and on mobile the oversized airline badge covers the top of the hero illustration (B mobile-0).
> MORE LIKE A TYPICAL AI-GENERATED PAGE: B. Its announcement bar, uniform white rounded cards, icon-card shipping row, FAQ accordion and four-up "Pairs well with" grid are the default e-commerce layout with no distinct visual identity.

**sonnet judge: picked skill (close)**

> WINNER: B (close)
> 
> REASONING: B reads as a considered design for this product. Its sage, forest and rust palette, arch-shaped gallery frame and Fraunces-style serif headlines fit a recycled-sailcloth bag (B desktop-0). A is a clean cream-and-green shop template with a serif headline (A desktop-0). B's "What's in the bag" section is a dark band with a proportional litre bar (Main 24 L, Front 6 L, Shoes 5 L) and "Fits comfortably" chips (B desktop-1, B mobile-2). That explains the 38 L better than A's labelled zone diagram, where the side "5" zones sit awkwardly on the bag edge (A desktop-2). B's review section has a large 4.7, percentage bars, a "How it fits" slider and three reviews with serif headlines (B desktop-3). It has more voice than A's boxed review cards. Both cover every item in the brief. A's buying column is slightly more complete, with a stock line, payment badges and an order-total CTA (A desktop-1), and it gives a stronger first screen of trust cues (A desktop-0). B's buy box is solid, with a big rust "Add to bag" and a repeat of returns and warranty beneath it (B desktop-1). B's mobile layout is good: swipe-sized thumbnails, a compact bar, accordions, and a related-products row layout that works (B mobile-5, B mobile-6). A's mobile page is also competent, but its shield badge covers the top of the bag (A mobile-0). B's visible defects hold it back: "4.7from312reviews" has lost its spaces, and the breadcrumb baseline is uneven. B's mobile sticky bar also cuts into the intro text (B mobile-1), and the colour swatches have no names beside them. I still prefer B for its distinctiveness and storytelling over A's safer but generic template.
> 
> BIGGEST FLAW OF WINNER: The collapsed spacing in "4.7from312reviews" sits right under the title on every viewport, and the breadcrumb is misaligned. Together with the mobile sticky bar overlapping body text, these make it look unpolished in the most visible spot.
> 
> BIGGEST FLAW OF LOSER: A looks like a familiar e-commerce template with little product personality, and its "airline carry-on approved" shield badge overlaps the bag illustration (most visibly on mobile) while the zone diagram has cramped, clipped side labels.
> 
> MORE LIKE A TYPICAL AI-GENERATED PAGE: A, because its cream background, green accent, rounded white cards, icon-led "ships / returns / repair" trio and 4-up spec stat tiles are the stock layout generated storefronts tend to use.

