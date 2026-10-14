import { useEffect, useRef } from 'react'

/*
 * Pip, the mascot: a soft blob with two eyes that follow the pointer, a mouth that changes with mood, and a squash on
 * press. Eyes and body move with transforms set from one pointer handler (no React state per move). Under reduced
 * motion the eyes look straight ahead and the squash is off; the mood still changes.
 */

export type Mood = 'calm' | 'happy' | 'cheer'

export default function Mascot({ mood, size = 220 }: { mood: Mood; size?: number }) {
  const svg = useRef<SVGSVGElement>(null)
  const eyeL = useRef<SVGGElement>(null)
  const eyeR = useRef<SVGGElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const move = (e: PointerEvent) => {
      const el = svg.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height * 0.42
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 260) * 7
      const x = (dx / d) * k
      const y = (dy / d) * k
      const t = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      if (eyeL.current) eyeL.current.style.transform = t
      if (eyeR.current) eyeR.current.style.transform = t
    }
    addEventListener('pointermove', move, { passive: true })
    return () => removeEventListener('pointermove', move)
  }, [])

  const mouth = mood === 'calm' ? 'M88 132 q22 14 44 0' : mood === 'happy' ? 'M84 128 q26 28 52 0' : 'M82 124 q28 40 56 0 z'
  return (
    <svg
      ref={svg}
      viewBox="0 0 220 220"
      width={size}
      height={size}
      role="img"
      aria-label={`Pip the mascot, looking ${mood === 'calm' ? 'calm' : mood === 'happy' ? 'happy' : 'delighted'}`}
      className="pip-mascot"
      onPointerDown={(e) => e.currentTarget.classList.add('squash')}
      onPointerUp={(e) => e.currentTarget.classList.remove('squash')}
      onPointerLeave={(e) => e.currentTarget.classList.remove('squash')}
    >
      <ellipse cx="110" cy="204" rx="62" ry="9" fill="#2a2438" opacity="0.12" />
      <path d="M110 22 C170 22 200 70 196 124 C192 176 156 200 110 200 C64 200 28 176 24 124 C20 70 50 22 110 22 Z" fill="#ff8f6b" stroke="#2a2438" strokeWidth="5" strokeLinejoin="round" />
      <path d="M62 70 C74 50 96 42 112 42" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity="0.45" />
      <path d="M96 22 C94 8 104 2 112 6 C108 14 110 18 116 22" fill="#7bc47f" stroke="#2a2438" strokeWidth="4" strokeLinejoin="round" />
      <g ref={eyeL} style={{ transition: 'transform 90ms ease-out' }}>
        <ellipse cx="82" cy="104" rx="15" ry="18" fill="#fff" stroke="#2a2438" strokeWidth="4" />
        <circle cx="82" cy="106" r="7.5" fill="#2a2438" />
        <circle cx="85" cy="102" r="2.4" fill="#fff" />
      </g>
      <g ref={eyeR} style={{ transition: 'transform 90ms ease-out' }}>
        <ellipse cx="138" cy="104" rx="15" ry="18" fill="#fff" stroke="#2a2438" strokeWidth="4" />
        <circle cx="138" cy="106" r="7.5" fill="#2a2438" />
        <circle cx="141" cy="102" r="2.4" fill="#fff" />
      </g>
      <path d={mouth} fill={mood === 'cheer' ? '#7a1f35' : 'none'} stroke="#2a2438" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="58" cy="136" r="9" fill="#ff5a36" opacity="0.35" />
      <circle cx="162" cy="136" r="9" fill="#ff5a36" opacity="0.35" />
    </svg>
  )
}
