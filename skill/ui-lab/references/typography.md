# Typography

Type is the fastest way to make a page feel chosen or default. Decide four things: the display voice, the text voice, how numbers are set, and the scale.

## Fifteen vetted pairings

All fonts are free under open licences (SIL OFL) from Google Fonts; most are also on Fontsource. Self-host the files you use, or load with `font-display: swap`. Pairings give each face a job: the display face carries personality in headings, the text face carries reading, the third face (if any) is for numbers, code or labels.

| # | Display | Text | Numbers / labels | Mood and role | Fits worlds | Fallback stack |
|---|---|---|---|---|---|---|
| 1 | Instrument Serif | Geist | Geist Mono | Refined, spacious, high-end editorial | 2 | `Georgia, serif` / `system-ui, sans-serif` |
| 2 | Fraunces (soft axis) | DM Sans | DM Sans tabular | Warm, handmade, food and craft | 8, 10 | `Georgia, serif` / `system-ui, sans-serif` |
| 3 | Newsreader | Libre Franklin | Libre Franklin tabular | Journalistic, reading-first, finance and policy | 12, 24 | `Georgia, serif` / `system-ui, sans-serif` |
| 4 | Bricolage Grotesque | Nunito | Nunito tabular | Friendly, characterful, consumer and education | 6 | `system-ui, sans-serif` |
| 5 | Inter Tight | Inter Tight | Inter Tight tabular | Neutral, rational, data and institutions | 7 | `Arial, sans-serif` |
| 6 | Geist | Geist | Geist Mono | Technical, calm, developer tools | 3 | `system-ui, sans-serif` / `ui-monospace, monospace` |
| 7 | Archivo Black | Space Grotesk | Space Mono | Loud, print-like, indie and brutalist | 4, 19 | `Arial Black, sans-serif` / `system-ui, sans-serif` |
| 8 | Syne | Inter Tight | none | Cinematic, art-directed, studios and launches | 5 | `Arial Black, sans-serif` / `system-ui, sans-serif` |
| 9 | Barlow Condensed | IBM Plex Sans | IBM Plex Mono | Signage, boards, drawings, engineering | 9, 22 | `Arial Narrow, sans-serif` / `system-ui, sans-serif` |
| 10 | Source Serif 4 | Public Sans | Public Sans tabular | Institutional, museum, civic | 14, 20 | `Georgia, serif` / `system-ui, sans-serif` |
| 11 | Cormorant Garamond | Karla | Karla tabular | Ritual, boutique, elegant small caps | 17 | `Georgia, serif` / `system-ui, sans-serif` |
| 12 | Anton | Hanken Grotesk | Hanken Grotesk tabular | Poster, product launch, huge condensed type | 1 | `Impact, Arial Narrow, sans-serif` / `system-ui, sans-serif` |
| 13 | Archivo (width axis 75 to 125) | Archivo | IBM Plex Mono | Timetable, operations, dense tools | 21 and ops dashboards | `Arial, sans-serif` / `ui-monospace, monospace` |
| 14 | Atkinson Hyperlegible | Atkinson Hyperlegible | Atkinson Hyperlegible | Maximum legibility, health, safety, accessibility-led | 18 | `system-ui, sans-serif` |
| 15 | Young Serif | Work Sans | Work Sans tabular | Warm, rounded serif for small businesses | 8, 15 | `Georgia, serif` / `system-ui, sans-serif` |

Also usable: Familjen Grotesk plus Instrument Sans (tight, slightly odd grotesque for product pages), Bricolage Grotesque plus Hanken Grotesk (heavy and friendly), VT323 alone (terminal worlds 13, 16 with JetBrains Mono), Rubik plus Lora (seed packet, 15), Crimson Pro plus Public Sans (nautical, 20).

**Choosing.** Start from the brief's mood and the world, then test the pair on the page's real headline and a real paragraph. If the display face and the text face look like cousins, one of them is redundant: change the contrast (serif with sans, condensed with wide, heavy with light).

## Rules

**Scale.** Pick a ratio and stick to it: 1.2 (dense UI), 1.25 (general), 1.333 to 1.5 (editorial and marketing). Six steps are enough. Define them as tokens (`--step--1` to `--step-4`). Marketing display sizes use `clamp()` so they shrink gracefully: `clamp(2.75rem, 6vw, 5rem)`.

**Measure.** Body text 45 to 80 characters per line (about `max-width: 65ch`). Headlines can run wider but should break at meaningful phrases (`text-wrap: balance`). Never set long reading text edge to edge on a 1440 screen.

**Leading.** Body 1.5 to 1.65. Headings 1.0 to 1.2, tighter as they grow. Dense UI 1.3 to 1.4.

**Weights.** Use two or three per page. A heavy display weight needs tightened tracking (-0.01 to -0.04em); small uppercase labels need loosened tracking (+0.06 to +0.12em).

**Numerals.** Anything that lines up in a column or updates live uses tabular figures: `font-variant-numeric: tabular-nums`. Right-align number columns. Put units in a smaller, muted size next to the value. In prose use lining or oldstyle by the face's character.

**Caps.** All caps only for short labels (up to about three words), with tracking. Never for sentences.

**Italics.** Real italics only (the face's italic, not a synthesized slant). Do not give every headline one italic word; that is a house-style default (anti-slop B1).

**Minimums.** Nothing below 12 px; body at least 16 px on mobile (also prevents input zoom on iOS).

**Loading.** Self-host or preload the display font; `font-display: swap`; set `size-adjust` on a local fallback to cut layout shift; subset to the character sets you use; load only the weights you use (or one variable font file).

**Fallbacks.** Always declare a generic family at the end of every stack. Check the page with the web fonts blocked: it should still be legible and not break the layout.

**Two roles, one face is allowed.** Pairings 5, 6, 13 and 14 use one family at several weights and sizes. That is a strong choice when the scale and weight contrast are deliberate; it is a default when they are not.
