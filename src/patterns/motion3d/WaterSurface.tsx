import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * Liquid surface: a dense plane whose vertices are displaced in a vertex
 * shader by expanding rings dropped along the cursor's path (a ring buffer
 * of 16 drops passed as uniforms) plus gentle ambient swell. Normals are
 * recomputed in-shader from finite differences, so light glints off the
 * crests. One draw call, no simulation textures.
 */

const DROPS = 16

const vert = /* glsl */ `
uniform float uTime; uniform vec3 uDrops[${DROPS}]; uniform float uCalm;
varying vec3 vN; varying float vH;
float h(vec2 p){
  float y = uCalm * (sin(p.x*1.4 + uTime*0.8)*0.05 + cos(p.y*1.7 + uTime*0.6)*0.05);
  for (int i = 0; i < ${DROPS}; i++) {
    vec3 d = uDrops[i];
    float age = uTime - d.z;
    if (age < 0.0 || age > 4.0) continue;
    float r = distance(p, d.xy);
    float front = age * 2.2;
    y += sin((r - front) * 7.0) * exp(-pow(r - front, 2.0) * 2.0) * 0.32 * (1.0 - age / 4.0);
  }
  return y;
}
void main(){
  vec3 p = position;
  float e = 0.03;
  float y = h(p.xy);
  vec3 dx = vec3(e, 0.0, h(p.xy + vec2(e, 0.0)) - y);
  vec3 dy = vec3(0.0, e, h(p.xy + vec2(0.0, e)) - y);
  vN = normalize(normalMatrix * cross(dx, dy));
  vH = y;
  p.z += y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`

const frag = /* glsl */ `
varying vec3 vN; varying float vH;
void main(){
  vec3 L = normalize(vec3(0.4, 0.8, 0.6));
  float diff = max(dot(vN, L), 0.0);
  float spec = pow(max(dot(reflect(-L, vN), normalize(vec3(0.0, 0.5, 1.0))), 0.0), 24.0);
  vec3 deep = vec3(0.02, 0.09, 0.2), shallow = vec3(0.1, 0.55, 0.75);
  vec3 col = mix(deep, shallow, 0.15 + diff * 0.45 + vH * 2.2) + spec * 1.1;
  gl_FragColor = vec4(col, 1.0);
}`

function Water() {
  const { camera, pointer, raycaster, clock } = useThree()
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const mesh = useRef<THREE.Mesh>(null!)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uCalm: { value: reducedMotion() ? 0 : 1 }, uDrops: { value: Array.from({ length: DROPS }, () => new THREE.Vector3(0, 0, -99)) } }),
    [],
  )
  const idx = useRef(0)
  const last = useRef(new THREE.Vector2(99, 99))
  useFrame(() => {
    uniforms.uTime.value = clock.elapsedTime
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObject(mesh.current)[0]
    if (hit?.uv) {
      const local = mesh.current.worldToLocal(hit.point.clone())
      if (last.current.distanceTo(new THREE.Vector2(local.x, local.y)) > 0.35) {
        last.current.set(local.x, local.y)
        uniforms.uDrops.value[idx.current++ % DROPS].set(local.x, local.y, clock.elapsedTime)
      }
    }
  })
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[14, 10, 260, 180]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  )
}

export default function WaterSurface() {
  return (
    <div className="h-96 cursor-crosshair overflow-hidden rounded-xl bg-[#020617]" role="img" aria-label="Water surface that ripples behind the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 4.5, 3.5], fov: 45 }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
        <Water />
      </Canvas>
    </div>
  )
}
