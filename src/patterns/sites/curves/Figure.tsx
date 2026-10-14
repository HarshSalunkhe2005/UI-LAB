import { useRef, useState } from 'react'

/*
 * One interactive figure: a set of draggable control points on an SVG canvas. Points move with the pointer (captured, so a
 * drag keeps working outside the figure) and with the arrow keys (4 px, or 16 px with Shift). Each point is a focusable
 * button with a spoken position. The parent decides what to draw between the points via `children`.
 */

export type Pt = [number, number]
export const W = 420
export const H = 300

export function clampPt([x, y]: Pt): Pt {
  return [Math.max(10, Math.min(W - 10, x)), Math.max(10, Math.min(H - 10, y))]
}

export default function Figure({ pts, set, labels, children, caption }: { pts: Pt[]; set: (p: Pt[]) => void; labels: string[]; children: React.ReactNode; caption: string }) {
  const svg = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState<number | null>(null)

  const to = (e: React.PointerEvent): Pt => {
    const r = svg.current!.getBoundingClientRect()
    return clampPt([((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H])
  }
  const move = (i: number, p: Pt) => set(pts.map((q, j) => (j === i ? p : q)))

  return (
    <figure className="fig">
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="group" aria-label={caption} onPointerMove={(e) => drag !== null && move(drag, to(e))} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}>
        <rect width={W} height={H} className="paper" />
        {Array.from({ length: 8 }, (_, i) => <line key={'v' + i} x1={(i + 1) * 52} x2={(i + 1) * 52} y1="0" y2={H} className="grid" />)}
        {Array.from({ length: 5 }, (_, i) => <line key={'h' + i} x1="0" x2={W} y1={(i + 1) * 50} y2={(i + 1) * 50} className="grid" />)}
        {children}
        {pts.map((p, i) => (
          <g key={i}>
            <circle
              cx={p[0]}
              cy={p[1]}
              r="11"
              className={`pt ${drag === i ? 'on' : ''}`}
              tabIndex={0}
              role="button"
              aria-label={`${labels[i]}: ${Math.round(p[0])}, ${Math.round(p[1])}. Drag, or use the arrow keys.`}
              onPointerDown={(e) => {
                ;(e.target as Element).setPointerCapture(e.pointerId)
                setDrag(i)
              }}
              onKeyDown={(e) => {
                const s = e.shiftKey ? 16 : 4
                const d: Record<string, Pt> = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }
                if (d[e.key]) {
                  e.preventDefault()
                  move(i, clampPt([p[0] + d[e.key][0], p[1] + d[e.key][1]]))
                }
              }}
            />
            <text x={p[0] + 16} y={p[1] - 12} className="plabel" aria-hidden>{labels[i].replace('Point ', 'P')}</text>
          </g>
        ))}
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
