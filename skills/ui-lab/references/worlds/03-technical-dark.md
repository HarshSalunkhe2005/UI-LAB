# World 3. Technical Dark

**Family:** Machine and Signal. **Metaphor:** a well-lit terminal with a single status light.
**Use when:** developer tools, infrastructure, AI tooling, security, where the product has a real interface to show.
**Never when:** the audience is non-technical, the product has no interface, or "dark with a glow" is the only reason.
**Grounds:** dark, tinted mid-tone.
**Fonts:** Geist (text and display) + Geist Mono (code and data only). Google Fonts.

```css
:root {
  --surface:#0a0a0b; --surface-raised:#131316; --ink:#ececee; --ink-muted:#9a9aa3; --accent:#3ddc97; --accent-ink:#04140c; --border:rgba(255,255,255,.1);
  --font-display:'Geist',system-ui,sans-serif; --font-text:'Geist',system-ui,sans-serif; --font-mono:'Geist Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.625rem; --step-3:2.5rem; --step-4:clamp(2.75rem,6vw,4.5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:24px; --space-5:48px; --space-6:96px;
  --radius:8px; --dur-fast:120ms; --dur:220ms; --ease:cubic-bezier(.2,.8,.2,1);
}
```
**Signature:** an interactive or animated slice of the product itself (a real component, not a screenshot); keyboard shortcuts shown inline.
**Refuse:** 1. purple-blue gradient blobs. 2. "10x faster" metric rows. 3. monospace used everywhere as decoration.
**First screen:** a plain headline and one command-like button on the left; on the right the live product panel with real rows; a quiet one-line install or sign-up under it.
