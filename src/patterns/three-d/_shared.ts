/* Shared helpers for 3D demos. Kept tiny so each pattern stays copy-pasteable (inline these if you copy one file). */

/**
 * Demo image by seed. Serves one of 48 self-hosted WebPs from /public/img (fast, same-origin
 * so canvas/WebGL can read them). When copying a pattern into another project, replace img()
 * with your own image URLs, or use the remote fallback: `https://picsum.photos/seed/${seed}/${w}/${h}`.
 */
export const IMG_COUNT = 48
export const img = (seed: number | string, _w = 400, _h = 500) => {
  const n = typeof seed === 'number' ? seed : [...seed].reduce((a, c) => a + c.charCodeAt(0), 0)
  return `/img/${((n % IMG_COUNT) + IMG_COUNT) % IMG_COUNT}.webp`
}

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Drag-to-rotate with momentum. Returns handlers + current value via callback. */
export function makeSpinner(onChange: (v: number) => void, opts: { sensitivity?: number; friction?: number; idle?: number } = {}) {
  const { sensitivity = 0.3, friction = 0.95, idle = 0 } = opts
  let value = 0
  let vel = idle
  let dragging = false
  let lastX = 0
  let raf = 0
  const tick = () => {
    if (!dragging) {
      vel = vel * friction + idle * (1 - friction)
      value += vel
      onChange(value)
    }
    raf = requestAnimationFrame(tick)
  }
  return {
    start() {
      if (reducedMotion()) vel = 0
      raf = requestAnimationFrame(tick)
    },
    stop() {
      cancelAnimationFrame(raf)
    },
    nudge(d: number) {
      value += d
      onChange(value)
    },
    handlers: {
      onPointerDown(e: React.PointerEvent) {
        dragging = true
        lastX = e.clientX
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      },
      onPointerMove(e: React.PointerEvent) {
        if (!dragging) return
        vel = (e.clientX - lastX) * sensitivity
        lastX = e.clientX
        value += vel
        onChange(value)
      },
      onPointerUp() {
        dragging = false
      },
    },
  }
}
