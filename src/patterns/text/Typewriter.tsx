import { useEffect, useState } from 'react'

/*
 * Typewriter that cycles through phrases: types, holds, deletes, next.
 * The live region is polite and only receives the full phrase once typed,
 * so screen readers are not spammed per character. Reduced motion: phrases
 * swap without typing.
 */

export function Typewriter({ words, speed = 70, hold = 1400 }: { words: string[]; speed?: number; hold?: number }) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [del, setDel] = useState(false)
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const word = words[i % words.length]

  useEffect(() => {
    if (reduced) {
      const id = setTimeout(() => setI((x) => x + 1), hold * 1.5)
      return () => clearTimeout(id)
    }
    const done = !del && n === word.length
    const empty = del && n === 0
    const id = setTimeout(
      () => {
        if (done) setDel(true)
        else if (empty) {
          setDel(false)
          setI((x) => x + 1)
        } else setN((x) => x + (del ? -1 : 1))
      },
      done ? hold : del ? speed / 2 : speed,
    )
    return () => clearTimeout(id)
  }, [n, del, word, speed, hold, reduced])

  return (
    <>
      <span aria-hidden>
        {reduced ? word : word.slice(0, n)}
        <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-middle" style={{ height: '0.9em' }} />
      </span>
      <span className="sr-only" aria-live="polite">{n === word.length || reduced ? word : ''}</span>
    </>
  )
}

export default function TypewriterDemo() {
  return (
    <p className="text-3xl font-semibold tracking-tight sm:text-5xl">
      Build <span className="text-accent"><Typewriter words={['landing pages.', 'dashboards.', 'portfolios.', 'anything.']} /></span>
    </p>
  )
}
