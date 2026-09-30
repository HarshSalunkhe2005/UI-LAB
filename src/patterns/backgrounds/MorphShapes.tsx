import { useEffect, useRef, useState } from 'react'

/*
 * Background shapes that morph as you scroll: one SVG path interpolates
 * between keyframe shapes (same command count, so the points can be
 * lerped numerically), while it rotates and shifts colour. Scroll progress
 * of the container drives it. Static first shape under reduced motion.
 */

const SHAPES = [
  'M100,20 C150,20 180,60 180,100 C180,150 140,180 100,180 C50,180 20,140 20,100 C20,50 60,20 100,20 Z',
  'M100,10 C170,40 190,70 170,110 C150,160 120,190 80,170 C40,150 10,120 30,70 C45,35 60,5 100,10 Z',
  'M100,40 C130,0 190,30 170,90 C200,140 150,200 100,170 C50,200 0,140 30,90 C10,30 70,0 100,40 Z',
  'M60,30 C110,10 190,20 180,90 C170,150 170,190 110,180 C40,170 10,160 20,100 C25,60 30,40 60,30 Z',
]
const nums = SHAPES.map((s) => s.match(/-?\d+(\.\d+)?/g)!.map(Number))
const template = SHAPES[0].split(/-?\d+(?:\.\d+)?/)

function lerpPath(p: number) {
  const seg = Math.min(nums.length - 2, Math.floor(p * (nums.length - 1)))
  const t = p * (nums.length - 1) - seg
  const a = nums[seg], b = nums[seg + 1]
  return template.map((part, i) => (i < a.length ? part + (a[i] + (b[i] - a[i]) * t).toFixed(1) : part)).join('')
}

export default function MorphShapes() {
  const box = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = box.current!
    const on = () => setP(el.scrollTop / (el.scrollHeight - el.clientHeight))
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])
  return (
    <div ref={box} className="h-80 overflow-y-auto rounded-xl bg-bg" tabIndex={0} aria-label="Morphing shapes, scroll inside">
      <div className="h-[300%]">
        <div className="sticky top-0 grid h-80 place-items-center">
          <svg viewBox="0 0 200 200" className="h-64 w-64" aria-hidden style={{ transform: `rotate(${p * 180}deg)` }}>
            <defs>
              <linearGradient id="ms" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={`hsl(${250 + p * 120} 80% 65%)`} />
                <stop offset="1" stopColor={`hsl(${320 + p * 80} 80% 55%)`} />
              </linearGradient>
            </defs>
            <path d={lerpPath(p)} fill="url(#ms)" />
          </svg>
          <p className="absolute bottom-4 font-mono text-xs text-fg-muted">scroll ↓ {Math.round(p * 100)}%</p>
        </div>
      </div>
    </div>
  )
}
