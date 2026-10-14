import { useState } from 'react'
import '@fontsource/caveat/600.css'

/*
 * Signature move (LxL Creative, Awwwards SOTD): a bold, tightly set headline with one word in a hand-written script,
 * in the brand's single warm accent, tilted and overlapping the lines around it. One accent per headline is the whole
 * rule. Type your own word to see how it holds. Pure CSS; the script word is real text, so it is read in order.
 */

export default function ScriptAccent() {
  const [word, setWord] = useState('Real people.')
  const safe = word.slice(0, 22)
  return (
    <div className="rounded-xl border border-border bg-[#2a211d] p-6 text-[#f6ead4] sm:p-10">
      <h3 className="mx-auto max-w-md text-center text-4xl leading-[0.95] font-extrabold tracking-tight uppercase sm:text-5xl">
        Real craft.
        <span className="relative z-10 -my-1 block py-1 text-[1.35em] normal-case" style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, color: '#ff7a45', transform: 'rotate(-4deg)', lineHeight: 0.9 }}>
          {safe || ' '}
        </span>
        Real results.
      </h3>
      <label className="mx-auto mt-8 block max-w-xs text-sm">
        <span className="mb-1 block text-[#d9c9ad]">Try your own accent word</span>
        <input value={word} onChange={(e) => setWord(e.target.value)} maxLength={22} className="min-h-11 w-full rounded-md border border-[#6d5a4c] bg-transparent px-3 text-[#f6ead4]" />
      </label>
    </div>
  )
}
