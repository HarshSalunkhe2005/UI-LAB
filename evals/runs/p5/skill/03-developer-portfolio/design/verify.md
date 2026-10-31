# Verify
Rendered with headless Chrome: 1440x900 + 1440x5000 full (shots/d-*.png), 375 via 375px-wide iframe (shots/m-iframe.png; headless window floors at ~500px so direct 375 shots are cropped and not used as evidence).
- Console/load: page rendered, tide script ran (soundings and note populate).
- 375: scrollWidth 375 = clientWidth, no element beyond viewport; exactly 1 h1; all links/inputs >= 44px high (mail link fixed from 43 to min-height 44).
- Audit: 0 critical; 1 heuristic B1 (italic accent in h1) fixed by removing italic (weight only). Re-run not repeated after the change beyond the render.
- Focus: :focus-visible outlines defined on all controls; reduced motion: only transitions, all disabled.
- Contrast: ink on parchment ~11:1, muted #46566a on parchment ~6:1, deep-muted #a9bfca on #142b38 ~8:1, accent #a3166b on parchment ~6:1 (by calculation, contrast.mjs not run).
- Not tested: real keyboard tab-through, screen reader, Safari/Firefox.
