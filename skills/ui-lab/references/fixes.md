# Fixes: what failed verification, and what already-solved problems look like

Find the failing check below, apply the fix, check again. After the gate fixes comes the catalogue of problems already solved, grouped by area. Each row: what you see, the cause, the fix.

## Gate failures

### console
A console error on a fresh load. Read the message: a missing file (wrong path), a script error (a null element, a typo) or a blocked resource. Fix the cause; do not silence it. A font or script that only fails because the machine is offline is reported as a note, not a failure.

### overflow
The page is wider than 375 px. One element is too wide: a long word, a fixed-width table, an image, a negative margin, an unbroken code line. Find it by listing elements whose right edge passes the viewport. Fixes: `min-width: 0` on grid and flex children, `overflow-wrap: anywhere`, `max-width: 100%`, `minmax(0, 1fr)` in grids, `overflow-x: auto` on a wrapper for tables and code.

### targets
An interactive element is under 44 px wide or tall at 375. The log lists up to eight with their sizes. Nav and footer links are the usual failures: a link is only as wide as its text. Give links `min-height: 44px; min-width: 44px` with padding, or make the whole row the link, and keep space between neighbours. Inline links inside a sentence are exempt.

### h1-main
Not exactly one `h1`, or no `main`. A one-page app with several views has one `h1`; the view titles are `h2` and inactive views are `hidden`. Wrap the page content in one `main`.

### reduced-motion
No `prefers-reduced-motion` rule in the CSS. Add `@media (prefers-reduced-motion: reduce)` that stops looping and decorative motion (animations, transitions, smooth scrolling, auto-playing media).

### focus
No `:focus` or `:focus-visible` rule. Add a visible ring (2 px or more, offset) to every interactive element; never `outline: none` without a replacement.

### collisions
Two text boxes overlap by more than a third. Open the slice at that spot. Usual causes: a badge or stamp placed over a label, a sticky header over a heading, text under an illustration, a wrapped headline running into the next block. Give the element its own row or reserved space; check at 1440 and 375.

### wrap
A block of five or more words wraps to about one word per line (usually at 375 px, sometimes in a narrow desktop column). The log names the text and the slice. A column or grid track is too narrow for its content: a table squeezed into three columns, a side-by-side layout that did not stack, a fixed width. Stack the columns at small widths (`grid-template-columns: 1fr`), give the column a real minimum (`minmax(12rem, 1fr)`), or drop a column. A comparison such as before and after becomes two stacked blocks, not two thin columns.

### tables
At 375 px a table is wider than the screen outside a scroll wrapper, or a cell holding words is under 60 px wide. Do not squash the table. Stack each row into a small card (label above value), or keep only the columns a reader needs and expand the rest on tap, or put the table in an `overflow-x: auto` wrapper with the first column frozen.

### highlight
A highlighted or marked phrase in a heading (a background behind inline text) breaks across lines at 1440, so the highlight splits mid-phrase. Highlight a shorter phrase that fits on one line, put the phrase on its own line (`display: block` or a line break before it), or make the headline narrower or smaller so the phrase does not wrap. A highlight that wraps looks like a layout accident.

### audit-critical
The static audit found a critical issue (for example missing alt text, an unlabelled form control, or a declared text colour pair that fails contrast). The log lists each with its line. Fix it in the source.

## Loop and environment

- Check, fix every failure in one batch, check again, then stop. Do not fix and re-run one thing at a time.
- Software-rendered WebGL is slow. Wait before judging a 3D screenshot; do not "fix" slowness that is the test environment, but keep first paint cheap.
- A jump-scroll is not a wheel scroll with a smooth-scroll library. Check both when a library is involved.
- A hidden or throttled browser tab stalls transitions; finish animations before screenshots.
- Not covered by any script, so check by hand and say so in the handoff: real devices, other browsers, screen readers, interactions that appear only after a click.

## Layout and responsive

| Symptom | Cause | Fix |
|---|---|---|
| Page scrolls sideways at 375 | One element wider than the viewport: a long word, a fixed-width table, an image, a negative margin | Find it by logging elements whose `scrollWidth` exceeds the viewport; add `min-width: 0`, `overflow-wrap: anywhere`, `max-width: 100%` |
| A grid child overflows its track | Grid items default to `min-width: auto`, so long content blows the column out | `grid-template-columns: minmax(0, 1fr)`; `min-width: 0` on the child |
| A flex child will not shrink or ellipsize | Same `min-width: auto` default | `min-width: 0` on the flex child |
| Table is cut off or side-scrolls blindly at 375 | Desktop table squashed | Stacked rows, or a column-priority table with an expand control (`dense-ui.md`); if it must scroll, freeze the first column and show an edge fade |
| Layout jumps on mobile when the URL bar hides | `100vh` includes the hidden bar | `100svh` (stable) or `100dvh` (live) |
| In-page links land under a sticky header | The target scrolls to the very top | `scroll-margin-top` on targets (header height plus 16px) |
| Sticky element does not stick | An ancestor has `overflow: hidden/auto`, or the parent is as short as the sticky child | Use `overflow-x: clip` on the ancestor; give the parent real height |
| Header text and a styled span stack vertically | `display: grid` on a flex or inline container makes each node a grid item | `display: flex; gap` for inline lockups |
| Image collapses to nothing inside a zero-size 3D or flex parent | Global `img { max-width: 100% }` resolves against a 0-width parent | `max-width: none` on that image, or give the parent a size |
| Sections look cramped on one screen and loose on another | Padding in `vh` or fixed px | A spacing scale; `clamp()` for section padding |
| Hero headline wraps to five or six lines and pushes the form or button below the fold | Display size set in `vw` or a large fixed size with a narrow column | Cap the size with `clamp()`, widen the column, shorten the headline; the headline and the primary action must both fit in 1440x900 and 375x812 |
| A band has a narrow text column and an empty half | A two-column layout where the second column holds nothing or a figure that did not load | Use the width: a wider measure, a second element of real content, or a single full-width column |
| Text sits behind a decorative illustration | Absolutely positioned art overlaps a text column | Reserve the column (padding or grid track) for the art; check at 1440 and 375 |
| A badge or stamp overlaps a neighbouring label | Rotated or absolutely positioned element with no reserved room | Give it its own row or space; verify no collisions in the render |

## Type and content

| Symptom | Cause | Fix |
|---|---|---|
| Layout shifts when the webfont loads | Fallback metrics differ | `font-display: swap` plus a metric-matched fallback (`size-adjust`), or preload the font |
| Display type looks default even though a font is named | The font failed to load or the family name has a typo | Check the network panel; confirm `document.fonts.check('1em "Name"')` |
| Headlines break one word per line on mobile | Huge fixed size | `clamp()` sizes; `text-wrap: balance` on headings |
| Numbers jump as they update | Proportional figures | `font-variant-numeric: tabular-nums` |
| Inputs zoom the page on iOS | Input font size under 16px | 16px minimum on inputs at touch widths |
| Wrapped inline text looks like it collides in a checker | The inline element's bounding box spans several lines | Compare per-line rects, not the bounding box, when testing for collisions |
| Code blocks show a background box behind every line | Inline-code styling (`code { background; padding }`) also applies to `code` inside `pre` | `pre code { background: none; padding: 0; border-radius: 0 }`; style `pre` once as the block |
| A badge or illustration is covered by another element | A positioned badge over the main image on a narrow screen | Give the badge its own row below the image at small widths |
| A navigation link is 32px wide and fails the target rule | Height was set to 44px but the link is only as wide as its text | `min-width: 44px` with horizontal padding, or make the whole row the link |
| More than one `h1` in a one-page app with several views | Each view has its own `h1` in the same document | One `h1` for the page; the view titles are `h2`; hide inactive views with `hidden` |
| Placeholder disclaimers show up on the shipped page | "Sample content" notes placed in the UI | Put disclosure in the handoff; keep the page clean |

## Interaction and accessibility

| Symptom | Cause | Fix |
|---|---|---|
| Focus ring is invisible or clipped | `outline: none`, or `overflow: hidden` clipping the ring | `:focus-visible` with a 2px outline and offset; avoid clipping parents or use `outline-offset: -2px` |
| Controls are under 44px on mobile | Padding set for desktop | Raise `min-height` and `min-width` to 44px at touch widths; add space between neighbours |
| Footer and nav links are tiny targets | Inline text links in lists | Make each link a block with padding |
| Screen reader reads decorative text or repeated marquee content | Duplicated nodes for a ticker | `aria-hidden` on the duplicate, or drop the ticker |
| `aria-label` on a div, p or pre is ignored or flagged | The element has no role | Give it a role (`region`, `group`), or use visible text |
| `role="status"` on a list is flagged and breaks its children | Role not allowed there | Wrap the list in `<div role="status">` |
| `aria-selected` on a button inside a grid | Belongs on the cell or option | Move it to the `gridcell` or `option` |
| Accordion content is announced when closed | Hidden by height or opacity only | Use `<details>` or `hidden`; keep closed content out of the tab order |
| Colour contrast fails only in hover or disabled states | States were not checked | Check every state's pair |
| Smooth scrolling hijacks tests and reduced-motion users | `scroll-behavior: smooth` is global | Apply inside `@media (prefers-reduced-motion: no-preference)`; set `auto` before scripted scrolls |
| A centred popover opens in the page corner | Top-layer popover is positioned against the viewport | Set `top` and `left` from the trigger's rect when it opens |

## Motion and scroll

| Symptom | Cause | Fix |
|---|---|---|
| Page loads already showing the last section's state | A timeline renders its start values immediately, in creation order, so the last wins | `immediateRender: false` on timelines, or set initial states in CSS |
| Palette or state drifts from scroll position | Timeline shorter than the scrollable distance | Pad the timeline to the exact scroll length |
| Animation fires at the wrong offset for nested elements | `offsetTop` is relative to the nearest positioned ancestor | `getBoundingClientRect().top + scrollY` |
| Scroll feels floaty, anchors jump | Smooth-scroll library not wired to the animation ticker | Drive the library from the same ticker; enable its anchor support |
| Everything repaints on every scroll frame | A CSS variable on `<html>` is tweened and read by the whole tree | Tween one background layer instead |
| Pinned section is too short or long | Track height does not match tween distance | Track = stages times viewport; tween length = track minus one viewport |
| Screenshots show half-drawn lines and unmoved counters | Page hidden or throttled, so transitions stall | Finish animations before the screenshot (`document.getAnimations().forEach(a => a.finish())`) |
| Looping animation keeps running under reduced motion | Only entrance effects were guarded | Guard every `animation: ... infinite` in a reduced-motion query |

## 3D and canvas

| Symptom | Cause | Fix |
|---|---|---|
| Plain untextured model flashes before the texture | Material compiled without its map | Do not render the object until textures exist; create the material with the map |
| `Cannot read properties of null (reading 'position')` in a frame loop | Loop runs before the conditional mesh mounts | `if (!ref.current) return` first |
| Canvas text uses the fallback font | Font not loaded when the canvas was painted | `await document.fonts.load('100px "Face"')` before drawing |
| Canvas text mirrored or offset on a cylinder | UV seam sits at the front | `wrapS = RepeatWrapping; offset.x = 0.5` |
| Strict-mode double mount breaks WebGL | Calling lose-context in cleanup | Do not; let the renderer dispose |
| Canvas is tiny or black inside a scaled preview | Canvas measured the wrong box | Size from the offset box, not the transformed rect |

## Build and tooling

| Symptom | Cause | Fix |
|---|---|---|
| `Invalid hook call` or two Reacts after adding dependencies | Stale dev-server dependency cache | Stop the server, clear its cache directory, restart |
| `Cannot access 'X' before initialization` | A module-level helper used a `const` declared below it | Declare dependencies first, or compute inside a function |
| An effect returns a Promise and warns | `scrollIntoView` as an arrow body | Wrap in braces so the effect returns nothing |
| The first load is huge | Everything imported eagerly | Lazy-load heavy routes and libraries |
