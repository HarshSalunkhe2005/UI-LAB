import { useId, useRef } from 'react'

/*
 * SVG-filter distortion on hover: feTurbulence + feDisplacementMap applied
 * to the button, with the displacement scale animated up then back to 0 by
 * rAF on hover. Gives a liquid/wobble "glitch" without canvas. The filter
 * is removed at rest so text stays crisp.
 */

export function DistortButton({ children, strength = 26 }: { children: React.ReactNode; strength?: number }) {
  const id = useId().replace(/:/g, '')
  const disp = useRef<SVGFEDisplacementMapElement>(null)
  const turb = useRef<SVGFETurbulenceElement>(null)
  const btn = useRef<HTMLButtonElement>(null)

  const play = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = performance.now()
    btn.current!.style.filter = `url(#${id})`
    const tick = (now: number) => {
      const t = Math.min((now - start) / 700, 1)
      const s = Math.sin(t * Math.PI) * strength
      disp.current!.setAttribute('scale', String(s))
      turb.current!.setAttribute('seed', String(Math.floor(t * 20)))
      if (t < 1) requestAnimationFrame(tick)
      else btn.current!.style.filter = ''
    }
    requestAnimationFrame(tick)
  }

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id={id}>
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.02 0.15" numOctaves="1" result="n" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <button ref={btn} onPointerEnter={play} onFocus={play} className="rounded-lg border-2 border-fg px-8 py-3 font-mono text-sm tracking-widest uppercase">
        {children}
      </button>
    </>
  )
}

export default function DistortButtonDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-6 py-10">
      <DistortButton>Distort</DistortButton>
      <DistortButton strength={50}>More chaos</DistortButton>
    </div>
  )
}
