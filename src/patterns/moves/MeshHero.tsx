import { useEffect, useRef } from 'react'

/*
 * Signature move (Stripe): a living gradient behind a light, large headline. Several soft colour blobs drift on
 * slow sine paths over a base colour, drawn on a tiny offscreen canvas and scaled up so the blur is free; a
 * skewed clip gives the diagonal edge. Reduced motion: one still frame. The headline is real text on top.
 */

const BLOBS = [
  { c: '#ff8a3d', fx: 0.21, fy: 0.17, px: 0, py: 1 },
  { c: '#7a5cff', fx: 0.15, fy: 0.23, px: 2, py: 0 },
  { c: '#27c6b8', fx: 0.19, fy: 0.13, px: 4, py: 3 },
  { c: '#ff4f8b', fx: 0.11, fy: 0.19, px: 1, py: 5 },
]

export default function MeshHero() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    cv.width = 96
    cv.height = 54
    let raf = 0
    const paint = (t: number) => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#0d1020'
      ctx.fillRect(0, 0, 96, 54)
      ctx.globalCompositeOperation = 'lighter'
      for (const b of BLOBS) {
        const x = 48 + Math.sin(t * b.fx + b.px) * 34
        const y = 27 + Math.cos(t * b.fy + b.py) * 18
        const g = ctx.createRadialGradient(x, y, 0, x, y, 34)
        g.addColorStop(0, b.c + 'dd')
        g.addColorStop(1, b.c + '00')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 96, 54)
      }
    }
    if (reduced) paint(3)
    else {
      const loop = (ms: number) => {
        paint(ms / 1000)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="relative isolate overflow-hidden rounded-xl border border-border">
      <canvas ref={ref} className="absolute inset-0 -z-10 h-full w-full scale-110 blur-[2px]" style={{ imageRendering: 'auto' }} aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-16 origin-bottom-left -skew-y-6 bg-bg" aria-hidden />
      <div className="px-8 pt-16 pb-28 sm:px-14">
        <h2 className="max-w-lg text-4xl leading-[1.05] font-light tracking-tight text-white sm:text-5xl">Infrastructure that moves like it knows where it is going.</h2>
        <p className="mt-4 max-w-md text-white/70">A light weight at a large size, over colour that is always slowly changing.</p>
      </div>
    </div>
  )
}
