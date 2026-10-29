# Verification

Method: headless Edge screenshots (1440 full page) plus Browser pane JS checks on a 375px-wide iframe of the page. Round 1, fix batch, one confirming round.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Console errors | PASS | Browser pane console empty on load |
| 2 | No horizontal scroll at 375 | PASS | 375px iframe: scrollWidth 360 <= 375, no element past the right edge |
| 3 | Targets >= 44 px | PASS | Every a/button height >= 44 at 375 |
| 4 | One h1, landmarks, alt, labels | PASS | 1 h1; header, nav, main, footer; no images or form controls |
| 5 | Visible focus | NOT CHECKED in browser | :focus-visible 3px ink outline defined (white in footer); not tabbed through |
| 6 | Reduced motion | PASS by code only | media query forces line drawn, removes transitions; emulation not run |
| 7 | Contrast | PASS | pairs in direction.md |
| 8 | Collisions and clipping | PASS | 1440 shot clean; hero at 375 viewed in iframe, chart labels fit |
| 9 | Controls do something | PASS | all links are in-page anchors with targets |
| 10 | First-screen hierarchy | PASS | h1, vermilion second sentence, then chart |

Found in round 1 and fixed: apparent clipping at 375 (grid items sized 1fr kept min-content width); fixed with minmax(0,1fr) and overflow-wrap on headings.
Left as known defects: shots/after-375.png is cropped because headless Edge enforces a minimum window width, so it is not evidence; the iframe measurement is.
Could not check: real phone, Safari and Firefox, screen reader, keyboard tab-through, reduced-motion emulation, offline font fallback look.
