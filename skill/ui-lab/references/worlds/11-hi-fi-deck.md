# World 11. Hi-Fi Deck

**Family:** Soft and Living. **Metaphor:** the front panel of a well-made machine: knurled, labelled, slightly warm.
**Use when:** audio and instrument brands, hardware, anything whose pitch is how it sounds or feels.
**Never when:** the product has no tangible control to demonstrate.
**Fonts:** Oswald (legends) + IBM Plex Mono (readouts). Google Fonts.

```css
:root {
  --surface:#2a2822; --surface-raised:#35322a; --ink:#e8d9a6; --ink-muted:#c1b383; --accent:#ffb23f; --accent-ink:#241a05; --border:#4a463b;
  --font-display:'Oswald','Arial Narrow',sans-serif; --font-text:'IBM Plex Mono',ui-monospace,monospace; --font-mono:'IBM Plex Mono',ui-monospace,monospace;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.625rem; --step-3:2.5rem; --step-4:clamp(2.75rem,6vw,4.75rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:80px;
  --radius:6px; --dur-fast:100ms; --dur:350ms; --ease:cubic-bezier(.4,.1,.2,1);
}
```
Red is reserved for record and the hot end of meters.
**Signature:** the product is the page: a working control (play, tone, tape stage) that you can hear or see change.
**Refuse:** 1. autoplay and loud defaults. 2. glossy chrome. 3. decorative knobs that do nothing.
**First screen:** a charcoal panel with a labelled row of real controls, a needle meter in motion only after input, one amber button.
