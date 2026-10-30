# Anti-slop: defaults to leave unless the brief earns them

Used at Gate 2. A match is not a ban. It is a question: did the brief, the audience or the product choose this, or did it arrive by default? If by default, change it, and write what you changed in the direction file.

## How to run the check

1. Write the page you would build without thinking, one line per axis (ground, type voice, layout grammar, accent strategy, motion).
2. Mark every line that matches an entry below (sections A to D).
3. Choose two candidate directions from different families (`world-index.md`), pick one, and make sure it differs from the default on at least three axes. Each change needs a reason from the brief.
4. Check section D: the obvious replacements are defaults too.

**Signal column.** `audit: <rule>` means the static audit script{{pro}} (`scripts/audit-ui.mjs`){{/pro}} already detects it from source. `audit: planned` means the static audit will gain a check. `manual` means a human or the render pass has to see it. A static signal proves a symptom, not a verdict: confirm in the render.

## A. 2023-era slop

| # | Name | Why it reads as AI | Signal | Instead |
|---|---|---|---|---|
| A1 | Purple-to-blue gradient wash | The model default for "modern tech"; every generator ships it | audit: planned (gradient with purple/indigo stops on large areas) | A flat colour chosen from the product or the world |
| A2 | Gradient text on headings | Decoration standing in for emphasis | audit: gradient-text | Weight, size or position for emphasis |
| A3 | Emoji or unicode symbols as feature icons | Cheapest way to fill an icon slot | audit: emoji-icon | Drawn SVG from one set, or no icon |
| A4 | Three identical icon-tile, heading, sentence cards | A template shape that carries no information | audit: planned (three sibling cards with identical structure) | Vary form by content: one large, two small; a list; a table |
| A5 | Glow shadows on pill buttons; cards that lift on hover everywhere | Motion and depth applied as seasoning | audit: planned (box-shadow with coloured blur plus translateY on :hover) | Flat buttons; one property changes on hover |
| A6 | Hero metric row as filler ("10,000+ users", "99.9% uptime") | Round numbers with no source read as invented | manual | Metrics only if real, sourced and relevant to the decision |
| A7 | "Trusted by" row of placeholder logos | Fake social proof | manual | Real names or one specific quote with a role |
| A8 | Glassmorphism cards on a gradient | Blur as a substitute for hierarchy | audit: planned (backdrop-filter on cards) | Solid surfaces with a clear border or tone step |
| A9 | Identical fade-up on every block as you scroll | One animation applied to everything | audit: planned (same reveal class on most sections) | Animate one thing that explains something |
| A10 | Inter at every size and weight, no scale | The default sans with no type decision | audit: inter-only | A chosen pair and a real scale (`typography.md`) |
| A11 | Centred everything, one column, equal section padding | Layout by default | manual | Alignment on a grid; density that varies between sections |
| A12 | Cards inside cards, each with shadow and radius | Containers instead of structure | audit: planned (nested elements both with shadow and radius) | One level of container |
| A13 | Vacuous copy: "Unlock the power of...", "seamless", "supercharge", "next level" | Words that fit any product | audit: generic-copy | The specific thing the product does, in the audience's words |
| A14 | Lorem ipsum or "Feature One" | Unfinished content | audit: lorem-ipsum | Real content from the brief |

## B. Convergent "tasteful" defaults (the current house style)

These are what an agent produces when it is trying to avoid section A.

| # | Name | Why it reads as AI | Signal | Instead |
|---|---|---|---|---|
| B1 | Cream ground, heavy display serif, one italic accent word in a warm colour | The same recipe on every "not generic" page | audit: planned (display serif with `<em>` or italic span in headings) | Type from the subject; emphasis from weight, size or position |
| B2 | Mono eyebrow label above every heading | Decorative metadata with no fact in it | audit: planned (small uppercase mono element before each heading) | Delete, or label only where it carries a fact |
| B3 | Rotated stamp or sticker ("SAMPLE", "NEW") and hard offset shadows | Neo-brutalism as garnish | audit: planned (rotate() on a text badge) | One strong object that belongs to the product |
| B4 | Marquee ticker strip | Motion for its own sake, usually repeating the hero | audit: infinite-animation | Static proof, or nothing |
| B5 | Numbered section labels ("01 / How it works") | Looks structured, carries no meaning | audit: planned (`01 /` style labels) | Plain headings; number only genuine steps |
| B6 | Bento grid of unequal rounded tiles | A template for the feature section | manual | Features as a table, a narrative, an annotated screenshot or a before and after |
| B7 | Serif plus warm orange on charcoal for any food or hospitality brief | Hospitality cliché | manual | Colour and type from the place: its material, signage, region |
| B8 | Three-up "how it works" with big numerals | The numerals do work the copy should do | manual | Show the real product moment for each step |
| B9 | Pricing with the middle tier scaled up and badged "Most popular" | Everyone's pricing page | manual | Say who each plan is for in the plan's own terms |
| B10 | Tag pills for every piece of metadata | Flat hierarchy, visual noise | manual | Plain text with a separator; pills only for filters that act |
| B11 | Hero: eyebrow, huge headline, subline, primary plus ghost button, tiny reassurance line | Interchangeable | manual | Lead with the product's own evidence: a working fragment, a number, a sentence only this product can say |
| B12 | Dark navy with blue and amber accents for anything analytical | The default "serious data" skin | manual | Choose ground by working conditions (a 7am glance, a control room, a printout) |

## C. Dense-UI defaults (dashboards, apps, tables)

| # | Name | Why it reads as AI | Signal | Instead |
|---|---|---|---|---|
| C1 | Stock dark-navy dashboard: row of equal KPI tiles, cyan accents, donut, soft area chart | The generic analytics template | manual | Lead with what needs action; one lead figure; one signal colour |
| C2 | Table clipped or side-scrolling blindly at 375 | Desktop layout squashed | render: horizontal overflow or clipped columns | Stacked rows or a column-priority table (`dense-ui.md`) |
| C3 | Colour as the only status signal | Looks fine to the author | manual | Text or icon plus colour |
| C4 | Every KPI the same size and weight | No decision has been made about what matters | manual | One or two lead figures, each against a target or a comparison |
| C5 | Donut or pie with five or more slices | Easy to generate, hard to read | manual | Sorted horizontal bars with direct labels |
| C6 | System font at 14px for everything | No type decision | audit: system-fonts-only | A chosen text face with tabular figures and a scale |
| C7 | Rainbow of series colours that carry no meaning | Decorative palette on a chart | manual | One accent for the series that matters, neutrals for the rest |
| C8 | Full list as the mobile default with the filter that matters off | Completeness over the user's task | manual | At 375 the default view is the action subset; the full list is one tap away |

## D. Defaults this procedure itself produces (observed)

When agents avoid A to C using the menu below, they tend to land in the same new place.

| # | Name | Why it reads as AI | Signal | Instead |
|---|---|---|---|---|
| D1 | Cool grey or pale paper ground, ink text, one vermilion accent used only for action | Austerity plus a single hot colour became the safe answer | manual | Choose accent logic from the product (a colour field, two close hues, colour from the content); let a section carry a ground of its own |
| D2 | Monospaced labels and numbers as the "data" voice | Mono signals "technical" without a reason | manual | Numerals and labels in the text face with tabular figures; mono only for code and identifiers |
| D3 | A "ledger, report, newsroom, departure board" metaphor with hairline rules everywhere | One metaphor family reused | manual | A metaphor from a different material of the product's world, or none |
| D4 | Left-aligned hero with a product fragment on the right, then ruled tables for every section | Same composition each time | manual | Change the form of at least two sections (a colour band, a large quote, an annotated screenshot, a single figure) |
| D5 | Austerity as the whole idea: no imagery, no colour fields, no scale contrast | Restraint without a reason | manual | Spend restraint deliberately: one place of real visual weight per screen, and rhythm changes down the page |
| D6 | Always picking the same two worlds for a brief type | Taste fell back to habit | manual | Draw candidates from two families that did not win last time on this kind of brief |

## Alternatives menu, per axis (use to choose, not to copy)

**Ground:** warm paper; cool neutral light; mid-tone flat colour as the whole page; deep dark with one lit surface; photographic or illustrated field; high-contrast black on white with no tint; a tint borrowed from the product's material (kraft, blueprint, terminal, signage).

**Type voice:** grotesque with tight tracking; humanist sans; slab or Clarendon-style serif; condensed display; monospaced as the main voice; geometric with a distinct numeral set; a text serif used small and set long; all-lowercase or all-caps as a system. The display face and the text face should do different jobs.

**Layout grammar:** asymmetric two-column with an offset; full-bleed sections with a fixed rail; a table or ledger as the structure; a single long column like an article with margin notes; a grid with visible rules; split screen; one oversized object and small supporting text; a sidebar-driven app shell for tools.

**Accent strategy:** none (ink only) with one highlight in the data; a single saturated colour used only for action; two close hues; a signal colour reserved for "needs attention"; colour from the content (photos, product) rather than from the interface.

**Motion:** none except state changes; one choreographed entrance; scroll that reveals a process; hover that shows information; physics on one object; page transitions only. Always honour reduced motion.
