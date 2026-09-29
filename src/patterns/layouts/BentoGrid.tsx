import type { ReactNode } from 'react'

/*
 * Bento grid: a 6-column grid where tiles span different widths/heights.
 * grid-auto-flow: dense backfills gaps so uneven tiles still pack tightly.
 * Collapses to a single column on small screens.
 */

export function BentoGrid({ children }: { children: ReactNode }) {
  return <div className="grid auto-rows-[10rem] grid-cols-1 gap-3 [grid-auto-flow:dense] sm:grid-cols-6">{children}</div>
}

export function BentoTile({
  span = 'sm:col-span-2',
  className = '',
  children,
}: {
  span?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border bg-surface p-5 ${span} ${className}`}>
      {children}
    </div>
  )
}

const Label = ({ k, v }: { k: string; v: string }) => (
  <>
    <p className="font-mono text-[11px] uppercase tracking-wider text-fg-muted">{k}</p>
    <p className="mt-1 text-lg font-medium">{v}</p>
  </>
)

export default function BentoDemo() {
  return (
    <BentoGrid>
      <BentoTile span="sm:col-span-4 sm:row-span-2" className="flex flex-col justify-end bg-gradient-to-br from-accent/25 to-transparent">
        <p className="font-display text-4xl italic">Your day, reconstructed.</p>
        <p className="mt-2 max-w-sm text-sm text-fg-muted">Lead tile: 4 columns × 2 rows. Put the one thing you want seen here.</p>
      </BentoTile>
      <BentoTile>
        <Label k="Sources" v="12 connected" />
      </BentoTile>
      <BentoTile>
        <Label k="Accuracy" v="97.4%" />
      </BentoTile>
      <BentoTile span="sm:col-span-3">
        <Label k="Latency" v="180ms median" />
      </BentoTile>
      <BentoTile span="sm:col-span-3">
        <Label k="Export" v="JSON · CSV · Live page" />
      </BentoTile>
    </BentoGrid>
  )
}
