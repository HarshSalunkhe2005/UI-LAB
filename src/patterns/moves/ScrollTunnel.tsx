import { useEffect, useRef } from 'react'

/*
 * Signature move (Igloo): scroll is the camera. A stack of frames sits along the Z axis and scrolling flies
 * through them: the page is a path, not a list of sections. Pure CSS 3D (perspective + translateZ); one CSS
 * variable is written per scroll event, no React state. Reduced motion: the camera does not move.
 */

const FRAMES = ['Surface', 'Shelf', 'Crevasse', 'Cavern', 'Core', 'Depth', 'Trench']

export default function ScrollTunnel() {
  const scroller = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sc = scroller.current!
    const st = stage.current!
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const p = sc.scrollTop / Math.max(1, sc.scrollHeight - sc.clientHeight)
      st.style.setProperty('--cam', String(p * (FRAMES.length - 1) * 360))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    sc.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      sc.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={scroller} className="relative h-96 overflow-y-auto rounded-xl border border-border bg-surface" tabIndex={0} aria-label="Scroll to fly through the tunnel">
      <div className="h-[900px]">
        <div ref={stage} className="sticky top-0 h-96 overflow-hidden" style={{ perspective: '700px', perspectiveOrigin: '50% 45%', ['--cam' as string]: 0 }}>
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {FRAMES.map((label, i) => (
              <div
                key={label}
                className="absolute top-1/2 left-1/2 grid h-56 w-80 place-items-center rounded-lg border border-border bg-bg/70 font-display text-3xl text-fg italic"
                style={{
                  transform: `translate(-50%, -50%) translateZ(calc(${-i * 360}px + var(--cam) * 1px))`,
                  opacity: `clamp(0, calc(1 - (var(--cam) - ${i * 360}) / 420), 1)`,
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <p className="absolute bottom-3 left-4 font-mono text-[11px] text-fg-muted">Scroll</p>
        </div>
      </div>
    </div>
  )
}
