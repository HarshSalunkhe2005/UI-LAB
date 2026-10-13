import { useEffect, useRef, useState } from 'react'

/* A split-flap board: each cell cycles forward through the character set until it shows its target. */

const SET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-'
export const pad = (s: string, n: number) => s.toUpperCase().padEnd(n, ' ').slice(0, n)

function Cell({ ch, prev, tick }: { ch: string; prev: string; tick: number }) {
  return (
    <span className="flap" aria-hidden>
      <span className="flap-top"><b>{ch}</b></span>
      <span className="flap-bot"><b>{prev}</b></span>
      <span key={tick} className="flap-fall flap-top"><b>{prev}</b></span>
      <span key={`b${tick}`} className="flap-rise flap-bot"><b>{ch}</b></span>
    </span>
  )
}

export function Board({ rows, cols, reduced, label }: { rows: string[][]; cols: number[]; reduced: boolean; label: string }) {
  const target = rows.flatMap((r) => r.map((c, i) => pad(c, cols[i]))).join('')
  const [cur, setCur] = useState(() => (reduced ? target : ' '.repeat(target.length)))
  const [prev, setPrev] = useState(cur)
  const [ticks, setTicks] = useState<number[]>(() => Array(target.length).fill(0))
  const curRef = useRef(cur)

  useEffect(() => {
    if (reduced) {
      curRef.current = target
      setCur(target)
      setPrev(target)
      return
    }
    const id = window.setInterval(() => {
      const c = curRef.current
      const next = c.split('').map((ch, i) => (ch === target[i] ? ch : SET[(SET.indexOf(ch) + 1) % SET.length])).join('')
      if (next === c) return window.clearInterval(id)
      setPrev(c)
      setTicks((t) => t.map((n, i) => (c[i] === target[i] ? n : n + 1)))
      curRef.current = next
      setCur(next)
    }, 60)
    return () => window.clearInterval(id)
  }, [target, reduced])

  let k = 0
  return (
    <div className="board" role="img" aria-label={label}>
      {rows.map((_, r) => (
        <div className="board-row" key={r}>
          {cols.map((n, c) => (
            <span className="board-grp" key={c}>
              {Array.from({ length: n }, () => {
                const i = k++
                return <Cell key={i} ch={cur[i]} prev={prev[i]} tick={ticks[i]} />
              })}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
