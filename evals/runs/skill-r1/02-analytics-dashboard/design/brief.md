# Brief (design/brief.md)

1. **Product:** Harbor is a ferry operator running 6 routes (H1-H6) from two piers; this screen is its daily operations dashboard.
2. **Who/where:** The operations manager, at 7am, on a 1440px desk monitor in the ops room (and on a phone, on the way in), coffee in hand, scanning for what went wrong overnight and what will go wrong this morning.
3. **Job:** Decide in seconds (a) are we on time, (b) where and why is it going wrong, (c) which sailing do I phone about. Secondary: filter by route and date range, sort today's sailings.
4. **Mood:** timetable-board, sober, urgent-only-when-needed.
5. **Memorable moment:** The "Needs attention" list: sailings ranked by passengers affected, each with a plain-language reason, one click to the row in the sailings table.
6. **Real content:** H1 Pier 4 to Kellan Island (320 seats), H2 Pier 4 to Saltmarsh (240), H3 Northgate to Gull Rock (180), H4 Northgate to Pemberton (400), H5 Pier 9 to Ostler Bay (280), H6 Pier 9 to Cray Point (150). Headline: "Operations, Fri 30 Oct 2026". Data points: on-time 43% so far (3 of 7 departures) against a 90% target; H3 08:15 +40 min, fog, 150 booked; H6 09:00 cancelled, vessel fault, 118 to rebook. 56 sailings today. All figures computed from one seeded dataset so totals equal parts.
7. **Constraints:** static single HTML/CSS/JS file, no network except Google Fonts, inline SVG only, works at 1440 and 375, WCAG AA contrast, keyboard operable, reduced motion honoured.
8. **Must not feel like:** the default dark-navy analytics skin with a KPI tile row and a donut; a marketing page; colourful for its own sake.
