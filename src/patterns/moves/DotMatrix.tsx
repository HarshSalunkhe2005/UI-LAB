import { useEffect, useRef } from 'react'

/*
 * Signature move (Nothing): type as a grid of dots. The word is drawn once to an offscreen canvas, sampled on a
 * regular grid, and each lit sample becomes a dot that swells and lights up near the pointer, like a ripple
 * through an LED matrix. Real text is provided to assistive tech via aria-label. Reduced motion: static dots.
 */

export default function DotMatrix({ text = 'NOTHING' }: { text?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const accent = getComputedStyle(cv).getPropertyValue('--accent').trim() || '#f90'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const STEP = 9
    let dots: { x: number; y: number }[] = []
    let w = 0
    let h = 0
    const mouse = { x: -999, y: -999 }
    let raf = 0

    const build = () => {
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const o = off.getContext('2d')!
      o.fillStyle = '#000'
      o.font = `900 ${Math.min(h * 0.62, w / (text.length * 0.8))}px system-ui, sans-serif`
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.fillText(text, w / 2, h / 2)
      const data = o.getImageData(0, 0, w, h).data
      dots = []
      for (let y = STEP / 2; y < h; y += STEP)
        for (let x = STEP / 2; x < w; x += STEP) if (data[((y | 0) * w + (x | 0)) * 4 + 3] > 128) dots.push({ x, y })
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const fg = getComputedStyle(cv).color
      for (const d of dots) {
        const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y)
        const k = Math.max(0, 1 - dist / 90)
        ctx.fillStyle = k > 0.05 ? accent : fg
        ctx.beginPath()
        ctx.arc(d.x, d.y, 1.6 + k * 2.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const fit = () => {
      const dpr = 1 // sampling grid is in CSS pixels; dots stay crisp enough at STEP spacing
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      build()
      draw()
    }
    const ro = new ResizeObserver(fit)
    ro.observe(cv)
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      if (!reduced && !raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          draw()
        })
    }
    const leave = () => {
      mouse.x = mouse.y = -999
      draw()
    }
    cv.addEventListener('pointermove', move)
    cv.addEventListener('pointerleave', leave)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      cv.removeEventListener('pointermove', move)
      cv.removeEventListener('pointerleave', leave)
    }
  }, [text])

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <canvas ref={ref} className="h-56 w-full text-fg" role="img" aria-label={text} />
      <p className="mt-2 text-center font-mono text-[11px] text-fg-muted">Move the pointer over the dots</p>
    </div>
  )
}
