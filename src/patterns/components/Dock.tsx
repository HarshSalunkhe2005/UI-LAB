import { useState } from 'react'

/*
 * macOS-style magnifying dock. Each icon's size is a smooth function of its
 * distance to the pointer (cosine falloff), so neighbours grow too. Icons
 * are real buttons with labels; keyboard focus magnifies the focused icon.
 */

const APPS = [['Finder', '🗂'], ['Mail', '✉️'], ['Music', '🎵'], ['Photos', '🌄'], ['Notes', '📝'], ['Maps', '🗺'], ['Settings', '⚙️']]

export default function Dock() {
  const [mx, setMx] = useState<number | null>(null)
  const base = 44
  const max = 76
  const range = 150
  return (
    <div className="grid h-48 place-items-end justify-center">
      <nav
        aria-label="Dock"
        onPointerMove={(e) => setMx(e.clientX)}
        onPointerLeave={() => setMx(null)}
        className="flex items-end gap-2 rounded-2xl border border-border bg-surface/70 px-3 pb-2 pt-2 shadow-lg backdrop-blur"
      >
        {APPS.map(([name, icon]) => (
          <DockIcon key={name} name={name} icon={icon} mx={mx} base={base} max={max} range={range} />
        ))}
      </nav>
    </div>
  )
}

function DockIcon({ name, icon, mx, base, max, range }: { name: string; icon: string; mx: number | null; base: number; max: number; range: number }) {
  const [el, setEl] = useState<HTMLButtonElement | null>(null)
  const [focused, setFocused] = useState(false)
  let size = base
  if (focused) size = max
  else if (mx !== null && el) {
    const r = el.getBoundingClientRect()
    const d = Math.abs(mx - (r.left + r.width / 2))
    if (d < range) size = base + (max - base) * (Math.cos((d / range) * Math.PI) + 1) / 2
  }
  return (
    <button
      ref={setEl}
      aria-label={name}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="group relative grid place-items-center rounded-xl bg-surface-2 transition-[width,height] duration-150 ease-out motion-reduce:transition-none"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      <span aria-hidden>{icon}</span>
      <span className="pointer-events-none absolute -top-8 rounded-md bg-fg px-2 py-0.5 text-xs text-bg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{name}</span>
    </button>
  )
}
