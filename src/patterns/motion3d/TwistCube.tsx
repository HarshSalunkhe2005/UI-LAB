import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * A 3×3 twisting puzzle cube that scrambles itself: every ~0.8s a random
 * layer (x/y/z, -1/0/1) turns 90°. The trick is the pivot: the 9 cubelets of
 * the layer are re-parented to a pivot group, the pivot is rotated with
 * easing, then they are re-parented back with their world transforms baked
 * and positions snapped to the grid. The whole cube orbits with the cursor.
 */

const COLORS = ['#ef4444', '#f97316', '#ffffff', '#facc15', '#22c55e', '#3b82f6'] // +x -x +y -y +z -z

function Cubelet({ pos }: { pos: [number, number, number] }) {
  const mats = useMemo(
    () => [0, 1, 2, 3, 4, 5].map((f) => {
      const axis = Math.floor(f / 2), sign = f % 2 ? -1 : 1
      const outer = pos[axis] === sign
      return new THREE.MeshStandardMaterial({ color: outer ? COLORS[f] : '#111', roughness: 0.35 })
    }),
    [pos],
  )
  return (
    <group position={pos} userData={{ cubelet: true }}>
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.08}>
        <meshStandardMaterial color="#0a0a0a" />
      </RoundedBox>
      <mesh>
        <boxGeometry args={[0.86, 0.86, 0.96]} />
        {mats.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
      </mesh>
      <mesh>
        <boxGeometry args={[0.96, 0.86, 0.86]} />
        {mats.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
      </mesh>
      <mesh>
        <boxGeometry args={[0.86, 0.96, 0.86]} />
        {mats.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
      </mesh>
    </group>
  )
}

function Puzzle() {
  const root = useRef<THREE.Group>(null!)
  const pivot = useMemo(() => new THREE.Group(), [])
  const turn = useRef<{ axis: 'x' | 'y' | 'z'; dir: number; t: number; members: THREE.Object3D[] } | null>(null)
  const pointer = useWindowPointer()
  const still = reducedMotion()
  const positions = useMemo(() => {
    const out: [number, number, number][] = []
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) out.push([x, y, z])
    return out
  }, [])

  useEffect(() => {
    root.current.add(pivot)
  }, [pivot])

  useFrame((_, dt) => {
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, 0.6 + pointer.current.x * 0.8, 3, dt)
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, 0.45 - pointer.current.y * 0.5, 3, dt)
    if (still) return
    if (!turn.current) {
      const axis = (['x', 'y', 'z'] as const)[Math.floor(Math.random() * 3)]
      const layer = Math.floor(Math.random() * 3) - 1
      const members = root.current.children.filter((c) => c.userData.cubelet && Math.round(c.position[axis]) === layer)
      pivot.rotation.set(0, 0, 0)
      members.forEach((m) => pivot.attach(m))
      turn.current = { axis, dir: Math.random() < 0.5 ? 1 : -1, t: 0, members }
    }
    const tr = turn.current
    tr.t = Math.min(1, tr.t + dt * 2.2)
    const e = tr.t < 0.5 ? 4 * tr.t ** 3 : 1 - (-2 * tr.t + 2) ** 3 / 2
    pivot.rotation[tr.axis] = e * (Math.PI / 2) * tr.dir
    if (tr.t >= 1) {
      pivot.updateMatrixWorld()
      tr.members.forEach((m) => {
        root.current.attach(m)
        m.position.set(Math.round(m.position.x), Math.round(m.position.y), Math.round(m.position.z))
      })
      turn.current = null
    }
  })

  return (
    <group ref={root}>
      {positions.map((p) => <Cubelet key={p.join()} pos={p} />)}
    </group>
  )
}

export default function TwistCube() {
  return (
    <div className="h-96 overflow-hidden rounded-xl bg-gradient-to-b from-surface-2 to-bg" role="img" aria-label="Three by three puzzle cube scrambling itself, turning toward the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 5]} intensity={2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} />
        <Puzzle />
      </Canvas>
    </div>
  )
}
