import { useEffect, useRef } from 'react'

/*
 * Signature move (Cuberto): a cursor that knows what it is over. A small dot follows the pointer with lag;
 * crossing an element with data-cursor="View" grows it into a labelled pill, and leaving shrinks it back.
 * One fixed element moved with transforms (no React state). The native cursor stays visible, so nothing
 * depends on this; it is skipped on touch and under reduced motion.
 */

const WORK = [
  ['Atlas', 'View'],
  ['Meridian', 'Play'],
  ['Foundry', 'Read'],
  ['Parallel', 'View'],
] as const

export default function LabelCursor() {
  const area = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = area.current!
    const d = dot.current!
    if (matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return
    let x = 0, y = 0, tx = 0, ty = 0
    let size = 14
    let targetSize = 14
    let raf = 0
    const loop = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      size += (targetSize - size) * 0.2
      d.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`
      d.style.width = d.style.height = `${size}px`
      raf = requestAnimationFrame(loop)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = e.clientX - r.left
      ty = e.clientY - r.top
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
      if (t) {
        label.current!.textContent = t.dataset.cursor!
        targetSize = 84
        d.dataset.on = '1'
      } else {
        targetSize = 14
        delete d.dataset.on
      }
    }
    const enter = () => (d.style.opacity = '1')
    const leave = () => (d.style.opacity = '0')
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div ref={area} className="relative overflow-hidden rounded-xl border border-border bg-surface p-5">
      <style>{`
        .lc-dot { position: absolute; top: 0; left: 0; z-index: 5; border-radius: 999px; background: var(--accent); pointer-events: none; opacity: 0; display: grid; place-items: center; color: var(--accent-fg); font: 600 13px var(--font-sans); mix-blend-mode: normal; transition: opacity 0.2s; }
        .lc-dot span { opacity: 0; transition: opacity 0.2s; }
        .lc-dot[data-on='1'] span { opacity: 1; }
      `}</style>
      <div className="grid gap-3 sm:grid-cols-2">
        {WORK.map(([name, verb], i) => (
          <a key={name} href="#/move-label-cursor" data-cursor={verb} className="block aspect-[16/9] rounded-lg p-4 text-lg font-medium" style={{ background: `linear-gradient(135deg, hsl(${[24, 210, 150, 320][i]} 60% 45% / 0.6), var(--surface-2))` }}>
            {name}
          </a>
        ))}
      </div>
      <div ref={dot} className="lc-dot" aria-hidden>
        <span ref={label} />
      </div>
    </div>
  )
}
