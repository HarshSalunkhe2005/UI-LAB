import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Click to shatter: a pane of glass showing an image breaks into triangular
 * shards around the click point (a fan of radial cracks plus rings, so
 * shards are smaller near impact), which fly outward, spin and fall under
 * gravity, then the pane restores itself. Each shard keeps the slice of
 * the image texture it covered (UVs from its original position).
 */

type Shard = { geo: THREE.BufferGeometry; c: THREE.Vector3; v: THREE.Vector3; w: THREE.Vector3 }
const W = 3.6, H = 2.4

function build(hx: number, hy: number): Shard[] {
  const rays = 16
  const rings = [0.25, 0.6, 1.1, 1.9, 4]
  const pt = (r: number, a: number) => new THREE.Vector2(THREE.MathUtils.clamp(hx + Math.cos(a) * r, -W / 2, W / 2), THREE.MathUtils.clamp(hy + Math.sin(a) * r, -H / 2, H / 2))
  const angles = Array.from({ length: rays }, (_, i) => (i / rays) * Math.PI * 2 + (Math.random() - 0.5) * 0.25)
  const out: Shard[] = []
  const tri = (a: THREE.Vector2, b: THREE.Vector2, c: THREE.Vector2) => {
    if (Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) < 1e-4) return
    const centre = new THREE.Vector3((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3, 0)
    const pos = new Float32Array([a.x - centre.x, a.y - centre.y, 0, b.x - centre.x, b.y - centre.y, 0, c.x - centre.x, c.y - centre.y, 0])
    const uv = new Float32Array([a.x / W + 0.5, a.y / H + 0.5, b.x / W + 0.5, b.y / H + 0.5, c.x / W + 0.5, c.y / H + 0.5])
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    geo.computeVertexNormals()
    const dir = new THREE.Vector3(centre.x - hx, centre.y - hy, 0).normalize()
    const near = 1 / (0.4 + Math.hypot(centre.x - hx, centre.y - hy))
    out.push({ geo, c: centre, v: dir.multiplyScalar(1.2 * near).add(new THREE.Vector3(0, 0.6, 1.5 + Math.random() * 2)), w: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(8) })
  }
  const centre = new THREE.Vector2(hx, hy)
  for (let k = 0; k < rays; k++) {
    const a0 = angles[k], a1 = angles[(k + 1) % rays]
    tri(centre, pt(rings[0], a0), pt(rings[0], a1))
    for (let r = 0; r < rings.length - 1; r++) {
      const p00 = pt(rings[r], a0), p01 = pt(rings[r], a1), p10 = pt(rings[r + 1], a0), p11 = pt(rings[r + 1], a1)
      tri(p00, p10, p11)
      tri(p00, p11, p01)
    }
  }
  return out
}

function Pane() {
  const tex = useMemo(() => {
    const t = new THREE.TextureLoader().load('/img/12.webp')
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  const [shards, setShards] = useState<Shard[] | null>(null)
  const t = useRef(0)
  const meshes = useRef<(THREE.Mesh | null)[]>([])
  useFrame((_, dt) => {
    if (!shards) return
    t.current += dt
    const time = t.current
    shards.forEach((s, i) => {
      const m = meshes.current[i]
      if (!m) return
      m.position.set(s.c.x + s.v.x * time, s.c.y + s.v.y * time - 4.9 * time * time, s.c.z + s.v.z * time)
      m.rotation.set(s.w.x * time, s.w.y * time, s.w.z * time)
    })
    if (time > 1.8) setShards(null)
  })
  return shards ? (
    <>
      {shards.map((s, i) => (
        <mesh key={i} ref={(el) => { meshes.current[i] = el }} geometry={s.geo} position={s.c}>
          <meshStandardMaterial map={tex} side={THREE.DoubleSide} metalness={0.1} roughness={0.2} />
        </mesh>
      ))}
    </>
  ) : (
    <mesh
      onClick={(e) => {
        t.current = 0
        setShards(build(e.point.x, e.point.y))
      }}
    >
      <planeGeometry args={[W, H]} />
      <meshStandardMaterial map={tex} roughness={0.15} metalness={0.1} />
    </mesh>
  )
}

export default function GlassShatter() {
  return (
    <div className="h-96 cursor-pointer overflow-hidden rounded-xl bg-[#0b0b0f]" role="img" aria-label="Image on a glass pane that shatters into shards where you click, then restores">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 45 }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[2, 3, 4]} intensity={1.5} />
        <Pane />
      </Canvas>
      <p className="-mt-7 text-center font-mono text-xs text-white/50">click the glass</p>
    </div>
  )
}
