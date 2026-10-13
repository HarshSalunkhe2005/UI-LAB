import { useEffect, useRef, useState } from 'react'

/*
 * Vibe-coded move (Habbo Hotel chatroom, v0): an isometric room where you click a tile and the avatar walks
 * there. Tiles are drawn as diamonds on a canvas; a breadth-first search finds the shortest 4-direction path
 * around furniture; the avatar eases from tile to tile. Keyboard: arrow keys step the avatar one tile, so the
 * room is playable without a pointer. No libraries. Reduced motion: the avatar teleports instead of walking.
 */

const N = 9
const BLOCKED = new Set(['3,3', '3,4', '4,3', '6,6', '6,5', '1,6', '2,6'])
const key = (x: number, y: number) => `${x},${y}`

function bfs(from: [number, number], to: [number, number]): [number, number][] {
  if (BLOCKED.has(key(...to))) return []
  const prev = new Map<string, string | null>([[key(...from), null]])
  const q: [number, number][] = [from]
  while (q.length) {
    const [x, y] = q.shift()!
    if (x === to[0] && y === to[1]) break
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy
      if (nx < 0 || ny < 0 || nx >= N || ny >= N || BLOCKED.has(key(nx, ny)) || prev.has(key(nx, ny))) continue
      prev.set(key(nx, ny), key(x, y))
      q.push([nx, ny])
    }
  }
  if (!prev.has(key(...to))) return []
  const path: [number, number][] = []
  for (let k: string | null = key(...to); k; k = prev.get(k) ?? null) path.unshift(k.split(',').map(Number) as [number, number])
  return path.slice(1)
}

export default function V0IsometricRoom() {
  const ref = useRef<HTMLCanvasElement>(null)
  const state = useRef({ tile: [1, 1] as [number, number], pos: [1, 1] as [number, number], path: [] as [number, number][] })
  const [said, setSaid] = useState('Click a tile, or use the arrow keys')

  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const css = getComputedStyle(cv)
    const accent = css.getPropertyValue('--accent').trim() || '#f90'
    const border = css.getPropertyValue('--border').trim() || '#444'
    const surface2 = css.getPropertyValue('--surface-2').trim() || '#222'
    const fg = css.getPropertyValue('--fg').trim() || '#eee'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0
    const TW = 54, TH = 27

    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = cv.clientWidth; h = cv.clientHeight
      cv.width = w * dpr; cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ro = new ResizeObserver(fit); ro.observe(cv); fit()

    const origin = () => ({ ox: w / 2, oy: h / 2 - (N * TH) / 2 + 8 })
    const toScreen = (x: number, y: number) => { const { ox, oy } = origin(); return { x: ox + ((x - y) * TW) / 2, y: oy + ((x + y) * TH) / 2 } }
    const toTile = (px: number, py: number): [number, number] | null => {
      const { ox, oy } = origin()
      const a = (px - ox) / (TW / 2), b = (py - oy) / (TH / 2)
      const x = Math.floor((a + b) / 2 + 0.5), y = Math.floor((b - a) / 2 + 0.5)
      return x >= 0 && y >= 0 && x < N && y < N ? [x, y] : null
    }

    const diamond = (x: number, y: number, fill: string, stroke = border) => {
      const c = toScreen(x, y)
      ctx.beginPath()
      ctx.moveTo(c.x, c.y - TH / 2); ctx.lineTo(c.x + TW / 2, c.y); ctx.lineTo(c.x, c.y + TH / 2); ctx.lineTo(c.x - TW / 2, c.y)
      ctx.closePath()
      ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.stroke()
    }
    const box = (x: number, y: number) => {
      const c = toScreen(x, y)
      const hgt = 22
      ctx.fillStyle = fg; ctx.globalAlpha = 0.35
      ctx.beginPath(); ctx.moveTo(c.x - TW / 2, c.y); ctx.lineTo(c.x, c.y + TH / 2); ctx.lineTo(c.x, c.y + TH / 2 - hgt); ctx.lineTo(c.x - TW / 2, c.y - hgt); ctx.fill()
      ctx.globalAlpha = 0.2
      ctx.beginPath(); ctx.moveTo(c.x + TW / 2, c.y); ctx.lineTo(c.x, c.y + TH / 2); ctx.lineTo(c.x, c.y + TH / 2 - hgt); ctx.lineTo(c.x + TW / 2, c.y - hgt); ctx.fill()
      ctx.globalAlpha = 0.5
      ctx.beginPath(); ctx.moveTo(c.x, c.y - TH / 2 - hgt); ctx.lineTo(c.x + TW / 2, c.y - hgt); ctx.lineTo(c.x, c.y + TH / 2 - hgt); ctx.lineTo(c.x - TW / 2, c.y - hgt); ctx.fill()
      ctx.globalAlpha = 1
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (let s = 0; s < N * 2; s++)
        for (let x = 0; x < N; x++) {
          const y = s - x
          if (y < 0 || y >= N) continue
          diamond(x, y, (x + y) % 2 ? surface2 : 'transparent')
          if (BLOCKED.has(key(x, y))) box(x, y)
        }
      const p = state.current.pos
      const c = toScreen(p[0], p[1])
      ctx.fillStyle = 'rgb(0 0 0 / 0.3)'
      ctx.beginPath(); ctx.ellipse(c.x, c.y + 4, 11, 5, 0, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.roundRect(c.x - 8, c.y - 30, 16, 28, 5); ctx.fill()
      ctx.fillStyle = fg
      ctx.beginPath(); ctx.arc(c.x, c.y - 36, 8, 0, Math.PI * 2); ctx.fill()
    }

    const loop = () => {
      const s = state.current
      if (s.path.length) {
        const [tx, ty] = s.path[0]
        if (reduced) { s.pos = [tx, ty]; s.path.shift() }
        else {
          const dx = tx - s.pos[0], dy = ty - s.pos[1], d = Math.hypot(dx, dy)
          if (d < 0.08) { s.pos = [tx, ty]; s.path.shift() }
          else s.pos = [s.pos[0] + (dx / d) * 0.07, s.pos[1] + (dy / d) * 0.07]
        }
      }
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const walkTo = (t: [number, number]) => {
      const from: [number, number] = [Math.round(state.current.pos[0]), Math.round(state.current.pos[1])]
      const path = bfs(from, t)
      if (!path.length) return setSaid(BLOCKED.has(key(...t)) ? 'Something is in the way' : 'Already here')
      state.current.pos = from
      state.current.path = path
      setSaid(`Walking to ${t[0]},${t[1]}`)
    }
    const click = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      const t = toTile(e.clientX - r.left, e.clientY - r.top)
      if (t) walkTo(t)
    }
    const kd = (e: KeyboardEvent) => {
      const d: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }
      const v = d[e.key]
      if (!v) return
      e.preventDefault()
      const p = state.current.path.length ? state.current.path[state.current.path.length - 1] : [Math.round(state.current.pos[0]), Math.round(state.current.pos[1])]
      const t: [number, number] = [p[0] + v[0], p[1] + v[1]]
      if (t[0] >= 0 && t[1] >= 0 && t[0] < N && t[1] < N && !BLOCKED.has(key(...t))) { state.current.path.push(t); setSaid(`Walking to ${t[0]},${t[1]}`) }
    }
    cv.addEventListener('pointerdown', click)
    cv.addEventListener('keydown', kd)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener('pointerdown', click); cv.removeEventListener('keydown', kd) }
  }, [])

  return (
    <div className="relative rounded-xl border border-border bg-surface">
      <canvas ref={ref} tabIndex={0} role="application" aria-label="Isometric room. Click a tile to walk there, or use the arrow keys to step." className="block h-96 w-full cursor-pointer touch-none outline-offset-4" />
      <p className="pointer-events-none absolute bottom-3 left-4 rounded bg-bg/70 px-2 py-1 font-mono text-[11px] text-fg-muted" aria-live="polite">{said}</p>
    </div>
  )
}
