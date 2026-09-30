import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * Refractive glass: a torus with drei's MeshTransmissionMaterial rotating
 * in front of big type, bending and colour-splitting it (chromatic
 * aberration) like a thick lens. The type is drawn to a CanvasTexture on
 * a plane in the scene, because transmission only refracts 3D content, so
 * no font files or network loads are needed. Tilts toward the cursor.
 */

function useTextTexture(text: string) {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 2048
    c.height = 1024
    const g = c.getContext('2d')!
    const grd = g.createLinearGradient(0, 0, 2048, 1024)
    grd.addColorStop(0, '#0b0b12')
    grd.addColorStop(1, '#1e1b4b')
    g.fillStyle = grd
    g.fillRect(0, 0, 2048, 1024)
    g.fillStyle = '#f4f4f5'
    g.font = 'bold 380px Georgia, serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(text, 1024, 512)
    g.strokeStyle = '#818cf8'
    g.lineWidth = 6
    for (let i = 0; i < 9; i++) {
      g.beginPath()
      g.moveTo(0, 90 + i * 110)
      g.lineTo(2048, 90 + i * 110)
      g.globalAlpha = 0.18
      g.stroke()
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [text])
}

function Glass() {
  const ref = useRef<THREE.Mesh>(null!)
  const pointer = useWindowPointer()
  const still = reducedMotion()
  useFrame((_, dt) => {
    if (!still) ref.current.rotation.z += dt * 0.25
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, 0.5 - pointer.current.y * 0.5, 4, dt)
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, pointer.current.x * 0.6, 4, dt)
  })
  return (
    <mesh ref={ref} position={[0, 0, 1.2]}>
      <torusGeometry args={[1.05, 0.42, 64, 128]} />
      <MeshTransmissionMaterial thickness={0.9} roughness={0.05} ior={1.35} chromaticAberration={0.5} anisotropy={0.2} distortion={0.3} distortionScale={0.4} temporalDistortion={0.1} backside samples={6} resolution={512} />
    </mesh>
  )
}

export function GlassShape({ text = 'GLASS', className = 'h-96' }: { text?: string; className?: string }) {
  const tex = useTextTexture(text)
  return (
    <div className={className} role="img" aria-label={`Rotating glass torus refracting the word ${text}`}>
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[10, 5]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
        <ambientLight intensity={1} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <Glass />
      </Canvas>
    </div>
  )
}

export default function GlassShapeDemo() {
  return <GlassShape />
}
