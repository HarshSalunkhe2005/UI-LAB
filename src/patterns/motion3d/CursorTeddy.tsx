import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * A teddy bear built only from primitives (no model file) whose head turns
 * to follow the cursor anywhere on the page. The body follows a little
 * (so the whole bear leans in), eyes blink on a random timer, and it
 * breathes when idle. Motion is damped with MathUtils.damp for a soft,
 * organic feel. Swap the primitives for a GLTF head bone to use a real model.
 */

const FUR = '#b0784a'
const LIGHT = '#e7c19a'
const DARK = '#2a1a12'

function Eye({ x }: { x: number }) {
  return (
    <group position={[x, 0.12, 0.78]}>
      <mesh scale={[1, 1, 0.6]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color={DARK} roughness={0.2} />
      </mesh>
      <mesh position={[0.03, 0.035, 0.05]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  )
}

function Ear({ x }: { x: number }) {
  return (
    <group position={[x, 0.62, -0.05]}>
      <mesh scale={[1, 1, 0.6]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color={FUR} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.1]} scale={[1, 1, 0.4]}>
        <sphereGeometry args={[0.17, 32, 32]} />
        <meshStandardMaterial color={LIGHT} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Bear() {
  const pointer = useWindowPointer()
  const head = useRef<THREE.Group>(null!)
  const body = useRef<THREE.Group>(null!)
  const eyes = useRef<THREE.Group>(null!)
  const blink = useRef({ next: 2, t: 0 })
  const still = reducedMotion()

  useFrame((state, dt) => {
    const { x, y } = pointer.current
    const d = THREE.MathUtils.damp
    head.current.rotation.y = d(head.current.rotation.y, x * 0.9, 6, dt)
    head.current.rotation.x = d(head.current.rotation.x, -y * 0.5, 6, dt)
    head.current.rotation.z = d(head.current.rotation.z, -x * 0.12, 4, dt)
    body.current.rotation.y = d(body.current.rotation.y, x * 0.3, 3, dt)
    if (!still) body.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.02
    // blink
    const b = blink.current
    b.t += dt
    if (b.t > b.next) {
      b.t = 0
      b.next = 2 + Math.random() * 3
    }
    eyes.current.scale.y = b.t < 0.12 ? 0.1 : d(eyes.current.scale.y, 1, 20, dt)
  })

  return (
    <group ref={body} position={[0, -0.55, 0]}>
      {/* body */}
      <mesh position={[0, -0.35, 0]} scale={[1, 1.1, 0.9]} castShadow>
        <sphereGeometry args={[0.72, 48, 48]} />
        <meshStandardMaterial color={FUR} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.3, 0.5]} scale={[1, 1.1, 0.5]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={LIGHT} roughness={0.9} />
      </mesh>
      {/* arms & feet */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.68, -0.25, 0.15]} rotation={[0, 0, s * 0.5]} scale={[0.6, 1, 0.6]}>
            <sphereGeometry args={[0.3, 24, 24]} />
            <meshStandardMaterial color={FUR} roughness={0.9} />
          </mesh>
          <mesh position={[s * 0.38, -0.98, 0.35]} scale={[1, 0.8, 1.2]}>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial color={FUR} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* head (the part that tracks the cursor) */}
      <group ref={head} position={[0, 0.72, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.8, 48, 48]} />
          <meshStandardMaterial color={FUR} roughness={0.9} />
        </mesh>
        <Ear x={-0.58} />
        <Ear x={0.58} />
        <mesh position={[0, -0.15, 0.68]} scale={[1.2, 0.9, 0.8]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial color={LIGHT} roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.06, 0.93]} scale={[1.3, 0.9, 0.8]}>
          <sphereGeometry args={[0.07, 20, 20]} />
          <meshStandardMaterial color={DARK} roughness={0.3} />
        </mesh>
        <group ref={eyes}>
          <Eye x={-0.27} />
          <Eye x={0.27} />
        </group>
      </group>
    </group>
  )
}

export function CursorTeddy({ className = 'h-96' }: { className?: string }) {
  return (
    <div className={className} role="img" aria-label="3D teddy bear that turns its head to follow the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0.2, 5], fov: 35 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} castShadow />
        <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#a5b4fc" />
        <Bear />
        <ContactShadows position={[0, -1.75, 0]} opacity={0.45} scale={6} blur={2.4} far={3} />
      </Canvas>
    </div>
  )
}

export default function CursorTeddyDemo() {
  return (
    <div className="rounded-xl bg-gradient-to-b from-amber-100/10 to-transparent">
      <CursorTeddy />
      <p className="pb-3 text-center font-mono text-xs text-fg-muted">move your cursor anywhere on the page</p>
    </div>
  )
}
