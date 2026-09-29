import { useEffect, useRef, useState } from 'react'

/*
 * Custom cursor scoped to a region: a dot that tracks exactly and a ring
 * that eases after it (lerp in rAF). Over elements with data-cursor the ring
 * grows and shows that label; mix-blend-mode: difference inverts what is
 * under it. Only on fine pointers; the native cursor returns under reduced
 * motion and on touch.
 */

export function CursorArea({ children }: { children: React.ReactNode }) {
  const area = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (!enabled) return
    const el = area.current!
    const target = { x: -100, y: -100 }
    const cur = { x: -100, y: -100 }
    let raf = 0
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.18
      cur.y += (target.y - cur.y) * 0.18
      ring.current!.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
      dot.current!.style.transform = `translate(${target.x}px, ${target.y}px) translate(-50%, -50%)`
      const hit = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
      setLabel(hit?.dataset.cursor ?? '')
    }
    el.addEventListener('pointermove', move)
    raf = requestAnimationFrame(tick)
    return () => {
      el.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  return (
    <div ref={area} className={`relative overflow-hidden ${enabled ? 'cursor-none [&_*]:cursor-none' : ''}`}>
      {children}
      {enabled && (
        <>
          <div ref={ring} aria-hidden className="pointer-events-none absolute top-0 left-0 z-50 grid place-items-center rounded-full border border-white bg-white font-mono text-[10px] text-black mix-blend-difference transition-[width,height] duration-300 ease-out-expo" style={{ width: label ? 84 : 36, height: label ? 84 : 36, background: label ? 'white' : 'transparent' }}>
            {label}
          </div>
          <div ref={dot} aria-hidden className="pointer-events-none absolute top-0 left-0 z-50 h-1.5 w-1.5 rounded-full bg-white mix-blend-difference" />
        </>
      )}
    </div>
  )
}

export default function CustomCursorDemo() {
  return (
    <CursorArea>
      <div className="grid h-72 grid-cols-3 gap-3 p-4">
        {['View', 'Play', 'Drag'].map((l, i) => (
          <div key={l} data-cursor={l} className="grid place-items-center rounded-xl text-white" style={{ background: `hsl(${i * 90 + 200} 60% 45%)` }}>
            <span className="font-display text-3xl italic">{l}</span>
          </div>
        ))}
      </div>
    </CursorArea>
  )
}
