# World 19. Type Specimen

**Family:** Loud and Graphic. **Metaphor:** a foundry's own showing: giant glyph, character set, size ladder, axes.
**Use when:** type foundries, design tools, anything that sells a typeface or a system.
**Never when:** you are not actually showing a typeface.
**Grounds:** light neutral, saturated colour field, dark.
**Fonts:** the typeface being shown, plus Inter Tight for neutral labels. Google Fonts.

```css
:root {
  --surface:#ffffff; --surface-raised:#f1f1ef; --ink:#0b0b0b; --ink-muted:#555555; --accent:#ff4d1c; --accent-ink:#0b0b0b; --border:#0b0b0b;
  --font-display:'Fraunces',Georgia,serif; --font-text:'Inter Tight',system-ui,sans-serif; --font-mono:'Inter Tight',system-ui,sans-serif;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.5rem; --step-2:3rem; --step-3:6rem; --step-4:clamp(8rem,30vw,26rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:48px; --space-6:96px;
  --radius:0; --dur-fast:0ms; --dur:150ms; --ease:linear;
}
```
**Signature:** you can drag the variable axes and see the real letterforms change.
**Refuse:** 1. lorem ipsum. 2. centred layouts. 3. a specimen showing one weight.
**First screen:** one glyph at the full viewport height; a character grid; three sliders for weight, width and optical size.
