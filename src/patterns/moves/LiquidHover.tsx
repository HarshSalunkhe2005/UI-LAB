import { useEffect, useId, useRef } from 'react'

/*
 * Signature move (Immersive Garden): an image that warps under the pointer. Instead of a WebGL shader, an SVG
 * filter (feTurbulence feeding feDisplacementMap) distorts any DOM element; the displacement scale eases up on
 * hover and back down on leave. Works on real images, video and text. Reduced motion: the effect is skipped.
 */

export default function LiquidHover() {
  const id = 'liq-' + useId().replace(/:/g, '')
  const disp = useRef<SVGFEDisplacementMapElement>(null)
  const turb = useRef<SVGFETurbulenceElement>(null)
  const target = useRef(0)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cur = 0
    let t = 0
    let raf = 0
    const loop = () => {
      cur += (target.current - cur) * 0.08
      t += 0.004
      disp.current?.setAttribute('scale', cur.toFixed(2))
      turb.current?.setAttribute('baseFrequency', `${0.012 + Math.sin(t) * 0.004} ${0.02 + Math.cos(t * 1.3) * 0.006}`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="mx-auto max-w-xl">
      <svg width="0" height="0" aria-hidden className="absolute">
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        className="grid aspect-[4/3] cursor-crosshair place-items-center overflow-hidden rounded-xl border border-border"
        style={{ filter: `url(#${id})`, background: 'conic-gradient(from 210deg at 30% 60%, var(--accent), #1b1f4a, #e8d9c4, var(--accent))' }}
        onPointerEnter={() => (target.current = 70)}
        onPointerLeave={() => (target.current = 0)}
        role="img"
        aria-label="A colour field that ripples under the pointer"
      >
        <span className="font-display text-6xl text-white mix-blend-difference italic">Ripple</span>
      </div>
      <p className="mt-3 text-center font-mono text-[11px] text-fg-muted">Hover the card: the filter is plain SVG, no WebGL</p>
    </div>
  )
}
