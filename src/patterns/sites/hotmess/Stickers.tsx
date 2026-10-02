import { useEffect, useRef } from 'react'

/* A pile of stickers you can grab, throw and stack. Plain pointer events + a tiny rAF integrator:
   no physics library. Position/velocity live in refs and are written straight to transforms. */

type Body = { x: number; y: number; vx: number; vy: number; r: number; vr: number; w: number; h: number; drag: boolean }

const INK = '#111'

const stroke = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const }

export const STICKERS: { id: string; label: string; w: number; h: number; fx: number; fy: number; r: number; node: React.ReactNode }[] = [
  {
    id: 'burst',
    label: 'No decaf sticker',
    w: 190,
    h: 190,
    fx: 0.07,
    fy: 0.16,
    r: -12,
    node: (
      <svg viewBox="0 0 200 200">
        <polygon {...stroke} fill="#ffd23f" points="100,6 121,36 156,22 160,59 196,66 175,97 196,128 160,138 156,176 121,164 100,194 79,164 44,176 40,138 4,128 25,97 4,66 40,59 44,22 79,36" />
        <text x="100" y="92" textAnchor="middle" fontFamily="Archivo Black" fontSize="34" fill={INK}>NO</text>
        <text x="100" y="128" textAnchor="middle" fontFamily="Archivo Black" fontSize="34" fill={INK}>DECAF</text>
      </svg>
    ),
  },
  {
    id: 'cup',
    label: 'Smiling cup sticker',
    w: 170,
    h: 190,
    fx: 0.8,
    fy: 0.1,
    r: 9,
    node: (
      <svg viewBox="0 0 180 200">
        <path {...stroke} fill="#ff4b2b" d="M24 50h120l-14 124a14 14 0 0 1-14 12H52a14 14 0 0 1-14-12z" />
        <path {...stroke} fill="none" d="M144 70h14a20 20 0 0 1 0 44h-18" />
        <rect {...stroke} fill="#fff1d6" x="18" y="32" width="132" height="20" rx="8" />
        <circle cx="66" cy="108" r="8" fill={INK} />
        <circle cx="106" cy="108" r="8" fill={INK} />
        <path {...stroke} fill="none" d="M62 138q24 22 50 0" />
        <path {...stroke} fill="none" d="M60 14q-10 -8 0 -16M86 14q-10 -8 0 -16M112 14q-10 -8 0 -16" />
      </svg>
    ),
  },
  {
    id: 'bolt',
    label: 'Lightning bolt sticker',
    w: 120,
    h: 170,
    fx: 0.62,
    fy: 0.52,
    r: 14,
    node: (
      <svg viewBox="0 0 120 170">
        <polygon {...stroke} fill="#2f5bff" points="70,6 10,96 52,96 38,164 112,64 68,64 92,6" />
      </svg>
    ),
  },
  {
    id: 'fresh',
    label: 'Fresh roasted label sticker',
    w: 230,
    h: 80,
    fx: 0.1,
    fy: 0.66,
    r: -6,
    node: (
      <svg viewBox="0 0 230 80">
        <rect {...stroke} fill="#8de8b5" x="4" y="6" width="222" height="68" rx="34" />
        <text x="115" y="50" textAnchor="middle" fontFamily="Archivo Black" fontSize="26" fill={INK}>FRESH ROASTED</text>
      </svg>
    ),
  },
  {
    id: 'badge',
    label: 'Small batch badge sticker',
    w: 190,
    h: 190,
    fx: 0.4,
    fy: 0.7,
    r: 0,
    node: (
      <svg viewBox="0 0 200 200">
        <defs>
          <path id="ring" d="M100 100m-70 0a70 70 0 1 1 140 0a70 70 0 1 1 -140 0" />
        </defs>
        <circle {...stroke} fill="#fff1d6" cx="100" cy="100" r="94" />
        <text fontFamily="Space Mono" fontWeight="700" fontSize="15" letterSpacing="3" fill={INK}>
          <textPath href="#ring">SMALL BATCH · BAD DECISIONS · SMALL BATCH · BAD DECISIONS ·</textPath>
        </text>
        <circle {...stroke} fill="#ff4b2b" cx="100" cy="100" r="34" />
        <ellipse cx="100" cy="100" rx="14" ry="22" fill="none" stroke={INK} strokeWidth="4" transform="rotate(30 100 100)" />
      </svg>
    ),
  },
  {
    id: 'bean',
    label: 'Coffee bean sticker',
    w: 110,
    h: 150,
    fx: 0.88,
    fy: 0.56,
    r: -24,
    node: (
      <svg viewBox="0 0 110 150">
        <ellipse {...stroke} fill="#8a5a3c" cx="55" cy="75" rx="44" ry="66" />
        <path {...stroke} fill="none" d="M55 14c-26 30 26 50 0 76s26 36 0 46" />
      </svg>
    ),
  },
  {
    id: 'bad',
    label: 'Bad idea sticker',
    w: 200,
    h: 70,
    fx: 0.74,
    fy: 0.82,
    r: 5,
    node: (
      <svg viewBox="0 0 200 70">
        <rect {...stroke} fill={INK} x="4" y="6" width="192" height="58" rx="10" />
        <text x="100" y="44" textAnchor="middle" fontFamily="Archivo Black" fontSize="26" fill="#ffd23f">BAD IDEA?</text>
      </svg>
    ),
  },
  {
    id: 'star',
    label: 'Star sticker',
    w: 120,
    h: 120,
    fx: 0.3,
    fy: 0.08,
    r: 18,
    node: (
      <svg viewBox="0 0 120 120">
        <path {...stroke} fill="#ff4b2b" d="M60 6l14 34 36 4-27 24 8 36-31-19-31 19 8-36L10 44l36-4z" />
      </svg>
    ),
  },
]

export default function Stickers() {
  const board = useRef<HTMLDivElement>(null)
  const els = useRef<(HTMLDivElement | null)[]>([])
  const bodies = useRef<Body[]>([])
  const z = useRef(10)

  useEffect(() => {
    const b = board.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const place = () => {
      const { width, height } = b.getBoundingClientRect()
      const small = width < 700
      STICKERS.forEach((s, i) => {
        const k = small ? 0.62 : 1
        const w = s.w * k
        const h = s.h * k
        const prev = bodies.current[i]
        bodies.current[i] = {
          x: prev ? Math.min(Math.max(0, prev.x), width - w) : s.fx * (width - w),
          y: prev ? Math.min(Math.max(0, prev.y), height - h) : s.fy * (height - h),
          vx: 0, vy: 0, r: prev ? prev.r : s.r, vr: 0, w, h, drag: false,
        }
        const el = els.current[i]!
        el.style.width = `${w}px`
        el.style.height = `${h}px`
      })
    }
    place()
    addEventListener('resize', place)

    let raf = 0
    const tick = () => {
      const { width, height } = b.getBoundingClientRect()
      bodies.current.forEach((s, i) => {
        if (!s.drag) {
          s.x += s.vx
          s.y += s.vy
          s.r += s.vr
          s.vx *= 0.95
          s.vy *= 0.95
          s.vr *= 0.95
          if (s.x < 0) (s.x = 0, s.vx *= -0.6)
          if (s.x > width - s.w) (s.x = width - s.w, s.vx *= -0.6)
          if (s.y < 0) (s.y = 0, s.vy *= -0.6)
          if (s.y > height - s.h) (s.y = height - s.h, s.vy *= -0.6)
        }
        els.current[i]!.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.r}deg)`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // drag
    const cleanups: (() => void)[] = []
    els.current.forEach((el, i) => {
      if (!el) return
      let ox = 0
      let oy = 0
      let lx = 0
      let ly = 0
      const down = (e: PointerEvent) => {
        const s = bodies.current[i]
        el.setPointerCapture(e.pointerId)
        const r = b.getBoundingClientRect()
        ox = e.clientX - r.left - s.x
        oy = e.clientY - r.top - s.y
        lx = e.clientX
        ly = e.clientY
        s.drag = true
        s.vx = s.vy = s.vr = 0
        el.style.zIndex = String(++z.current)
        el.classList.add('held')
      }
      const move = (e: PointerEvent) => {
        const s = bodies.current[i]
        if (!s.drag) return
        const r = b.getBoundingClientRect()
        s.x = e.clientX - r.left - ox
        s.y = e.clientY - r.top - oy
        s.vx = s.vx * 0.5 + (e.clientX - lx) * 0.5
        s.vy = s.vy * 0.5 + (e.clientY - ly) * 0.5
        lx = e.clientX
        ly = e.clientY
      }
      const up = () => {
        const s = bodies.current[i]
        if (!s.drag) return
        s.drag = false
        el.classList.remove('held')
        const cap = 38
        s.vx = reduced ? 0 : Math.max(-cap, Math.min(cap, s.vx))
        s.vy = reduced ? 0 : Math.max(-cap, Math.min(cap, s.vy))
        s.vr = s.vx * 0.35
      }
      const key = (e: KeyboardEvent) => {
        const s = bodies.current[i]
        const step = 28
        const m: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
        if (m[e.key]) {
          e.preventDefault()
          s.x += m[e.key][0]
          s.y += m[e.key][1]
          s.r += m[e.key][0] / 4
          el.style.zIndex = String(++z.current)
        }
      }
      el.addEventListener('pointerdown', down)
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerup', up)
      el.addEventListener('pointercancel', up)
      el.addEventListener('keydown', key)
      cleanups.push(() => {
        el.removeEventListener('pointerdown', down)
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerup', up)
        el.removeEventListener('pointercancel', up)
        el.removeEventListener('keydown', key)
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', place)
      cleanups.forEach((c) => c())
    }
  }, [])

  return (
    <div ref={board} className="board">
      {STICKERS.map((s, i) => (
        <div
          key={s.id}
          ref={(el) => {
            els.current[i] = el
          }}
          className="sticker"
          role="img"
          aria-label={`${s.label}. Drag to move, or focus and use the arrow keys.`}
          tabIndex={0}
        >
          {s.node}
        </div>
      ))}
    </div>
  )
}
