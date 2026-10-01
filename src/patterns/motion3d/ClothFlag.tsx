import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * A flag rippling in the wind, pinned on its left edge: a subdivided plane
 * whose vertices travel along overlapping sine waves (amplitude grows with
 * distance from the pole). The cursor acts as a gust: waves speed up and a
 * bulge forms where the pointer is. Shading comes from recomputed normals,
 * so folds catch the light. Texture is a CanvasTexture.
 */

function flagTex() {
  const c = document.createElement('canvas')
  c.width = 600
  c.height = 400
  const g = c.getContext('2d')!
  const stripes = ['#f43f5e', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6']
  stripes.forEach((col, i) => {
    g.fillStyle = col
    g.fillRect(0, (i * 400) / stripes.length, 600, 400 / stripes.length + 1)
  })
  g.fillStyle = 'rgba(255,255,255,.92)'
  g.font = 'italic bold 110px Georgia, serif'
  g.textAlign = 'center'
  g.fillText('UI Lab', 300, 235)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Flag() {
  const mesh = useRef<THREE.Mesh>(null!)
  const tex = useMemo(flagTex, [])
  const geo = useMemo(() => new THREE.PlaneGeometry(3, 2, 60, 40), [])
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array), [geo])
  const { pointer } = useThree()
  const gust = useRef(0)
  const still = reducedMotion()
  useFrame((s, dt) => {
    const near = Math.abs(pointer.x) < 0.9 && Math.abs(pointer.y) < 0.9 ? 1 : 0
    gust.current = THREE.MathUtils.damp(gust.current, near, 2, dt)
    const t = still ? 0 : s.clock.elapsedTime * (1.6 + gust.current * 1.8)
    const p = geo.attributes.position as THREE.BufferAttribute
    const px = pointer.x * 1.6, py = pointer.y * 1.1
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3], y = base[i * 3 + 1]
      const k = (x + 1.5) / 3
      let z = (Math.sin(x * 2.2 - t * 2) * 0.18 + Math.sin(x * 4.1 + y * 1.3 - t * 3.1) * 0.06) * k
      const d2 = (x - px) ** 2 + (y - py) ** 2
      z += Math.exp(-d2 * 2.5) * 0.35 * gust.current * k
      p.setZ(i, z)
      p.setY(i, y - k * k * 0.12)
    }
    p.needsUpdate = true
    geo.computeVertexNormals()
  })
  return (
    <group position={[-0.2, 0.3, 0]}>
      <mesh ref={mesh} geometry={geo} position={[1.5, 0, 0]}>
        <meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 4.2]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  )
}

export default function ClothFlag() {
  return (
    <div className="h-96 overflow-hidden rounded-xl bg-gradient-to-b from-sky-300 to-sky-100" role="img" aria-label="Flag waving in the wind; the cursor makes a gust">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0.6, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 4]} intensity={2} />
        <Flag />
      </Canvas>
    </div>
  )
}
