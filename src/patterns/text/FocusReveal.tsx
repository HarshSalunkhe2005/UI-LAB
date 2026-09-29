import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/*
 * Words sit blurred; a camera-style focus frame (four corner brackets)
 * travels from word to word, resizing to each word's measured box, and the
 * word under it comes sharp. Measuring with offsetLeft/Top/Width/Height
 * means it works with any font and size and survives wrapping.
 * Screen readers read the plain sentence; the frame is decorative.
 */

export function FocusReveal({ text, interval = 1100 }: { text: string; interval?: number }) {
  const words = text.split(' ')
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const [i, setI] = useState(0)
  const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0 })

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[i]
      if (el) setBox({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight })
    }
    measure()
    addEventListener('resize', measure)
    return () => removeEventListener('resize', measure)
  }, [i])

  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const pad = 8
  const corner = 'absolute h-3 w-3 border-accent'

  return (
    <p className="relative" aria-label={text}>
      {words.map((w, n) => (
        <span key={n} aria-hidden>
          <span
            ref={(el) => {
              refs.current[n] = el
            }}
            className="inline-block transition-[filter,opacity] duration-500"
            style={reduced ? undefined : { filter: n === i ? 'none' : 'blur(6px)', opacity: n === i ? 1 : 0.55 }}
          >
            {w}
          </span>{' '}
        </span>
      ))}
      {!reduced && (
        <span
          aria-hidden
          className="pointer-events-none absolute transition-all duration-700 ease-out-expo"
          style={{ left: box.x - pad, top: box.y - pad, width: box.w + pad * 2, height: box.h + pad * 2 }}
        >
          <span className={`${corner} top-0 left-0 border-t-2 border-l-2`} />
          <span className={`${corner} top-0 right-0 border-t-2 border-r-2`} />
          <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
          <span className={`${corner} right-0 bottom-0 border-r-2 border-b-2`} />
        </span>
      )}
    </p>
  )
}

export default function FocusRevealDemo() {
  return (
    <div className="py-6 text-center text-3xl font-semibold tracking-tight sm:text-5xl">
      <FocusReveal text="Bring every idea into focus" />
    </div>
  )
}
