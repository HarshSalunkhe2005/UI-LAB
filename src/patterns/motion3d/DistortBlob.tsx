import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * A liquid 3D blob (drei MeshDistortMaterial: noise-displaced vertices in
 * the shader). It leans toward the cursor, wobbles harder and swells on
 * hover, and cycles colour on click, springing each change with damping.
 */

const COLORS = ['#818cf8', '#f472b6', '#34d399', '#fbbf24', '#22d3ee']

function Blob() {
  const ref = useRef<THREE.Mesh>(null!)
  // drei does not export the material instance type, so type the fields we drive.
  const mat = useRef<THREE.MeshPhysicalMaterial & { distort: number; speed: number }>(null!)
  const [hover, setHover] = useState(false)
  const [ci, setCi] = useState(0)
  const pointer = useWindowPointer()
  const col = useRef(new THREE.Color(COLORS[0]))
  const still = reducedMotion()
  useFrame((_, dt) => {
    const d = THREE.MathUtils.damp
    ref.current.position.x = d(ref.current.position.x, pointer.current.x * 0.6, 3, dt)
    ref.current.position.y = d(ref.current.position.y, pointer.current.y * 0.4, 3, dt)
    const s = d(ref.current.scale.x, hover ? 1.15 : 1, 6, dt)
    ref.current.scale.setScalar(s)
    mat.current.distort = d(mat.current.distort, still ? 0.15 : hover ? 0.55 : 0.32, 4, dt)
    mat.current.speed = still ? 0 : hover ? 4 : 1.8
    col.current.set(COLORS[ci])
    mat.current.color.lerp(col.current, 0.08)
  })
  return (
    <mesh
      ref={ref}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => setCi((c) => (c + 1) % COLORS.length)}
    >
      <sphereGeometry args={[1.3, 128, 128]} />
      <MeshDistortMaterial ref={mat as never} color={COLORS[0]} roughness={0.15} metalness={0.2} distort={0.32} speed={1.8} />
    </mesh>
  )
}

export default function DistortBlob() {
  return (
    <div className="h-96 cursor-pointer" role="img" aria-label="Liquid 3D blob that wobbles on hover and changes colour on click">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <pointLight position={[-4, -2, 2]} intensity={15} color="#f0abfc" />
        <Blob />
      </Canvas>
    </div>
  )
}
