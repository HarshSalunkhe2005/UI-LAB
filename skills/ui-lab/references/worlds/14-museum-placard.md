# World 14. Museum Placard

**Family:** Paper and Print. **Metaphor:** the label beside the object. The object is the page; the label is quiet.
**Use when:** galleries, exhibitions, heritage sites, cultural institutions, anywhere a thing needs a caption.
**Never when:** the page needs to sell or entertain louder than the object.
**Grounds:** light neutral, tinted mid-tone, dark.
**Fonts:** Source Serif 4 (text and title) + Public Sans (credit line). Google Fonts.

```css
:root {
  --surface:#f6f4ee; --surface-raised:#ffffff; --ink:#1f1d1a; --ink-muted:#57524a; --accent:#2f4a6b; --accent-ink:#ffffff; --border:#cfcac0;
  --font-display:'Source Serif 4',Georgia,serif; --font-text:'Source Serif 4',Georgia,serif; --font-mono:'Public Sans',system-ui,sans-serif;
  --step--1:.8125rem; --step-0:1.125rem; --step-1:1.375rem; --step-2:1.875rem; --step-3:2.75rem; --step-4:clamp(2.75rem,6vw,4.5rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:28px; --space-5:56px; --space-6:96px;
  --radius:0; --dur-fast:100ms; --dur:200ms; --ease:linear;
}
```
**Signature:** the hierarchy itself (title, maker and dates, medium, description, credit line) with a large-print toggle that scales the whole label.
**Refuse:** 1. card shadows and icons. 2. bright colour. 3. small grey text.
**First screen:** a large image of the object on gallery white; a label block to its right set in five clear levels; a "large print" control.
