import { lazy, type ComponentType } from 'react'
import { META, type PatternMeta } from './meta'

export { CATEGORIES, type Category } from './meta'

export type Pattern = PatternMeta & { Component: ComponentType }

// Most patterns are tiny and bundled eagerly. Real-3D patterns (three.js / R3F, ~600KB)
// live in patterns/motion3d and are code-split: loaded only when first rendered.
// Anything that renders a Component must wrap it in <Suspense>.
// Whole-site demos (patterns/sites/<name>/index.tsx) are code-split too: they pull gsap, lenis and sometimes three.
// Every pattern is code-split and loaded when it is first rendered (a home card scrolling into view, or its own page),
// so the first load carries only the shell. The sources shown on pattern pages are loaded the same way (see App.tsx).
// (Vite applies a negative pattern to the whole list, so the whole-site entry points come from their own glob.)
const LAZY = {
  ...import.meta.glob(['./patterns/**/*.tsx', '!./patterns/sites/**'], { import: 'default' }),
  ...import.meta.glob('./patterns/sites/*/index.tsx', { import: 'default' }),
} as Record<string, () => Promise<ComponentType>>

const lazyCache: Record<string, ComponentType> = {}

export const PATTERNS: Pattern[] = META.map((m) => {
  const key = `./patterns/${m.file}`
  let Component: ComponentType | undefined
  if (LAZY[key]) Component = lazyCache[key] ??= lazy(() => LAZY[key]().then((c) => ({ default: c })))
  if (!Component) throw new Error(`Pattern file missing: src/patterns/${m.file}`)
  return { ...m, Component }
})
