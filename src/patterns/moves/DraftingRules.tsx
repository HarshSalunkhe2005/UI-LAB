import { useEffect, useRef } from 'react'

/*
 * Signature move (Heron AI, Awwwards SOTD): a drafting-sheet page. Fine red rules cross the paper like construction
 * lines, a pencil elevation draws itself as you scroll, and the rules close in around it. All of it is SVG stroke
 * offsets and transforms driven by one progress number. Reduced motion: the drawing is complete and the rules rest.
 */

const LINES = [
  'M20 200 H220', // ground
  'M30 200 V90 H110 V200', // left block
  'M110 200 V60 H190 V200', // right block
  'M110 60 L150 30 L190 60', // roof
  'M45 120 H95 M45 150 H95 M125 100 H175 M125 130 H175 M125 160 H175', // windows
  'M20 200 L10 215 M220 200 L230 215', // footings
]

export default function DraftingRules() {
  const box = useRef<HTMLDivElement>(null)
  const paths = useRef<(SVGPathElement | null)[]>([])
  const ruleA = useRef<HTMLDivElement>(null)
  const ruleB = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const lens = paths.current.map((p) => p?.getTotalLength() ?? 0)
    const apply = () => {
      raf = 0
      const max = el.scrollHeight - el.clientHeight
      const p = reduced ? 1 : max > 0 ? Math.min(1, el.scrollTop / max) : 0
      paths.current.forEach((path, i) => {
        if (!path) return
        const start = i / LINES.length
        const local = Math.min(1, Math.max(0, (p - start * 0.7) / 0.45))
        path.style.strokeDashoffset = String(lens[i] * (1 - local))
      })
      if (ruleA.current) ruleA.current.style.transform = `translateY(${p * 70}px)`
      if (ruleB.current) ruleB.current.style.transform = `translateY(${-p * 70}px)`
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    el.addEventListener('scroll', on, { passive: true })
    apply()
    return () => {
      el.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div ref={box} tabIndex={0} role="region" aria-label="Scroll to draw the elevation" className="overflow-y-auto" style={{ height: 360 }}>
        <div style={{ height: 960 }}>
          <div className="sticky top-0 grid place-items-center overflow-hidden bg-[#f1eee6] text-[#2a2622]" style={{ height: 360 }}>
            <div ref={ruleA} className="absolute inset-x-0 top-[4%] h-px bg-[#b3391f]/70" aria-hidden />
            <div ref={ruleB} className="absolute inset-x-0 bottom-[4%] h-px bg-[#b3391f]/70" aria-hidden />
            <p className="absolute top-3 right-4 font-mono text-[10px] tracking-widest text-[#b3391f] uppercase">Sheet 02 / Elevation</p>
            <svg viewBox="0 0 240 230" className="h-[78%]" role="img" aria-label="Pencil elevation of a two-block house, drawn as you scroll">
              {LINES.map((d, i) => (
                <path
                  key={i}
                  ref={(n) => { paths.current[i] = n }}
                  d={d}
                  fill="none"
                  stroke="#2a2622"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                />
              ))}
              <circle cx="150" cy="30" r="2.5" fill="#b3391f" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
