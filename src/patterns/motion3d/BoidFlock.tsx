import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * A flock of 220 "birds" (boids: separation, alignment, cohesion) that also
 * steer toward the cursor, so the swarm chases it around and swirls when it
 * stops. Neighbour search is a brute-force O(n²) loop, which is fine at this
 * count. Each boid is a cone in one InstancedMesh, oriented along velocity.
 */

const N = 220

function Flock() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const { camera, pointer, raycaster } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const goal = useMemo(() => new THREE.Vector3(), [])
  const boids = useMemo(
    () => Array.from({ length: N }, () => ({ p: new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2), v: new THREE.Vector3().randomDirection().multiplyScalar(0.02) })),
    [],
  )
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), up: new THREE.Vector3(0, 1, 0), sep: new THREE.Vector3(), ali: new THREE.Vector3(), coh: new THREE.Vector3(), c: new THREE.Color() }), [])
  const still = reducedMotion()

  useFrame(() => {
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, goal)
    for (const b of boids) {
      tmp.sep.set(0, 0, 0); tmp.ali.set(0, 0, 0); tmp.coh.set(0, 0, 0)
      let n = 0
      for (const o of boids) {
        if (o === b) continue
        const d = b.p.distanceTo(o.p)
        if (d < 0.6) {
          n++
          tmp.ali.add(o.v)
          tmp.coh.add(o.p)
          if (d < 0.22) tmp.sep.add(b.p.clone().sub(o.p).divideScalar(d * d + 0.01))
        }
      }
      if (n) {
        b.v.add(tmp.ali.divideScalar(n).sub(b.v).multiplyScalar(0.05))
        b.v.add(tmp.coh.divideScalar(n).sub(b.p).multiplyScalar(0.002))
      }
      b.v.add(tmp.sep.multiplyScalar(0.0008))
      b.v.add(goal.clone().sub(b.p).multiplyScalar(0.0009))
      b.v.z -= b.p.z * 0.002
      b.v.clampLength(0.015, still ? 0.015 : 0.06)
      if (!still) b.p.add(b.v)
    }
    boids.forEach((b, i) => {
      tmp.q.setFromUnitVectors(tmp.up, b.v.clone().normalize())
      tmp.m.compose(b.p, tmp.q, new THREE.Vector3(1, 1, 1))
      mesh.current.setMatrixAt(i, tmp.m)
      mesh.current.setColorAt(i, tmp.c.setHSL(0.55 + b.v.length() * 3, 0.8, 0.6))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]}>
      <coneGeometry args={[0.04, 0.16, 5]} />
      <meshStandardMaterial roughness={0.5} />
    </instancedMesh>
  )
}

export default function BoidFlock() {
  return (
    <div className="h-96 overflow-hidden rounded-xl bg-gradient-to-b from-[#0c1222] to-[#1e1b4b]" role="img" aria-label="Flock of birds that chases the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} />
        <Flock />
      </Canvas>
    </div>
  )
}
