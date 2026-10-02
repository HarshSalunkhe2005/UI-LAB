// Mutable animation state. GSAP scrubs these from scroll, the R3F loop reads them
// every frame, so React never re-renders while scrolling.
export const rig = {
  x: 0.34, // fraction of half viewport width
  y: 0,
  s: 1.05,
  rx: 0,
  ry: 0.6,
  rz: -0.18,
  flavor: 0,
}

// Intro animation layered on top of the scroll rig.
export const intro = { s: 0, ry: -5 }

export const pointer = { x: 0, y: 0 }
