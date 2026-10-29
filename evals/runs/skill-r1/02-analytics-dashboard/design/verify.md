# Verification log (design/verify.md)

**Method:** browser pane (rendered, JS inspection + screenshots)   **Widths rendered:** 1440x900, 375x812 (1024 seen incidentally)
**Round 1:** 2026-10-30, batched   **Round 2 (confirming):** 2026-10-30, after one batch of fixes

| # | Check | Result | Evidence and fix |
|---|---|---|---|
| 1 | Console: zero errors at fresh load | PASS | read_console_messages empty after load and after filter/sort/jump interactions. |
| 2 | No horizontal scroll at 375 | PASS | scrollWidth 375 = viewport. |
| 3 | Interactive elements >= 44x44 at 375 | PASS | JS sweep of buttons, selects, segmented labels: 0 under 44. (Radio inputs are overlaid by 44px labels.) |
| 4 | One h1; landmarks; alt; labels | PASS | 1 h1, header/main/footer present, no images, all select/radio have labels. |
| 5 | Visible focus; no trap | PASS (partial) | :focus-visible 3px ink outline confirmed on tabbed button; radio uses sibling-span outline. Full tab-through not exhaustively walked. |
| 6 | Reduced motion | PASS (by code) | Only bar-width transition (240ms) and a row highlight animation; the animation is inside prefers-reduced-motion:no-preference. Not rendered under emulated reduced motion. |
| 7 | Contrast 4.5:1 | PASS | scripts/contrast.mjs: ink 14.5, muted 6.1 / 5.5, accent on raised 5.7, white on accent 6.0, warning chip 6.5, success chip 5.6, accent on tint 5.2. Chart bar fill (#6F8F90) is non-text. |
| 8 | No collisions/clipping | PASS after fix | Round 1 found: (a) trend panel overlapping the table and footer at 375 (flex panels shrinking), (b) table panel collapsing at <=1199 (flex-basis 0), (c) trend x labels "Thu"/"Today" colliding and "43%" label on the point, (d) mobile row left padding differing between attention and normal rows, (e) load counts clipped in the load chart at 1440 ("31,335/39,200"), (f) table row grid stretching the page to 2100px at 1440. All fixed; confirming round clean. |
| 9 | Every control does something | PASS | Range, route, reset, attention-only, show-all, sort headers + mobile sort select, 3 view-as-table toggles, attention items jump and highlight row: all exercised. |
| 10 | First screen hierarchy in 3 seconds | PASS | At 1440: lead figure (red 88% / 43% Today) then ranked attention list with cancellations first. |

**Found in round 1 and fixed:** items (a)-(f) above; attention list was 15 items because peak-hour load was clamped at 100%, capped the load model at 94% so only the designed overbooked sailings (4) trigger it; "1 seats left" pluralised; decimal pts rounded.
**Left as known defects (and why):**
- 1440x900 page is about 100px taller than the viewport (header + 5-row attention list + 440px working area); the table scrolls inside its panel but the page scrolls slightly.
- Trend line for a single route with one early departure can swing to 0% today (small sample); labelled "Today (hollow point) is partial".
- At 375 the sticky frame is deliberately not sticky (it would eat 200px); filters scroll away.
- Passengers "vs prior" for 7/30 days is depressed because today counts only departed sailings.
**Could not check:** real touch devices, Safari/Firefox, screen reader, reduced-motion emulation, Google Fonts loading (page falls back to system fonts offline), exhaustive keyboard walk.
