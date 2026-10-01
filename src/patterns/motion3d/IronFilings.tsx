import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Iron filings / compass field: a grid of 1,200 needles (one InstancedMesh)
 * that all turn to point at the cursor like a magnet, the ones nearby
 * standing up and glowing hot. Each needle's quaternion is built from the
 * direction to the cursor on the floor plane plus a tilt that grows with
 * proximity.
 */

const W = 40
const H = 30
const GAP = 0.22

function Field() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const { camera, pointer, raycaster } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(), c: new THREE.Color(), cold: new THREE.Color('#94a3b8'), hot: new THREE.Color('#fb923c') }), [])
  useFrame((_, dt) => {
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, hit)
    target.lerp(hit, Math.min(1, dt * 8))
    for (let i = 0; i < W * H; i++) {
      const x = ((i % W) - W / 2) * GAP
      const z = (Math.floor(i / W) - H / 2) * GAP
      const dx = target.x - x, dz = target.z - z
      const d = Math.hypot(dx, dz)
      const yaw = Math.atan2(dx, dz)
      const lift = Math.max(0, 1 - d / 2.2)
      tmp.e.set(Math.PI / 2 - lift * 1.1, yaw, 0, 'YXZ')
      tmp.q.setFromEuler(tmp.e)
      const s = 0.7 + lift * 0.9
      tmp.m.compose(new THREE.Vector3(x, 0.02, z), tmp.q, new THREE.Vector3(1, s, 1))
      mesh.current.setMatrixAt(i, tmp.m)
      mesh.current.setColorAt(i, tmp.c.copy(tmp.cold).lerp(tmp.hot, lift))
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, W * H]}>
      <coneGeometry args={[0.04, 0.26, 6]} />
      <meshStandardMaterial roughness={0.4} metalness={0.6} />
    </instancedMesh>
  )
}

export default function IronFilings() {
  return (
    <div className="h-96 cursor-crosshair overflow-hidden rounded-xl bg-[#0b0f17]" role="img" aria-label="Field of metal needles that all point toward the cursor like a magnet">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 3.6, 3], fov: 50 }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 6, 2]} intensity={2} />
        <Field />
      </Canvas>
    </div>
  )
}
