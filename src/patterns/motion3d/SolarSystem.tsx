import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * Mini interactive solar system: planets orbit at different speeds on
 * tilted rings; hovering one pauses its orbit and outlines it; clicking it
 * selects it, the camera glides to frame it and an info card updates
 * (aria-live). Click empty space to zoom back out.
 */

const PLANETS = [
  { name: 'Ember', r: 1.3, size: 0.16, speed: 1.6, color: '#f97316', fact: 'Closest and fastest. A year lasts 4 seconds here.' },
  { name: 'Azure', r: 2.1, size: 0.26, speed: 1.0, color: '#38bdf8', fact: 'Ocean world with two tiny moons.' },
  { name: 'Verdant', r: 3.0, size: 0.3, speed: 0.7, color: '#22c55e', fact: 'Forests cover 80% of the surface.' },
  { name: 'Ringer', r: 4.1, size: 0.42, speed: 0.45, color: '#eab308', fact: 'Gas giant with a bright ice ring.', ring: true },
  { name: 'Frost', r: 5.1, size: 0.22, speed: 0.3, color: '#c4b5fd', fact: 'Coldest planet, wrapped in violet haze.' },
]

function Planet({ p, i, selected, onSelect }: { p: (typeof PLANETS)[number]; i: number; selected: boolean; onSelect: (i: number, pos: THREE.Vector3) => void }) {
  const ref = useRef<THREE.Group>(null!)
  const angle = useRef(i * 1.7)
  const [hover, setHover] = useState(false)
  const still = reducedMotion()
  useFrame((_, dt) => {
    if (!hover && !selected && !still) angle.current += dt * p.speed * 0.4
    ref.current.position.set(Math.cos(angle.current) * p.r, 0, Math.sin(angle.current) * p.r)
    ref.current.rotation.y += dt
  })
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[p.r - 0.005, p.r + 0.005, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>
      <group
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => { e.stopPropagation(); onSelect(i, ref.current.position) }}
      >
        <mesh scale={hover || selected ? 1.18 : 1}>
          <sphereGeometry args={[p.size, 32, 32]} />
          <meshStandardMaterial color={p.color} roughness={0.6} emissive={p.color} emissiveIntensity={hover || selected ? 0.35 : 0.05} />
        </mesh>
        {p.ring && (
          <mesh rotation={[-Math.PI / 2.4, 0, 0]}>
            <ringGeometry args={[p.size * 1.4, p.size * 2.1, 64]} />
            <meshStandardMaterial color="#fef3c7" side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
        )}
      </group>
    </>
  )
}

function Rig({ focus }: { focus: React.MutableRefObject<THREE.Vector3 | null> }) {
  useFrame((s, dt) => {
    const f = focus.current
    const want = f ? new THREE.Vector3(f.x * 1.25, 1.2, f.z * 1.25 + 1.8) : new THREE.Vector3(0, 6.5, 8)
    s.camera.position.x = THREE.MathUtils.damp(s.camera.position.x, want.x, 2.5, dt)
    s.camera.position.y = THREE.MathUtils.damp(s.camera.position.y, want.y, 2.5, dt)
    s.camera.position.z = THREE.MathUtils.damp(s.camera.position.z, want.z, 2.5, dt)
    s.camera.lookAt(f ?? new THREE.Vector3())
  })
  return null
}

export default function SolarSystem() {
  const [sel, setSel] = useState<number | null>(null)
  const focus = useRef<THREE.Vector3 | null>(null)
  return (
    <div className="relative">
      <div className="h-[26rem] overflow-hidden rounded-xl bg-black" role="img" aria-label="Interactive solar system; click a planet to fly to it">
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 6.5, 8], fov: 45 }} onPointerMissed={() => { setSel(null); focus.current = null }}>
          <ambientLight intensity={0.15} />
          <pointLight position={[0, 0, 0]} intensity={60} color="#fde68a" decay={1.6} />
          <mesh>
            <sphereGeometry args={[0.6, 48, 48]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          {PLANETS.map((p, i) => (
            <Planet key={p.name} p={p} i={i} selected={sel === i} onSelect={(n, pos) => { setSel(n); focus.current = pos }} />
          ))}
          <Rig focus={focus} />
        </Canvas>
      </div>
      <div aria-live="polite" className="absolute top-3 left-3 max-w-56 rounded-lg bg-black/60 p-3 text-sm text-white backdrop-blur">
        {sel === null ? (
          <p className="text-white/70">Click a planet</p>
        ) : (
          <>
            <p className="font-display text-2xl italic">{PLANETS[sel].name}</p>
            <p className="mt-1 text-white/80">{PLANETS[sel].fact}</p>
          </>
        )}
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {PLANETS.map((p, i) => (
          <button key={p.name} onClick={() => { setSel(i); focus.current = null }} className="rounded-full border border-border px-2.5 py-0.5 text-xs">{p.name}</button>
        ))}
      </div>
    </div>
  )
}
