# World 17. Tarot

**Family:** Loud and Graphic. **Metaphor:** a velvet table and a deck: shuffle, deal, turn.
**Use when:** divination, games, wellbeing, storytelling products; anything that deals out a small set of outcomes.
**Never when:** the real product is a SaaS tool with a mystic coat of paint.
**Grounds:** dark, saturated colour field.
**Fonts:** Cormorant Garamond (names) + Karla (labels, small caps). Google Fonts.

```css
:root {
  --surface:#1a0f1f; --surface-raised:#271832; --ink:#f1e6cf; --ink-muted:#c1b08f; --accent:#c9a24a; --accent-ink:#1a0f1f; --border:#4a3558;
  --font-display:'Cormorant Garamond',Georgia,serif; --font-text:'Karla',system-ui,sans-serif; --font-mono:ui-monospace,Menlo,monospace;
  --step--1:.8125rem; --step-0:1.0625rem; --step-1:1.3125rem; --step-2:1.875rem; --step-3:3rem; --step-4:clamp(3rem,8vw,5.5rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:28px; --space-5:52px; --space-6:96px;
  --radius:10px; --dur-fast:200ms; --dur:700ms; --ease:cubic-bezier(.4,0,.2,1);
}
```
**Signature:** a 3D card flip, one card at a time, with an instant-reveal fallback for reduced motion; every card has a meaning and a reading, and reshuffling deals a different set.
**Refuse:** 1. mystic clichés on top of unrelated content. 2. random text. 3. a flip that keyboard users cannot reach.
**First screen:** dark velvet, a single face-down card with a gold line, one sentence of invitation, a "draw" button.
