# Site types: what goes on the page, in what order

Most requests are one of a dozen kinds of site. Each has a sensible order of sections, worlds that fit (from different families, so Gate 2 has real candidates), and packaged patterns for the hard parts (see `patterns/INDEX.md` and `patterns-index.md`). Treat this as a skeleton, then make it yours with real content.

## A business with a physical place (bakery, cafe, studio, clinic)
**Order:** what we are in one sentence, today's offer or menu, how to order or book, where and when (with open-now), one line about the people.
**Worlds:** 8 Warm Organic (Soft and Living); 4 Neo-Brutalist Print (Loud and Graphic) or 2 Editorial Quiet Luxury (Paper and Print).
**Patterns:** `hero-colour-split`, `form-field-errors`, `footer-links`, `nav-responsive`.
**Do not:** bury opening hours three clicks deep, or make people phone to ask a price.

## A consumer app or product landing page
**Order:** the promise, a live taste of the product, why it works, one plan with a clear price, a sign-up.
**Worlds:** 6 Soft Playful for friendly apps; 3 Technical Dark for developer tools; 1 Product Hero Scroll for a physical product; 7 Swiss Grid for data products.
**Patterns:** `hero-evidence`, `hero-annotated-chart`, `feature-table`, `pricing-plain`, `faq-details`, `testimonial-pull`.
**Do not:** open with a row of logos before saying what it does, or use a metric row you cannot source.

## A portfolio
**Order:** the three best pieces first, a sentence about you, how to get in touch.
**Worlds:** 5 Cinematic Immersive, 2 Editorial Quiet Luxury, 16 Terminal BBS.
**Patterns:** `hero-type-poster`, `nav-responsive`, `footer-links`.
**Do not:** hide the work behind an intro animation, or make the plain version impossible to reach.

## A publication, blog or documentation
**Order:** the article itself, a contents list, related reading, a way to subscribe.
**Worlds:** 12 Broadsheet; 24 Explorable Explainer; 21 Plain Text Sheet for reference pages.
**Patterns:** `toc-scrollspy`, `code-block-copy`, `scroll-progress-rule`, `faq-details`.
**Do not:** set body text wider than about 65 characters, or put a hero image above the headline.

## A report or data story
**Order:** the one finding that matters, the evidence in order, what to do, the method.
**Worlds:** 7 Swiss Grid; 12 Broadsheet.
**Patterns:** `kpi-lead-figure`, `line-chart-annotated`, `bars-direct-labelled`, `data-table-sortable`.
**Do not:** show a chart without its numbers available as a table.

## A shop or product page
**Order:** the product and its price, options, a buy button that stays reachable, delivery and returns early, reviews, related items.
**Worlds:** 2 Editorial Quiet Luxury or 8 Warm Organic, by the goods; 1 Product Hero Scroll for a single hero product; 23 Thermal Receipt for the basket and checkout summary.
**Patterns:** `product-gallery`, `option-picker`, `add-to-cart-bar`, `review-summary`, `pricing-plain`.
**Do not:** reveal delivery costs only at the last step, or hide that an option is sold out.

## An event, exhibition or venue
**Order:** what, when, where, how to get a ticket, then the programme.
**Worlds:** 14 Museum Placard for culture; 9 Departures Board for anything time-driven.
**Patterns:** `hero-type-poster`, `nav-responsive`, `form-field-errors`.
**Do not:** put the date and place only in an image.

## A service people check often (status, forecast, schedule, prices)
**Order:** the current answer, the next few hours or days, a way to change place or filter.
**Worlds:** 21 Plain Text Sheet; 20 Nautical Chart; 9 Departures Board.
**Patterns:** `status-chips`, `data-table-sortable`, `filter-bar-segmented`, `empty-state`.
**Do not:** make people wait for an animation to read a number.

## An admin screen or dashboard
**Order:** what needs attention, the list, the detail, the actions.
**Worlds:** 21 Plain Text Sheet, 7 Swiss Grid, 9 Departures Board, 3 Technical Dark. Read `dense-ui.md` first.
**Patterns:** `kpi-lead-figure`, `attention-list`, `data-table-sortable`, `bars-direct-labelled`, `line-chart-annotated`, `filter-bar-segmented`, `status-chips`, `sidebar-app-shell`, `skeleton-loading`, `empty-state`.
**Do not:** use colour as the only signal for a status, or make the full list the mobile default when an action subset exists.

## A mobile-first app screen
**Order:** the one thing to do now, its state, the quick switch between areas.
**Worlds:** 6 Soft Playful; 18 Clinical Label for health.
**Patterns:** `toast-live`, `empty-state`, `status-chips`, `form-field-errors`.
**Do not:** make a web page in a phone frame: use thumb-reach controls, 44 px targets and a bottom bar.

## Whatever you build
1. Say what it is in the first screen, in plain words.
2. Put the one action you want in reach, and make it obvious.
3. Include the unhappy states: empty, error, loading, offline, sold out.
4. Keep a plain, fast version of the content reachable.
5. Check it with a keyboard and at phone width before calling it done.
