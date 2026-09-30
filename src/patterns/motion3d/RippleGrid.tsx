import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * 1,600 cubes in ONE draw call (InstancedMesh). Cubes near the cursor rise
 * and brighten (Gaussian falloff of distance to the pointer on the floor),
 * and clicking sends a ring-shaped shockwave across the grid. Each frame
 * writes every instance's matrix and colour; heights are eased so the
 * surface behaves like liquid.
 */

const N = 40
const GAP = 0.26

function Grid() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const { camera, pointer, raycaster, clock } = useThree()
  const heights = useMemo(() => new Float32Array(N * N), [])
  const hit = useRef(new THREE.Vector3(99, 0, 99))
  const waves = useRef<{ x: number; z: number; t: number }[]>([])
  const m = useMemo(() => new THREE.Matrix4(), [])
  const c = useMemo(() => new THREE.Color(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const low = useMemo(() => new THREE.Color('#1e1b4b'), [])
  const high = useMemo(() => new THREE.Color('#c7d2fe'), [])
  const still = reducedMotion()

  useFrame((s, dt) => {
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, hit.current)
    const t = s.clock.elapsedTime
    waves.current = waves.current.filter((w) => t - w.t < 3)
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const k = i * N + j
        const x = (i - N / 2) * GAP
        const z = (j - N / 2) * GAP
        const d2 = (x - hit.current.x) ** 2 + (z - hit.current.z) ** 2
        let target = Math.exp(-d2 / 0.9) * 1.4
        for (const w of waves.current) {
          const age = t - w.t
          const r = Math.hypot(x - w.x, z - w.z)
          target += Math.exp(-((r - age * 4) ** 2) / 0.15) * 0.9 * (1 - age / 3)
        }
        if (!still) target += Math.sin(x * 1.3 + t) * Math.cos(z * 1.1 + t * 0.8) * 0.06
        heights[k] = THREE.MathUtils.damp(heights[k], target, 8, dt)
        const h = 0.08 + Math.max(0, heights[k])
        m.makeScale(1, h, 1).setPosition(x, h / 2, z)
        mesh.current.setMatrixAt(k, m)
        mesh.current.setColorAt(k, c.copy(low).lerp(high, Math.min(1, heights[k] / 1.2)))
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, N * N]}
      onClick={(e) => waves.current.push({ x: e.point.x, z: e.point.z, t: clock.elapsedTime })}
    >
      <boxGeometry args={[GAP * 0.86, 1, GAP * 0.86]} />
      <meshStandardMaterial roughness={0.35} metalness={0.2} />
    </instancedMesh>
  )
}

export default function RippleGrid() {
  return (
    <div className="h-96 cursor-crosshair rounded-xl bg-[#0b0a1a]" role="img" aria-label="Grid of 3D cubes that rise around the cursor and ripple on click">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 6, 7], fov: 40 }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 8, 2]} intensity={2} />
        <pointLight position={[-4, 3, 3]} intensity={20} color="#f472b6" />
        <Grid />
      </Canvas>
    </div>
  )
}
