# Verify
Rendered with headless Chrome: 1440 full page screenshot viewed; 375 via 375px iframe harness (screenshot viewed + DOM measurement).
- 375: scrollWidth 375, no element past viewport; all controls >=44px (only the off-screen skip link is smaller, shown on focus).
- Desktop: hierarchy clear, ground changes paper/green/yellow/paper/green, digest sheet is the weight.
- One h1, header/nav/main/footer present, input has label, focus-visible styles, reduced-motion handled, form gives inline feedback, no dead anchors.
- Not done: tab-through in a real browser, console read, scripts/audit-ui.mjs, contrast script (declared pairs are high-contrast; yellow on green, ink on yellow checked by eye only). Impeccable hook finding (overflow clip) fixed by removing body overflow-x:hidden.
