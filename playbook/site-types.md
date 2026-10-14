# Site types: what goes on the page, in what order

Most requests are one of a dozen kinds of site. Each has a sensible order of sections, a world that fits, and parts in UI Lab that already do the hard bits. Treat this as a starting skeleton, then make it yours with real content.

## A business with a physical place (bakery, cafe, studio, clinic)

**Order:** what we are in one sentence, today's offer or menu, how to order or book, where and when (with open-now), one line about the people. **World:** 8 Warm Organic. **Proof:** `site-crumb`. **Parts:** `site-nav`, `newsletter-form`, `not-found-page`. **Do not:** bury the opening hours three clicks deep, or make people phone to ask a price.

## A consumer app or product landing page

**Order:** the promise, a live taste of the product, why it works, one plan with a clear price, a sign-up. **World:** 6 Soft Playful for friendly apps, 3 Technical Dark for developer tools, 1 Product Hero Scroll for a physical product. **Proof:** `site-pip`, `site-lattice`, `site-solar`. **Parts:** `pricing-tiers`, `faq-section`, `cookie-banner`, `newsletter-form`. **Do not:** open with a row of logos before saying what it is.

## A portfolio

**Order:** the three best pieces first, a sentence about you, how to get in touch. **World:** 5 Cinematic Immersive, 2 Editorial Quiet Luxury or 16 Terminal BBS. **Proof:** `site-abyss`, `site-mare`, `site-pebble`. **Parts:** `move-scatter-grid`, `move-feed-the-bee`. **Do not:** hide the work behind an intro animation, or make the plain version impossible to reach.

## A publication, blog or documentation

**Order:** the article itself, a contents list, related reading, a way to subscribe. **World:** 12 Broadsheet. **Proof:** `site-ledger`. **Parts:** `article-layout`, `pagination-breadcrumbs`, `faq-section`. **Do not:** set body text wider than about 65 characters, or put a hero image above the headline.

## A report or data story

**Order:** the one finding that matters, the evidence in order, what to do, the method. **World:** 7 Swiss Grid. **Proof:** `site-commute-report`. **Parts:** `data-table`, `charts`. **Do not:** show a chart without its numbers available as a table.

## A shop

**Order:** products, a basket that always shows its total, delivery cost early, checkout. **World:** 2 Editorial Quiet Luxury or 8 Warm Organic, depending on the goods. **Parts:** `shop-cart`, `pagination-breadcrumbs`, `alert-banners`, `combobox` for search. **Do not:** reveal delivery costs only at the last step.

## An event, exhibition or venue

**Order:** what, when, where, how to get a ticket, then the programme. **World:** 14 Museum Placard for culture, 9 Departures Board for anything time-driven. **Proof:** `site-salt-road`, `site-departures`. **Parts:** `date-picker`, `site-nav`. **Do not:** put the date and place only in an image.

## A service that people check often (status, forecast, schedule, prices)

**Order:** the current answer, the next few hours or days, a way to change place or filter. **World:** 21 Plain Text Sheet or 20 Nautical Chart. **Proof:** `site-plain-forecast`, `site-tidewater`. **Parts:** `data-table`, `alert-banners`. **Do not:** make people wait for an animation to read a number.

## An admin screen or dashboard

**Order:** what needs attention, the list, the detail, the actions. **World:** none needed; follow the accessibility baseline and keep it plain. **Parts:** `data-table`, `settings-screen`, `menu-button`, `alert-banners`, `analytics-dashboard`. **Do not:** use colour as the only signal for a status.

## Whatever you build

1. Say what it is in the first screen, in plain words.
2. Put the one action you want in reach, and make it obvious.
3. Include the unhappy states: empty, error, loading, offline, sold out.
4. Keep a plain, fast version of the content reachable.
5. Check it with a keyboard and at phone width before calling it done.
