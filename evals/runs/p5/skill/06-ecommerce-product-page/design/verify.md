# Verify
Rendered: headless Chrome 1440 full-page screenshot; 375 view by loading the page in a 375px-wide iframe (headless Chrome enforces a ~500px minimum window, so direct 375 screenshots are cropped) plus a screenshot of that iframe. Audit: node scripts/audit-ui.mjs.
1 console errors: 0 (error listener, iframe). Pass.
2 horizontal scroll at 375: scrollWidth 360-375, no overflow. Pass.
3 tap targets at 375: found 7 links at 42-43 px high (breadcrumbs, reviews link, footer links). Fixed with min-height 44px. Re-measured after fix (see handoff). Inline sentence link "See spec" exempt.
4 one h1, landmarks present, 0 images without alt, form controls labelled. Pass.
5 focus: :focus-visible outline on all controls; radios keep a visible ring via the label. Not tabbed manually.
6 reduced motion: transitions and smooth scroll disabled. Pass.
7 contrast: declared pairs checked by the audit (0 findings).
8 collisions: viewed 1440 full page and 375 top; lower 375 sections not individually viewed (limit).
9 controls: colour, size, qty, add, sticky add, cart, gallery thumbs, related cards all act.
10 hierarchy: gallery, price and CTA first; dark capacity band and receipt change rhythm.
Audit: 0 critical, 0 warning, 2 heuristic suggestions (card hover lift, similar related cards) kept deliberately.
