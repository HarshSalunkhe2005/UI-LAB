# Worlds 9 to 24: narrow directions

These borrow the look and logic of a real object or printed form. A niche world works only when the content already lives there: a departures board for a ferry operator, a clinical label for a medicine. A skin on unrelated content is a gimmick, and the swap test will catch it. Take the logic (what the object does, how it is set, how it communicates), then rebuild it for your content.

Token vocabulary and font rules are the same as in `worlds.md`. All fonts are free (open licence) on Google Fonts. Pick worlds by family using `world-index.md`.

---

## 9. Departures Board
**Family:** Machine and Signal. **Metaphor:** a station hall at dusk; the board is the voice of the building.
**Use when:** rail, ferry, airline, event schedules; anything with times, places and states.
**Never when:** there is no real timetable data, or the board would only be decoration.
**Fonts:** Barlow Condensed (headings) + IBM Plex Mono (board and numbers). Google Fonts.

```css
:root {
  --surface:#080b14; --surface-raised:#16130e; --ink:#f1e8c9; --ink-muted:#b5ab8c; --accent:#ffd23f; --accent-ink:#1a1400; --border:#2c2619;
  --font-display:'Barlow Condensed','Arial Narrow',sans-serif; --font-text:'IBM Plex Mono',ui-monospace,monospace; --font-mono:'IBM Plex Mono',ui-monospace,monospace;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.75rem; --step-3:3rem; --step-4:clamp(3rem,8vw,6rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:80px;
  --radius:2px; --dur-fast:60ms; --dur:300ms; --ease:steps(4,end);
}
```
**Signature:** a board whose rows change status while you watch (cells cycle through the alphabet to a target, 60 ms a step), with a real table behind it for assistive tech.
**Refuse:** 1. fake urgency colours. 2. flap animation under reduced motion. 3. a board used as decoration.
**First screen:** a dark hall; a board of six real rows (time, place, status) fills the width; the page title is small above it; one yellow action.

## 10. Botanical Plate
**Family:** Soft and Living. **Metaphor:** a pressed specimen mounted on cotton paper with a numbered key.
**Use when:** nature, craft, archive, museum shop, slow commerce, field guides.
**Never when:** you have no hand-built or scanned illustration (stock vectors read as clip art).
**Fonts:** Fraunces (display) + JetBrains Mono (small-caps labels), Caveat for annotation only. Google Fonts.

```css
:root {
  --surface:#efe4cc; --surface-raised:#f7eed9; --ink:#2a2418; --ink-muted:#5e5440; --accent:#a8402a; --accent-ink:#f7eed9; --border:#cdbd9d;
  --font-display:'Fraunces',Georgia,serif; --font-text:'Fraunces',Georgia,serif; --font-mono:'JetBrains Mono',ui-monospace,monospace;
  --step--1:.75rem; --step-0:1.0625rem; --step-1:1.25rem; --step-2:1.75rem; --step-3:2.75rem; --step-4:clamp(3rem,7vw,5.5rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:28px; --space-5:56px; --space-6:104px;
  --radius:2px; --dur-fast:200ms; --dur:900ms; --ease:cubic-bezier(.3,.7,.2,1);
}
```
Leaf green `#4f7a38` appears only in the specimen.
**Signature:** an illustration driven by one number: press the plant and it dries, folds and changes colour.
**Refuse:** 1. emoji flowers. 2. handwriting for body text. 3. grunge overlays and green-on-green.
**First screen:** cotton paper, one large pressed specimen with numbered leader lines, a key beside it in small caps, a short serif paragraph.

## 11. Hi-Fi Deck
**Family:** Soft and Living. **Metaphor:** the front panel of a well-made machine: knurled, labelled, slightly warm.
**Use when:** audio and instrument brands, hardware, anything whose pitch is how it sounds or feels.
**Never when:** the product has no tangible control to demonstrate.
**Fonts:** Oswald (legends) + IBM Plex Mono (readouts). Google Fonts.

```css
:root {
  --surface:#2a2822; --surface-raised:#35322a; --ink:#e8d9a6; --ink-muted:#c1b383; --accent:#ffb23f; --accent-ink:#241a05; --border:#4a463b;
  --font-display:'Oswald','Arial Narrow',sans-serif; --font-text:'IBM Plex Mono',ui-monospace,monospace; --font-mono:'IBM Plex Mono',ui-monospace,monospace;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.625rem; --step-3:2.5rem; --step-4:clamp(2.75rem,6vw,4.75rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:80px;
  --radius:6px; --dur-fast:100ms; --dur:350ms; --ease:cubic-bezier(.4,.1,.2,1);
}
```
Red is reserved for record and the hot end of meters.
**Signature:** the product is the page: a working control (play, tone, tape stage) that you can hear or see change.
**Refuse:** 1. autoplay and loud defaults. 2. glossy chrome. 3. decorative knobs that do nothing.
**First screen:** a charcoal panel with a labelled row of real controls, a needle meter in motion only after input, one amber button.

## 12. Broadsheet
**Family:** Paper and Print. **Metaphor:** a newspaper that respects your attention: rules, columns, a clear order of importance.
**Use when:** newsletters, journals, finance and policy writing, long-form, reference products. A Read world.
**Never when:** the page is a tool, a shop or a marketing hero.
**Fonts:** Newsreader (text and display) + Libre Franklin (data and labels). Google Fonts.

```css
:root {
  --surface:#f3eee0; --surface-raised:#f9f5ea; --ink:#1a1712; --ink-muted:#5a5446; --accent:#b3261e; --accent-ink:#f9f5ea; --border:#1a1712;
  --font-display:'Newsreader',Georgia,serif; --font-text:'Newsreader',Georgia,serif; --font-mono:'Libre Franklin',system-ui,sans-serif;
  --step--1:.8125rem; --step-0:1.125rem; --step-1:1.375rem; --step-2:2rem; --step-3:3.25rem; --step-4:clamp(3rem,7vw,5.5rem);
  --space-1:4px; --space-2:8px; --space-3:14px; --space-4:24px; --space-5:44px; --space-6:80px;
  --radius:0; --dur-fast:100ms; --dur:200ms; --ease:linear;
}
```
**Signature:** reading is the interface: justified, hyphenated columns, marginal sidenotes, a text-size control, a market table with sign and arrow.
**Refuse:** 1. card grids for articles. 2. colour-only up and down. 3. centred body text or a hero image above the headline.
**First screen:** a masthead with a date rule; a lead headline over two narrow columns; a thin table of figures at the margin.

## 13. CRT Terminal
**Family:** Machine and Signal. **Metaphor:** a phosphor monitor in a dark room.
**Use when:** developer tools with character, retro games, security themes, fiction.
**Never when:** long reading is the main task or the audience needs a conventional interface.
**Fonts:** VT323 (one family only), IBM Plex Mono as the readable fallback. Google Fonts.

```css
:root {
  --surface:#050805; --surface-raised:#0a110a; --ink:#3dff7a; --ink-muted:#27b552; --accent:#ffb000; --accent-ink:#1a1100; --border:#1b3a22;
  --font-display:'VT323',ui-monospace,monospace; --font-text:'VT323',ui-monospace,monospace; --font-mono:'VT323',ui-monospace,monospace;
  --step--1:1rem; --step-0:1.25rem; --step-1:1.5rem; --step-2:2rem; --step-3:3rem; --step-4:clamp(3rem,8vw,5.5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:72px;
  --radius:0; --dur-fast:0ms; --dur:120ms; --ease:steps(2,end);
}
```
**Signature:** a faint flicker and scan drift (off under reduced motion); the content stays readable and keyboard-operable.
**Refuse:** 1. barrel distortion on text. 2. rainbow glitch. 3. flicker above three flashes a second.
**First screen:** green glyphs on black, a prompt line with a blinking block, three real commands listed, nothing decorative around them.

## 14. Museum Placard
**Family:** Paper and Print. **Metaphor:** the label beside the object. The object is the page; the label is quiet.
**Use when:** galleries, exhibitions, heritage sites, cultural institutions, anywhere a thing needs a caption.
**Never when:** the page needs to sell or entertain louder than the object.
**Fonts:** Source Serif 4 (text and title) + Public Sans (credit line). Google Fonts.

```css
:root {
  --surface:#f6f4ee; --surface-raised:#ffffff; --ink:#1f1d1a; --ink-muted:#57524a; --accent:#2f4a6b; --accent-ink:#ffffff; --border:#cfcac0;
  --font-display:'Source Serif 4',Georgia,serif; --font-text:'Source Serif 4',Georgia,serif; --font-mono:'Public Sans',system-ui,sans-serif;
  --step--1:.8125rem; --step-0:1.125rem; --step-1:1.375rem; --step-2:1.875rem; --step-3:2.75rem; --step-4:clamp(2.75rem,6vw,4.5rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:28px; --space-5:56px; --space-6:96px;
  --radius:0; --dur-fast:100ms; --dur:200ms; --ease:linear;
}
```
**Signature:** the hierarchy itself (title, maker and dates, medium, description, credit line) with a large-print toggle that scales the whole label.
**Refuse:** 1. card shadows and icons. 2. bright colour. 3. small grey text.
**First screen:** a large image of the object on gallery white; a label block to its right set in five clear levels; a "large print" control.

## 15. Seed Packet
**Family:** Loud and Graphic. **Metaphor:** a printed packet with a window, a hand-lettered name and instructions on the back.
**Use when:** gardening, grocery, food, seasonal and planting products, anything with a calendar of when.
**Never when:** the content has no seasonality or instructions.
**Fonts:** Rubik (variable, name) + Lora (instructions). Google Fonts.

```css
:root {
  --surface:#c9a66b; --surface-raised:#fbf2dc; --ink:#2b1d0e; --ink-muted:#4a3720; --accent:#2f7a3b; --accent-ink:#ffffff; --border:#8a6b3a;
  --font-display:'Rubik','Arial Rounded MT Bold',sans-serif; --font-text:'Lora',Georgia,serif; --font-mono:ui-monospace,Menlo,monospace;
  --step--1:.8125rem; --step-0:1.0625rem; --step-1:1.3125rem; --step-2:1.875rem; --step-3:3rem; --step-4:clamp(3rem,8vw,6rem);
  --space-1:4px; --space-2:8px; --space-3:14px; --space-4:24px; --space-5:48px; --space-6:88px;
  --radius:12px; --dur-fast:150ms; --dur:500ms; --ease:cubic-bezier(.3,.9,.3,1);
}
```
One saturated illustration colour per variety on the packet window.
**Signature:** the packet opens to a planting-calendar table.
**Refuse:** 1. cartoon vegetables. 2. gradient backgrounds. 3. a table without headers.
**First screen:** kraft ground, a cream packet with an illustration window and a bold variety name, a "sow in / harvest in" strip.

## 16. Terminal BBS
**Family:** Machine and Signal. **Metaphor:** a bulletin-board system: you log in, you type, it answers.
**Use when:** portfolios and developer sites that want a conversational, text-first interface.
**Never when:** a recruiter or a customer needs to find something in five seconds without typing.
**Fonts:** JetBrains Mono, one family. Google Fonts.

```css
:root {
  --surface:#0c0c0e; --surface-raised:#141418; --ink:#d8d8e0; --ink-muted:#9090a0; --accent:#ffcf4a; --accent-ink:#1a1400; --border:#2a2a32;
  --font-display:'JetBrains Mono',ui-monospace,monospace; --font-text:'JetBrains Mono',ui-monospace,monospace; --font-mono:'JetBrains Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.5rem; --step-3:2.25rem; --step-4:clamp(2.25rem,5vw,3.5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:36px; --space-6:64px;
  --radius:0; --dur-fast:0ms; --dur:100ms; --ease:linear;
}
```
**Signature:** a working prompt (help, ls, cat, theme, clear) backed by real content, with a plain-link fallback for anyone who does not type.
**Refuse:** 1. a fake terminal that cannot be used. 2. a boot sequence that cannot be skipped. 3. no visible focus.
**First screen:** a prompt line with a short welcome, `help` already listing five commands, the same five as plain links below.

## 17. Tarot
**Family:** Loud and Graphic. **Metaphor:** a velvet table and a deck: shuffle, deal, turn.
**Use when:** divination, games, wellbeing, storytelling products; anything that deals out a small set of outcomes.
**Never when:** the real product is a SaaS tool with a mystic coat of paint.
**Fonts:** Cormorant Garamond (names) + Karla (labels, small caps). Google Fonts.

```css
:root {
  --surface:#1a0f1f; --surface-raised:#271832; --ink:#f1e6cf; --ink-muted:#c1b08f; --accent:#c9a24a; --accent-ink:#1a0f1f; --border:#4a3558;
  --font-display:'Cormorant Garamond',Georgia,serif; --font-text:'Karla',system-ui,sans-serif; --font-mono:ui-monospace,Menlo,monospace;
  --step--1:.8125rem; --step-0:1.0625rem; --step-1:1.3125rem; --step-2:1.875rem; --step-3:3rem; --step-4:clamp(3rem,8vw,5.5rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:28px; --space-5:52px; --space-6:96px;
  --radius:10px; --dur-fast:200ms; --dur:700ms; --ease:cubic-bezier(.4,0,.2,1);
}
```
**Signature:** a 3D card flip, one card at a time, with an instant-reveal fallback for reduced motion; every card has a meaning and a reading, and reshuffling deals a different set.
**Refuse:** 1. mystic clichés on top of unrelated content. 2. random text. 3. a flip that keyboard users cannot reach.
**First screen:** dark velvet, a single face-down card with a gold line, one sentence of invitation, a "draw" button.

## 18. Clinical Label
**Family:** Instrument and Spec. **Metaphor:** the label on a pharmacy bottle, optimised for clarity under risk.
**Use when:** medicine, health, safety, compliance: any place a misread costs something.
**Never when:** the brief wants delight or atmosphere more than accuracy.
**Fonts:** Atkinson Hyperlegible (text and display). Google Fonts.

```css
:root {
  --surface:#ffffff; --surface-raised:#f5f7f8; --ink:#101418; --ink-muted:#4b5560; --accent:#b3261e; --accent-ink:#ffffff; --border:#101418;
  --font-display:'Atkinson Hyperlegible',system-ui,sans-serif; --font-text:'Atkinson Hyperlegible',system-ui,sans-serif; --font-mono:'Atkinson Hyperlegible',system-ui,sans-serif;
  --step--1:.9375rem; --step-0:1.125rem; --step-1:1.375rem; --step-2:1.875rem; --step-3:2.5rem; --step-4:clamp(2.5rem,5vw,3.75rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:40px; --space-6:72px;
  --radius:4px; --dur-fast:0ms; --dur:0ms; --ease:linear;
}
```
The accent is a warning colour only, always with an icon and a word.
**Signature:** a strict hierarchy (drug, strength, dose, warning, schedule) with a tickable daily schedule.
**Refuse:** 1. brand colour on warnings. 2. small print or light grey text. 3. decoration of any kind.
**First screen:** a bordered label: name and strength large, dose line, a boxed warning with icon and words, a seven-day tick grid.

## 19. Type Specimen
**Family:** Loud and Graphic. **Metaphor:** a foundry's own showing: giant glyph, character set, size ladder, axes.
**Use when:** type foundries, design tools, anything that sells a typeface or a system.
**Never when:** you are not actually showing a typeface.
**Fonts:** the typeface being shown, plus Inter Tight for neutral labels. Google Fonts.

```css
:root {
  --surface:#ffffff; --surface-raised:#f1f1ef; --ink:#0b0b0b; --ink-muted:#555555; --accent:#ff4d1c; --accent-ink:#0b0b0b; --border:#0b0b0b;
  --font-display:'Fraunces',Georgia,serif; --font-text:'Inter Tight',system-ui,sans-serif; --font-mono:'Inter Tight',system-ui,sans-serif;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.5rem; --step-2:3rem; --step-3:6rem; --step-4:clamp(8rem,30vw,26rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:48px; --space-6:96px;
  --radius:0; --dur-fast:0ms; --dur:150ms; --ease:linear;
}
```
**Signature:** you can drag the variable axes and see the real letterforms change.
**Refuse:** 1. lorem ipsum. 2. centred layouts. 3. a specimen showing one weight.
**First screen:** one glyph at the full viewport height; a character grid; three sliders for weight, width and optical size.

## 20. Nautical Chart
**Family:** Instrument and Spec. **Metaphor:** an Admiralty chart: contours, soundings, a compass rose.
**Use when:** maps, data with depth or elevation, travel, science; anything with a continuous surface.
**Never when:** you only have a stock map tile and a colour filter.
**Fonts:** Crimson Pro italic (soundings and places) + Public Sans (legend). Google Fonts.

```css
:root {
  --surface:#efe9d6; --surface-raised:#f7f2e2; --ink:#1d2b3a; --ink-muted:#4a5a6a; --accent:#a3166b; --accent-ink:#ffffff; --border:#7d93a8;
  --font-display:'Crimson Pro',Georgia,serif; --font-text:'Public Sans',system-ui,sans-serif; --font-mono:'Public Sans',system-ui,sans-serif;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.625rem; --step-3:2.5rem; --step-4:clamp(2.5rem,6vw,4.25rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:72px;
  --radius:0; --dur-fast:150ms; --dur:600ms; --ease:cubic-bezier(.4,0,.2,1);
}
```
Sea blues in steps (`#dbe6ea`, `#b9d0d9`, `#8fb2c2`, `#5f90a6`); magenta only for hazards and labels.
**Signature:** a generated contour field that responds to a control (a tide slider redraws the water line).
**Refuse:** 1. a stock tile with a filter. 2. rainbow gradients for depth. 3. fading contours instead of redrawing them.
**First screen:** a chart sheet with a compass rose, contour lines, three sounding numbers, a tide slider with its value shown.

## 21. Plain Text Sheet
**Family:** Paper and Print. **Metaphor:** a well-kept text file with a few real controls.
**Use when:** forecasts, status pages, schedules, scores, prices, logs; dense pages people check quickly and often. An Operate world.
**Never when:** the page needs to persuade or to look expensive.
**Fonts:** IBM Plex Mono, one family at one or two sizes. Google Fonts.

```css
:root {
  --surface:#fdfcf8; --surface-raised:#f3f1e9; --ink:#1c1b18; --ink-muted:#55534b; --accent:#0b5cad; --accent-ink:#ffffff; --border:#c9c5b8;
  --font-display:'IBM Plex Mono',ui-monospace,monospace; --font-text:'IBM Plex Mono',ui-monospace,monospace; --font-mono:'IBM Plex Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:.9375rem; --step-1:1.0625rem; --step-2:1.25rem; --step-3:1.5rem; --step-4:2rem;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:32px; --space-6:56px;
  --radius:0; --dur-fast:0ms; --dur:0ms; --ease:linear;
}
```
Light and dark follow the system setting; one highlight marks "now".
**Signature:** charts drawn with characters (shading blocks, a "now" marker) with a real table beside each.
**Refuse:** 1. a text chart without a table. 2. colour as the only signal. 3. images "for warmth" or boxes around data.
**First screen:** a title line, a timestamp, a monospace table with the current row marked, two plain controls.

## 22. Blueprint
**Family:** Instrument and Spec. **Metaphor:** a drawing sheet pinned to the wall: title block, grid, dimension lines.
**Use when:** engineering, architecture, construction, surveying, workshops; products whose output is a drawing or a calculation.
**Never when:** blue is the only reason, or the calculator cannot state its limits.
**Fonts:** Barlow Condensed (titles) + IBM Plex Mono (notes and numbers). Google Fonts.

```css
:root {
  --surface:#0d2b52; --surface-raised:#12376a; --ink:#e9f4ff; --ink-muted:#b5d3ee; --accent:#ffd37a; --accent-ink:#1a1200; --border:#7fd4ff;
  --font-display:'Barlow Condensed','Arial Narrow',sans-serif; --font-text:'IBM Plex Mono',ui-monospace,monospace; --font-mono:'IBM Plex Mono',ui-monospace,monospace;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.75rem; --step-3:2.75rem; --step-4:clamp(3rem,7vw,5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:72px;
  --radius:0; --dur-fast:100ms; --dur:600ms; --ease:cubic-bezier(.4,0,.2,1);
}
```
Cyan `#7fd4ff` is for dimension lines and rules; amber is for the thing to act on.
**Signature:** a working diagram: change the span and the beam bends, with the sums written beside it; lines draw themselves once.
**Refuse:** 1. blue without a grid. 2. fake dimensions. 3. thin light-blue text on dark blue below 4.5:1.
**First screen:** a drawing sheet with a title block, a visible grid, one diagram with dimension lines, an input and its computed result.

## 23. Thermal Receipt
**Family:** Instrument and Spec. **Metaphor:** a till receipt still warm from the printer.
**Use when:** order, checkout, ticket, booking and confirmation pages; shops and services that want pricing to feel honest; anything with line items and a total.
**Never when:** there is no itemised content, or a fee would be hidden by the format.
**Fonts:** Space Mono, one family at two sizes. Google Fonts.

```css
:root {
  --surface:#1c1b19; --surface-raised:#f7f4ea; --ink:#f7f4ea; --ink-muted:#bdb9aa; --accent:#ffd166; --accent-ink:#1c1b19; --border:#8b8778;
  --font-display:'Space Mono',ui-monospace,monospace; --font-text:'Space Mono',ui-monospace,monospace; --font-mono:'Space Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.5rem; --step-3:2.25rem; --step-4:clamp(2.25rem,5vw,3.5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:36px; --space-6:64px;
  --radius:0; --dur-fast:60ms; --dur:200ms; --ease:steps(3,end);
}
```
Text on the paper (`--surface-raised`) uses `#1c1b19`; the red stamp is `#c4311d`.
**Signature:** the receipt is the form: change the order and the printed lines, the total and the barcode change with it.
**Refuse:** 1. hiding a fee. 2. a fake scannable barcode. 3. text wrapping out of its column or a crinkle texture.
**First screen:** a near-black counter, a cream receipt strip with right-aligned tabular lines and a total, one yellow action beneath.

## 24. Explorable Explainer
**Family:** Cinematic and Spatial. **Metaphor:** a good textbook whose figures you can pick up.
**Use when:** teaching, documentation, onboarding, science and data communication; pages whose job is making someone understand how something works. A Read world.
**Never when:** nothing in the content can be manipulated.
**Fonts:** Newsreader (explanation) + Hanken Grotesk (headings, controls) + JetBrains Mono (live numbers). Google Fonts.

```css
:root {
  --surface:#fbf8f1; --surface-raised:#ffffff; --ink:#1d1b17; --ink-muted:#58544a; --accent:#1f5fbf; --accent-ink:#ffffff; --border:#d8d2c4;
  --font-display:'Hanken Grotesk',system-ui,sans-serif; --font-text:'Newsreader',Georgia,serif; --font-mono:'JetBrains Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:1.125rem; --step-1:1.3125rem; --step-2:1.875rem; --step-3:2.75rem; --step-4:clamp(2.75rem,6vw,4.5rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:28px; --space-5:52px; --space-6:96px;
  --radius:8px; --dur-fast:100ms; --dur:250ms; --ease:cubic-bezier(.2,.8,.2,1);
}
```
Blue means "you control this"; amber `#b36a00` means "the system computed this".
**Signature:** the figure is the argument: each passage sits beside something you can move, and the formula or code beneath it updates as you do.
**Refuse:** 1. a figure you can only watch. 2. drag handles without arrow-key support. 3. jargon introduced before the picture that needs it.
**First screen:** a serif paragraph on the left, a figure with one blue slider on the right, the formula beneath it recomputing.
