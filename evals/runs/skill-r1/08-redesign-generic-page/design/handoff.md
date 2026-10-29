# Handoff

- Built: ../index.html (single file, static HTML/CSS/JS). Fonts via Google Fonts; graphics are inline SVG/CSS.
- Run it: open index.html.
- Direction in one line: "The ledger", all 5 axes changed from the generic default (ground, type, layout, accent, motion).
- Rendered: 1440 full page (shots/after-1440.png); 375 via iframe measurement and a viewed hero. Headless 375 PNG is cropped by the engine, see verify.md.
- Verification result: design/verify.md. No FAIL; keyboard focus and reduced motion checked by code only.
- Not tested: real devices, other browsers, screen readers, keyboard run.
- Placeholder content: hero chart data (labelled Sample data), logo names, testimonial quotes (names and roles come from the fixture, quotes rewritten), "10,000+" kept from the fixture.
- Known defects: plan and trial buttons jump to #start or #top because no signup exists; nav link "Customers" added; feature copy is rewritten, claims (encryption, no-code integrations) are plausible but unverified.
- Preserved / changed / measured: see preserve.md. Critique before 4/20; after: 0 gradients, 0 emoji icons, no scaled plan card, all targets >= 44px, no overflow at 375.
- Next steps: real product screenshot in the hero, real customer quotes, a signup destination.
