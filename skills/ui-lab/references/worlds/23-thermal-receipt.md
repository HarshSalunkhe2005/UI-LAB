# World 23. Thermal Receipt

**Family:** Instrument and Spec. **Metaphor:** a till receipt still warm from the printer.
**Use when:** order, checkout, ticket, booking and confirmation pages; shops and services that want pricing to feel honest; anything with line items and a total.
**Never when:** there is no itemised content, or a fee would be hidden by the format.
**Grounds:** dark, light neutral, tinted mid-tone.
**Fonts:** Space Mono, one family at two sizes. Google Fonts.

```css
:root {
  --surface:#1c1b19; --surface-raised:#f7f4ea; --ink:#f7f4ea; --ink-muted:#bdb9aa; --accent:#ffd166; --accent-ink:#1c1b19; --border:#8b8778;
  --font-display:'Space Mono',ui-monospace,monospace; --font-text:'Space Mono',ui-monospace,monospace; --font-mono:'Space Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.5rem; --step-3:2.25rem; --step-4:clamp(2.25rem,5vw,3.5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:36px; --space-6:64px;
  --radius:0; --dur-fast:60ms; --dur:200ms; --ease:steps(3,end);
}
```
Text on the paper (`--surface-raised`) uses `#1c1b19`; the red stamp is `#c4311d`.
**Signature:** the receipt is the form: change the order and the printed lines, the total and the barcode change with it.
**Refuse:** 1. hiding a fee. 2. a fake scannable barcode. 3. text wrapping out of its column or a crinkle texture.
**First screen:** a near-black counter, a cream receipt strip with right-aligned tabular lines and a total, one yellow action beneath.
