# Direction

## Gate 2

| Axis | Default I would have built | Matches | Chosen | Reason |
|---|---|---|---|---|
| Ground | Dark navy dashboard or cream paper | A6, A1 | Cool grey-green paper #E9ECE6, raised panels #F6F7F3, hard ink rules | Daily-glance analytics tool; printed ledger feel, not a control-room skin |
| Type voice | Inter, or display serif with italic accent | B9, A1 | Archivo condensed 800 display, IBM Plex Sans text, Plex Mono for labels and numerals | Numbers and release labels are the product's material |
| Layout grammar | Centred hero, 3-up cards, scaled middle plan | B10, B3, A10, A12 | Left-aligned asymmetric hero; features as ruled ledger; testimonials as one offset long column; pricing as a ruled table | Analytics is tables and logs; each section changes form |
| Accent strategy | Purple gradient | B1 | Ink only, plus one vermilion reserved for "what moved" (anomaly, key phrase, Pro rule, CTA band) | Orbit's job is flagging the one thing that changed |
| Motion | Fade-up everywhere, card lift | B8, B4 | One explaining motion: chart line draws, release flag appears; light single scroll reveal; reduced-motion disables all | Chart draw shows cause after effect |

Axes changed: 5 of 5.

Swap test: swap Orbit for a competitor and the hero chart, the release-note copy and the "what moved" accent still belong to an anomaly-explaining product; only the annotation and copy would change. Ledger forms would suit any analytics tool. Acceptable.

## Gate 3

- Name: The ledger. Signature moment: hero chart with annotated drop and Orbit's note.
- Fonts: Archivo (display, 800, wdth 62-125, Google Fonts); IBM Plex Sans 400/500 (text); IBM Plex Mono 400/500 (labels, tabular numerals). Fallbacks Arial Narrow and system.
- Three refusals: 1. No gradients, glows or card lift. 2. No emoji or decorative icons, no eyebrow labels, no numbered sections. 3. No scaled or badged "Most popular" plan.

```css
:root{--surface:#E9ECE6;--surface-raised:#F6F7F3;--ink:#14161A;--ink-muted:#4A5048;--accent:#C42D08;--accent-text:#B82E0A;--accent-ink:#FFFFFF;--success:#1F6B3A;--warning:#8A5A00;--danger:#B82E0A;--border:#14161A;--hair:#B9BEB2;
--step--1:.8125rem;--step-0:1.0625rem;--step-1:1.3125rem;--step-2:clamp(1.6rem,3vw,2.25rem);--step-3:clamp(2.2rem,5vw,3.75rem);--step-4:clamp(2.9rem,8.6vw,7.4rem);
--space-1:4px;--space-2:8px;--space-3:16px;--space-4:24px;--space-5:40px;--space-6:72px;--radius:2px;--dur-fast:120ms;--dur:240ms;--ease:cubic-bezier(.2,.7,.2,1)}
```

Contrast pairs (scripts/contrast.mjs): ink on surface 15.18; ink-muted on surface 6.95; accent-text on surface 5.13; white on accent 5.64; white on ink 18.11; #9AA196 on ink (footer copyright) 6.82. Ink on accent is 3.21 and is not used for text.
