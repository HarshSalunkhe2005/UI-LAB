/*
 * Focus rings that people can actually see. Use :focus-visible so the ring appears for keyboard users and not on every
 * mouse click; make it at least 2px, offset from the element, and give it 3:1 contrast against both the element and what
 * is behind it. A two-colour ring (light inside, dark outside) survives any background. Never remove the outline without a
 * replacement. Tab through the examples.
 */

const CSS = `
.fr a, .fr button, .fr input { font: inherit; }
.fr .a:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 3px; border-radius: .5rem; }
.fr .b:focus-visible { outline: 2px solid #fff; outline-offset: 0; box-shadow: 0 0 0 5px #111; }
.fr .c:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 5px var(--color-accent); }
`

export default function FocusRings() {
  return (
    <div className="fr space-y-6">
      <style>{CSS}</style>
      <p className="text-sm text-fg-muted">Press Tab to move through these. Mouse clicks do not show the ring.</p>
      <div className="flex flex-wrap items-center gap-4">
        <a href="#fr" onClick={(e) => e.preventDefault()} className="a grid min-h-11 place-items-center px-3 text-accent underline underline-offset-2">Offset outline</a>
        <button className="b min-h-11 rounded-md bg-fg px-4 text-sm font-medium text-bg">Two-colour ring</button>
        <button className="c min-h-11 rounded-md border border-border bg-surface px-4 text-sm font-medium">Gap and ring</button>
        <input className="c min-h-11 rounded-md border border-border bg-surface px-3 text-sm" placeholder="Input" aria-label="Example input" />
      </div>
      <div className="rounded-lg bg-[#111] p-4">
        <button className="b min-h-11 rounded-md border border-white/40 px-4 text-sm font-medium text-white">On a dark background</button>
      </div>
    </div>
  )
}
