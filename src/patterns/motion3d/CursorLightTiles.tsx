import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * A wall of bevelled tiles with random depths, lit only by a warm point
 * light that follows the cursor a little in front of the wall. Moving the
 * cursor rakes the light across the relief so every tile edge catches and
 * casts, like torchlight on stone. Tiles are one InstancedMesh; a faint
 * ambient keeps the unlit side readable.
 */

const COLS = 26
const ROWS = 14
const S = 0.34

function Wall() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const light = useRef<THREE.PointLight>(null!)
  const { camera, pointer, raycaster } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.6), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const ready = useRef(false)

  useFrame((_, dt) => {
    if (!ready.current) {
      const m = new THREE.Matrix4()
      const q = new THREE.Quaternion()
      for (let i = 0; i < COLS * ROWS; i++) {
        const x = ((i % COLS) - COLS / 2 + 0.5) * S
        const y = (Math.floor(i / COLS) - ROWS / 2 + 0.5) * S
        const depth = 0.05 + Math.random() * 0.35
        q.setFromEuler(new THREE.Euler((Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15, 0))
        m.compose(new THREE.Vector3(x, y, depth / 2), q, new THREE.Vector3(1, 1, depth / 0.3))
        mesh.current.setMatrixAt(i, m)
      }
      mesh.current.instanceMatrix.needsUpdate = true
      ready.current = true
    }
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, hit)
    const p = light.current.position
    p.x = THREE.MathUtils.damp(p.x, hit.x, 10, dt)
    p.y = THREE.MathUtils.damp(p.y, hit.y, 10, dt)
  })

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, COLS * ROWS]}>
        <boxGeometry args={[S * 0.92, S * 0.92, 0.3]} />
        <meshStandardMaterial color="#d6d3d1" roughness={0.55} metalness={0.05} />
      </instancedMesh>
      <pointLight ref={light} position={[0, 0, 0.9]} intensity={6} distance={4} decay={1.4} color="#fdba74" />
    </>
  )
}

export default function CursorLightTiles() {
  return (
    <div className="h-96 cursor-none overflow-hidden rounded-xl bg-black" role="img" aria-label="Relief wall of tiles lit by a light that follows the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.04} />
        <Wall />
      </Canvas>
    </div>
  )
}
