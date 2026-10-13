import { useEffect, useRef } from 'react'

/*
 * Signature move (Lenis / Darkroom): scrolling with inertia. The container's scroll target is eased toward
 * the wheel input with a lerp each frame (that is all smooth-scroll libraries really do), and the same loop
 * drives a progress rail and a live velocity readout. Keyboard, scrollbar and touch scrolling keep working
 * because we only intercept the wheel and fall back to native scroll for everything else. Reduced motion:
 * the wheel is not intercepted at all.
 */

export default function ScrollRail() {
  const box = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const vel = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = box.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let target = el.scrollTop
    let raf = 0
    let last = el.scrollTop
    let lastSet = el.scrollTop // the value this loop last wrote, to tell our scrolls from native ones
    const max = () => el.scrollHeight - el.clientHeight

    const loop = () => {
      const next = el.scrollTop + (target - el.scrollTop) * 0.1
      el.scrollTop = Math.abs(target - next) < 0.3 ? target : next
      lastSet = el.scrollTop
      const v = el.scrollTop - last
      last = el.scrollTop
      if (bar.current) bar.current.style.transform = `scaleY(${el.scrollTop / Math.max(1, max())})`
      if (vel.current) vel.current.textContent = `${Math.abs(v).toFixed(1).padStart(5, '0')} px/frame`
      raf = requestAnimationFrame(loop)
    }
    const onWheel = (e: WheelEvent) => {
      if (reduced) return
      e.preventDefault()
      target = Math.max(0, Math.min(max(), target + e.deltaY))
    }
    const onNative = () => {
      // Keyboard, scrollbar drags and touch move scrollTop directly: adopt it as the new target.
      if (Math.abs(el.scrollTop - lastSet) > 1.5) {
        target = el.scrollTop
        lastSet = el.scrollTop
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scroll', onNative, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', onNative)
    }
  }, [])

  return (
    <div className="relative rounded-xl border border-border bg-surface">
      <div ref={box} tabIndex={0} aria-label="Smooth scrolling demo" className="h-80 overflow-y-auto px-8 py-6 pr-12">
        {Array.from({ length: 14 }, (_, i) => (
          <p key={i} className="mb-6 font-display text-3xl text-fg/90 italic">
            {['Inertia', 'Easing', 'Lerp', 'Momentum', 'Velocity', 'Friction', 'Glide'][i % 7]} {i + 1}
          </p>
        ))}
      </div>
      <div className="pointer-events-none absolute top-4 right-4 bottom-4 w-0.5 rounded bg-border" aria-hidden>
        <div ref={bar} className="h-full origin-top rounded bg-accent" style={{ transform: 'scaleY(0)' }} />
      </div>
      <span ref={vel} className="absolute bottom-2 left-4 font-mono text-[11px] text-fg-muted" aria-hidden />
    </div>
  )
}
