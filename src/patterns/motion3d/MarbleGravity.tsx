import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Marbles with gravity toward the cursor: 60 glossy spheres are pulled to
 * the pointer (on the z=0 plane), collide with each other (pairwise sphere
 * separation + velocity exchange), and pile into a squishy cluster that
 * follows the cursor around. Hold the mouse button to repel instead.
 * Plain Euler integration, no physics engine.
 */

const N = 60

function Marbles() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const { camera, pointer, raycaster } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const goal = useMemo(() => new THREE.Vector3(), [])
  const down = useRef(false)
  useEffect(() => {
    const up = () => (down.current = false)
    addEventListener('pointerup', up)
    return () => removeEventListener('pointerup', up)
  }, [])
  const balls = useMemo(
    () => Array.from({ length: N }, (_, i) => ({ p: new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3, 0), v: new THREE.Vector3(), r: 0.14 + (i % 4) * 0.05 })),
    [],
  )
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), c: new THREE.Color() }), [])
  useFrame((_, dt) => {
    const h = Math.min(dt, 1 / 30)
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, goal)
    for (const b of balls) {
      const d = goal.clone().sub(b.p)
      const dist = Math.max(0.3, d.length())
      b.v.addScaledVector(d.normalize(), (down.current ? -12 : 6) * h / Math.sqrt(dist))
      b.v.z -= b.p.z * 4 * h
      b.v.multiplyScalar(0.96)
    }
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = balls[i], b = balls[j]
        const d = b.p.clone().sub(a.p)
        const len = d.length()
        const min = a.r + b.r
        if (len < min && len > 0) {
          const n = d.divideScalar(len)
          const push = (min - len) / 2
          a.p.addScaledVector(n, -push)
          b.p.addScaledVector(n, push)
          const rel = b.v.clone().sub(a.v).dot(n)
          if (rel < 0) {
            a.v.addScaledVector(n, rel * 0.9)
            b.v.addScaledVector(n, -rel * 0.9)
          }
        }
      }
    }
    balls.forEach((b, i) => {
      b.p.addScaledVector(b.v, h)
      tmp.m.compose(b.p, tmp.q, new THREE.Vector3(b.r, b.r, b.r))
      mesh.current.setMatrixAt(i, tmp.m)
      mesh.current.setColorAt(i, tmp.c.setHSL((i * 0.137) % 1, 0.75, 0.55))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  })
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, N]}
      onPointerDown={() => (down.current = true)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial clearcoat={1} roughness={0.15} />
    </instancedMesh>
  )
}

export default function MarbleGravity() {
  return (
    <div className="h-96 cursor-crosshair overflow-hidden rounded-xl bg-[#0a0a12]" role="img" aria-label="Colourful marbles pulled toward the cursor, colliding into a cluster">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <pointLight position={[-4, -2, 3]} intensity={15} color="#93c5fd" />
        <Marbles />
      </Canvas>
      <p className="-mt-7 text-center font-mono text-xs text-white/50">hold mouse button over a marble to repel</p>
    </div>
  )
}
