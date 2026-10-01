import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWindowPointer } from './_pointer'

/*
 * A faceted crystal that explodes into its individual triangles on hover
 * and snaps back together when you leave. The geometry is split into one
 * mesh per face (non-indexed), and every shard flies out along its own
 * face normal with a random spin; one eased progress value drives them all.
 */

function Shards({ open }: { open: boolean }) {
  const g = useRef<THREE.Group>(null!)
  const pointer = useWindowPointer()
  const t = useRef(0)
  const shards = useMemo(() => {
    const src = new THREE.IcosahedronGeometry(1.4, 1).toNonIndexed()
    const p = src.attributes.position
    const out: { geo: THREE.BufferGeometry; n: THREE.Vector3; c: THREE.Vector3; spin: THREE.Vector3; color: THREE.Color }[] = []
    for (let i = 0; i < p.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(p, i), b = new THREE.Vector3().fromBufferAttribute(p, i + 1), c = new THREE.Vector3().fromBufferAttribute(p, i + 2)
      const centre = a.clone().add(b).add(c).divideScalar(3)
      const geo = new THREE.BufferGeometry().setFromPoints([a.sub(centre), b.sub(centre), c.sub(centre)])
      geo.computeVertexNormals()
      out.push({ geo, n: centre.clone().normalize(), c: centre, spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(6), color: new THREE.Color().setHSL(0.7 + centre.y * 0.08, 0.7, 0.6) })
    }
    return out
  }, [])
  const meshes = useRef<(THREE.Mesh | null)[]>([])
  useFrame((s, dt) => {
    t.current = THREE.MathUtils.damp(t.current, open ? 1 : 0, open ? 4 : 6, dt)
    const e = t.current
    shards.forEach((sh, i) => {
      const m = meshes.current[i]
      if (!m) return
      m.position.copy(sh.c).addScaledVector(sh.n, e * (1.4 + (i % 5) * 0.25))
      m.rotation.set(sh.spin.x * e, sh.spin.y * e, sh.spin.z * e)
    })
    g.current.rotation.y += dt * 0.25
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -pointer.current.y * 0.5, 3, dt)
    void s
  })
  return (
    <group ref={g}>
      {shards.map((sh, i) => (
        <mesh key={i} ref={(el) => { meshes.current[i] = el }} geometry={sh.geo}>
          <meshStandardMaterial color={sh.color} flatShading side={THREE.DoubleSide} metalness={0.3} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

export default function ExplodeShape() {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="h-96 overflow-hidden rounded-xl bg-[#0c0a1d]"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      role="img"
      aria-label="Crystal that bursts into shards on hover and reassembles"
    >
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <pointLight position={[-3, -2, 2]} intensity={20} color="#f472b6" />
        <Shards open={open} />
      </Canvas>
    </div>
  )
}
