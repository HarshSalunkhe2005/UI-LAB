/*
 * Accordion on native <details>/<summary> (keyboard + screen readers for
 * free), with a smooth height animation using `interpolate-size` and
 * ::details-content where supported. `name` makes it exclusive (one open).
 */

const CSS = `
.acc { interpolate-size: allow-keywords; }
.acc::details-content { height: 0; overflow: hidden; transition: height .35s var(--ease-out-expo), content-visibility .35s allow-discrete; }
.acc[open]::details-content { height: auto; }
.acc summary::-webkit-details-marker { display: none; }
.acc[open] .chev { transform: rotate(45deg); }
@media (prefers-reduced-motion: reduce) { .acc::details-content { transition: none; } }
`

const FAQ = [
  ['What is UI Lab?', 'A reference library of UI patterns, each a single file with a live demo, built to be read by AI agents and humans.'],
  ['Can I use the code?', 'Yes. Copy tokens.css first, then any pattern file. Most have no dependencies beyond React and Tailwind.'],
  ['Does it handle accessibility?', 'Every pattern lists its keyboard, screen-reader and reduced-motion behaviour in its doc.'],
  ['How do I add a pattern?', 'Add a file under src/patterns and one entry in src/meta.ts. Everything else is generated.'],
]

export default function Accordion() {
  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      <style>{CSS}</style>
      {FAQ.map(([q, a], i) => (
        <details key={q} name="faq" className="acc group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium">
            {q}
            <span className="chev text-xl leading-none text-fg-muted transition-transform duration-300" aria-hidden>+</span>
          </summary>
          <p className="px-5 pb-4 text-sm text-fg-muted">{a}</p>
        </details>
      ))}
    </div>
  )
}
