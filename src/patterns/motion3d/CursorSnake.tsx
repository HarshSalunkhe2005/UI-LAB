import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * A glossy segmented snake that chases the cursor. The head eases toward the
 * pointer on the z=0 plane; each following segment is pulled to stay a fixed
 * distance behind the one in front (follow-the-leader constraint), which
 * produces natural slithering curves. Segments taper and shift hue along
 * the body; the head gets eyes oriented along its velocity.
 */

const SEGS = 34
const GAP = 0.17

function Snake() {
  const { camera, pointer, raycaster } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const pts = useMemo(() => Array.from({ length: SEGS }, (_, i) => new THREE.Vector3(-i * GAP, 0, 0)), [])
  const meshes = useRef<(THREE.Mesh | null)[]>([])
  const head = useRef<THREE.Group>(null!)
  useFrame((s, dt) => {
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, target)
    const wobble = Math.sin(s.clock.elapsedTime * 6) * 0.04
    pts[0].lerp(target, Math.min(1, dt * 5))
    pts[0].y += wobble * 0.3
    for (let i = 1; i < SEGS; i++) {
      const d = pts[i].clone().sub(pts[i - 1])
      const len = d.length() || 1
      pts[i].copy(pts[i - 1]).add(d.multiplyScalar(GAP / len))
    }
    pts.forEach((p, i) => meshes.current[i]?.position.copy(p))
    const dir = pts[0].clone().sub(pts[1])
    head.current.position.copy(pts[0])
    head.current.rotation.z = Math.atan2(dir.y, dir.x)
  })
  return (
    <>
      {pts.map((_, i) => {
        const k = i / SEGS
        return (
          <mesh key={i} ref={(el) => { meshes.current[i] = el }} scale={0.2 * (1 - k * 0.75)}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshPhysicalMaterial color={new THREE.Color().setHSL(0.38 - k * 0.25, 0.75, 0.5)} clearcoat={1} roughness={0.25} />
          </mesh>
        )
      })}
      <group ref={head}>
        {[-1, 1].map((sd) => (
          <mesh key={sd} position={[0.1, sd * 0.09, 0.15]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#09090b" roughness={0.1} />
          </mesh>
        ))}
      </group>
    </>
  )
}

export default function CursorSnake() {
  return (
    <div className="h-96 cursor-crosshair overflow-hidden rounded-xl bg-[#052e16]" role="img" aria-label="Glossy 3D snake that slithers after the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 5]} intensity={2} />
        <Snake />
      </Canvas>
    </div>
  )
}
