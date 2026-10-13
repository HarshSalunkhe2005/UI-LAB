/* A procedural pressed-plant drawing. `dry` goes 0 (fresh) to 1 (pressed): colours fade toward sepia and the stem flattens. */

const mix = (a: number, b: number, t: number) => a + (b - a) * t
/** Hue interpolation along the shorter way round the colour wheel, so a purple flower browns through red, not green. */
const hueMix = (a: number, b: number, t: number) => (a + (((b - a + 540) % 360) - 180) * t + 360) % 360

export function Plant({ petals = 5, leaves = 4, hue = 330, dry = 0, className, label }: { petals?: number; leaves?: number; hue?: number; dry?: number; className?: string; label: string }) {
  const leaf = `hsl(${mix(98, 44, dry)} ${mix(38, 26, dry)}% ${mix(36, 50, dry)}%)`
  const leafDark = `hsl(${mix(98, 40, dry)} ${mix(40, 28, dry)}% ${mix(26, 36, dry)}%)`
  const petal = `hsl(${hueMix(hue, 30, dry * 0.85)} ${mix(62, 28, dry)}% ${mix(68, 70, dry)}%)`
  const center = `hsl(${mix(44, 34, dry)} ${mix(80, 40, dry)}% ${mix(52, 40, dry)}%)`
  const squash = 1 - dry * 0.16

  return (
    <svg viewBox="0 0 200 310" className={className} role="img" aria-label={label}>
      <g style={{ transform: `scaleY(${squash})`, transformOrigin: '100px 300px', transition: 'transform 0.4s' }}>
        <path d="M100 298C96 240 106 170 100 92" stroke={leafDark} strokeWidth="3" fill="none" strokeLinecap="round" style={{ transition: 'stroke 0.4s' }} />
        {Array.from({ length: leaves }, (_, i) => {
          const y = 262 - i * (150 / leaves + 8)
          const d = i % 2 ? 1 : -1
          const len = 52 - i * 4
          return (
            <g key={i} style={{ transition: 'fill 0.4s' }}>
              <path d={`M100 ${y}c${d * 16} -8 ${d * len * 0.7} -10 ${d * len} -34c${-d * 24} -4 ${-d * 38} 8 ${-d * len} 34Z`} fill={leaf} stroke={leafDark} strokeWidth="1.2" />
              <path d={`M100 ${y}c${d * 18} -12 ${d * len * 0.6} -20 ${d * len * 0.95} -33`} stroke={leafDark} strokeWidth="0.8" fill="none" />
            </g>
          )
        })}
        <g>
          {Array.from({ length: petals }, (_, i) => (
            <ellipse key={i} cx="100" cy="62" rx="12" ry="26" transform={`rotate(${(i * 360) / petals} 100 88)`} fill={petal} stroke={`hsl(${hueMix(hue, 30, dry)} 40% 38%)`} strokeWidth="1" />
          ))}
          <circle cx="100" cy="88" r="9" fill={center} stroke="#6b4b14" strokeWidth="1" />
        </g>
      </g>
    </svg>
  )
}

export const SPECIES = [
  { id: 'campanula', common: 'Harebell', latin: 'Campanula rotundifolia', hab: 'Dry grassland', season: 'Summer', price: 38, petals: 5, leaves: 3, hue: 255 },
  { id: 'primula', common: 'Primrose', latin: 'Primula vulgaris', hab: 'Hedge banks', season: 'Spring', price: 34, petals: 5, leaves: 4, hue: 52 },
  { id: 'geranium', common: 'Herb Robert', latin: 'Geranium robertianum', hab: 'Shaded walls', season: 'Summer', price: 36, petals: 5, leaves: 5, hue: 330 },
  { id: 'anemone', common: 'Wood Anemone', latin: 'Anemone nemorosa', hab: 'Ancient woodland', season: 'Spring', price: 42, petals: 7, leaves: 3, hue: 200 },
  { id: 'aster', common: 'Sea Aster', latin: 'Tripolium pannonicum', hab: 'Salt marsh', season: 'Autumn', price: 40, petals: 12, leaves: 4, hue: 285 },
  { id: 'clematis', common: 'Old Man’s Beard', latin: 'Clematis vitalba', hab: 'Chalk hedgerows', season: 'Autumn', price: 44, petals: 8, leaves: 5, hue: 90 },
] as const
