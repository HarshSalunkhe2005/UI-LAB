# Handoff (design/handoff.md)

- **Built:** `index.html` (single file, inline CSS/JS/SVG). Design artifacts in `design/`.
- **Run it:** open `index.html` in a browser. Fonts load from Google Fonts (Archivo, IBM Plex Mono) with system fallbacks.
- **Direction in one line:** Departure-board ops screen: pale fog ground, Archivo plus Plex Mono, action-first layout, one vermilion reserved for "needs action"; all 5 axes differ from the dark-navy KPI-tile default.
- **Rendered:** 1440x900 and 375x812; ranges Today / 7 days / 30 days; route All and H3; attention-only; sort by delay; attention item jump; focus outline; mobile stacked table and stacked charts.
- **Verification result:** see verify.md; no FAIL left.
- **Not tested:** other browsers, devices, screen readers, reduced-motion emulation, offline font fallback look.
- **Placeholder content:** all data is invented, generated from a seeded generator (history of 60 days plus 56 sailings today with hand-set incidents). Totals equal sums of parts. Route names, vessels and piers are fictional. "Data as of 07:12" is fixed.
- **Known defects:** page is ~100px taller than 900px viewport at 1440; trend point for a single route can plunge on a small sample; frame not sticky at 375.
- **Next steps:** wire to a real feed; add a stale-data indicator and loading skeletons; dark/night variant for the night shift.
