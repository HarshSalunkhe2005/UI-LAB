# World 22. Blueprint

**Family:** Instrument and Spec. **Metaphor:** a drawing sheet pinned to the wall: title block, grid, dimension lines.
**Use when:** engineering, architecture, construction, surveying, workshops; products whose output is a drawing or a calculation.
**Never when:** blue is the only reason, or the calculator cannot state its limits.
**Fonts:** Barlow Condensed (titles) + IBM Plex Mono (notes and numbers). Google Fonts.

```css
:root {
  --surface:#0d2b52; --surface-raised:#12376a; --ink:#e9f4ff; --ink-muted:#b5d3ee; --accent:#ffd37a; --accent-ink:#1a1200; --border:#7fd4ff;
  --font-display:'Barlow Condensed','Arial Narrow',sans-serif; --font-text:'IBM Plex Mono',ui-monospace,monospace; --font-mono:'IBM Plex Mono',ui-monospace,monospace;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.75rem; --step-3:2.75rem; --step-4:clamp(3rem,7vw,5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:72px;
  --radius:0; --dur-fast:100ms; --dur:600ms; --ease:cubic-bezier(.4,0,.2,1);
}
```
Cyan `#7fd4ff` is for dimension lines and rules; amber is for the thing to act on.
**Signature:** a working diagram: change the span and the beam bends, with the sums written beside it; lines draw themselves once.
**Refuse:** 1. blue without a grid. 2. fake dimensions. 3. thin light-blue text on dark blue below 4.5:1.
**First screen:** a drawing sheet with a title block, a visible grid, one diagram with dimension lines, an input and its computed result.
