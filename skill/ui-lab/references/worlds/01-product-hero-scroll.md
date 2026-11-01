# World 1. Product Hero Scroll

**Family:** Cinematic and Spatial. **Metaphor:** a product launch film you steer with the scroll wheel.
**Use when:** a physical or single-object product (drink, shoe, headphones, device) is the star and you have a model, frame sequence or strong cut-out.
**Never when:** there is no object worth looking at, the audience arrives to compare prices, or the page must work as a document.
**Grounds:** saturated colour field, dark, light neutral.
**Fonts:** Anton (display) + Hanken Grotesk (text). Google Fonts.

```css
:root {
  --surface:#f2542d; --surface-raised:#fff1e6; --ink:#14100d; --ink-muted:#24140c; --accent:#14100d; --accent-ink:#fff1e6; --border:rgba(20,16,13,.2);
  --font-display:'Anton','Arial Narrow',Impact,sans-serif; --font-text:'Hanken Grotesk',system-ui,sans-serif; --font-mono:ui-monospace,Menlo,monospace;
  --step--1:.875rem; --step-0:1.0625rem; --step-1:1.375rem; --step-2:2rem; --step-3:4rem; --step-4:clamp(6rem,22vw,22rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:32px; --space-5:64px; --space-6:128px;
  --radius:999px; --dur-fast:200ms; --dur:700ms; --ease:cubic-bezier(.65,0,.35,1);
}
```
One flat colour per product variant replaces `--surface` as the page scrolls; ink flips light or dark to keep 4.5:1.
**Signature:** the object turns through stages; label, colour and copy change on stage boundaries.
**Refuse:** 1. a dark gradient hero. 2. floating glass cards. 3. a second competing animation.
**First screen:** a huge condensed word fills the width behind the object; the object sits centre, tilted; one line of copy and one button at the bottom edge.
