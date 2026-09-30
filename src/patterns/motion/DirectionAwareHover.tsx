import { img } from '../three-d/_shared'

/*
 * Direction-aware hover: the overlay slides in from the edge the pointer
 * entered through, and out through the edge it left by. The entry edge is
 * the side closest to the pointer (compare distances to each edge), written
 * to data attributes that CSS animates. Keyboard focus shows it from below.
 */

type Side = 'top' | 'right' | 'bottom' | 'left'
const FROM: Record<Side, string> = { top: 'translateY(-100%)', right: 'translateX(100%)', bottom: 'translateY(100%)', left: 'translateX(-100%)' }

function side(e: React.PointerEvent<HTMLElement>): Side {
  const r = e.currentTarget.getBoundingClientRect()
  const d = { top: e.clientY - r.top, bottom: r.bottom - e.clientY, left: e.clientX - r.left, right: r.right - e.clientX }
  return (Object.keys(d) as Side[]).reduce((a, b) => (d[a] < d[b] ? a : b))
}

export default function DirectionAwareHover() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <a
          key={i}
          href="#"
          onClick={(e) => e.preventDefault()}
          className="group relative block aspect-square overflow-hidden rounded-xl"
          onPointerEnter={(e) => {
            const o = e.currentTarget.querySelector<HTMLElement>('.ov')!
            o.style.transition = 'none'
            o.style.transform = FROM[side(e)]
            requestAnimationFrame(() => {
              o.style.transition = ''
              o.style.transform = 'none'
            })
          }}
          onPointerLeave={(e) => {
            e.currentTarget.querySelector<HTMLElement>('.ov')!.style.transform = FROM[side(e)]
          }}
        >
          <img src={img(i + 1100, 300, 300)} alt="" className="h-full w-full object-cover" />
          <span
            className="ov absolute inset-0 grid place-items-center bg-accent/85 text-accent-fg transition-transform duration-300 ease-out-expo group-focus-visible:!translate-y-0 motion-reduce:transition-none"
            style={{ transform: 'translateY(100%)' }}
          >
            <span className="font-display text-2xl italic">No. {i + 1}</span>
          </span>
        </a>
      ))}
    </div>
  )
}
