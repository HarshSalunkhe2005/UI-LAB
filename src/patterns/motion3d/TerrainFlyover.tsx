import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * Endless low-poly terrain flyover. The ground is one plane whose heights
 * come from fractal noise sampled at (x, z + travel), so moving "forward" is
 * just scrolling the noise; nothing is ever regenerated. Flat-shaded,
 * height-coloured (water, sand, grass, rock, snow), with fog hiding the
 * edge. The cursor banks and steers the camera.
 */

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const fbm = (x: number, y: number) => noise(x, y) * 0.55 + noise(x * 2, y * 2) * 0.28 + noise(x * 4, y * 4) * 0.12 + noise(x * 8, y * 8) * 0.05

const SEA = 0.42
const BANDS: [number, THREE.Color][] = [
  [0.0, new THREE.Color('#1d4ed8')], [SEA - 0.03, new THREE.Color('#38bdf8')], [SEA + 0.01, new THREE.Color('#fde68a')],
  [SEA + 0.05, new THREE.Color('#4ade80')], [0.58, new THREE.Color('#15803d')], [0.66, new THREE.Color('#78716c')], [0.74, new THREE.Color('#fafafa')],
]

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(40, 40, 56, 56).toNonIndexed()
    g.rotateX(-Math.PI / 2)
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3))
    return g
  }, [])
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array), [geo])
  const travel = useRef(0)
  const pointer = useWindowPointer()
  const still = reducedMotion()
  const c = useMemo(() => new THREE.Color(), [])
  useFrame((s, dt) => {
    if (!still) travel.current += dt * 2.2
    const p = geo.attributes.position as THREE.BufferAttribute
    const col = geo.attributes.color as THREE.BufferAttribute
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2]
      let h = fbm(x * 0.09 + 50, (z - travel.current) * 0.09 + 50)
      // stretch contrast so peaks and sea both appear, then flatten the sea
      h = THREE.MathUtils.clamp((h - 0.5) * 1.8 + 0.5, 0, 1)
      const level = Math.max(h, SEA)
      p.setY(i, (level - SEA) * 7)
      let k = 0
      while (k < BANDS.length - 1 && h > BANDS[k + 1][0]) k++
      if (h < SEA) k = h < SEA - 0.06 ? 0 : 1
      c.copy(BANDS[k][1])
      col.setXYZ(i, c.r, c.g, c.b)
    }
    p.needsUpdate = true
    col.needsUpdate = true
    geo.computeVertexNormals()
    const cam = s.camera
    cam.position.x = THREE.MathUtils.damp(cam.position.x, pointer.current.x * 5, 1.5, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 6 + pointer.current.y * 2, 1.5, dt)
    cam.rotation.z = THREE.MathUtils.damp(cam.rotation.z, -pointer.current.x * 0.25, 2, dt)
  })
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial vertexColors flatShading roughness={0.9} />
    </mesh>
  )
}

export default function TerrainFlyover() {
  return (
    <div className="h-96 overflow-hidden rounded-xl" role="img" aria-label="Endless low-poly landscape flyover steered by the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 6, 9], fov: 55, rotation: [-0.45, 0, 0] }}>
        <color attach="background" args={['#bae6fd']} />
        <fog attach="fog" args={['#bae6fd', 8, 26]} />
        <hemisphereLight args={['#ffffff', '#1e293b', 0.9]} />
        <directionalLight position={[5, 10, 3]} intensity={1.8} />
        <Terrain />
      </Canvas>
    </div>
  )
}
