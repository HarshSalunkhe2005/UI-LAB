# Verification log

**Method:** headless Chrome screenshots (1440x900, 1440x4300 full page, 375x812) plus the Browser pane emulated at 375x812 with DOM measurement and scripted interaction. **Widths rendered:** 1440, 375.
**Round 1:** screenshots and measurements. **Round 2 (confirming):** re-ran the interaction script and overflow/target measurement after the fix.

| # | Check | Result | Evidence and fix |
|---|---|---|---|
| 1 | Console zero errors | PASS | Console read after fresh load: no messages |
| 2 | No horizontal scroll at 375 | PASS | scrollWidth 375 = viewport 375; no element past the right edge (the 375 headless full-page shot showed clipping only because headless Chrome enforces a wider minimum window; the emulated viewport measured clean) |
| 3 | Targets >= 44x44 at 375 | PASS | Script over button/a/input/summary/label: zero under 43.5 px (excluding inline text links) |
| 4 | One h1; landmarks; alt; labels | PASS | One h1 "Atlas 38"; header, nav, main, footer; svg illustrations have role=img + aria-label or aria-hidden; radios inside labels, qty buttons aria-labelled |
| 5 | Visible focus; no trap | PASS (by CSS, dialog uses native focus trap) | :focus-visible 3px outline, light and dark variants; not tabbed by hand in a real keyboard session |
| 6 | Reduced motion | PASS | Only transitions (no loops); a prefers-reduced-motion rule sets them to none; smooth scroll only under no-preference |
| 7 | Contrast | PASS | contrast.mjs: muted on surface 6.6, muted on raised 7.3, pale on harbour 7.8 / 10.0, success on raised 6.1, warning on surface 5.8, button text 15.5, ink on signal 7.9, dimension labels on each field 8.1 to 11.0 |
| 8 | No collisions or clipping | PASS after fix | Round 1: the "Front view" caption chip overlapped the "35 cm" dimension label at 375. Moved the chip to the top-right of the stage |
| 9 | Every control does something | PASS | Scripted: colour (field, bag and sold-out Rust L change), size, qty, add to bag (count 2), related add (3), bag dialog opens, remove, checkout message, close, cutaway line highlight, thumbnails switch view, anchors jump |
| 10 | First-screen hierarchy | PASS | Colour field + large bag + "Atlas 38" + price + Add to bag visible in 3 seconds at 1440; at 375 the bag fills the first screen and the title is below |

**Found in round 1 and fixed:** caption collision at 375.
**Left as known defects:** at 1440x900 the gallery thumbnails sit just under the fold; checkout is a stub message.
**Could not check:** real touch devices, Safari/Firefox, screen reader pass, keyboard walk-through by hand, Google Fonts loading offline (fallbacks defined).
