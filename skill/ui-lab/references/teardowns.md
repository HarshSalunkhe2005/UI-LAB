# Teardowns: a technique index

Condensed from teardowns of 68 sites (30 world-class, 20 AI-generated, 12 recent award winners, 6 community picks). Each entry is a technique: what it does, when to reach for it, how to rebuild it, and what to watch. Site names show where it was seen. **Learn the technique, never copy a layout, text or asset.** Where a packaged pattern covers it, the slug is in brackets (see `patterns/INDEX.md`).

## First screen and hero

**Product evidence in the hero** (Raycast, Resend, Linear, Superhuman). *When:* the product has a real interface or output. *How:* build a small working fragment in HTML (a command palette that types itself, a code block that turns into its result, an inbox you operate by key) instead of a screenshot. *Watch:* keep it inert under reduced motion and keyboard-reachable. [`hero-evidence`, `hero-annotated-chart`]

**Poster-scale type as structure** (Rauno Freiberg, Neutomni, Boc Studio). *When:* personality is the pitch. *How:* a display face at 20 to 30vw, clipped by one viewport edge, one object beside it. *Watch:* the real text must stay in the DOM; shrink with `clamp()` at 375. [`hero-type-poster`]

**Flat colour field as weight** (Stripe Press, Arc, KATACHI). *When:* no photography, but you need first-screen presence. *How:* one saturated field beside a calm text panel; the figure sits on the seam. *Watch:* check text contrast on the field; keep one field per screen. [`hero-colour-split`]

**Statement that comes into focus** (Butter). *When:* the opening sentence is the product. *How:* split words, drive blur and opacity from one scroll-progress number. *Watch:* the sentence must be fully readable without script.

**Counter-to-wordmark preloader** (EDOLUS). *When:* a heavy first load already exists. *How:* a tiny percentage counter hands over to the wordmark, letters rising in order. *Watch:* never block content on it; skip under reduced motion.

## Navigation and chrome

**Header readable over everything** (twks). *When:* a full-bleed page with varied backgrounds. *How:* `mix-blend-mode: difference` on the header with white text. *Watch:* check on mid-tone backgrounds; keep a solid fallback.

**Collapsible app shell** (dashboard and editor teardowns, Bento Slides). *When:* tools with more than five destinations. *How:* a rail that collapses to icons, a persistent top bar, a main region that scrolls on its own. *Watch:* labels stay as accessible names when collapsed; overlay at 375. [`sidebar-app-shell`]

**Scroll-following contents list** (Tailwind docs). *When:* docs and long pages. *How:* IntersectionObserver marks the heading in view. *Watch:* `scroll-margin-top` on headings. [`toc-scrollspy`]

**Navigation as instrument panel** (Pensatori Irrazionali). *When:* a studio or product explained as modules. *How:* one state value drives the active module and its status lights. *Watch:* monospace labels need 4.5:1; status is text too.

**Morphing tab indicator** (Arc). *When:* a few tabs with identity. *How:* one absolutely positioned pill that animates its transform and width to the selected tab. *Watch:* tabs keep real roles and arrow-key behaviour.

## Layout and cards

**Contact-sheet index instead of cards** (Office Commun). *When:* a portfolio or archive. *How:* a label line above one horizontal strip of variable-width images per project. *Watch:* add buttons and keyboard scrolling to strips.

**Two layouts for one list** (Gil Huybrecht). *When:* a gallery with an overview and a browse mode. *How:* switch between scatter and grid by transforms only, on the same DOM. *Watch:* focus order must follow the visible order.

**Block grid with one type size** (Are.na). *When:* curation tools. *How:* drag-to-reorder tiles, a single text size, quiet chrome. *Watch:* provide keyboard reordering.

**Frames that trade space** (v0 frame grids). *When:* a showcase where hover or focus means "look at this one". *How:* flex-grow transitions between siblings. *Watch:* the focused item must work on touch and keyboard, not only hover.

**Features as ruled rows or a table** (Heron, Plain-text pages). *When:* technical or sceptical buyers. *How:* three columns: feature, what it does, what it does not. *Watch:* honesty in the third column is the point. [`feature-table`]

## Type

**Outlined plus solid display type** (basement.studio, Tim Van Damme). *When:* loud brands. *How:* `-webkit-text-stroke` on one line, solid on the next. *Watch:* stroke width at small sizes; contrast of the outline.

**One script word per headline** (LxL Creative). *When:* a human touch on a heavy grotesque. *How:* a handwriting face for a single word, tilted slightly. *Watch:* it is also a house-style tell if used on every page; use only where the brand is personal.

**Pictures inside the sentence** (Noho). *When:* a material or place story told in one line. *How:* inline-block image chips at letter height, revealed word by word. *Watch:* alt text on chips; the sentence reads without them.

**Dot-matrix type** (Nothing). *When:* a brand whose voice is a display. *How:* render text as a dot grid on canvas, ripple under the pointer. *Watch:* keep real text for assistive tech.

**Monumental clipped numerals** (Mercury odometer). *When:* a number is the argument. *How:* digit columns that translate to the value. *Watch:* the final value is plain text. [`count-up-tabular`]

## Scroll and narrative

**Scroll-scrubbed frames on a pinned canvas** (Apple product pages). *When:* a physical product with a model or frame set. *How:* pin a section, map scroll progress to a frame index, draw to a canvas. *Watch:* preload, give a still fallback, avoid scroll-jacking.

**Scrollytelling** (The Pudding). *When:* a story whose chart changes as you read. *How:* a sticky figure and text steps that update it on intersection. *Watch:* every step readable without the figure's animation.

**Camera along a path** (Igloo Inc.). *When:* an experience site. *How:* map scroll to a position on a spline in 3D or CSS 3D. *Watch:* device cost; keep a static route.

**Scroll-velocity band** (Boc Studio, Lenis). *When:* a band of text or logos that should react to the reader. *How:* read scroll velocity and scale the marquee speed and direction. *Watch:* decorative loops are a house-style default; add a pause control.

**Progress rule** (reading sites). *When:* long reading. *How:* a thin fixed bar scaled by scroll progress. [`scroll-progress-rule`]

**Bars that grow once** (many data pages). *When:* a chart that should explain magnitude on first view. *How:* IntersectionObserver adds a class once; scaleX transitions. [`reveal-once-bars`]

## Cursor and pointer

**Spotlight grid** (Linear). *When:* a grid of cards in a dark product page. *How:* update CSS variables from pointer position; a radial gradient border follows. *Watch:* touch fallback is a static border.

**Cursor that labels** (Cuberto). *When:* an agency page with media cards. *How:* a follower element that grows and shows a word over targets. *Watch:* never the only affordance; hide on touch.

**Particles that lean toward the pointer** (Active Theory, v0 particle logo). *When:* immersive brand pages. *How:* 2D canvas particles with attraction and return. *Watch:* cap counts for mobile.

**Creature that follows the cursor** (Leo Parpeix). *When:* a personal site with humour. *How:* an element that eases toward the pointer with lag. *Watch:* harmless extra only; reduced motion off.

## Dense UI and data

**Lead figure plus comparison** (Mercury, finance dashboards). *When:* any summary. *How:* one large number with a target or a prior period, others small. [`kpi-lead-figure`]

**Ranked action list** (operations dashboards). *When:* the user acts on the worst items first. *How:* an ordered list ranked by impact, reason in words, row is a link. [`attention-list`]

**Sortable table with stacked mobile layout** (admin teardowns). *When:* any records list. *How:* a real table with aria-sort; below 640 px each row becomes label and value pairs with a sort select. [`data-table-sortable`]

**Direct-labelled bars with a target** (data-poster pages). *When:* comparing a measure across categories. *How:* HTML bars with values as text and a tick at the limit. [`bars-direct-labelled`]

**Charts drawn with characters** (Brolly). *When:* a page people check often and fast. *How:* block glyphs in a monospace table with a "now" marker, plus a real table. *Watch:* never a text chart without a table.

**Segmented range and live count** (analytics apps). *When:* filters that change many panels. *How:* a radio group, a select, a reset, and a polite live count. [`filter-bar-segmented`]

**Command palette** (Raycast, Linear). *When:* a tool with many actions. *How:* a dialog with a filtered list, arrow keys, Enter to run, Escape to close.

## Forms, state and feedback

**Every form state designed** (waitlist and newsletter templates). *When:* any capture. *How:* idle, error, success, with focus moved and a live message. [`hero-email-inline`, `form-field-errors`]

**Toast stack with spring physics** (Emil Kowalski). *When:* confirmations in an app. *How:* stacked, collapse and expand on hover, limited to three. *Watch:* long enough to read, dismissible. [`toast-live`]

**State-machine button** (Rive). *When:* a control with idle, hover, press and success. *How:* one data attribute drives all visuals; transitions are CSS.

**One verb, one result** (Draw a Fish). *When:* a playful product with a single action. *How:* let the visitor make something in five seconds with no onboarding.

## Commerce

**Speed and restraint as the aesthetic** (Shopify templates). *When:* a shop with many items. *How:* fast pages, plain type, a bag that always shows its total, delivery cost early. [`add-to-cart-bar`, `option-picker`, `product-gallery`]

**Product page told as a long scroll** (Apple). *When:* one hero product. *How:* pinned scenes per feature, a persistent buy bar. *Watch:* the plain specs and the price must be reachable without the show.

## Content and trust

**Annotated product artefact** (the pages that won this skill's own comparisons). *When:* a SaaS page needing trust. *How:* show a real output (a digest, a report) with lettered annotations explaining each decision. *Watch:* real-looking, internally consistent numbers.

**Specific pull quote** (editorial and SaaS teardowns). *When:* social proof. *How:* one large quote with a decision and a number in it, two small. [`testimonial-pull`]

**Honest pricing by audience** (SaaS teardowns). *When:* any pricing. *How:* each plan names who it is for; no scaled middle tier. [`pricing-plain`]

## What the teardowns agree on

1. The memorable moment is one thing, built early, and everything else serves it.
2. Technique choices are the cheapest that deliver the moment: CSS before canvas, canvas before WebGL.
3. The sites that read as authored commit to a world and refuse the rest; the AI-generated ones mostly stay on the default order and style.
4. Restraint is a choice. The best quiet sites spend it on purpose (one size, one colour, motion only where it earns attention).
