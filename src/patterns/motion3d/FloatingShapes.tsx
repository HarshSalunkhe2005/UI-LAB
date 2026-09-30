import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * Glossy 3D shapes floating in space that get pushed away from the cursor
 * and drift back home. The pointer is projected onto the z=0 plane each
 * frame; each shape adds a repulsion offset that falls off with distance,
 * springs back with damping, and keeps its own slow spin and bob.
 */

const SHAPES: { geo: 'torusKnot' | 'ico' | 'torus' | 'box' | 'sphere' | 'cone'; pos: [number, number, number]; color: string; s: number }[] = [
  { geo: 'torusKnot', pos: [-2.2, 0.8, 0], color: '#818cf8', s: 0.45 },
  { geo: 'ico', pos: [2.1, 1, -0.5], color: '#f472b6', s: 0.6 },
  { geo: 'torus', pos: [0.2, -1.1, 0.4], color: '#fbbf24', s: 0.55 },
  { geo: 'box', pos: [-1.4, -1, -0.8], color: '#34d399', s: 0.55 },
  { geo: 'sphere', pos: [1.3, -0.6, 0.6], color: '#22d3ee', s: 0.45 },
  { geo: 'cone', pos: [-0.1, 1.3, -0.6], color: '#fb7185', s: 0.5 },
]

function Geo({ geo }: { geo: (typeof SHAPES)[number]['geo'] }) {
  switch (geo) {
    case 'torusKnot': return <torusKnotGeometry args={[0.6, 0.2, 128, 24]} />
    case 'ico': return <icosahedronGeometry args={[0.8, 0]} />
    case 'torus': return <torusGeometry args={[0.6, 0.25, 32, 64]} />
    case 'box': return <boxGeometry args={[1, 1, 1]} />
    case 'sphere': return <sphereGeometry args={[0.8, 48, 48]} />
    case 'cone': return <coneGeometry args={[0.7, 1.2, 32]} />
  }
}

function Shape({ shape, i }: { shape: (typeof SHAPES)[number]; i: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const off = useRef(new THREE.Vector3())
  const { camera, pointer } = useThree()
  const tmp = useRef(new THREE.Vector3())
  const still = reducedMotion()
  useFrame((s, dt) => {
    // project the canvas pointer onto z=0
    const v = tmp.current.set(pointer.x, pointer.y, 0.5).unproject(camera)
    const dir = v.sub(camera.position).normalize()
    const hit = camera.position.clone().add(dir.multiplyScalar(-camera.position.z / dir.z))
    const home = new THREE.Vector3(...shape.pos)
    const away = home.clone().add(off.current).sub(hit)
    const dist = away.length()
    const push = Math.max(0, 1.6 - dist) * 1.4
    const target = away.normalize().multiplyScalar(push)
    off.current.x = THREE.MathUtils.damp(off.current.x, target.x, 4, dt)
    off.current.y = THREE.MathUtils.damp(off.current.y, target.y, 4, dt)
    const t = s.clock.elapsedTime
    const bob = still ? 0 : Math.sin(t * 0.8 + i) * 0.12
    ref.current.position.set(home.x + off.current.x, home.y + off.current.y + bob, home.z)
    if (!still) {
      ref.current.rotation.x += dt * 0.3
      ref.current.rotation.y += dt * 0.4
    }
  })
  return (
    <mesh ref={ref} scale={shape.s}>
      <Geo geo={shape.geo} />
      <meshPhysicalMaterial color={shape.color} roughness={0.15} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
    </mesh>
  )
}

export function FloatingShapes({ className = 'h-96' }: { className?: string }) {
  return (
    <div className={className} role="img" aria-label="Glossy 3D shapes floating and dodging the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -2, 2]} intensity={0.8} color="#c4b5fd" />
        {SHAPES.map((s, i) => (
          <Shape key={i} shape={s} i={i} />
        ))}
      </Canvas>
    </div>
  )
}

export default function FloatingShapesDemo() {
  return (
    <div className="relative">
      <FloatingShapes />
      <p className="pointer-events-none absolute inset-0 grid place-items-center text-4xl font-semibold tracking-tight mix-blend-difference">Push them around</p>
    </div>
  )
}
