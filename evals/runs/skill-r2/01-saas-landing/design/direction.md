# Direction (design/direction.md)

## Gate 2: house-style check

| Axis | Default I would have built | Matches in anti-slop.md | Chosen direction | Reason from the brief |
|---|---|---|---|---|
| Ground | Near-black with purple/blue glow, or cream paper | B1, B7, A1, D1 | Flat highlighter yellow hero; paper, deep green and coral bands further down | Digest is a highlighter-on-paper artefact; PMs skim Monday morning, so the page should read as "marked up" |
| Type voice | Inter + serif italic accent, or grotesque + mono labels | B9, A1, A2, D2 | Bricolage Grotesque (heavy, tight, slightly odd) for display; Hanken Grotesk text with tabular figures, no mono | Customer quotes need a plain voice; numbers sit in the text face (avoids D2) |
| Layout grammar | Centred hero, three-up steps, bento features, middle-tier-badged pricing | A7, A9, A10, A12, B3, B10 | Asymmetric hero with a collapsing-tickets object; steps as alternating rows each with its own product moment; features as one annotated digest; plain-language plans, no badge | Evidence-first: show the product fragment, annotate it |
| Accent strategy | One gradient accent for buttons | B1, D1 | Ink-green buttons and ground, yellow as highlighter, coral reserved for the customer-voice quote band; colour used by section, not only for action | Colour fields carry the rhythm instead of one action colour |
| Motion | Fade-up on every block | B8 | One thing: digest bars grow once when the digest scrolls into view; reduced motion shows final state | The only motion that explains something is "tickets become counts" |

**Candidates:**
- Candidate 1: yellow highlighter ground, green and coral bands, Bricolage + Hanken (the winner).
- Candidate 2: black-on-white, one blue field, condensed display, ruled newspaper layout (rejected: D3/D5 territory, a ledger metaphor with hairlines).
- Chosen, because the highlighter reads as the product's act (marking what matters) and gives the page the strongest first-screen weight.

Axes changed: 5 of 5. Section D checked: yes (no cool-grey ground, no mono data voice, no ledger metaphor, hero is not a left text / right fragment with ruled tables everywhere; sections change form: annotated digest, full-bleed quote band, plain details FAQ).

**Boldest visual element on first screen:** full yellow field with a giant tight headline and the dark-green digest card where three ticket lines feed one ranked row.
**Rhythm changes:** yellow (hero) -> paper (how it works, light and airy) -> deep green (annotated digest, dense) -> coral (one huge quote, large scale) -> paper/yellow (pricing) -> ink (footer).

**Swap test:** swap in a competitor and the ticket-to-digest object, the counts of accounts/ARR and the highlighter ground all have to be redone; the structure is tied to this product.

## Gate 3: direction card

- **Name and metaphor:** "Highlighter". A ticket pile marked up into one page.
- **Signature moment:** three ticket slips collapse into the first digest row with its numbers.
- **Fonts:** display Bricolage Grotesque 700/800 (Google Fonts); text Hanken Grotesk 400/500/700 (Google Fonts), `font-variant-numeric: tabular-nums` for figures. No mono. Fallback system-ui.
- **Three refusals:** 1. No gradients, glows or glass. 2. No invented logo wall; proof is named-role quotes and one sourced-style figure. 3. No rotated stickers, eyebrow labels or scroll fade-up on every block.

```css
:root {
  --surface: #F3D54E;
  --surface-raised: #FBF8EF;
  --ink: #14201B;
  --ink-muted: #3D3A14;      /* on yellow */
  --ink-muted-paper: #5A5648;
  --accent: #0E3B2E;
  --accent-ink: #F3D54E;
  --coral: #FF7A59;
  --success: #1B6B44; --warning: #8A5A00; --danger: #B3261E;
  --border: rgba(20,32,27,.18);
  --step--1: .875rem; --step-0: 1.0625rem; --step-1: 1.25rem; --step-2: 1.75rem; --step-3: clamp(2rem,4vw,3rem); --step-4: clamp(2.75rem,7vw,6rem);
  --space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px; --space-5: 48px; --space-6: 96px;
  --radius: 10px;
  --dur-fast: 120ms; --dur: 700ms; --ease: cubic-bezier(.2,.7,.2,1);
}
```

Contrast checked (contrast.mjs): ink/yellow 11.53, muted/yellow 7.96, yellow/green 8.58, ink/coral 6.53, ink/paper 15.79, muted-paper/paper 6.92, pale-green/green 8.00, danger/paper 6.16, success/paper 6.12.
