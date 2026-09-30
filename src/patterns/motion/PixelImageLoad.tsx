import { useEffect, useRef, useState } from 'react'
import { img } from '../three-d/_shared'

/*
 * Pixelated image reveal: when the image scrolls into view it is drawn to a
 * canvas at tiny resolution (imageSmoothing off, so blocks stay crisp) and
 * the resolution steps up 4 → 8 → 16 → … → full over ~1s, then the real
 * <img> takes over. Needs CORS-friendly images (picsum sends the header).
 */

export function PixelImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const c = canvas.current!
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setDone(true)
    const im = new Image()
    im.crossOrigin = 'anonymous'
    im.src = src
    let timer = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const run = () => {
        const ctx = c.getContext('2d')!
        c.width = c.clientWidth
        c.height = c.clientHeight
        const steps = [4, 8, 14, 24, 40, 70, 120]
        let k = 0
        const step = () => {
          const w = steps[k]
          const h = Math.round((w * c.height) / c.width)
          const off = document.createElement('canvas')
          off.width = w
          off.height = h
          off.getContext('2d')!.drawImage(im, 0, 0, w, h)
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(off, 0, 0, c.width, c.height)
          k++
          if (k < steps.length) timer = window.setTimeout(step, 140)
          else timer = window.setTimeout(() => setDone(true), 140)
        }
        step()
      }
      if (im.complete) run()
      else im.onload = run
    }, { threshold: 0.3 })
    io.observe(c)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" style={{ opacity: done ? 1 : 0 }} />
      {!done && <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />}
    </div>
  )
}

export default function PixelImageLoad() {
  const [k, setK] = useState(0)
  return (
    <div key={k} className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <PixelImage key={i} src={img(i + 1500, 400, 500)} alt={`Sample photo ${i + 1}`} className="aspect-[4/5] rounded-lg" />
        ))}
      </div>
      <button onClick={() => setK((x) => x + 1)} className="text-sm text-fg-muted hover:text-fg">↻ Replay</button>
    </div>
  )
}
