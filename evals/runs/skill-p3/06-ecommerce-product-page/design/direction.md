# Direction (design/direction.md)

## Gate 2: house-style check

| Axis | Default I would have built | Matches in anti-slop.md | Chosen direction | Reason from the brief |
|---|---|---|---|---|
| Ground | White page, grey gallery tile | A11 (uniform), D1 (pale ground + one hot accent) | Gallery is a full-bleed field of the chosen colour; cream paper below; one harbour-blue dark band; oat band | Product is sold by colour; colour is the decision, so the page should carry it |
| Type voice | Inter everywhere | A10 | Bricolage Grotesque 800 display (tight), Instrument Sans text with tabular figures | A sturdy, slightly odd grotesque suits sailcloth and canvas; numbers stay in the text face (D2) |
| Layout grammar | 50/50 gallery left, buy column right, sections as centred stacks, 3 equal feature cards | A4, A11, D4 | 58/42 split with sticky field; buy column is a printed order slip; sections change form: big-figure band, annotated cutaway with bars, review ledger, two-column terms, product row | Different forms per section, not repeated cards |
| Accent strategy | Single brand blue button | D1 | Colour from the product (field follows selection); ink action button; sail-maker's orange only for the bag lining and patch | Keeps one signal for the product itself |
| Motion | Fade-up on everything, hover lift | A5, A9 | State-change only: field colour crossfade, thumb swap, button confirm; none looping; reduced motion disables | Motion explains selection |

**Candidate 1:** World 1 Product Hero Scroll (Cinematic and Spatial). Scroll-frames fit a hero object but the task is deciding and buying, and no real frames exist; heavy for 375.
**Candidate 2:** World 23 Thermal Receipt (Instrument and Spec). Itemised, honest-price, order lines that update with the choice.
**Chosen:** World 23, adapted: the receipt logic becomes the order slip in the buy column (lines, total, zigzag edge) while the mono voice and black counter are dropped (replaced by a colour field and a grotesque) so it does not read as another austere-monospace page (D2/D5). Cross-technique from World 8 (warm paper) for the cream ground only.

Axes changed: 5 of 5. Section D checked: yes (D1 avoided by field-follows-product; D2 avoided by text-face numerals; D3 receipt metaphor is limited to one component; D4 sections change form).

**Boldest visual element on the first screen:** the 58%-wide saturated colour field with a 600px illustrated bag and a "55 cm" dimension line.
**Rhythm changes:** (1) colour field then cream sheet, (2) big-figure spec band on raised cream, (3) harbour-blue dark band for "what's in the bag", (4) oat band for shipping and returns, (5) ink footer.

**Swap test:** with a competitor name, the colour-follows-selection field, cutaway-volume breakdown and slip would still carry only if the product is a bag with colours; the form is tied to this product's decision (colour, torso size, litre count), so it holds.

## Gate 3: direction card

- **Name and metaphor:** "Sail loft order slip". A sailmaker's loft: canvas, stencil, tally slip.
- **Signature moment:** pick a colour and the whole stage, bag drawing, thumbnails and slip line change together.
- **Fonts:** display Bricolage Grotesque 800 (Google); text Instrument Sans 400-700 (Google); tabular numerals via font-variant-numeric. Fallback system sans. No mono.
- **Three refusals:** 1. no fake urgency (timers, "only 2 viewing"). 2. no stock photo stand-ins or grey placeholder boxes. 3. no hidden costs: shipping, tax status and returns are on the slip before the button.

```css
:root{
  --surface:#f1ece0; --surface-raised:#fbf8f1; --oat:#e6dcc2; --harbour:#1f3a52;
  --ink:#17202a; --ink-muted:#4a5360; --accent:#17202a; --accent-ink:#fbf8f1;
  --signal:#f2a33a; --success:#1d6b45; --warning:#8a4b00; --danger:#a3321f;
  --border:#cdc3ab; --focus:#0b57d0;
  --step--1:.875rem; --step-0:1rem; --step-1:1.125rem; --step-2:1.5rem; --step-3:2.25rem; --step-4:clamp(3.25rem,7vw,6rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:36px; --space-6:72px;
  --radius:6px; --dur-fast:120ms; --dur:350ms; --ease:cubic-bezier(.22,.8,.3,1);
}
```
Contrast pairs (checked in verify.md): ink on surface, muted on surface, raised on ink button, pale text on harbour, focus on light/dark.
