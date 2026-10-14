import { useState } from 'react'
import '@fontsource/caveat/600.css'

/*
 * Signature move (Tim Van Damme, One Page Love): a name lockup that mixes three voices on a dark ground. A big outlined
 * display line (stroke only, so the dark shows through), a marker-script alias in one warm colour set right under it, and
 * a loose layer of hand-drawn doodles over a halftone portrait. Pure CSS and SVG. The outline uses text-stroke with a
 * transparent fill, so keep the stroke at least 1.5px and the type very large, or it will not read. Toggle the doodles.
 */

export default function OutlineLockup() {
  const [doodles, setDoodles] = useState(true)
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#141414] p-6 text-white sm:p-8">
      <div className="relative mx-auto h-40 w-full max-w-md overflow-hidden rounded-lg bg-white" aria-hidden>
        <div className="absolute inset-0" style={{ filter: 'contrast(14)', isolation: 'isolate' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, #fff 0, #aaa 28%, #333 72%)', filter: 'blur(10px)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, #000 0 34%, #fff 64%) 0 0 / 7px 7px', mixBlendMode: 'multiply' }} />
        </div>
        {doodles && (
          <svg viewBox="0 0 320 160" className="absolute inset-0 h-full w-full" fill="none" stroke="#ff7a66" strokeWidth="3" strokeLinecap="round">
            <path d="M120 40 C112 14 130 6 140 22 M200 40 C208 14 190 6 180 22" />
            <path d="M140 118 C150 132 170 132 180 118 C170 110 150 110 140 118 Z" />
            <path d="M60 30 l-14 -10 M70 50 l-18 -2 M262 34 l14 -10 M256 56 l18 -2" />
            <path d="M270 120 q22 -6 28 14" />
          </svg>
        )}
      </div>
      <h3 className="mt-5 text-center leading-[0.95] font-extrabold tracking-tight uppercase" style={{ fontSize: 'clamp(40px, 9vw, 76px)', color: 'transparent', WebkitTextStroke: '2px #f2f2f2' }}>
        Tim Van Damme
      </h3>
      <p className="-mt-1 text-center" style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: 'clamp(40px, 9vw, 72px)', color: '#ff7a66', transform: 'rotate(-3deg)', lineHeight: 0.9 }}>
        Max Voltar
      </p>
      <p className="sr-only">Tim Van Damme, also known as Max Voltar.</p>
      <label className="mx-auto mt-6 flex w-max items-center gap-3 text-sm text-[#d9d9d9]">
        <input type="checkbox" checked={doodles} onChange={(e) => setDoodles(e.target.checked)} className="size-5" />
        Show the doodles
      </label>
    </div>
  )
}
