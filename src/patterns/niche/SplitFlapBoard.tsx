import { useEffect, useRef, useState } from 'react'

/*
 * Niche world: Departures Board. A split-flap display like a station or airport board. Each cell cycles
 * forward through the character set (like the real mechanism, it can only go forward) until it shows the
 * target; every step is a flap that falls. Rows are real text in the accessibility tree (a visually hidden
 * table mirrors the board), and "Shuffle" gives the board something to do. Reduced motion: cells jump
 * straight to the target with no flipping.
 */

const SET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-'
const COLS = [5, 12, 3, 8] // time, destination, platform, status

type Row = [string, string, string, string]
const DATA: Row[][] = [
  [
    ['21:40', 'BERLIN', '4', 'ON TIME'],
    ['22:05', 'VIENNA', '7', 'BOARDING'],
    ['22:30', 'ROME', '2', 'DELAYED'],
    ['23:15', 'PRAGUE', '5', 'ON TIME'],
    ['23:50', 'WARSAW', '9', 'ON TIME'],
  ],
  [
    ['21:55', 'MUNICH', '3', 'ON TIME'],
    ['22:20', 'BUDAPEST', '6', 'CANCELLED'],
    ['22:45', 'ZURICH', '1', 'BOARDING'],
    ['23:30', 'OSLO', '8', 'DELAYED'],
    ['00:10', 'LISBON', '4', 'ON TIME'],
  ],
]

const pad = (s: string, n: number) => s.toUpperCase().padEnd(n, ' ').slice(0, n)

function Cell({ ch, prev, tick }: { ch: string; prev: string; tick: number }) {
  return (
    <span className="sf-cell" aria-hidden>
      <span className="sf-top"><b>{ch}</b></span>
      <span className="sf-bot"><b>{prev}</b></span>
      <span key={tick} className="sf-fall sf-top"><b>{prev}</b></span>
      <span key={`b${tick}`} className="sf-rise sf-bot"><b>{ch}</b></span>
    </span>
  )
}

export default function SplitFlapBoard() {
  const [set, setSet] = useState(0)
  const target = DATA[set].flatMap((r) => r.map((c, i) => pad(c, COLS[i]))).join('')
  const reduced = useRef(false)
  const [cur, setCur] = useState(() => ' '.repeat(target.length))
  const [prev, setPrev] = useState(() => ' '.repeat(target.length))
  const [ticks, setTicks] = useState<number[]>(() => Array(target.length).fill(0))

  const curRef = useRef(cur)

  useEffect(() => {
    reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) {
      curRef.current = target
      setCur(target)
      setPrev(target)
      return
    }
    // Plain state updates computed from a ref: no side effects inside updater functions (StrictMode runs those twice).
    const id = window.setInterval(() => {
      const c = curRef.current
      const next = c.split('').map((ch, i) => (ch === target[i] ? ch : SET[(SET.indexOf(ch) + 1) % SET.length])).join('')
      if (next === c) return window.clearInterval(id)
      setPrev(c)
      setTicks((t) => t.map((n, i) => (c[i] === target[i] ? n : n + 1)))
      curRef.current = next
      setCur(next)
    }, 75)
    return () => window.clearInterval(id)
  }, [target])

  let k = 0
  return (
    <div className="rounded-xl border border-border bg-[#14120f] p-4 sm:p-6" style={{ containerType: 'inline-size' }}>
      <style>{`
        .sf-row { display: flex; gap: 14px; margin-bottom: 6px; }
        .sf-grp { display: flex; gap: 2px; }
        .sf-cell { position: relative; display: inline-block; width: 1.05em; height: 1.55em; font: 600 clamp(9px, 2.5cqw, 26px)/1.55 var(--font-mono, monospace); color: #f4e9c8; perspective: 300px; }
        .sf-top, .sf-bot { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; background: #1f1c17; border-radius: 3px; text-align: center; }
        .sf-top { top: 0; transform-origin: bottom; border-bottom: 1px solid #000; }
        .sf-bot { bottom: 0; transform-origin: top; }
        .sf-top b, .sf-bot b { display: block; font-weight: 600; }
        .sf-bot b { transform: translateY(-50%); }
        .sf-fall { animation: sf-fall 75ms ease-in forwards; z-index: 2; }
        .sf-rise { animation: sf-rise 75ms ease-out 75ms both; z-index: 1; }
        @keyframes sf-fall { to { transform: rotateX(-90deg); } }
        @keyframes sf-rise { from { transform: rotateX(90deg); } to { transform: rotateX(0); } }
        @media (prefers-reduced-motion: reduce) { .sf-fall, .sf-rise { animation: none; } }
      `}</style>
      <div role="img" aria-label="Departures board">
        {DATA[set].map((_, r) => (
          <div className="sf-row" key={r}>
            {COLS.map((n, c) => (
              <span className="sf-grp" key={c}>
                {Array.from({ length: n }, () => {
                  const i = k++
                  return <Cell key={i} ch={cur[i]} prev={prev[i]} tick={ticks[i]} />
                })}
              </span>
            ))}
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>Departures</caption>
        <thead><tr><th>Time</th><th>Destination</th><th>Platform</th><th>Status</th></tr></thead>
        <tbody>{DATA[set].map((r) => <tr key={r[1]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>
      <button onClick={() => setSet((s) => (s + 1) % DATA.length)} className="mt-4 min-h-11 rounded-md border border-white/20 px-4 text-sm text-[#f4e9c8] hover:bg-white/10">
        Update board
      </button>
    </div>
  )
}
