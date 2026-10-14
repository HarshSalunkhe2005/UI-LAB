import { useRef } from 'react'

/*
 * Signature move (Aspen Search, Awwwards SOTD): a split-screen of flat black and grey panels with halftone imagery and
 * oversized type. The halftone is made in CSS: a soft tone gradient multiplied by a dot grid, then pushed through a
 * high-contrast filter, so dark areas grow into big dots and light areas shrink to nothing. Move the pointer and the
 * highlight (and the dots) follow. Paint only: no layout work, no image. Reduced motion: the tone stays still.
 */

export default function HalftoneSplit() {
  const box = useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect()
    box.current!.style.setProperty('--x', `${((e.clientX - r.left) / r.width) * 100}%`)
    box.current!.style.setProperty('--y', `${((e.clientY - r.top) / r.height) * 100}%`)
  }
  const tone = 'radial-gradient(circle at var(--x, 35%) var(--y, 40%), #fff 0%, #bbb 22%, #444 52%, #000 85%)'
  const dots = 'radial-gradient(circle, #000 0 38%, #fff 62%) 0 0 / 9px 9px'

  const Halftone = ({ flip }: { flip?: boolean }) => (
    <div className="relative overflow-hidden bg-white" style={{ filter: 'contrast(28)', isolation: 'isolate', transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
      <div className="absolute inset-0" style={{ background: tone, filter: 'blur(14px)' }} />
      <div className="absolute inset-0" style={{ background: dots, mixBlendMode: 'multiply' }} />
    </div>
  )

  return (
    <div ref={box} onPointerMove={move} className="grid h-80 grid-cols-2 grid-rows-2 overflow-hidden rounded-xl border border-border bg-[#1c1c1c] font-sans">
      <Halftone />
      <div className="grid place-items-center bg-[#d6d6d6] px-3 text-[#111]">
        <p className="text-4xl font-semibold tracking-tight sm:text-6xl">Search</p>
      </div>
      <div className="grid place-items-center bg-[#1c1c1c] px-3 text-white">
        <p className="text-2xl leading-[0.95] font-extrabold tracking-tight uppercase sm:text-4xl">Placing<br />winners.</p>
      </div>
      <Halftone flip />
    </div>
  )
}
