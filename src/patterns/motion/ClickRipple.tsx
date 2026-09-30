/*
 * Click effects: Material-style ripple from the exact press point, plus a
 * ring "shockwave" variant. The ripple is a span sized to the button's
 * diagonal, scaled from 0 with WAAPI and removed after. Keyboard presses
 * (no coordinates) ripple from the centre.
 */

function ripple(e: React.MouseEvent<HTMLElement>, ring = false) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = e.clientX ? e.clientX - r.left : r.width / 2
  const y = e.clientY ? e.clientY - r.top : r.height / 2
  const size = Math.hypot(r.width, r.height) * 2
  const s = document.createElement('span')
  Object.assign(s.style, {
    position: 'absolute', left: `${x - size / 2}px`, top: `${y - size / 2}px`, width: `${size}px`, height: `${size}px`,
    borderRadius: '50%', pointerEvents: 'none',
    background: ring ? 'transparent' : 'currentColor', border: ring ? '2px solid currentColor' : 'none',
  })
  el.appendChild(s)
  s.animate([{ transform: 'scale(0)', opacity: ring ? 0.8 : 0.25 }, { transform: 'scale(1)', opacity: 0 }], {
    duration: ring ? 700 : 600,
    easing: 'cubic-bezier(.16,1,.3,1)',
  }).onfinish = () => s.remove()
}

export default function ClickRipple() {
  const base = 'relative overflow-hidden rounded-xl px-6 py-3 text-sm font-medium'
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-10">
      <button onClick={(e) => ripple(e)} className={`${base} bg-accent text-accent-fg`}>Ripple</button>
      <button onClick={(e) => ripple(e)} className={`${base} border border-border`}>Outline ripple</button>
      <button onClick={(e) => ripple(e, true)} className={`${base} bg-fg text-bg`}>Shockwave</button>
      <div onClick={(e) => ripple(e)} className="relative grid h-24 w-40 cursor-pointer place-items-center overflow-hidden rounded-xl bg-surface-2 text-sm text-fg-muted">
        tap this card
      </div>
    </div>
  )
}
