# Eval briefs

Each brief is given to the agent verbatim, as the only design input. Output is static HTML/CSS/JS (no build step, no CDN needed for layout) at `<run-dir>/<brief-id>/index.html`. Fonts may come from Google Fonts or be system fonts; images must be inline SVG, CSS, or generated shapes (no hotlinked stock photos, no network assets the grader cannot reproduce).

Brief ids are stable: runs and results refer to them.

## Positive briefs (8)

### 01-saas-landing
Build the marketing landing page for **Relay**, a tool that turns support tickets into a weekly "what customers are actually asking for" digest for product managers. Audience: PMs at 50-500 person software companies. Must include: hero with a clear promise and one primary action, how it works, a feature section, social proof, pricing (3 tiers), FAQ, footer. The page should not look like every other AI-tool landing page.

### 02-analytics-dashboard
Build a single-screen analytics dashboard for **Harbor**, a ferry operator with 6 routes. The ops manager checks it at 7am to see: on-time rate, passenger load vs capacity per route, delays by cause, and which sailings need attention today. Include a date range control, a route filter, a sortable table of today's sailings, and at least two charts (hand-drawn SVG or canvas is fine). Dense, scannable, real-looking data.

### 03-developer-portfolio
Build the portfolio site for **Mira Okafor**, a freelance front-end engineer who specialises in data-heavy interfaces and accessibility. Include: intro, 4 selected projects (each with problem, what she did, outcome), a short about, services, contact. She wants it to feel like her: precise, a bit dry, quietly confident.

### 04-restaurant-site
Build the site for **Salt & Ember**, a 28-seat wood-fire restaurant in a coastal town. Include: hero, the story, a menu (starters, mains, desserts, drinks with prices), opening hours, location, a reservation form, and a private-dining note. It should make you hungry and feel like one specific place.

### 05-docs-page
Build one documentation page for the **Quill** JavaScript date library: "Parsing and formatting". Include: left nav with sections, right-hand on-this-page outline, headings, prose, code blocks with a copy button, a table of format tokens, a callout for a gotcha, and prev/next links. Optimise for reading and finding things.

### 06-ecommerce-product-page
Build a product detail page for the **Atlas 38** carry-on backpack (38 L, recycled sailcloth, ships in 2 days). Include: gallery (illustrated with SVG/CSS), title, price, colour and size options, add-to-cart, key specs, "what's in the bag" breakdown, reviews summary with 3 reviews, shipping and returns, related products. Must feel trustworthy and make buying easy.

### 07-mobile-app-screen
Build a mobile-first web screen (design width 390px, centred in a device frame on desktop) for **Tally**, a habit tracker. The screen is "Today": streak count, today's habits with check-off, a week strip, and a bottom tab bar. Interactions: tapping a habit toggles it and updates the streak and progress live. One screen, but it must feel like an app, not a web page.

### 08-redesign-generic-page
Redesign the existing page in `evals/fixtures/generic-landing/index.html` (a landing page for **Orbit Analytics**). Keep the product, the information and the section order (hero, logos, features, testimonials, pricing, CTA, footer). Change everything that makes it look generic: layout, type, colour, spacing, motion, copy where it is vacuous. Deliver as `<run-dir>/08-redesign-generic-page/index.html`. Do not edit the fixture in place.

## Negative prompts (3)

The skill must NOT load or influence these. Pass = the agent answers without invoking UI Lab, without producing UI, without design-process ceremony (direction cards, worlds, etc).

### N1-backend-api
Write a Flask endpoint `POST /invoices/<id>/refund` that validates the amount against the invoice balance, is idempotent on a client-supplied `Idempotency-Key` header, and returns 409 on a duplicate with a different amount.

### N2-sql-query
Given tables `orders(id, customer_id, created_at, total)` and `customers(id, region)`, write a Postgres query that returns, per region, the 3 customers with the highest total spend in the last 90 days, including ties, and explain which index would help.

### N3-bash-script
Write a bash script that watches a directory for new `.csv` files, validates that each has a header row and no empty lines, moves good files to `processed/` and bad ones to `rejected/` with a `.reason` file beside them, and is safe to run twice at once.
