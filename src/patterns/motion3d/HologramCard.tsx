import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useWindowPointer } from './_pointer'

/*
 * Holographic trading card: a foil shader whose rainbow sheen depends on the
 * card's tilt (view angle) and the pointer position, plus diagonal sparkle
 * bands and a glare spot, the way real holo foil shifts as you turn it. The
 * card tilts toward the cursor in 3D. Artwork is a canvas texture.
 */

const frag = /* glsl */ `
uniform sampler2D uArt; uniform vec2 uTilt; uniform float uTime;
varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec3 art = texture2D(uArt, vUv).rgb;
  float band = vUv.x * 1.2 + vUv.y * 0.8 + uTilt.x * 1.5 - uTilt.y * 1.2;
  vec3 rainbow = 0.5 + 0.5 * cos(6.2831 * (band + vec3(0., .33, .67)));
  float stripes = smoothstep(0.4, 1., sin((vUv.x - vUv.y) * 60. + uTilt.x * 20.) * .5 + .5);
  float sparkle = step(0.985, h(floor(vUv * 180.))) * (0.5 + 0.5 * sin(uTime * 5. + h(floor(vUv * 180.)) * 30.));
  vec2 g = vec2(0.5 + uTilt.x * 1.2, 0.5 - uTilt.y * 1.2);
  float glare = exp(-distance(vUv, g) * 5.) * 0.6;
  vec3 col = art + rainbow * (0.22 + stripes * 0.25) + sparkle + glare;
  gl_FragColor = vec4(col, 1.);
}`
const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`

function art() {
  const c = document.createElement('canvas')
  c.width = 500
  c.height = 700
  const g = c.getContext('2d')!
  const grd = g.createLinearGradient(0, 0, 0, 700)
  grd.addColorStop(0, '#1e1b4b')
  grd.addColorStop(1, '#4c1d95')
  g.fillStyle = grd
  g.fillRect(0, 0, 500, 700)
  g.strokeStyle = '#fbbf24'
  g.lineWidth = 10
  g.strokeRect(20, 20, 460, 660)
  g.fillStyle = '#fef3c7'
  g.font = 'bold 44px Georgia, serif'
  g.fillText('Lumen Drake', 50, 90)
  g.fillStyle = '#f59e0b'
  g.beginPath()
  g.moveTo(250, 170); g.lineTo(380, 380); g.lineTo(250, 330); g.lineTo(120, 380); g.closePath()
  g.fill()
  g.fillStyle = '#e9d5ff'
  g.font = '28px system-ui'
  g.fillText('★★★★★  LEGENDARY', 60, 560)
  g.font = '22px system-ui'
  g.fillText('Turns light into wishes.', 60, 610)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Card() {
  const g = useRef<THREE.Group>(null!)
  const pointer = useWindowPointer()
  const uniforms = useMemo(() => ({ uArt: { value: art() }, uTilt: { value: new THREE.Vector2() }, uTime: { value: 0 } }), [])
  useFrame((s, dt) => {
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, pointer.current.x * 0.55, 5, dt)
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -pointer.current.y * 0.45, 5, dt)
    uniforms.uTilt.value.set(g.current.rotation.y, g.current.rotation.x)
    uniforms.uTime.value = s.clock.elapsedTime
  })
  return (
    <group ref={g}>
      <RoundedBox args={[2.1, 2.94, 0.04]} radius={0.1}>
        <meshStandardMaterial color="#d4d4d8" metalness={0.8} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[2.0, 2.84]} />
        <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
      </mesh>
    </group>
  )
}

export default function HologramCard() {
  return (
    <div className="h-[26rem] overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900 to-black" role="img" aria-label="Holographic trading card whose foil shimmers as it tilts toward the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 4]} intensity={1.5} />
        <Card />
      </Canvas>
    </div>
  )
}
