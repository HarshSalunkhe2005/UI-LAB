# World 5. Cinematic Immersive

**Family:** Cinematic and Spatial. **Metaphor:** a title sequence; the interface is the credits.
**Use when:** portfolios, studios, launches, games, experiences, where the first impression is the product.
**Never when:** the user has a task to finish quickly, the device is low-powered, or you cannot afford the assets (video, WebGL, photography).
**Grounds:** dark, saturated colour field.
**Fonts:** Syne (display) + Inter Tight (small UI text). Google Fonts.

```css
:root {
  --surface:#07080c; --surface-raised:#10121a; --ink:#f1efe9; --ink-muted:#a39f96; --accent:#ffb347; --accent-ink:#1b1204; --border:rgba(241,239,233,.14);
  --font-display:'Syne','Arial Black',sans-serif; --font-text:'Inter Tight',system-ui,sans-serif; --font-mono:ui-monospace,Menlo,monospace;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.75rem; --step-3:3.5rem; --step-4:clamp(4rem,14vw,12rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:32px; --space-5:72px; --space-6:140px;
  --radius:2px; --dur-fast:200ms; --dur:1400ms; --ease:cubic-bezier(.77,0,.175,1);
}
```
The accent is pulled from the imagery itself, not chosen from a palette.
**Signature:** full-bleed video or WebGL; scroll scrubs the camera or timeline; text appears at beats and clears out of the way; page transitions are part of the show.
**Refuse:** 1. autoplay audio. 2. text over unstable imagery without a scrim. 3. loaders longer than the content is worth.
**First screen:** moving image fills the viewport; the title set huge at the lower left with nothing else competing; a tiny "scroll" cue and a nav reduced to two words.
