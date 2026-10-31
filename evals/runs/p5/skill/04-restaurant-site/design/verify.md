# Verify
Rendered 1440x900 and 375x812 (Chrome headless + preview pane). 375: scrollWidth 375, no overflow, no controls under 44px, console clean. Audit script: 0 critical; fixed btn-nav hover contrast, tag size; remaining warnings heuristic/false (nav btn is min-height 44; reveal is 8 elements, disabled under reduced motion). Hook: low-contrast and clipped-overflow flags reviewed: hero overflow:hidden is intentional (art only); ratios checked >=4.5 with contrast.mjs.
Not done: keyboard tab-through by hand, real Safari/Firefox.
