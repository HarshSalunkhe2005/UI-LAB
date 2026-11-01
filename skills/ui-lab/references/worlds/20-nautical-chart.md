# World 20. Nautical Chart

**Family:** Instrument and Spec. **Metaphor:** an Admiralty chart: contours, soundings, a compass rose.
**Use when:** maps, data with depth or elevation, travel, science; anything with a continuous surface.
**Never when:** you only have a stock map tile and a colour filter.
**Grounds:** light neutral, tinted mid-tone, dark.
**Fonts:** Crimson Pro italic (soundings and places) + Public Sans (legend). Google Fonts.

```css
:root {
  --surface:#efe9d6; --surface-raised:#f7f2e2; --ink:#1d2b3a; --ink-muted:#4a5a6a; --accent:#a3166b; --accent-ink:#ffffff; --border:#7d93a8;
  --font-display:'Crimson Pro',Georgia,serif; --font-text:'Public Sans',system-ui,sans-serif; --font-mono:'Public Sans',system-ui,sans-serif;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.625rem; --step-3:2.5rem; --step-4:clamp(2.5rem,6vw,4.25rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:72px;
  --radius:0; --dur-fast:150ms; --dur:600ms; --ease:cubic-bezier(.4,0,.2,1);
}
```
Sea blues in steps (`#dbe6ea`, `#b9d0d9`, `#8fb2c2`, `#5f90a6`); magenta only for hazards and labels.
**Signature:** a generated contour field that responds to a control (a tide slider redraws the water line).
**Refuse:** 1. a stock tile with a filter. 2. rainbow gradients for depth. 3. fading contours instead of redrawing them.
**First screen:** a chart sheet with a compass rose, contour lines, three sounding numbers, a tide slider with its value shown.
