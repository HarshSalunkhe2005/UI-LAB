import * as THREE from 'three'
import type { Flavor } from './flavors'

const W = 2048
const H = 1050

function drawCitrus(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rind: string, flesh: string) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.fillStyle = rind
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = flesh
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = rind
  for (let i = 0; i < 8; i++) {
    ctx.save()
    ctx.rotate((i * Math.PI) / 4)
    ctx.fillRect(-r * 0.018, 0, r * 0.036, r * 0.86)
    ctx.restore()
  }
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export function makeLabel(f: Flavor, maxAniso: number): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!

  // base
  ctx.fillStyle = f.can
  ctx.fillRect(0, 0, W, H)

  // sunburst rays emanating from the front-centre
  ctx.save()
  ctx.translate(W / 2, H * 0.5)
  ctx.globalAlpha = 0.14
  ctx.fillStyle = f.accent
  for (let i = 0; i < 28; i++) {
    ctx.rotate((Math.PI * 2) / 28)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(1500, -60)
    ctx.lineTo(1500, 60)
    ctx.fill()
  }
  ctx.restore()

  // wavy bands top + bottom
  const wave = (y: number, amp: number, color: string, thick: number) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= W; x += 16) ctx.lineTo(x, y + Math.sin((x / W) * Math.PI * 8) * amp)
    for (let x = W; x >= 0; x -= 16) ctx.lineTo(x, y + thick + Math.sin((x / W) * Math.PI * 8) * amp)
    ctx.fill()
  }
  wave(H * 0.08, 18, f.accent, 46)
  wave(H * 0.08 + 70, 18, f.ink, 14)
  wave(H * 0.86, 18, f.ink, 14)
  wave(H * 0.86 + 34, 18, f.accent, 46)

  // front + back brand blocks (front centred at u=0.5, back split over the seam)
  const brand = (cx: number, big: boolean) => {
    ctx.save()
    ctx.translate(cx, 0)
    ctx.textAlign = 'center'
    ctx.fillStyle = f.ink
    ctx.font = `${big ? 330 : 250}px Anton, Impact, sans-serif`
    ctx.fillText('SOLAR', 0, H * (big ? 0.5 : 0.46))
    ctx.fillStyle = f.accent
    ctx.font = `${big ? 66 : 56}px "Bricolage Grotesque Variable", Arial, sans-serif`
    ctx.fillText(f.name.toUpperCase(), 0, H * (big ? 0.6 : 0.56))
    ctx.fillStyle = f.ink
    ctx.font = `600 ${big ? 30 : 28}px "Bricolage Grotesque Variable", Arial, sans-serif`
    ctx.fillText(big ? 'SPARKLING · ZERO SUGAR · 355 ML' : 'REAL FRUIT  ·  NO ADDED SUGAR', 0, H * (big ? 0.67 : 0.62))
    ctx.restore()
  }
  brand(W / 2, true)
  brand(0, false)
  brand(W, false)

  // citrus slices flanking the front brand
  drawCitrus(ctx, W / 2 - 520, H * 0.45, 130, f.accent, f.can)
  drawCitrus(ctx, W / 2 + 520, H * 0.45, 130, f.accent, f.can)

  // bubbles
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 90; i++) {
    ctx.beginPath()
    ctx.arc(rnd() * W, H * (0.2 + rnd() * 0.6), 4 + rnd() * 16, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.offset.x = 0.5 // cylinder seam sits at the back, brand faces camera
  tex.anisotropy = maxAniso
  tex.needsUpdate = true
  return tex
}
