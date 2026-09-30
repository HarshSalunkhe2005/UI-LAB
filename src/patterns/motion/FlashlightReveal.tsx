import { img } from '../three-d/_shared'

/*
 * Flashlight / spotlight reveal: a dark (or blurred, desaturated) cover sits
 * over an image, with a radial-gradient mask hole following the pointer so
 * you "discover" the picture. Mask position lives in CSS vars. Keyboard /
 * touch fallback: a button reveals everything.
 */

export default function FlashlightReveal() {
  return (
    <div
      className="group relative h-80 overflow-hidden rounded-xl"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
    >
      <img src={img(1600, 1000, 640)} alt="Night city street" className="h-full w-full object-cover" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/90 backdrop-blur-sm backdrop-grayscale transition-opacity duration-500 group-has-[button[aria-pressed=true]]:opacity-0"
        style={{
          maskImage: 'radial-gradient(circle 110px at var(--mx, 50%) var(--my, 50%), transparent 0 60%, #000 100%)',
          WebkitMaskImage: 'radial-gradient(circle 110px at var(--mx, 50%) var(--my, 50%), transparent 0 60%, #000 100%)',
        }}
      />
      <button
        onClick={(e) => e.currentTarget.setAttribute('aria-pressed', String(e.currentTarget.getAttribute('aria-pressed') !== 'true'))}
        aria-pressed="false"
        className="absolute right-3 bottom-3 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur"
      >
        Reveal all
      </button>
    </div>
  )
}
