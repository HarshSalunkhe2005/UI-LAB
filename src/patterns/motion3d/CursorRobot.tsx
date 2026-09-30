import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * Boxy robot mascot: the head turns toward the cursor, the glowing eyes
 * slide inside the visor to look even further, the antenna springs with
 * a lag, and hovering the robot makes the eyes brighten. Built from
 * RoundedBox primitives, emissive eyes, no model file.
 */

function Robot() {
  const pointer = useWindowPointer()
  const head = useRef<THREE.Group>(null!)
  const pupils = useRef<THREE.Group>(null!)
  const antenna = useRef<THREE.Group>(null!)
  const eyeMat = useRef<THREE.MeshStandardMaterial>(null!)
  const hovered = useRef(false)
  const still = reducedMotion()

  useFrame((s, dt) => {
    const { x, y } = pointer.current
    const d = THREE.MathUtils.damp
    head.current.rotation.y = d(head.current.rotation.y, x * 0.7, 5, dt)
    head.current.rotation.x = d(head.current.rotation.x, -y * 0.35, 5, dt)
    pupils.current.position.x = d(pupils.current.position.x, x * 0.09, 8, dt)
    pupils.current.position.y = d(pupils.current.position.y, y * 0.05, 8, dt)
    antenna.current.rotation.z = d(antenna.current.rotation.z, -head.current.rotation.y * 0.6 + (still ? 0 : Math.sin(s.clock.elapsedTime * 3) * 0.05), 3, dt)
    eyeMat.current.emissiveIntensity = d(eyeMat.current.emissiveIntensity, hovered.current ? 6 : 2.5, 6, dt)
  })

  return (
    <group position={[0, -0.4, 0]} onPointerOver={() => (hovered.current = true)} onPointerOut={() => (hovered.current = false)}>
      <RoundedBox args={[1.5, 1.3, 1]} radius={0.2} position={[0, -0.8, 0]}>
        <meshStandardMaterial color="#e4e4e7" metalness={0.3} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, -0.75, 0.51]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1.5} />
      </mesh>
      <group ref={head} position={[0, 0.45, 0]}>
        <RoundedBox args={[1.7, 1.2, 1.2]} radius={0.28}>
          <meshStandardMaterial color="#f4f4f5" metalness={0.25} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[1.35, 0.6, 0.1]} radius={0.12} position={[0, 0, 0.58]}>
          <meshStandardMaterial color="#09090b" roughness={0.15} metalness={0.6} />
        </RoundedBox>
        <group ref={pupils} position={[0, 0, 0.65]}>
          {[-0.3, 0.3].map((xx) => (
            <mesh key={xx} position={[xx, 0, 0]}>
              <capsuleGeometry args={[0.07, 0.14, 8, 16]} />
              <meshStandardMaterial ref={xx < 0 ? eyeMat : undefined} color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
          ))}
        </group>
        <group ref={antenna} position={[0, 0.6, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5]} />
            <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </group>
        {[-1, 1].map((sx) => (
          <mesh key={sx} position={[sx * 0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 24]} />
            <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function CursorRobot({ className = 'h-96' }: { className?: string }) {
  return (
    <div className={className} role="img" aria-label="3D robot that turns its head and eyes toward the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0.3, 5.5], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 4]} intensity={1.8} />
        <pointLight position={[-3, 1, 2]} intensity={8} color="#818cf8" />
        <Robot />
        <ContactShadows position={[0, -1.85, 0]} opacity={0.5} scale={6} blur={2.2} far={3} />
      </Canvas>
    </div>
  )
}

export default function CursorRobotDemo() {
  return <CursorRobot />
}
