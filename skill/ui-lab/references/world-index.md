# World index (read at Gate 2)

24 worlds in 6 families. Gate 2 asks for two candidate directions drawn from **different families**, so the worlds do the diversifying and your own taste does not. Read this index (it is short and has everything needed to choose), pick two families that could plausibly serve the brief, then open only the two chosen worlds, one file each (the File column). Do not open the others.

**What a world file contains:** family, metaphor, use when, never when, free fonts, a full `:root` token block, signature move, three refusals and a three-line first screen. Token vocabulary: `--surface` page ground, `--surface-raised` panels, `--ink` main text, `--ink-muted` secondary text, `--accent` the one action or signal colour, `--accent-ink` text on the accent, `--border` rules; type steps `--step--1` to `--step-4`, spacing `--space-1` to `--space-6`, `--radius`, motion `--dur-fast`, `--dur`, `--ease`. All fonts are free (open licence) on Google Fonts; self-host or load with `font-display: swap` and always set a fallback stack. Hex values and fonts are starting points: keep the roles and the logic, move the rest toward the brand.

## How to choose

1. **Roll** (Gate 2): draw a random number (`echo $RANDOM`, or `date +%N`), take it modulo 6, and start at that family. The families below are numbered 0 to 5 in the order listed (0 Paper and Print, 1 Loud and Graphic, 2 Machine and Signal, 3 Instrument and Spec, 4 Soft and Living, 5 Cinematic and Spatial).
2. From the rolled family, going forward and wrapping, find the first family with a world whose "Fits" matches the product, audience and the job of the page. The best-fitting world there is candidate A. Continue to the next fitting family for candidate B. Two worlds from the same family are one candidate, not two.
3. Run the swap test on each. Drop a world that would only be a skin on the content, and take the next fitting family.
4. Adapt: take the logic and token structure; move hues, fonts and shapes toward this brand. Never use a world's hex values unchanged and call it done.
5. Cross techniques freely (a Swiss grid's number treatment inside a Soft Playful page), never identities.

## Families

### Paper and Print: ink on paper, hierarchy, reading
| World | Fits | Never for | File |
|---|---|---|---|
| 2 Editorial Quiet Luxury | fashion, hospitality, architecture, high-end services | speed, comparison, no photography | `references/worlds/02-editorial-quiet-luxury.md` |
| 12 Broadsheet | newsletters, journals, finance and policy writing, long-form | tools, shops, marketing heroes | `references/worlds/12-broadsheet.md` |
| 14 Museum Placard | galleries, heritage, cultural institutions, captioned objects | selling louder than the object | `references/worlds/14-museum-placard.md` |
| 21 Plain Text Sheet | forecasts, status pages, schedules, prices, logs | persuading or looking expensive | `references/worlds/21-plain-text-sheet.md` |

### Loud and Graphic: attitude, colour, print energy
| World | Fits | Never for | File |
|---|---|---|---|
| 4 Neo-Brutalist Print | indie products, zines, creative tools | cautious buyers, dense reading | `references/worlds/04-neo-brutalist-print.md` |
| 15 Seed Packet | gardening, grocery, seasonal products, anything with a calendar | content with no seasonality | `references/worlds/15-seed-packet.md` |
| 17 Tarot | divination, games, wellbeing, outcome-dealing products | a SaaS with a mystic coat of paint | `references/worlds/17-tarot.md` |
| 19 Type Specimen | type foundries, design tools, systems | not showing a typeface | `references/worlds/19-type-specimen.md` |

### Machine and Signal: terminals, boards, status
| World | Fits | Never for | File |
|---|---|---|---|
| 3 Technical Dark | developer tools, infrastructure, AI tooling, security | non-technical audiences | `references/worlds/03-technical-dark.md` |
| 9 Departures Board | rail, ferry, airline, event schedules, anything with times and states | no real timetable data | `references/worlds/09-departures-board.md` |
| 13 CRT Terminal | dev tools with character, retro games, hacking themes | long reading | `references/worlds/13-crt-terminal.md` |
| 16 Terminal BBS | developer portfolios, conversational text-first sites | five-second findability for strangers | `references/worlds/16-terminal-bbs.md` |

### Instrument and Spec: precision, data, risk
| World | Fits | Never for | File |
|---|---|---|---|
| 7 Swiss Grid and Data Poster | reports, data stories, institutions, clarity as the pitch | warmth, ornament, no real data | `references/worlds/07-swiss-grid-and-data-poster.md` |
| 18 Clinical Label | medicine, health, safety, compliance | delight or atmosphere over accuracy | `references/worlds/18-clinical-label.md` |
| 20 Nautical Chart | maps, depth or elevation data, travel, science | a stock tile with a filter | `references/worlds/20-nautical-chart.md` |
| 22 Blueprint | engineering, architecture, construction, calculators | blue as the only reason | `references/worlds/22-blueprint.md` |
| 23 Thermal Receipt | checkout, tickets, booking, anything itemised | hiding a fee behind the format | `references/worlds/23-thermal-receipt.md` |

### Soft and Living: warm, tactile, human
| World | Fits | Never for | File |
|---|---|---|---|
| 6 Soft Playful | consumer apps, kids and education, light wellness | money, health or legal risk as the main emotion | `references/worlds/06-soft-playful.md` |
| 8 Warm Organic | food, wellness, craft, sustainability, local business | technical or urgent products | `references/worlds/08-warm-organic.md` |
| 10 Botanical Plate | nature, craft, archive, field guides, slow commerce | no hand-built illustration | `references/worlds/10-botanical-plate.md` |
| 11 Hi-Fi Deck | audio, instruments, hardware, tangible controls | products with nothing to operate | `references/worlds/11-hi-fi-deck.md` |

### Cinematic and Spatial: motion-led, immersive, explorable
| World | Fits | Never for | File |
|---|---|---|---|
| 1 Product Hero Scroll | a physical product that is the star, with a model or frames | no object worth looking at | `references/worlds/01-product-hero-scroll.md` |
| 5 Cinematic Immersive | portfolios, studios, launches, games | task-first users, low-powered devices | `references/worlds/05-cinematic-immersive.md` |
| 24 Explorable Explainer | teaching, documentation, science and data communication | nothing to manipulate | `references/worlds/24-explorable-explainer.md` |
