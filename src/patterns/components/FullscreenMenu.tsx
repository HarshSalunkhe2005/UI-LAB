import { useEffect, useRef, useState } from 'react'
import { img } from '../three-d/_shared'

/*
 * Fullscreen overlay menu: the panel reveals with a circular clip-path from
 * the toggle, big links slide up from masks with a stagger, and hovering a
 * link swaps a preview image. Esc closes, focus moves into the menu and
 * back to the toggle, background marked inert while open.
 */

const LINKS = ['Work', 'Studio', 'Journal', 'Careers', 'Contact']

export default function FullscreenMenu() {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(0)
  const first = useRef<HTMLAnchorElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) first.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="relative h-96 overflow-hidden rounded-xl border border-border bg-bg">
      <div inert={open} className="p-6">
        <p className="font-semibold">◆ atelier</p>
        <p className="mt-24 max-w-xs text-3xl font-semibold tracking-tight">Page content sits here under the menu.</p>
      </div>
      <button
        ref={toggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="fs-menu"
        className="absolute top-4 right-4 z-20 rounded-full bg-fg px-4 py-2 text-sm text-bg"
      >
        {open ? 'Close' : 'Menu'}
      </button>
      <nav
        id="fs-menu"
        aria-label="Main"
        aria-hidden={!open}
        className="absolute inset-0 z-10 grid grid-cols-[1fr_auto] items-center gap-6 bg-neutral-950 p-8 text-white transition-[clip-path] duration-700 ease-[cubic-bezier(.76,0,.24,1)] motion-reduce:transition-none"
        style={{ clipPath: open ? 'circle(150% at calc(100% - 50px) 30px)' : 'circle(0% at calc(100% - 50px) 30px)' }}
      >
        <ul className="space-y-1">
          {LINKS.map((l, i) => (
            <li key={l} className="overflow-hidden">
              <a
                ref={i === 0 ? first : undefined}
                href="#"
                tabIndex={open ? 0 : -1}
                onClick={(e) => e.preventDefault()}
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className="block text-5xl font-semibold tracking-tight transition-[transform,color] duration-700 ease-out-expo hover:text-orange-400 motion-reduce:transition-none"
                style={{ transform: open ? 'none' : 'translateY(110%)', transitionDelay: open ? `${250 + i * 60}ms` : '0ms' }}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden h-56 w-44 overflow-hidden rounded-lg sm:block" aria-hidden>
          {LINKS.map((l, i) => (
            <img key={l} src={img(i + 1800, 300, 380)} alt="" className="absolute h-56 w-44 object-cover transition-opacity duration-300" style={{ opacity: hover === i ? 1 : 0 }} />
          ))}
        </div>
      </nav>
    </div>
  )
}
