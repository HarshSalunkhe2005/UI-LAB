# World 24. Explorable Explainer

**Family:** Cinematic and Spatial. **Metaphor:** a good textbook whose figures you can pick up.
**Use when:** teaching, documentation, onboarding, science and data communication; pages whose job is making someone understand how something works. A Read world.
**Never when:** nothing in the content can be manipulated.
**Grounds:** light neutral, tinted mid-tone, dark.
**Fonts:** Newsreader (explanation) + Hanken Grotesk (headings, controls) + JetBrains Mono (live numbers). Google Fonts.

```css
:root {
  --surface:#fbf8f1; --surface-raised:#ffffff; --ink:#1d1b17; --ink-muted:#58544a; --accent:#1f5fbf; --accent-ink:#ffffff; --border:#d8d2c4;
  --font-display:'Hanken Grotesk',system-ui,sans-serif; --font-text:'Newsreader',Georgia,serif; --font-mono:'JetBrains Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:1.125rem; --step-1:1.3125rem; --step-2:1.875rem; --step-3:2.75rem; --step-4:clamp(2.75rem,6vw,4.5rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:28px; --space-5:52px; --space-6:96px;
  --radius:8px; --dur-fast:100ms; --dur:250ms; --ease:cubic-bezier(.2,.8,.2,1);
}
```
Blue means "you control this"; amber `#b36a00` means "the system computed this".
**Signature:** the figure is the argument: each passage sits beside something you can move, and the formula or code beneath it updates as you do.
**Refuse:** 1. a figure you can only watch. 2. drag handles without arrow-key support. 3. jargon introduced before the picture that needs it.
**First screen:** a serif paragraph on the left, a figure with one blue slider on the right, the formula beneath it recomputing.
