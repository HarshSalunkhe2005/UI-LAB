# World 7. Swiss Grid and Data Poster

**Family:** Instrument and Spec. **Metaphor:** a conference poster that happens to be interactive.
**Use when:** reports, data stories, institutions, products whose pitch is clarity and trust.
**Never when:** the brand needs warmth or ornament, or there is no real data to make the argument.
**Grounds:** light neutral, saturated colour field, dark.
**Fonts:** Inter Tight (display and text) with tabular figures, Schibsted Grotesk as an alternative. Google Fonts.

```css
:root {
  --surface:#ffffff; --surface-raised:#f4f4f2; --ink:#0d0d0d; --ink-muted:#555555; --accent:#e10600; --accent-ink:#ffffff; --border:#0d0d0d;
  --font-display:'Inter Tight',system-ui,sans-serif; --font-text:'Inter Tight',system-ui,sans-serif; --font-mono:'Inter Tight',system-ui,sans-serif;
  --step--1:.8125rem; --step-0:1rem; --step-1:1.5rem; --step-2:2.5rem; --step-3:5rem; --step-4:clamp(6rem,20vw,16rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:48px; --space-6:96px;
  --radius:0; --dur-fast:150ms; --dur:500ms; --ease:cubic-bezier(.2,.7,.2,1);
}
```
Use three sizes per screen. Numerals use `font-variant-numeric: tabular-nums`.
**Signature:** a visible 12-column grid; one giant statistic as the argument (a big number is earned here because the data is the content).
**Refuse:** 1. decoration, shadows, rounded corners. 2. more than one accent. 3. a chart without a plain statement of what it shows.
**First screen:** a rule across the top; one enormous figure with its unit and a one-line claim; three small columns of method and source beneath.
