# World 13. CRT Terminal

**Family:** Machine and Signal. **Metaphor:** a phosphor monitor in a dark room.
**Use when:** developer tools with character, retro games, security themes, fiction.
**Never when:** long reading is the main task or the audience needs a conventional interface.
**Fonts:** VT323 (one family only), IBM Plex Mono as the readable fallback. Google Fonts.

```css
:root {
  --surface:#050805; --surface-raised:#0a110a; --ink:#3dff7a; --ink-muted:#27b552; --accent:#ffb000; --accent-ink:#1a1100; --border:#1b3a22;
  --font-display:'VT323',ui-monospace,monospace; --font-text:'VT323',ui-monospace,monospace; --font-mono:'VT323',ui-monospace,monospace;
  --step--1:1rem; --step-0:1.25rem; --step-1:1.5rem; --step-2:2rem; --step-3:3rem; --step-4:clamp(3rem,8vw,5.5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:72px;
  --radius:0; --dur-fast:0ms; --dur:120ms; --ease:steps(2,end);
}
```
**Signature:** a faint flicker and scan drift (off under reduced motion); the content stays readable and keyboard-operable.
**Refuse:** 1. barrel distortion on text. 2. rainbow glitch. 3. flicker above three flashes a second.
**First screen:** green glyphs on black, a prompt line with a blinking block, three real commands listed, nothing decorative around them.
