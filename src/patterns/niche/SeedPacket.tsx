import { useRef, useState } from 'react'

/*
 * Niche world: Seed Packet / Garden Catalogue. An illustrated packet that tilts toward the pointer (CSS 3D,
 * two variables), tears open along a perforated top when you press the button, and reveals the planting
 * calendar. The calendar is a real table: sow, grow and harvest months are marked with text, not colour alone.
 * Reduced motion: no tilt and the tear is an instant swap.
 */

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const SOW = [2, 3, 4]
const GROW = [4, 5, 6, 7]
const HARVEST = [6, 7, 8, 9]

export default function SeedPacket() {
  const [open, setOpen] = useState(false)
  const pk = useRef<HTMLDivElement>(null)

  const tilt = (e: React.PointerEvent) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    pk.current!.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`
  }

  return (
    <div className="grid gap-6 rounded-xl border border-border bg-[#e9dcc0] p-6 text-[#2c3a1f] md:grid-cols-[18rem_1fr]">
      <div className="[perspective:900px]" onPointerMove={tilt} onPointerLeave={() => (pk.current!.style.transform = '')}>
        <div ref={pk} className="relative mx-auto w-60 transition-transform duration-200 [transform-style:preserve-3d] motion-reduce:transition-none">
          <div
            className="relative h-80 overflow-hidden rounded-sm border-2 border-[#2c3a1f] bg-[#f6efd8] shadow-xl"
            style={{ clipPath: open ? 'polygon(0 14%, 8% 10%, 18% 15%, 30% 9%, 42% 14%, 55% 8%, 68% 13%, 80% 9%, 92% 14%, 100% 11%, 100% 100%, 0 100%)' : undefined, transition: 'clip-path 0.4s' }}
          >
            <div className="absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,#2c3a1f_0_6px,transparent_6px_12px)]" aria-hidden />
            <p className="mt-6 text-center font-mono text-[10px] tracking-[0.3em]">HEIRLOOM SEEDS</p>
            <h3 className="mt-2 text-center font-display text-4xl leading-none italic" style={{ fontFamily: 'var(--font-display, serif)' }}>Sweet<br />Pea</h3>
            <svg viewBox="0 0 120 120" className="mx-auto mt-3 h-32 w-32" aria-hidden>
              <path d="M60 110C60 80 58 60 60 30" stroke="#2c3a1f" strokeWidth="2" fill="none" />
              {[-1, 1].map((d) => (
                <g key={d}>
                  <path d={`M60 70c${d * 30} -6 ${d * 44} -26 ${d * 40} -44c${d * -26} 4 ${d * -40} 20 ${d * -40} 44Z`} fill="#c8586b" stroke="#2c3a1f" strokeWidth="1.5" />
                  <path d={`M60 90c${d * 22} 2 ${d * 36} -8 ${d * 36} -24`} stroke="#2c3a1f" strokeWidth="1" fill="none" />
                </g>
              ))}
              <circle cx="60" cy="28" r="6" fill="#e9b33d" stroke="#2c3a1f" strokeWidth="1.5" />
            </svg>
            <p className="mt-2 text-center font-mono text-[10px]">Lathyrus odoratus · Net wt. 40 seeds</p>
          </div>
        </div>
      </div>
      <div>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="min-h-11 rounded border-2 border-[#2c3a1f] bg-[#2c3a1f] px-5 font-mono text-sm tracking-wider text-[#f6efd8] hover:bg-[#3d4f2b]">
          {open ? 'Close packet' : 'Tear open'}
        </button>
        <h4 className="mt-5 font-display text-2xl italic" style={{ fontFamily: 'var(--font-display, serif)' }}>Planting calendar</h4>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-80 border-collapse text-center font-mono text-xs" aria-label="Planting calendar by month">
            <thead>
              <tr><th className="text-left font-normal" />{MONTHS.map((m, i) => <th key={i} scope="col" className="w-7 py-1 font-normal">{m}</th>)}</tr>
            </thead>
            <tbody>
              {([['Sow', SOW], ['Grow', GROW], ['Harvest', HARVEST]] as const).map(([row, on]) => (
                <tr key={row} className="border-t border-[#2c3a1f]/30">
                  <th scope="row" className="py-2 text-left font-normal">{row}</th>
                  {MONTHS.map((_, i) => (
                    <td key={i} className="p-0.5">
                      <span className={`grid h-6 place-items-center rounded-sm ${on.includes(i) ? 'bg-[#2c3a1f] text-[#f6efd8]' : 'bg-black/5 text-transparent'}`}>{on.includes(i) ? '●' : '.'}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
