# World 21. Plain Text Sheet

**Family:** Paper and Print. **Metaphor:** a well-kept text file with a few real controls.
**Use when:** forecasts, status pages, schedules, scores, prices, logs; dense pages people check quickly and often. An Operate world.
**Never when:** the page needs to persuade or to look expensive.
**Fonts:** IBM Plex Mono, one family at one or two sizes. Google Fonts.

```css
:root {
  --surface:#fdfcf8; --surface-raised:#f3f1e9; --ink:#1c1b18; --ink-muted:#55534b; --accent:#0b5cad; --accent-ink:#ffffff; --border:#c9c5b8;
  --font-display:'IBM Plex Mono',ui-monospace,monospace; --font-text:'IBM Plex Mono',ui-monospace,monospace; --font-mono:'IBM Plex Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:.9375rem; --step-1:1.0625rem; --step-2:1.25rem; --step-3:1.5rem; --step-4:2rem;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:32px; --space-6:56px;
  --radius:0; --dur-fast:0ms; --dur:0ms; --ease:linear;
}
```
Light and dark follow the system setting; one highlight marks "now".
**Signature:** charts drawn with characters (shading blocks, a "now" marker) with a real table beside each.
**Refuse:** 1. a text chart without a table. 2. colour as the only signal. 3. images "for warmth" or boxes around data.
**First screen:** a title line, a timestamp, a monospace table with the current row marked, two plain controls.
