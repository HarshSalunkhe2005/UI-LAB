import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * Neon sign: glass tubes bent from a CatmullRom path (TubeGeometry), bright
 * emissive material pushed above 1.0 so the Bloom post-process makes it
 * glow. It flickers on like a real transformer warming up, randomly
 * stutters, and clicking toggles it. Tilts gently toward the cursor.
 */

// Spells NOVA: N, O (closed loop), V, A (+ separate crossbar).
const PATHS: [number, number][][] = [
  [[-2.5, -0.6], [-2.5, 0.6], [-1.7, -0.6], [-1.7, 0.6]],
  [[-1.0, -0.6], [-1.25, 0], [-1.0, 0.6], [-0.35, 0.6], [-0.1, 0], [-0.35, -0.6], [-1.0, -0.6]],
  [[0.3, 0.6], [0.75, -0.6], [1.2, 0.6]],
  [[1.6, -0.6], [2.05, 0.6], [2.5, -0.6]],
  [[1.78, -0.12], [2.32, -0.12]],
]

function Tubes({ on }: { on: boolean }) {
  const g = useRef<THREE.Group>(null!)
  // One shared material so the whole sign flickers together.
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff3bd4', emissive: '#ff3bd4', emissiveIntensity: 4, toneMapped: false }), [])
  const pointer = useWindowPointer()
  const still = reducedMotion()
  const geos = useMemo(() => PATHS.map((p) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'catmullrom', 0.05), 200, 0.045, 12, false)), [])
  const warm = useRef(0)
  useFrame((s, dt) => {
    warm.current = on ? Math.min(1, warm.current + dt * 0.8) : 0
    const flick = still ? 1 : warm.current < 1 ? (Math.random() < warm.current ? 1 : 0.08) : Math.random() < 0.006 ? 0.2 : 1
    mat.emissiveIntensity = on ? 4.5 * flick : 0.05
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, pointer.current.x * 0.35, 3, dt)
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -pointer.current.y * 0.2, 3, dt)
    void s
  })
  return (
    <group ref={g}>
      {geos.map((geo, i) => (
        <mesh key={i} geometry={geo} material={mat} />
      ))}
      <mesh position={[0, 0, -0.15]}>
        <planeGeometry args={[6, 2.2]} />
        <meshStandardMaterial color="#0b0b10" roughness={0.9} />
      </mesh>
    </group>
  )
}

export default function NeonSign() {
  const [on, setOn] = useState(true)
  return (
    <button onClick={() => setOn((o) => !o)} aria-pressed={on} aria-label="Neon sign reading NOVA; click to switch it on or off" className="block h-80 w-full overflow-hidden rounded-xl bg-[#07070a]">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.15} />
        <Tubes on={on} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </button>
  )
}
