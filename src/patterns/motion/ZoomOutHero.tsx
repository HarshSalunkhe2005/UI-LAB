import { useEffect, useRef, useState } from 'react'
import { img } from '../three-d/_shared'

/*
 * Full-bleed hero that shrinks into a framed window as you scroll (Alche-
 * style). Scroll progress through a tall section maps to inset (clip-path),
 * corner radius and the headline's position. clip-path keeps layout
 * stable, only paint changes. Reduced motion: shows the framed end state.
 */

export default function ZoomOutHero() {
  const box = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const [reduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const el = box.current!
    const on = () => setP(Math.min(1, el.scrollTop / (el.clientHeight * 1.2)))
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])

  const t = reduced ? 1 : p
  return (
    <div ref={box} className="h-96 overflow-y-auto rounded-xl bg-bg" tabIndex={0} aria-label="Zoom-out hero, scroll inside">
      <div style={{ height: '260%' }}>
        <div className="sticky top-0 h-96">
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(${t * 18}% ${t * 22}% ${t * 18}% ${t * 22}% round ${t * 24}px)` }}
          >
            <img src={img(700, 1200, 800)} alt="Aerial landscape" className="h-full w-full object-cover" style={{ transform: `scale(${1.15 - t * 0.15})` }} />
          </div>
          <h3
            className="absolute left-6 font-semibold tracking-tight text-fg mix-blend-difference"
            style={{ bottom: `${8 + t * 4}%`, fontSize: `${3.5 - t * 1.6}rem`, color: 'white' }}
          >
            Worlds, framed.
          </h3>
          <p className="absolute top-3 right-4 font-mono text-xs text-white/70 mix-blend-difference">scroll ↓</p>
        </div>
      </div>
    </div>
  )
}
