import { useEffect, useRef } from 'react'

/*
 * Signature move (Apple product pages): scroll position, not time, drives the picture. A pinned canvas shows
 * frame N of a sequence where N = scroll progress. Real pages decode images or video; to stay asset-free this
 * demo draws each frame procedurally (a ring of beads that opens like a petal), so any scrub behaviour you
 * see is exactly what a frame sequence would do. Reduced motion: the middle frame is shown, no scrubbing.
 */

const FRAMES = 120

function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string, fg: string) {
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2
  const cy = h / 2
  const R = Math.min(w, h) * 0.3
  const open = Math.sin(t * Math.PI) // 0 -> 1 -> 0
  for (let ring = 0; ring < 5; ring++) {
    const n = 18 + ring * 6
    const rr = R * (0.35 + ring * 0.17) * (0.6 + 0.8 * open)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + t * (ring % 2 ? 2.2 : -2.2) * Math.PI * 0.5
      const z = Math.sin(a * 2 + t * 6)
      ctx.globalAlpha = 0.35 + 0.65 * (z * 0.5 + 0.5)
      ctx.fillStyle = ring === 4 ? accent : fg
      ctx.beginPath()
      ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * (0.55 + 0.45 * open), 2 + (z * 0.5 + 0.5) * 3.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

export default function FrameScrub() {
  const scroller = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const readout = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sc = scroller.current!
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    const css = getComputedStyle(cv)
    const accent = css.getPropertyValue('--accent').trim() || '#f90'
    const fg = css.getPropertyValue('--fg').trim() || '#eee'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let shown = -1
    const render = () => {
      const p = reduced ? 0.5 : sc.scrollTop / Math.max(1, sc.scrollHeight - sc.clientHeight)
      const f = Math.round(p * (FRAMES - 1))
      if (f === shown) return
      shown = f
      drawFrame(ctx, w, h, f / (FRAMES - 1), accent, fg)
      if (readout.current) readout.current.textContent = `frame ${String(f + 1).padStart(3, '0')} / ${FRAMES}`
    }
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      shown = -1
      render()
    }
    const ro = new ResizeObserver(fit)
    ro.observe(cv)
    let raf = 0
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          render()
        })
    }
    sc.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      ro.disconnect()
      sc.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={scroller} className="relative h-96 overflow-y-auto rounded-xl border border-border bg-surface" tabIndex={0} aria-label="Scroll to scrub the animation">
      <div className="h-[1400px]">
        <div className="sticky top-0 h-96">
          <canvas ref={canvas} className="absolute inset-0 h-full w-full" role="img" aria-label="An animation of rings of beads that opens and closes as you scroll" />
          <span ref={readout} className="absolute bottom-3 left-4 font-mono text-[11px] text-fg-muted" />
          <span className="absolute top-3 right-4 font-mono text-[11px] text-fg-muted">Scroll to scrub</span>
        </div>
      </div>
    </div>
  )
}
