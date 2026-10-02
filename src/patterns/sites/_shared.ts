import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/* Helpers shared by the whole-site demos in this folder. They are full pages, so they scroll the window,
   and they must coexist with UI Lab's own hash router and clean up completely when you leave. */

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Smooth scroll (Lenis, driven by GSAP's ticker so ScrollTrigger stays in sync) plus in-page anchor links.
 * Anchor clicks are handled here instead of by the browser: UI Lab's router lives in the URL hash,
 * so a real `#section` navigation would be read as a route change.
 * Everything is torn down on unmount.
 */
export function useSiteScroll(root: RefObject<HTMLElement | null>, { smooth = true, lerp = 0.1 } = {}) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    let lenis: Lenis | null = null
    let tick: ((t: number) => void) | null = null
    if (smooth && !reducedMotion()) {
      lenis = new Lenis({ lerp })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t: number) => lenis!.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a || !el.contains(a)) return
      const id = a.getAttribute('href')!.slice(1)
      if (id.startsWith('/')) return // a UI Lab route, let it through
      e.preventDefault()
      const target = id ? el.querySelector<HTMLElement>(`#${CSS.escape(id)}`) : null
      if (!target) return
      if (lenis) lenis.scrollTo(target)
      else target.scrollIntoView({ behavior: 'smooth' })
    }
    el.addEventListener('click', onClick)
    return () => {
      el.removeEventListener('click', onClick)
      if (tick) gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33) // GSAP's default
      lenis?.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [root, smooth, lerp])
}
