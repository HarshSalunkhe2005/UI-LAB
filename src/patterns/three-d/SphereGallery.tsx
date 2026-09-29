import { useEffect, useRef, useState } from 'react'
import { img, reducedMotion } from './_shared'

/*
 * Images spread over a sphere (Fibonacci lattice), each billboarded to face
 * the camera. Drag rotates on both axes with inertia. Positions are
 * projected in JS (rotation matrices), z sorts stacking and drives scale,
 * brightness and blur. Hidden hemisphere fades out.
 */

type V = [number, number, number]

export default function SphereGallery({ count = 42, radius = 150 }: { count?: number; radius?: number }) {
  const pts = useRef<V[]>([])
  if (!pts.current.length) {
    const g = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      pts.current.push([Math.cos(g * i) * r, y, Math.sin(g * i) * r])
    }
  }
  const [rot, setRot] = useState({ x: -0.3, y: 0 })
  const vel = useRef({ x: 0, y: reducedMotion() ? 0 : 0.004 })
  const drag = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (!drag.current) {
        vel.current.x *= 0.95
        vel.current.y = vel.current.y * 0.95 + (reducedMotion() ? 0 : 0.004) * 0.05
        setRot((r) => ({ x: Math.max(-1.2, Math.min(1.2, r.x + vel.current.x)), y: r.y + vel.current.y }))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const cy = Math.cos(rot.y), sy = Math.sin(rot.y), cx = Math.cos(rot.x), sx = Math.sin(rot.x)
  const projected = pts.current.map(([x, y, z], i) => {
    const x1 = x * cy - z * sy
    const z1 = x * sy + z * cy
    const y2 = y * cx - z1 * sx
    const z2 = y * sx + z1 * cx
    return { i, x: x1 * radius, y: y2 * radius, z: z2 }
  })

  return (
    <div
      className="relative h-96 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
      role="img"
      aria-label="Sphere of images, drag to rotate"
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY }
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!drag.current) return
        const dx = (e.clientX - drag.current.x) * 0.006
        const dy = (e.clientY - drag.current.y) * 0.006
        drag.current = { x: e.clientX, y: e.clientY }
        vel.current = { x: -dy, y: dx }
        setRot((r) => ({ x: Math.max(-1.2, Math.min(1.2, r.x - dy)), y: r.y + dx }))
      }}
      onPointerUp={() => (drag.current = null)}
    >
      {projected.map((p) => {
        const d = (p.z + 1) / 2
        return (
          <img
            key={p.i}
            src={img(p.i + 100, 120, 120)}
            alt=""
            draggable={false}
            className="absolute top-1/2 left-1/2 -mt-7 -ml-7 h-14 w-14 rounded-lg object-cover"
            style={{
              transform: `translate(${p.x}px, ${p.y}px) scale(${0.55 + d * 0.75})`,
              zIndex: Math.round(d * 1000),
              opacity: 0.15 + d * 0.85,
              filter: `blur(${(1 - d) * 2}px)`,
            }}
          />
        )
      })}
    </div>
  )
}
