# World 18. Clinical Label

**Family:** Instrument and Spec. **Metaphor:** the label on a pharmacy bottle, optimised for clarity under risk.
**Use when:** medicine, health, safety, compliance: any place a misread costs something.
**Never when:** the brief wants delight or atmosphere more than accuracy.
**Grounds:** light neutral, saturated colour field.
**Fonts:** Atkinson Hyperlegible (text and display). Google Fonts.

```css
:root {
  --surface:#ffffff; --surface-raised:#f5f7f8; --ink:#101418; --ink-muted:#4b5560; --accent:#b3261e; --accent-ink:#ffffff; --border:#101418;
  --font-display:'Atkinson Hyperlegible',system-ui,sans-serif; --font-text:'Atkinson Hyperlegible',system-ui,sans-serif; --font-mono:'Atkinson Hyperlegible',system-ui,sans-serif;
  --step--1:.9375rem; --step-0:1.125rem; --step-1:1.375rem; --step-2:1.875rem; --step-3:2.5rem; --step-4:clamp(2.5rem,5vw,3.75rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:40px; --space-6:72px;
  --radius:4px; --dur-fast:0ms; --dur:0ms; --ease:linear;
}
```
The accent is a warning colour only, always with an icon and a word.
**Signature:** a strict hierarchy (drug, strength, dose, warning, schedule) with a tickable daily schedule.
**Refuse:** 1. brand colour on warnings. 2. small print or light grey text. 3. decoration of any kind.
**First screen:** a bordered label: name and strength large, dose line, a boxed warning with icon and words, a seven-day tick grid.
