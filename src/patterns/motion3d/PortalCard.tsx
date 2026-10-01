import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshPortalMaterial, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * A card that is a window into another 3D world (drei MeshPortalMaterial
 * renders a separate scene through the card's surface with correct
 * parallax). Tilting the card with the cursor changes what you see inside,
 * like looking through a real window. Inner world: a low-poly sunset
 * desert with spinning crystal.
 */

function Inside() {
  const crystal = useRef<THREE.Mesh>(null!)
  const still = reducedMotion()
  useFrame((_, dt) => {
    if (!still) crystal.current.rotation.y += dt * 0.6
  })
  return (
    <>
      <color attach="background" args={['#fb923c']} />
      <fog attach="fog" args={['#fb7185', 3, 12]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 3, 1]} intensity={2} color="#fde68a" />
      <mesh position={[0, 0.8, -6]}>
        <circleGeometry args={[1.4, 48]} />
        <meshBasicMaterial color="#fef3c7" />
      </mesh>
      {[-3, -1.2, 1.5, 3.2].map((x, i) => (
        <mesh key={i} position={[x, -1.4, -3 - i]} rotation={[0, i, 0]}>
          <coneGeometry args={[1.4, 2.2 + i * 0.4, 4]} />
          <meshStandardMaterial color={i % 2 ? '#9a3412' : '#c2410c'} flatShading />
        </mesh>
      ))}
      <mesh position={[0, -1.5, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      <mesh ref={crystal} position={[0, -0.2, -1.5]}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={0.6} flatShading />
      </mesh>
    </>
  )
}

function Card() {
  const g = useRef<THREE.Group>(null!)
  const pointer = useWindowPointer()
  useFrame((_, dt) => {
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, pointer.current.x * 0.6, 4, dt)
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -pointer.current.y * 0.4, 4, dt)
  })
  return (
    <group ref={g}>
      <RoundedBox args={[2.1, 3, 0.06]} radius={0.12}>
        <meshStandardMaterial color="#e7e5e4" />
      </RoundedBox>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.95, 2.85]} />
        <MeshPortalMaterial resolution={512} blur={0}>
          <Inside />
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

export default function PortalCard() {
  return (
    <div className="h-[26rem] overflow-hidden rounded-xl bg-gradient-to-b from-surface-2 to-bg" role="img" aria-label="Card that is a window into a 3D desert world; tilt with the cursor to look inside">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <Card />
      </Canvas>
    </div>
  )
}
