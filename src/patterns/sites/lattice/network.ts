/* Canvas 2D "edge network": a dot grid that wakes up near the pointer, region nodes that light up as the
   story progresses, and packets that replicate along lit edges. State lives in a plain object (`net`) that
   scroll code writes and the draw loop reads, so React never re-renders per frame. */

export const net = { lit: 4, dead: false } // starts ambient (4 regions) until the story section takes over

type Region = { n: string; x: number; y: number }
// Lit in this order as `net.lit` grows.
const REGIONS: Region[] = [
  { n: 'iad', x: 0.3, y: 0.36 },
  { n: 'fra', x: 0.58, y: 0.3 },
  { n: 'sin', x: 0.8, y: 0.62 },
  { n: 'syd', x: 0.9, y: 0.84 },
  { n: 'gru', x: 0.34, y: 0.74 },
  { n: 'nrt', x: 0.9, y: 0.38 },
  { n: 'lhr', x: 0.48, y: 0.2 },
  { n: 'bom', x: 0.7, y: 0.48 },
  { n: 'sfo', x: 0.12, y: 0.42 },
]

const ACCENT = '94, 242, 178'
const AMBER = '255, 180, 84'

type Packet = { a: number; b: number; t: number; speed: number }

export function startNetwork(canvas: HTMLCanvasElement, reduced: boolean) {
  const ctx = canvas.getContext('2d')!
  let w = 0
  let h = 0
  let dpr = 1
  const pointer = { x: -999, y: -999 }
  const packets: Packet[] = []
  let raf = 0
  let last = performance.now()
  let spawn = 0

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2)
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  const move = (e: PointerEvent) => {
    pointer.x = e.clientX
    pointer.y = e.clientY
  }
  resize()
  addEventListener('resize', resize)
  addEventListener('pointermove', move)

  const pos = (r: Region) => ({ x: r.x * w, y: r.y * h })

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    ctx.clearRect(0, 0, w, h)

    // dot grid
    const gap = w < 700 ? 30 : 36
    for (let x = gap / 2; x < w; x += gap) {
      for (let y = gap / 2; y < h; y += gap) {
        const dx = pointer.x - x
        const dy = pointer.y - y
        const d = Math.hypot(dx, dy)
        const k = Math.max(0, 1 - d / 180)
        const px = x + (dx / (d || 1)) * k * 6
        const py = y + (dy / (d || 1)) * k * 6
        ctx.fillStyle = `rgba(${ACCENT}, ${0.07 + k * 0.5})`
        ctx.fillRect(px - 0.75, py - 0.75, 1.5 + k * 1.5, 1.5 + k * 1.5)
      }
    }

    const lit = REGIONS.slice(0, net.lit).map((r, i) => ({ ...pos(r), n: r.n, dead: net.dead && i === 0 }))
    const alive = lit.filter((p) => !p.dead)

    // edges: each lit node to its two nearest living neighbours
    ctx.lineWidth = 1
    const edges: [number, number][] = []
    alive.forEach((p, i) => {
      alive
        .map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach((o) => {
          if (i < o.j || !edges.some(([a, b]) => a === o.j && b === i)) edges.push([i, o.j])
        })
    })
    edges.forEach(([i, j]) => {
      ctx.strokeStyle = `rgba(${ACCENT}, 0.22)`
      ctx.beginPath()
      ctx.moveTo(alive[i].x, alive[i].y)
      ctx.lineTo(alive[j].x, alive[j].y)
      ctx.stroke()
    })

    // packets
    if (!reduced) {
      spawn -= dt
      if (spawn <= 0 && edges.length) {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)]
        packets.push({ a, b, t: 0, speed: 0.35 + Math.random() * 0.4 })
        spawn = 0.35
      }
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i]
      p.t += dt * p.speed
      const A = alive[p.a]
      const B = alive[p.b]
      if (p.t >= 1 || !A || !B) {
        packets.splice(i, 1)
        continue
      }
      const x = A.x + (B.x - A.x) * p.t
      const y = A.y + (B.y - A.y) * p.t
      ctx.fillStyle = `rgba(${ACCENT}, 0.95)`
      ctx.beginPath()
      ctx.arc(x, y, 2.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(${ACCENT}, 0.18)`
      ctx.beginPath()
      ctx.arc(x, y, 7, 0, Math.PI * 2)
      ctx.fill()
    }

    // nodes
    const t = now / 1000
    REGIONS.forEach((r, i) => {
      const { x, y } = pos(r)
      const on = i < net.lit
      const dead = net.dead && i === 0
      const rgb = dead ? AMBER : ACCENT
      if (on) {
        const pulse = reduced ? 0 : (Math.sin(t * 2 + i) + 1) / 2
        ctx.fillStyle = `rgba(${rgb}, ${0.08 + pulse * 0.08})`
        ctx.beginPath()
        ctx.arc(x, y, 18 + pulse * 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(${rgb}, 1)`
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'
        ctx.beginPath()
        ctx.arc(x, y, 3.5, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.font = '11px "JetBrains Mono Variable", ui-monospace, monospace'
      ctx.fillStyle = on ? `rgba(${rgb}, 0.95)` : 'rgba(255,255,255,0.35)'
      ctx.fillText(dead ? `${r.n} ✕` : r.n, x + 10, y - 9)
    })

    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    removeEventListener('resize', resize)
    removeEventListener('pointermove', move)
  }
}
