import { useState } from 'react'

/*
 * Gooey FAB menu: a blur + alpha-contrast SVG filter (the classic "goo")
 * makes the action bubbles melt out of the main button as they fan out.
 * The filter only applies to the blob layer; labels/icons sit on a crisp
 * layer above so text stays sharp. Real buttons with aria-expanded.
 */

const ITEMS = [['✎', 'Edit'], ['⤴', 'Share'], ['★', 'Favourite'], ['🗑', 'Delete']]

export default function GooeyMenu() {
  const [open, setOpen] = useState(false)
  const angle = (i: number) => (-90 - 60 + i * 40) * (Math.PI / 180)
  const R = 90
  return (
    <div className="grid h-72 place-items-center">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
        </filter>
      </svg>
      <div className="relative h-16 w-16">
        <div className="absolute inset-0" style={{ filter: 'url(#goo)' }} aria-hidden>
          {ITEMS.map((_, i) => (
            <span
              key={i}
              className="absolute inset-1 rounded-full bg-accent transition-transform duration-500 ease-out-expo motion-reduce:transition-none"
              style={{ transform: open ? `translate(${Math.cos(angle(i)) * R}px, ${Math.sin(angle(i)) * R}px)` : 'none', transitionDelay: `${i * 40}ms` }}
            />
          ))}
          <span className="absolute inset-0 rounded-full bg-accent" />
        </div>
        {ITEMS.map(([icon, label], i) => (
          <button
            key={label}
            aria-label={label}
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            className="absolute inset-1 grid place-items-center rounded-full text-lg text-accent-fg transition-all duration-500 ease-out-expo motion-reduce:transition-none"
            style={{ transform: open ? `translate(${Math.cos(angle(i)) * R}px, ${Math.sin(angle(i)) * R}px)` : 'none', opacity: open ? 1 : 0, transitionDelay: `${i * 40}ms` }}
          >
            {icon}
          </button>
        ))}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close actions' : 'Open actions'}
          className="absolute inset-0 grid place-items-center rounded-full text-2xl text-accent-fg"
        >
          <span className="transition-transform duration-300" style={{ transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
        </button>
      </div>
    </div>
  )
}
