# Direction (design/direction.md)

## Gate 2: house-style check

| Axis | Default I would have built | Matches in anti-slop.md | Chosen direction | Reason from the brief |
|---|---|---|---|---|
| Ground | Dark navy/slate, glass-ish cards | A6, B7 | Cool pale "sea fog" light ground (#E8ECEB), white-ish panels, one border colour | A 7am glance in a lit ops room and phone in daylight; reads in greyscale and prints. |
| Type voice | Inter at 14px everywhere | B9, C5 | Archivo (variable width, condensed for lead figures and titles) for text; IBM Plex Mono for times, counts, loads | The product is a timetable: departure-board mono for times and numbers, tabular by nature. |
| Layout grammar | Row of 4-5 equal KPI tiles on top, charts under, table last | A6, C3 | Action-first ledger: one lead figure beside the ranked attention list, load bars, then a working area (sailings table 8 cols) beside stacked analysis (delay causes, trend) | Brief order: on-time, then attention, then detail. The decision list sits in the first viewport, not under summaries. |
| Accent strategy | Blue plus amber, several series colours | A6 | Ink and grey-teal only for data; one vermilion (#B8301A) reserved for "needs action": cancelled, 95%+ full, attention markers, on-time below target | Dense-UI rule: one signal colour, used nowhere else. Amber appears only as the Delayed chip. |
| Motion | Staggered fade-up of cards, animated counters | B8 | None except bar width transitions on filter change and a 2s row highlight, all off under reduced motion | Ops tool; motion only explains a state change. |

Axes changed: 5 of 5.

**Swap test:** Replace Harbor with a bus operator and the route names, the vessel/pier ledger, the "seats" load language and the fog/tide/berth cause taxonomy all have to change; the layout (attention first) would survive, which is intended.

## Gate 3: direction card

- **Name and metaphor:** Departure board. Ink on fog, mono times, one red lamp for trouble.
- **Signature moment:** Needs-attention list ranked by passengers affected, wired to the table row.
- **Fonts:** display/text Archivo (400-800, width 75-125, Google Fonts); numerals/times IBM Plex Mono (400/500/600, Google Fonts). System fallbacks.
- **Three refusals:**
  1. No donut, no gradient, no glow, no five identical KPI tiles.
  2. No colour-only status: every state has a word and a glyph.
  3. No decorative motion or ticker; nothing loops.

```css
:root {
  --surface: #E8ECEB;
  --surface-raised: #F7F8F6;   /* panels */
  --surface-sunk: #DCE3E1;      /* tracks, head rows */
  --ink: #10282A;
  --ink-muted: #4A6264;
  --accent: #B8301A;            /* act-now only */
  --accent-ink: #FFFFFF;
  --accent-tint: #FBE9E5;
  --success: #1B6B43; --success-tint: #E3F1E8;
  --warning: #7A4E00; --warning-tint: #FFF1D6;
  --danger: #B8301A;
  --border: #C5D0CE;
  --step--1: 12px/1.35; --step-0: 14px/1.45; --step-1: 16px/1.3; --step-2: 22px/1.1; --step-3: 32px/1; --step-4: 76px/0.9;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --radius: 6px;
  --dur-fast: 120ms; --dur: 240ms; --ease: cubic-bezier(.2,.7,.2,1);
}
```

Contrast pairs checked (scripts/contrast.mjs): ink on surface-raised 14.5; ink-muted on raised 6.1, on surface 5.5; white on accent 6.0; accent on raised 5.7, on accent-tint 5.2; warning on warning-tint 6.5; success on success-tint 5.6. All pass 4.5.
