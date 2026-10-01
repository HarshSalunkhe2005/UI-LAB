import { useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useWindowPointer } from './_pointer'

/*
 * Isometric room diorama (a classic portfolio hero): an orthographic camera
 * at the iso angle, a cut-away room with furniture built from primitives.
 * Hovering an object lifts and highlights it and shows its label; the whole
 * scene parallax-tilts with the cursor. Labels/descriptions are also
 * listed as text for assistive tech.
 */

const ITEMS = [
  { id: 'desk', label: 'Desk: where the code happens', pos: [-0.6, 0.45, -0.7] as const, size: [1.6, 0.1, 0.8] as const, color: '#a16207' },
  { id: 'monitor', label: 'Monitor: 3 projects open', pos: [-0.6, 0.85, -0.95] as const, size: [0.8, 0.5, 0.06] as const, color: '#18181b' },
  { id: 'plant', label: 'Plant: still alive', pos: [1.1, 0.35, -1.1] as const, size: [0.3, 0.7, 0.3] as const, color: '#16a34a' },
  { id: 'bed', label: 'Bed: rarely used', pos: [0.7, 0.2, 0.6] as const, size: [1.2, 0.4, 0.8] as const, color: '#6366f1' },
  { id: 'rug', label: 'Rug: very cosy', pos: [-0.4, 0.02, 0.5] as const, size: [1.2, 0.04, 0.9] as const, color: '#f472b6' },
]

function Item({ it, hover, setHover }: { it: (typeof ITEMS)[number]; hover: string | null; setHover: (s: string | null) => void }) {
  const on = hover === it.id
  return (
    <group position={[it.pos[0], it.pos[1] + (on ? 0.12 : 0), it.pos[2]]} onPointerOver={(e) => { e.stopPropagation(); setHover(it.id) }} onPointerOut={() => setHover(null)}>
      <RoundedBox args={it.size as unknown as [number, number, number]} radius={0.03}>
        <meshStandardMaterial color={it.color} emissive={on ? '#ffffff' : '#000000'} emissiveIntensity={on ? 0.18 : 0} />
      </RoundedBox>
      {it.id === 'monitor' && (
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[0.72, 0.42]} />
          <meshBasicMaterial color={on ? '#a5b4fc' : '#4f46e5'} />
        </mesh>
      )}
    </group>
  )
}

function Scene({ hover, setHover }: { hover: string | null; setHover: (s: string | null) => void }) {
  const pointer = useWindowPointer()
  useFrame((s, dt) => {
    const g = s.scene.getObjectByName('room') as THREE.Group
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.current.x * 0.15, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.current.y * 0.06, 3, dt)
  })
  return (
    <group name="room">
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
      <mesh position={[0, 1, -1.5]}>
        <boxGeometry args={[3, 2.1, 0.1]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
      <mesh position={[-1.5, 1, 0]}>
        <boxGeometry args={[0.1, 2.1, 3]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[0.3, 1.4, -1.44]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshBasicMaterial color="#7dd3fc" />
      </mesh>
      {ITEMS.map((it) => <Item key={it.id} it={it} hover={hover} setHover={setHover} />)}
    </group>
  )
}

export default function IsoRoom() {
  const [hover, setHover] = useState<string | null>(null)
  return (
    <div className="relative">
      <div className="h-96 overflow-hidden rounded-xl bg-gradient-to-b from-orange-100 to-rose-100" role="img" aria-label="Isometric room diorama; hover the furniture">
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} orthographic camera={{ position: [6, 5.2, 6], zoom: 85 }} onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 2]} intensity={1.8} />
          <Scene hover={hover} setHover={setHover} />
        </Canvas>
      </div>
      <p aria-live="polite" className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">{ITEMS.find((i) => i.id === hover)?.label ?? 'Hover the furniture'}</p>
      <ul className="sr-only">{ITEMS.map((i) => <li key={i.id}>{i.label}</li>)}</ul>
    </div>
  )
}
