# Niche worlds: when the product has a physical or editorial home

`worlds.md` holds the eight general directions. These sixteen are narrower. Each one borrows the look and the logic of a
real object or printed form, and it only works when the brief genuinely lives there: a departures board for a rail
company, a clinical label for a medicine. Use one when the content already belongs to it. A skin applied to unrelated
content is a gimmick, and the swap test will catch it.

Every card has the same shape as `worlds.md`. **Proof** names the pattern (and, where one exists, the whole site) that
shows the world working. Open it at `#/<slug>` or `#/live/<slug>` before you commit.

**A niche world is a vocabulary, not a template.** Take the logic (what the object does, how it is set, how it
communicates), then rebuild it for the content in front of you.

---

## 9. Departures Board
**Proof:** site `site-departures`, pattern `niche-split-flap`.
**Use for:** rail, ferry, airline, event schedules, anything with times, places and states.
**Metaphor:** a station hall at dusk; the board is the voice of the building.
**Palette:** night blue-black `#080b14`, board brown-black `#16130e`, flap cream `#f1e8c9`, one signal yellow `#ffd23f`.
**Type:** a condensed sign face for headings (Barlow Condensed, Oswald), a monospace for the board (JetBrains Mono, IBM Plex Mono).
**Motion:** cells cycle forward through the alphabet to a target, 60 ms per step; nothing else on the page moves like that.
**Signature:** a board whose rows change status while you watch, with a real table behind it for assistive tech.
**Needs:** real route/timetable data; the board's credibility is in the data.
**Refuse:** a board used as a decoration, fake urgency colours, auto-playing sound, flap animation under reduced motion.

## 10. Botanical Plate
**Proof:** site `site-herbarium`, pattern `niche-plate-callouts`.
**Use for:** nature, craft, archive, museum shop, slow commerce, field guides.
**Metaphor:** a pressed specimen mounted on cotton paper with a numbered key.
**Palette:** paper `#efe4cc`, ink `#2a2418`, leaf green `#4f7a38`, one printer's red `#a8402a`; the specimen is the only saturated thing.
**Type:** a soft old-style serif (Fraunces), small caps mono for labels (JetBrains Mono), a handwriting face (Caveat) for annotation only.
**Motion:** slow reveals; the drawing responds to input (pointer, slider), nothing loops.
**Signature:** an illustration driven by one number: press the plant and it dries, folds and changes colour.
**Needs:** hand-built SVG or real scans. Stock vectors read as clip art.
**Refuse:** emoji flowers, handwriting for body text, grunge overlays, green-on-green.

## 11. Hi-Fi Deck
**Proof:** site `site-tape`, pattern `niche-vu-deck`.
**Use for:** audio and instrument brands, hardware, anything whose pitch is how it sounds or feels.
**Metaphor:** the front panel of a well-made machine: knurled, labelled, slightly warm.
**Palette:** panel charcoal `#2a2822`, cream legends `#e8d9a6`, one amber `#ffb23f`, a red only for record and the hot end of meters.
**Type:** a stencil-feel condensed face for legends (Oswald), a monospace for readouts (IBM Plex Mono).
**Motion:** needles ease, keys travel 4px, reels turn; every motion is mechanical and linked to state.
**Signature:** the product is the page: a working control (play, tone, tape stage) that you can hear or see change.
**Needs:** the sound or behaviour itself. Generate it in WebAudio rather than shipping files.
**Refuse:** autoplay, loud defaults, glossy chrome, decorative knobs that do nothing.

## 12. Broadsheet
**Proof:** site `site-ledger`, pattern `niche-broadsheet`.
**Use for:** newsletters, journals, finance and policy writing, long-form, reference products. This is a Read world.
**Metaphor:** a newspaper that respects your attention: rules, columns, a clear order of importance.
**Palette:** newsprint `#f3eee0`, ink `#1a1712`, one red `#b3261e` for kickers and signals; no grey UI chrome.
**Type:** a text serif with an optical-size axis (Newsreader), a neutral grotesk for data and labels (Libre Franklin).
**Motion:** almost none. A reading-progress rule is the one moving part.
**Signature:** reading is the interface: justified hyphenated columns, marginal sidenotes, text-size control, sign-and-arrow market table.
**Needs:** real copy; a broadsheet with lorem ipsum is just a grid.
**Refuse:** card grids for articles, colour-only up/down, centred body text, a hero image above the headline.

## 13. CRT Terminal
**Proof:** pattern `niche-crt`.
**Use for:** developer tools with character, retro games, security and hacking themes, fiction.
**Metaphor:** a phosphor monitor in a dark room.
**Palette:** near-black `#050805`, phosphor green `#3dff7a` or amber `#ffb000`, one dim shade of the same hue for secondary text.
**Type:** a pixel or bitmap-style mono (VT323, IBM Plex Mono at small size); one family only.
**Motion:** a faint flicker and scan drift, disabled for reduced motion; typing is instant under reduced motion.
**Signature:** the effect is cosmetic but the content stays readable and operable by keyboard.
**Needs:** nothing, it is CSS. Do not use it for content people must read at length.
**Refuse:** barrel distortion on text, rainbow glitch, flicker above three flashes a second.

## 14. Museum Placard
**Proof:** site `site-salt-road`, pattern `niche-museum-placard`.
**Use for:** galleries, exhibitions, heritage sites, cultural institutions, anywhere a thing needs a caption.
**Metaphor:** the label beside the object. The object is the page; the label is quiet.
**Palette:** gallery white `#f6f4ee`, charcoal text `#1f1d1a`, one muted institutional colour for rules.
**Type:** a restrained serif or humanist sans; strict hierarchy: title, maker and dates, medium, description, credit line.
**Motion:** none beyond the large-print toggle and audio-guide keypad.
**Signature:** the hierarchy itself, set exactly as a curator would, with a large-print option that scales the whole label.
**Needs:** real accession data. Invented dates and artists undermine the form.
**Refuse:** card shadows, icons, bright colour, small grey text.

## 15. Seed Packet
**Proof:** pattern `niche-seed-packet`.
**Use for:** gardening, grocery, food, seasonal and planting products, anything with a calendar of when.
**Metaphor:** a printed packet with a window, a hand-lettered name and instructions on the back.
**Palette:** kraft `#c9a66b`, packet cream, one saturated illustration colour per variety.
**Type:** a friendly slab or script for the name, a plain serif for instructions.
**Motion:** tilt to the pointer, one tear along the perforation.
**Signature:** the packet opens to a planting-calendar table.
**Needs:** an illustration per variety.
**Refuse:** cartoon vegetables, gradient backgrounds, a table without headers.

## 16. Terminal BBS
**Proof:** site `site-pebble`, pattern `niche-terminal-bbs`.
**Use for:** portfolios and developer sites that want a conversational, text-first interface.
**Metaphor:** a bulletin-board system: you log in, you type, it answers.
**Palette:** one dark background, one light foreground, one highlight; no gradients.
**Type:** a monospace only.
**Motion:** a boot sequence that can be skipped with any key; typing speed capped.
**Signature:** a working prompt (help, ls, cat, theme, clear) backed by real content, with a plain-link fallback.
**Needs:** the content must also exist as normal links for people who do not type.
**Refuse:** a fake terminal that cannot be used, a mandatory boot sequence, no visible focus.

## 17. Tarot
**Proof:** pattern `niche-tarot`.
**Use for:** divination, games, wellbeing, storytelling products, anything that deals out a small set of outcomes.
**Metaphor:** a velvet table and a deck: shuffle, deal, turn.
**Palette:** deep velvet, gold line `#c9a24a`, parchment faces; one card back design.
**Type:** a display serif for names, a small caps sans for labels.
**Motion:** a 3D card flip, one at a time, with reduced-motion fallback to an instant reveal.
**Signature:** every card has meaning and a reading; reshuffle deals a different set.
**Needs:** illustrated cards and real copy for each.
**Refuse:** mysticism clichés layered on a SaaS page, random text, flips that cannot be reached by keyboard.

## 18. Clinical Label
**Proof:** pattern `niche-clinical-label`.
**Use for:** medicine, health, safety, compliance: any place a misread costs something.
**Metaphor:** the label on a pharmacy bottle, optimised for clarity under risk.
**Palette:** white, black, one warning colour with an icon and a word, never colour alone.
**Type:** a highly legible sans (Libre Franklin, Atkinson Hyperlegible) with tabular numbers for doses.
**Motion:** none.
**Signature:** a strict hierarchy: drug, strength, dose, warning, schedule, with a tickable daily schedule.
**Needs:** reviewed content. Never invent doses or warnings.
**Refuse:** decoration, brand colour on warnings, small print, light grey text.

## 19. Type Specimen
**Proof:** site `site-specimen`, pattern `niche-specimen`.
**Use for:** type foundries, design tools, anything that sells a typeface or a system.
**Metaphor:** a foundry's own showing: giant glyph, character set, size ladder, axes.
**Palette:** white or black, one colour for emphasis; the typeface is the colour.
**Type:** the typeface being shown, and nothing else beyond a neutral label face.
**Motion:** live sliders for the variable axes; nothing decorative.
**Signature:** you can drag the axes and see the real letterforms change.
**Needs:** a variable font with real axes.
**Refuse:** lorem ipsum, centred layouts, a specimen with one weight.

## 20. Nautical Chart
**Proof:** site `site-tidewater`, pattern `niche-nautical-chart`.
**Use for:** maps, data with depth or elevation, travel, science, anything with a continuous surface.
**Metaphor:** an Admiralty chart: contours, soundings, a compass rose.
**Palette:** chart paper `#efe9d6`, sea blues in steps, one magenta for hazards and labels.
**Type:** a small serif italic for soundings and place names, a plain sans for the legend.
**Motion:** the water line moves with a tide slider; contours are redrawn, not faded.
**Signature:** a generated contour field (marching squares) that responds to a control.
**Needs:** real or generated elevation data.
**Refuse:** a stock map tile with a coloured filter, rainbow gradients for depth.

## 21. Plain Text Sheet
**Proof:** site `site-plain-forecast`.
**Use for:** forecasts, status pages, schedules, scores, prices, logs: anything dense that people check quickly and often. An Operate world.
**Metaphor:** a well-kept text file with a few real controls.
**Palette:** paper and ink, one link colour, one highlight for "now"; light and dark from the system setting.
**Type:** one monospace family at one or two sizes (IBM Plex Mono, JetBrains Mono).
**Motion:** none. State changes are instant and announced as text.
**Signature:** charts drawn with characters (shading blocks, asterisks, a "now" marker) with a real table next to each one.
**Needs:** real, current data, and the discipline to leave things out.
**Refuse:** a text chart without a table, colour as the only signal, images "for warmth", decorative boxes around data.

## 22. Blueprint
**Proof:** site `site-blueprint`, move `move-drafting-rules`.
**Use for:** engineering, architecture, construction, surveying, workshops, anything whose product is a drawing or a calculation.
**Metaphor:** a drawing sheet pinned to the wall: title block, grid, dimension lines.
**Palette:** blueprint blue `#0d2b52`, drafting white `#e9f4ff`, cyan for dimensions `#7fd4ff`, one amber `#ffd37a` for the thing to act on.
**Type:** a condensed drafting face for titles (Barlow Condensed), a monospace for notes and numbers (IBM Plex Mono).
**Motion:** lines draw themselves once on arrival; diagrams respond to input; nothing loops.
**Signature:** a working diagram: change the span and the beam bends, with the sums written beside it.
**Needs:** a real formula or process behind the picture, and a label saying how far to trust it.
**Refuse:** blue as decoration without a grid, fake dimensions, a calculator that does not state its limits, thin light-blue text on dark blue below 4.5:1.

## 23. Thermal Receipt
**Proof:** site `site-till-roll`.
**Use for:** order, checkout, ticket, booking and confirmation pages; shops and services that want their pricing to feel honest; anything with line items and a total.
**Metaphor:** a till receipt still warm from the printer.
**Palette:** thermal paper `#f7f4ea` on a near-black counter `#1c1b19`, one red stamp `#c4311d`, one warm yellow `#ffd166` for the action.
**Type:** a single monospace (Space Mono) at two sizes; right-aligned figures in tabular columns.
**Motion:** a new line steps in as if fed from the printer, once, and not at all under reduced motion.
**Signature:** the receipt is the form: change the order and the printed lines, the total and the barcode change with it.
**Needs:** real prices and rules (what is included, what is not), written down plainly.
**Refuse:** a receipt that hides a fee, a fake barcode implied to be scannable, text that wraps out of its column, a skeuomorphic crinkle texture.

## 24. Explorable Explainer
**Proof:** site `site-curves`.
**Use for:** teaching, documentation, onboarding, science and data communication, any page whose job is to make someone understand how something works. A Read world.
**Metaphor:** a good textbook whose figures you can pick up.
**Palette:** warm paper `#fbf8f1`, ink, one working blue for what you control and one amber for what the system computes.
**Type:** a readable serif for explanation (Newsreader), a bold sans for headings and controls (Hanken Grotesk), a monospace for live numbers and code.
**Motion:** only what you cause. Figures respond to dragging and sliders instantly; nothing plays on its own.
**Signature:** the figure is the argument: each passage sits beside something you can move, and the formula or code beneath it updates as you do.
**Needs:** a real model behind the figure (the same maths the thing uses), and a keyboard path to every draggable part.
**Refuse:** a figure you can only watch, drag handles without arrow-key support, decorative animation, jargon introduced before the picture that needs it.

---

## Choosing between a niche world and a general one

| Brief smells like... | Start with |
|---|---|
| timetable, schedule, status, "live" | 9 Departures Board |
| specimens, plants, archive, field notes | 10 Botanical Plate |
| sound, instruments, hardware | 11 Hi-Fi Deck |
| newsletter, journal, essay, finance | 12 Broadsheet |
| retro, hacker, fiction | 13 CRT Terminal or 16 Terminal BBS |
| exhibition, collection, heritage | 14 Museum Placard |
| seasonal, grow, cook, calendar | 15 Seed Packet |
| draw, reading, game of chance | 17 Tarot |
| health, dose, safety | 18 Clinical Label |
| type, design system | 19 Type Specimen |
| depth, terrain, travel | 20 Nautical Chart |
| status, forecast, scores, prices | 21 Plain Text Sheet |
| engineering, drawings, calculations | 22 Blueprint |
| order, checkout, booking, line items | 23 Thermal Receipt |
| explain, teach, document, "how does it work" | 24 Explorable Explainer |

If nothing here fits, do not force it: go back to `worlds.md` or invent a world. Add a niche world by copying the card
shape, building something that proves it, and registering the proof under category `Niche worlds` or `Sites`.
