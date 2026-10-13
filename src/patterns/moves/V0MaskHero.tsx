import { useEffect, useId, useRef } from 'react'

/*
 * Vibe-coded move ("An unusual hero", v0): type as a window onto motion. An SVG <mask> made from the word
 * lets a moving gradient show through only where the letters are. The word stays real SVG <text> (selectable,
 * readable by assistive tech through the role/aria-label), and the gradient is driven by one rAF loop that
 * writes a gradientTransform. Reduced motion: the gradient is still.
 */

export default function V0MaskHero({ word = 'MOTION' }: { word?: string }) {
  const uid = useId().replace(/:/g, '')
  const grad = useRef<SVGLinearGradientElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const loop = (ms: number) => {
      const t = ms / 1000
      grad.current?.setAttribute('gradientTransform', `translate(${Math.sin(t * 0.5) * 0.35} 0) rotate(${20 + Math.sin(t * 0.3) * 25} 0.5 0.5)`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <svg viewBox="0 0 800 300" className="block w-full" role="img" aria-label={word}>
        <defs>
          <linearGradient id={`g${uid}`} ref={grad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff8a3d" />
            <stop offset="0.35" stopColor="#ff3d81" />
            <stop offset="0.65" stopColor="#6a5cff" />
            <stop offset="1" stopColor="#2ad4c8" />
          </linearGradient>
          <mask id={`m${uid}`}>
            <rect width="800" height="300" fill="black" />
            <text x="400" y="215" textAnchor="middle" fontSize="210" fontWeight="900" fill="white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-8px' }}>
              {word}
            </text>
          </mask>
        </defs>
        <rect width="800" height="300" fill={`url(#g${uid})`} mask={`url(#m${uid})`} />
      </svg>
    </div>
  )
}
