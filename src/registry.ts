import type { ComponentType } from 'react'
import { META, type PatternMeta } from './meta'

export { CATEGORIES, type Category } from './meta'

export type Pattern = PatternMeta & { Component: ComponentType }

const MODULES = import.meta.glob('./patterns/**/*.tsx', { eager: true, import: 'default' }) as Record<string, ComponentType>

export const PATTERNS: Pattern[] = META.map((m) => {
  const Component = MODULES[`./patterns/${m.file}`]
  if (!Component) throw new Error(`Pattern file missing: src/patterns/${m.file}`)
  return { ...m, Component }
})
