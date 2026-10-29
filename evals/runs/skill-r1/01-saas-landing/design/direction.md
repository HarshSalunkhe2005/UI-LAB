# Direction

## Gate 2: house-style check
| Axis | Default I would have built | Matches | Chosen | Reason |
|---|---|---|---|---|
| Ground | Off-white/cream or dark slate | A1, A6 | Cool paper grey (#EEF1F4) with white ledger sheets and one ink-dark closing band | PMs read digests as documents; paper + rules signals "report", not "app" |
| Type voice | Serif display w/ italic accent word, or Inter | A1, B9 | Familjen Grotesk bold (display), Instrument Sans (text), IBM Plex Mono for counts and quotes metadata | The product's output is numbers and verbatim quotes; mono carries "this is data", grotesque carries the argument |
| Layout grammar | Centred hero, three-up cards, bento | A7, A9, B3, B10 | Ledger/table structure with visible rules; hero is the digest itself, left-aligned two-column; features as a comparison table; steps as a weekday timeline | The product is a ranked list; the page is shaped like one |
| Accent | Blue/purple glow gradient | B1, A6 | Ink only, one vermilion (#C92A0E) reserved for action and "rising" requests | Colour means "look here" exactly like in the digest |
| Motion | Fade-up on everything | B8 | One thing: ledger bars fill once on load; row expand. Nothing else. Reduced motion: none | Bars explain magnitude |

Axes changed: 5 of 5. Also avoided: eyebrow labels, numbered sections, stamps, marquee, "Most popular" scaled tier, pills.

**Swap test:** swap in a competitor and the hero ledger, tier descriptions (who each is for) and quotes all have to be rewritten with their data: the design is specific to a ranked-ledger product.

## Gate 3: direction card
- **Name/metaphor:** "The Monday Ledger": a newsroom's weekly bulletin.
- **Signature moment:** hero digest, click a row to read the tickets.
- **Fonts:** Familjen Grotesk 700 (Google Fonts), Instrument Sans 400/500/600 (Google), IBM Plex Mono 400/500 (Google); fallbacks system.
- **Refusals:** 1. No gradients, glows or glass. 2. No decorative labels, numbered sections or badges. 3. No looping or scroll-triggered fade-ups.

```css
:root{
  --surface:#EEF1F4; --surface-raised:#FFFFFF; --ink:#0F1720; --ink-muted:#4A5565;
  --accent:#C92A0E; --accent-ink:#FFFFFF; --success:#1F7A4D; --warning:#8A5A00; --danger:#C92A0E;
  --border:#C9D1DA;
  --step--1:.8125rem; --step-0:1rem; --step-1:1.25rem; --step-2:1.75rem; --step-3:clamp(2rem,4vw,2.75rem); --step-4:clamp(2.6rem,6.2vw,5rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:48px; --space-6:96px;
  --radius:4px; --dur-fast:120ms; --dur:600ms; --ease:cubic-bezier(.2,.7,.2,1);
}
```
Contrast checked: ink/surface 15.9; muted/surface 6.7; white/accent 5.5; accent/surface 4.9; accent/white 5.5; footer muted #A9B3C1 on ink 8.5; muted/white 7.6; success/white 5.3.
