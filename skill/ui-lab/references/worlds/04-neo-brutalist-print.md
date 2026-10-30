# World 4. Neo-Brutalist Print

**Family:** Loud and Graphic. **Metaphor:** a risograph poster stapled to a wall.
**Use when:** indie products, zines, creative tools, anything whose personality is the pitch.
**Never when:** the buyer is cautious (finance, health, enterprise procurement) or the content is dense reading.
**Fonts:** Archivo Black (display) + Space Mono (small print), body in Space Grotesk. Google Fonts.

```css
:root {
  --surface:#fff4e0; --surface-raised:#ffffff; --ink:#111111; --ink-muted:#4a4538; --accent:#ff5a36; --accent-ink:#111111; --border:#111111;
  --font-display:'Archivo Black','Arial Black',sans-serif; --font-text:'Space Grotesk',system-ui,sans-serif; --font-mono:'Space Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:1.0625rem; --step-1:1.375rem; --step-2:2rem; --step-3:3.5rem; --step-4:clamp(3.5rem,11vw,9rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:48px; --space-6:80px;
  --radius:0; --dur-fast:100ms; --dur:200ms; --ease:cubic-bezier(.3,1.6,.5,1);
}
```
Borders are 2px `--border`; shadows are hard offsets (`4px 4px 0 var(--ink)`), the one world where they are earned.
**Signature:** thick borders with hard offset shadows that move on hover; oversized type crossing container edges; rotated stickers that carry real information.
**Refuse:** 1. blur and soft shadows. 2. gradients. 3. thin light-grey text.
**First screen:** a giant two-line headline touching the viewport edges; a sticker-shaped price or tag tilted at the corner; one chunky button with its offset shadow.
