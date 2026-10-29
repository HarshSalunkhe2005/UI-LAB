# Verification log (design/verify.md)

**Method:** headless Edge screenshots (1440 full page; 375 via a 375px-wide iframe, since headless Edge has a minimum window width) plus DOM measurements in the browser pane at 375x812.   **Widths rendered:** 1440, 375
**Round 1:** 2026-10-30   **Round 2 (confirming):** 375 re-render after fixes

| # | Check | Result | Evidence and fix |
|---|---|---|---|
| 1 | Console zero errors | NOT CHECKED | Browser pane was hidden, console not read; no script errors seen (form, toggle and bars render) |
| 2 | No horizontal scroll at 375 | PASS | scrollWidth 375 = viewport; no element right edge > 375 |
| 3 | Targets >= 44x44 at 375 | PASS (after fix) | Footer links FAQ/Sales were 32/40 wide; added min-width 44. Inline mailto link in FAQ excepted |
| 4 | One h1; landmarks; alt; labels | PASS | 1 h1; header, nav, main, footer present; email input has label; no raster images, SVGs aria-hidden |
| 5 | Visible focus; no trap | PASS by CSS, NOT tabbed | :focus-visible outline rule on all controls, inverted on dark grounds; not exercised by keyboard |
| 6 | Reduced motion | PASS by CSS | Only motion is bars growing once; reduced-motion media query sets final state, smooth scroll off |
| 7 | Contrast | PASS | contrast.mjs pairs in direction.md, all >= 6.1:1 (see direction.md) |
| 8 | Collisions/clipping | PASS (after fix) | Round 1: small quotes in coral band inherited giant size (selector too broad); scoped to the lead quote. Confirmed at 1440/375 |
| 9 | Every control does something | PASS | Nav anchors, form validates and confirms, billing toggle changes prices, details open, mailto links |
| 10 | Hierarchy in three seconds / rhythm | PASS | Yellow, paper, deep green, coral, paper+yellow, ink bands; hero object plus giant headline carries weight |

**Found in round 1 and fixed:** oversized secondary quotes; footer link widths; digest note wording (item B vs C accounts).
**Left as known defects:** none known.
**Could not check:** console, real keyboard tabbing, Google Fonts loading online (renders with fallback if blocked), Safari/Firefox, screen readers. Impeccable hook flagged "gray on color" for #BFD4C8 on #0E3B2E; measured 8.0:1, treated as false positive.
