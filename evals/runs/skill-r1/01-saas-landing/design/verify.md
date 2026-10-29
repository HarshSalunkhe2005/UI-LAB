# Verification log
**Method:** Browser pane (rendered), JS DOM measurements + screenshots. **Widths:** 1440, 375 (hero, how, features, pricing, FAQ viewed).
**Round 1:** found 2 targets under 44px at 375 (hero text link 25px high, footer "FAQ" link 32px wide), fixed in one batch, removed an empty paragraph in FAQ header. **Round 2 (confirming):** re-measured, none left.

| # | Check | Result | Evidence and fix |
|---|---|---|---|
| 1 | Console clean | PASS | read_console_messages: none |
| 2 | No horizontal scroll at 375 | PASS | scrollWidth 375 = innerWidth, no element past right edge |
| 3 | Targets 44x44 at 375 | PASS (after fix) | textlink min-height 44; footer links min-width 44; zero small targets in round 2 |
| 4 | h1/landmarks/alt/labels | PASS | one h1; header, nav, main, footer; no img; email has label |
| 5 | Focus visible | PASS (by CSS, not tabbed) | :focus-visible 3px outline on all; native controls, no traps |
| 6 | Reduced motion | PASS (by CSS) | bar fill animation disabled under prefers-reduced-motion; nothing loops |
| 7 | Contrast | PASS | pairs in direction.md, all >= 4.85 |
| 8 | Collisions/clipping | PASS | feature table becomes stacked list at 375; pricing stacks; screenshots reviewed |
| 9 | Every control works | PASS | ledger rows toggle quotes; FAQ details; form validates; anchors target existing ids |
| 10 | First screen hierarchy | PASS | headline, one CTA, digest ledger visible at 1440 and 375 |

**Left as known defects:** none known.
**Could not check:** real keyboard tab-through, reduced-motion emulation, Safari/Firefox, screen reader, Google Fonts loading offline (fallbacks defined).
