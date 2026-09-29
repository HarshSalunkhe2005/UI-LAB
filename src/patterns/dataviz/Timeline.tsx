/*
 * Vertical event timeline. A single rail line, dots coloured by
 * confidence, and time in a fixed-width mono column so rows align.
 * Items reveal on scroll via the same animation-timeline trick.
 */

type Event = { time: string; title: string; detail: string; confidence: 'high' | 'medium' | 'low' }

const DOT: Record<Event['confidence'], string> = {
  high: 'bg-success',
  medium: 'bg-warning',
  low: 'bg-danger',
}

export function Timeline({ events }: { events: Event[] }) {
  return (
    <ol className="relative ml-[4.5rem] border-l border-border">
      {events.map((e) => (
        <li key={e.time + e.title} className="reveal relative pb-8 pl-6 last:pb-0">
          <time className="absolute top-0.5 -left-[4.5rem] w-14 text-right font-mono text-xs text-fg-muted tabular-nums">
            {e.time}
          </time>
          <span className={`absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full ring-4 ring-bg ${DOT[e.confidence]}`} />
          <h4 className="font-medium">{e.title}</h4>
          <p className="mt-0.5 text-sm text-fg-muted">{e.detail}</p>
        </li>
      ))}
    </ol>
  )
}

const DAY: Event[] = [
  { time: '07:42', title: 'Left home', detail: 'Phone location + door sensor agree.', confidence: 'high' },
  { time: '08:15', title: 'Coffee, Bandra', detail: 'Card payment; photo EXIF 3 min later.', confidence: 'high' },
  { time: '11:30', title: 'Meeting', detail: 'Calendar entry, no location ping.', confidence: 'medium' },
  { time: '14:05', title: 'Unknown stop', detail: 'Single Wi-Fi fingerprint, needs review.', confidence: 'low' },
  { time: '19:20', title: 'Back home', detail: 'Location + smart-lock event.', confidence: 'high' },
]

export default function TimelineDemo() {
  return (
    <div>
      <div className="mb-6 flex gap-4 font-mono text-[11px] text-fg-muted">
        {(['high', 'medium', 'low'] as const).map((c) => (
          <span key={c} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${DOT[c]}`} /> {c}
          </span>
        ))}
      </div>
      <Timeline events={DAY} />
    </div>
  )
}
