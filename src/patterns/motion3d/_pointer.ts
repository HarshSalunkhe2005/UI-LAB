import { useEffect, useRef } from 'react'

/**
 * Window-wide pointer, normalised to -1..1 from the viewport centre (y up).
 * Characters use this so they keep looking at the cursor even when it is
 * outside their canvas. Returns a ref (no re-renders); read it in useFrame.
 */
export function useWindowPointer() {
  const p = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const on = (e: PointerEvent) => {
      p.current.x = (e.clientX / innerWidth) * 2 - 1
      p.current.y = -((e.clientY / innerHeight) * 2 - 1)
    }
    addEventListener('pointermove', on)
    return () => removeEventListener('pointermove', on)
  }, [])
  return p
}

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
