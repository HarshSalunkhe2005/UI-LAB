import { useRef } from 'react'

/*
 * Signature move (Resn): the cursor leaves things behind. Here it drops the letters of a word along its path,
 * each one rising and fading. Elements are created and removed straight in the DOM (no React state), spaced by
 * distance, not time, so slow movement stays calm. Reduced motion: nothing is spawned.
 */

const WORD = 'PLAYFUL'

export default function GlyphTrail() {
  const box = useRef<HTMLDivElement>(null)
  const last = useRef({ x: 0, y: 0, i: 0 })

  const onMove = (e: React.PointerEvent) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = box.current!
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    if (Math.hypot(x - last.current.x, y - last.current.y) < 38) return
    last.current = { x, y, i: last.current.i + 1 }
    const s = document.createElement('span')
    s.textContent = WORD[last.current.i % WORD.length]
    s.className = 'gt-glyph'
    s.style.left = `${x}px`
    s.style.top = `${y}px`
    s.style.setProperty('--rot', `${(Math.random() - 0.5) * 50}deg`)
    el.appendChild(s)
    s.addEventListener('animationend', () => s.remove())
    while (el.querySelectorAll('.gt-glyph').length > 40) el.querySelector('.gt-glyph')?.remove()
  }

  return (
    <div ref={box} onPointerMove={onMove} className="relative h-80 cursor-none overflow-hidden rounded-xl border border-border bg-surface">
      <style>{`
        .gt-glyph { position: absolute; transform: translate(-50%, -50%); font: 600 34px var(--font-display, serif); color: var(--accent); pointer-events: none; animation: gt-rise 1.1s var(--ease-out-expo, ease-out) forwards; }
        @keyframes gt-rise { from { opacity: 1; transform: translate(-50%, -50%) rotate(var(--rot)) scale(1); } to { opacity: 0; transform: translate(-50%, -190%) rotate(var(--rot)) scale(0.6); } }
      `}</style>
      <p className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-[11px] text-fg-muted">Move the pointer across the card</p>
    </div>
  )
}
