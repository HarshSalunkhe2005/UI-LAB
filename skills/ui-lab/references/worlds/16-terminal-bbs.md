# World 16. Terminal BBS

**Family:** Machine and Signal. **Metaphor:** a bulletin-board system: you log in, you type, it answers.
**Use when:** portfolios and developer sites that want a conversational, text-first interface.
**Never when:** a recruiter or a customer needs to find something in five seconds without typing.
**Grounds:** dark, tinted mid-tone.
**Fonts:** JetBrains Mono, one family. Google Fonts.

```css
:root {
  --surface:#0c0c0e; --surface-raised:#141418; --ink:#d8d8e0; --ink-muted:#9090a0; --accent:#ffcf4a; --accent-ink:#1a1400; --border:#2a2a32;
  --font-display:'JetBrains Mono',ui-monospace,monospace; --font-text:'JetBrains Mono',ui-monospace,monospace; --font-mono:'JetBrains Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.5rem; --step-3:2.25rem; --step-4:clamp(2.25rem,5vw,3.5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:36px; --space-6:64px;
  --radius:0; --dur-fast:0ms; --dur:100ms; --ease:linear;
}
```
**Signature:** a working prompt (help, ls, cat, theme, clear) backed by real content, with a plain-link fallback for anyone who does not type.
**Refuse:** 1. a fake terminal that cannot be used. 2. a boot sequence that cannot be skipped. 3. no visible focus.
**First screen:** a prompt line with a short welcome, `help` already listing five commands, the same five as plain links below.
