# Colour

Colour in UI is a set of roles, not a palette of favourites. Decide the roles, choose values for them from the product's world, then check contrast.

## The role method

Define these tokens first and use only them in components:

| Role | Job | Notes |
|---|---|---|
| `--surface` | Page ground | The most used colour; sets the temperature of the whole page |
| `--surface-raised` | Panels, cards, popovers | Differs from the ground by a small tone step, not a shadow stack |
| `--ink` | Main text | Not pure black on pure white unless the world demands it; a tinted near-black reads softer and still passes |
| `--ink-muted` | Secondary text, captions | Must still pass 4.5:1 on the surfaces it sits on |
| `--accent` | The one action or signal colour | Used for buttons, links, the thing to act on; nowhere else |
| `--accent-ink` | Text on the accent | Check it against `--accent` |
| `--border` | Rules, dividers | One colour; vary width, not hue |
| `--success`, `--warning`, `--danger` | State | Always with an icon or word; test each as text and as a fill |

**Accent logic.** Choose one: (a) ink only, with a single highlight in the data; (b) one saturated colour for action only; (c) two close hues, one for action and one for emphasis; (d) a signal colour reserved for "needs attention"; (e) colour from the content (photos, product) while the interface stays neutral; (f) colour fields by section for rhythm. State the logic in the direction file. A page that uses its accent on five unrelated things has no accent.

**Where colour comes from.** The product's material, place, object or audience: a ferry gives sea fog and signal red; a kitchen gives ash, ember and oak; a clinic gives white, black and a warning colour. Start there, not from a palette site.

**Ratios.** As a starting point: surface and neutrals about 80 to 90 percent of the screen, one accent about 5 to 10 percent, state colours only where state exists. Bold directions can invert this (a full colour field), but then neutral text must carry the information.

## Contrast rules

- Body text 4.5:1 against its background; large text (about 24 px, or 19 px bold) and UI borders or icons that carry meaning 3:1.
- Check every pair that appears: ink on surface, ink-muted on surface and on surface-raised, accent-ink on accent, accent text on surface, each state colour as text, text over images (use a scrim), hover and disabled states.
- Placeholder text and disabled controls still need readable text if the information matters.
- Do not use colour alone for meaning: add a sign, icon, word or shape.
- Compute rather than eyeball. Relative luminance per WCAG 2.x: linearise each sRGB channel, weight 0.2126, 0.7152, 0.0722; ratio = (lighter + 0.05) / (darker + 0.05). `scripts/contrast.mjs <fg> <bg>` does this.

## Building tints and shades

Use a perceptual space. In CSS:

```css
:root {
  --accent: oklch(0.58 0.17 35);
  --accent-hover: oklch(from var(--accent) calc(l - 0.06) c h);
  --surface-raised: color-mix(in oklch, var(--surface), white 40%);
}
```

Keep lightness steps even (about 0.06 to 0.08 per step) and chroma lower at the extremes. For a neutral ramp, tint the greys toward the accent hue slightly (chroma 0.005 to 0.02) so the page feels like one material.

## Dark mode, derived

Do not invert. Derive:

1. **Surface:** a dark tone with a hint of the brand hue (L 0.14 to 0.2), not pure black. Raised surfaces are lighter than the ground by 0.03 to 0.05 L, since shadows are invisible on dark.
2. **Ink:** off-white (L 0.92 to 0.96). Muted ink L 0.68 to 0.75. Check 4.5:1 on both surfaces.
3. **Accent:** raise lightness and slightly lower chroma so it does not vibrate on dark; recheck `--accent-ink`.
4. **Borders:** a low-alpha light line (`rgba(255,255,255,.08)` to `.14`).
5. **State colours:** lighten each so the text version passes 4.5:1.
6. **Images and charts:** reduce brightness slightly or add a subtle overlay; re-pick chart colours instead of reusing the light-mode values.
7. Switch with `prefers-color-scheme` and a manual toggle that stores the choice; set `color-scheme` so form controls and scrollbars follow.

Some worlds (3, 5, 9, 13, 16, 22, 23) are dark by nature; do not add a light mode just to have one.

## Colour in charts and data

- One accent for the series that matters; neutrals for the rest.
- Sequential data: one hue, lightness steps. Diverging: two hues meeting at a neutral midpoint. Categorical: at most five distinguishable hues, each also labelled directly.
- Never rainbow for depth, density or magnitude.
- Colour-blind safety: do not separate red and green by hue alone; vary lightness and add labels or patterns.

## Quick audit

- Squint test: does the accent mark exactly the thing to act on?
- Greyscale test: does the page still read?
- Count the hues: more than three on one screen (excluding photos) needs a reason.
