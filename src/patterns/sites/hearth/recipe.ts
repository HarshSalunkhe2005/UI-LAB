/* Recipe data and the maths for scaling it. Pure functions, no React, so they can be tested. */

export type Ingredient = { name: string; qty: number; unit: 'g' | 'ml' | 'tsp' | 'tbsp' | 'each' | 'pinch'; note?: string }
export type Step = { text: string; minutes?: number }

export const BASE_SERVES = 4
export const TITLE = 'Slow tomato and white bean stew'
export const INGREDIENTS: Ingredient[] = [
  { name: 'olive oil', qty: 3, unit: 'tbsp' },
  { name: 'onions', qty: 2, unit: 'each', note: 'finely chopped' },
  { name: 'garlic cloves', qty: 4, unit: 'each', note: 'sliced' },
  { name: 'tinned tomatoes', qty: 800, unit: 'g' },
  { name: 'cooked white beans', qty: 500, unit: 'g', note: 'drained' },
  { name: 'vegetable stock', qty: 400, unit: 'ml' },
  { name: 'smoked paprika', qty: 2, unit: 'tsp' },
  { name: 'salt', qty: 1, unit: 'pinch', note: 'to taste' },
]
export const STEPS: Step[] = [
  { text: 'Warm the oil in a wide pan over a medium heat. Add the onions and a pinch of salt and cook until soft and golden.', minutes: 10 },
  { text: 'Add the garlic and paprika. Stir for one minute until it smells like a campfire.', minutes: 1 },
  { text: 'Tip in the tomatoes, beans and stock. Bring to a gentle simmer, then turn the heat down low.' },
  { text: 'Cook, stirring now and then, until the sauce is thick and glossy.', minutes: 35 },
  { text: 'Taste, adjust the salt, and rest off the heat before serving with bread.', minutes: 5 },
]

const FRACTIONS: [number, string][] = [[0.125, '⅛'], [0.25, '¼'], [1 / 3, '⅓'], [0.5, '½'], [2 / 3, '⅔'], [0.75, '¾']]

/** Format an amount the way a cook would say it: 1½, ¾, 0.4 only when no fraction is close. */
export function nice(n: number): string {
  if (n >= 100) return String(Math.round(n / 5) * 5)
  if (n >= 10) return String(Math.round(n))
  const whole = Math.floor(n + 1e-6)
  const rest = n - whole
  if (rest < 0.06) return String(whole || 0)
  const hit = FRACTIONS.find(([v]) => Math.abs(v - rest) < 0.07)
  if (hit) return `${whole || ''}${hit[1]}`
  if (rest > 0.93) return String(whole + 1)
  return n.toFixed(1)
}

export function scale(qty: number, serves: number, base = BASE_SERVES): number {
  return (qty * serves) / base
}

/** Convert a metric amount to US-style cooking units for display. Only used for the unit toggle. */
export function convert(i: Ingredient, serves: number, imperial: boolean): { amount: string; unit: string } {
  const q = scale(i.qty, serves)
  if (!imperial) return { amount: nice(q), unit: i.unit === 'each' ? '' : i.unit === 'pinch' ? (q > 1.5 ? 'pinches' : 'pinch') : i.unit }
  if (i.unit === 'g') return { amount: nice(q / 28.35), unit: 'oz' }
  if (i.unit === 'ml') return { amount: nice(q / 236.6), unit: q / 236.6 > 1.05 ? 'cups' : 'cup' }
  return { amount: nice(q), unit: i.unit === 'each' ? '' : i.unit === 'pinch' ? (q > 1.5 ? 'pinches' : 'pinch') : i.unit }
}
