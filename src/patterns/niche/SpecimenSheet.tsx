import { useState } from 'react'
import '@fontsource-variable/fraunces/full.css'

/*
 * Niche world: Type Specimen Sheet. How a type foundry sells a typeface: a huge glyph, the character set, a size
 * ladder and live controls for the variable axes (weight, optical size, softness, wonk). The axes drive
 * font-variation-settings on one element, so you see what the design space does. Sliders are native range inputs
 * with visible values. Needs a variable font with those axes (Fraunces here, via Fontsource).
 */

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&?!@#%'

export default function SpecimenSheet() {
  const [wght, setWght] = useState(500)
  const [opsz, setOpsz] = useState(72)
  const [soft, setSoft] = useState(0)
  const [wonk, setWonk] = useState(0)
  const style = { fontFamily: "'Fraunces Variable', serif", fontVariationSettings: `'wght' ${wght}, 'opsz' ${opsz}, 'SOFT' ${soft}, 'WONK' ${wonk}` } as const

  const axes: [string, number, (n: number) => void, number, number][] = [
    ['Weight', wght, setWght, 100, 900],
    ['Optical size', opsz, setOpsz, 9, 144],
    ['Softness', soft, setSoft, 0, 100],
    ['Wonk', wonk, setWonk, 0, 1],
  ]

  return (
    <div className="rounded-xl border border-[#cfc6b4] bg-[#f6f1e6] p-6 text-[#1b1813]">
      <div className="grid gap-6 md:grid-cols-[1fr_15rem]">
        <div>
          <p className="font-mono text-[11px] tracking-wider uppercase">Fraunces · Variable · 4 axes</p>
          <p className="mt-2 leading-none" style={{ ...style, fontSize: 'clamp(7rem, 22vw, 13rem)' }} aria-label="Ag">Ag</p>
          <p className="mt-2 break-all leading-snug" style={{ ...style, fontSize: '1.7rem' }}>{ALPHA}</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()} aria-label="Variable axes">
          {axes.map(([name, val, set, min, max]) => (
            <label key={name} className="block">
              <span className="flex justify-between font-mono text-xs"><span>{name}</span><span className="tabular-nums">{val}</span></span>
              <input type="range" min={min} max={max} step={max === 1 ? 1 : 1} value={val} onChange={(e) => set(Number(e.target.value))} className="h-8 w-full accent-[#a8402a]" />
            </label>
          ))}
        </form>
      </div>
      <div className="mt-6 space-y-1 border-t border-[#1b1813]/30 pt-4">
        {[48, 32, 22, 16, 12].map((px) => (
          <p key={px} className="flex items-baseline gap-4" style={style}>
            <span className="w-10 shrink-0 font-mono text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>{px}</span>
            <span style={{ fontSize: px }}>Sphinx of black quartz, judge my vow</span>
          </p>
        ))}
      </div>
    </div>
  )
}
