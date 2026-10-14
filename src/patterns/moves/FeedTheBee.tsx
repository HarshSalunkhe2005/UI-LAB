import { useEffect, useRef, useState } from 'react'

/*
 * Signature move (Leo Parpeix, Awwwards SOTD): a small creature that follows the cursor and can be fed. The bee eases
 * toward the pointer with a lag, tilts into its direction of travel, and its wings beat. Click or press Enter to drop
 * a crumb; the bee goes for it. It is a toy: nothing depends on it. Position is set with transform from one rAF loop.
 * Reduced motion: no following; the bee sits still and the button just counts crumbs.
 */

export default function FeedTheBee() {
  const stage = useRef<HTMLDivElement>(null)
  const bee = useRef<HTMLDivElement>(null)
  const wing = useRef<SVGGElement>(null)
  const target = useRef({ x: 160, y: 120 })
  const crumb = useRef<{ x: number; y: number } | null>(null)
  const [fed, setFed] = useState(0)
  const [crumbPos, setCrumbPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const el = stage.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let x = 160
    let y = 120
    let raf = 0
    let t = 0
    const loop = () => {
      t += 1
      const goal = crumb.current ?? target.current
      const dx = goal.x - x
      const dy = goal.y - y
      x += dx * 0.06
      y += dy * 0.06
      if (crumb.current && Math.hypot(dx, dy) < 14) {
        crumb.current = null
        setCrumbPos(null)
        setFed((n) => n + 1)
      }
      const bob = Math.sin(t * 0.12) * 3
      if (bee.current) bee.current.style.transform = `translate(${x - 18}px, ${y - 14 + bob}px) rotate(${Math.max(-25, Math.min(25, dx * 0.12))}deg)`
      if (wing.current) wing.current.style.transform = `scaleY(${0.5 + Math.abs(Math.sin(t * 0.7)) * 0.7})`
      raf = requestAnimationFrame(loop)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      target.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    if (!reduced) {
      el.addEventListener('pointermove', move)
      raf = requestAnimationFrame(loop)
    } else if (bee.current) bee.current.style.transform = 'translate(142px, 106px)'
    return () => {
      el.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  const drop = (x: number, y: number) => {
    crumb.current = { x, y }
    setCrumbPos({ x, y })
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      crumb.current = null
      setCrumbPos(null)
      setFed((n) => n + 1)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-[#f4f1ea] p-3 text-[#16302a]">
      <div
        ref={stage}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          drop(e.clientX - r.left, e.clientY - r.top)
        }}
        className="relative h-56 cursor-crosshair overflow-hidden rounded-lg bg-[#e8e4d8]"
      >
        <p className="pointer-events-none absolute inset-0 grid place-items-center text-6xl font-semibold tracking-tight text-[#16302a]/80 select-none sm:text-8xl" aria-hidden>FRENCH</p>
        {crumbPos && <span className="absolute size-3 rounded-full bg-[#c98a1b]" style={{ left: crumbPos.x - 6, top: crumbPos.y - 6 }} aria-hidden />}
        <div ref={bee} className="pointer-events-none absolute top-0 left-0" aria-hidden style={{ transform: 'translate(142px, 106px)' }}>
          <svg width="40" height="30" viewBox="0 0 40 30">
            <g ref={wing} style={{ transformOrigin: '20px 10px' }}>
              <ellipse cx="14" cy="6" rx="7" ry="5" fill="#cfe3ee" stroke="#6a8ea1" opacity="0.9" />
              <ellipse cx="26" cy="6" rx="7" ry="5" fill="#cfe3ee" stroke="#6a8ea1" opacity="0.9" />
            </g>
            <ellipse cx="20" cy="17" rx="14" ry="9" fill="#f3c316" stroke="#2a2a1a" strokeWidth="1.5" />
            <path d="M14 9 v16 M22 8 v18 M29 11 v12" stroke="#2a2a1a" strokeWidth="3" />
            <circle cx="32" cy="15" r="1.6" fill="#2a2a1a" />
          </svg>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span>Click the panel to drop a crumb. Fed: <b className="tabular-nums">{fed}</b></span>
        <button onClick={() => drop(60 + Math.random() * 200, 40 + Math.random() * 120)} className="min-h-11 rounded-md border border-[#16302a]/40 px-4 font-medium hover:bg-[#16302a] hover:text-[#f4f1ea]">
          Feed the bee
        </button>
      </div>
      <p className="sr-only" role="status">{fed} crumbs eaten.</p>
    </div>
  )
}
