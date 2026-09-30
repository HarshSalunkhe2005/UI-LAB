import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Scroll-driven 3D product story: a planet with a ring rotates, tilts,
 * slides side to side and changes colour as the text sections scroll past,
 * like a product page where the object turns to show each feature.
 * Scroll progress (0..1) is read from the container into a ref and the
 * scene eases toward it every frame. Keyframes are a plain array: edit
 * them to choreograph any object.
 */

const KEYS = [
  { x: 1.4, rotY: 0, tilt: 0.3, scale: 1, color: '#6366f1' },
  { x: -1.4, rotY: Math.PI * 0.9, tilt: -0.2, scale: 1.15, color: '#ec4899' },
  { x: 1.3, rotY: Math.PI * 1.8, tilt: 0.6, scale: 0.95, color: '#f59e0b' },
  { x: 0, rotY: Math.PI * 2.6, tilt: 0.1, scale: 1.35, color: '#10b981' },
]
const SECTIONS = [
  ['Orbit', 'A calm object to anchor the first screen.'],
  ['Turn', 'It swings across and turns as you read.'],
  ['Tilt', 'Every section gets its own angle and colour.'],
  ['Land', 'And it settles centre stage at the end.'],
]

function Planet({ progress }: { progress: React.MutableRefObject<number> }) {
  const g = useRef<THREE.Group>(null!)
  const mat = useRef<THREE.MeshStandardMaterial>(null!)
  const c = useRef(new THREE.Color())
  useFrame((_, dt) => {
    const p = progress.current * (KEYS.length - 1)
    const i = Math.min(KEYS.length - 2, Math.floor(p))
    const t = THREE.MathUtils.smoothstep(p - i, 0, 1)
    const a = KEYS[i], b = KEYS[i + 1]
    const L = THREE.MathUtils.lerp
    const d = THREE.MathUtils.damp
    g.current.position.x = d(g.current.position.x, L(a.x, b.x, t), 5, dt)
    g.current.rotation.y = d(g.current.rotation.y, L(a.rotY, b.rotY, t), 5, dt)
    g.current.rotation.z = d(g.current.rotation.z, L(a.tilt, b.tilt, t), 5, dt)
    g.current.scale.setScalar(d(g.current.scale.x, L(a.scale, b.scale, t), 5, dt))
    c.current.set(a.color).lerp(new THREE.Color(b.color), t)
    mat.current.color.lerp(c.current, 0.1)
  })
  return (
    <group ref={g}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial ref={mat} color={KEYS[0].color} roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.6, 0.06, 16, 128]} />
        <meshStandardMaterial color="#e4e4e7" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.9, 0.6, 0]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#f4f4f5" />
      </mesh>
    </group>
  )
}

export default function ScrollModel() {
  const box = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  useEffect(() => {
    const el = box.current!
    const on = () => (progress.current = el.scrollTop / (el.scrollHeight - el.clientHeight || 1))
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])
  return (
    <div ref={box} className="relative h-96 overflow-y-auto rounded-xl bg-bg" tabIndex={0} aria-label="Scroll-driven 3D object story, scroll inside">
      <div className="pointer-events-none sticky top-0 h-96" aria-hidden>
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 40 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 3, 5]} intensity={2.2} />
          <directionalLight position={[-4, -1, -2]} intensity={0.6} color="#a5b4fc" />
          <Planet progress={progress} />
        </Canvas>
      </div>
      <div className="relative -mt-96">
        {SECTIONS.map(([h, p], i) => (
          <section key={h} className={`flex h-96 items-center px-8 ${i % 2 ? 'justify-end text-right' : ''}`}>
            <div className="max-w-[45%]">
              <p className="font-mono text-xs text-fg-muted">0{i + 1}</p>
              <h4 className="font-display text-4xl italic">{h}</h4>
              <p className="mt-2 text-sm text-fg-muted">{p}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
