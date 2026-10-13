import { useState } from 'react'

/*
 * Niche world: Museum Wall Label. The object is the star and the label is set like a gallery placard: title in
 * italics, artist and dates, medium, dimensions, accession number, a short wall text, and an audio-guide
 * keypad where typing the number "plays" that entry's transcript. A "Large print" toggle scales the whole
 * label up (not just the text), because gallery labels have to be readable at arm's length. Audio is simulated
 * (transcript text), so nothing autoplays.
 */

const GUIDE: Record<string, string> = {
  '14': 'Fourteen. The potter pressed the clay in six strokes and left the thumbprint on purpose.',
  '15': 'Fifteen. The glaze pooled in the base during firing; the flaw became the signature.',
  '16': 'Sixteen. Found in a house clearance in 1962 and donated by the family the same year.',
}

export default function MuseumPlacard() {
  const [big, setBig] = useState(false)
  const [code, setCode] = useState('')
  const play = GUIDE[code]

  return (
    <div className="grid gap-6 rounded-xl border border-border bg-[#ece8df] p-6 text-[#1b1a17] md:grid-cols-2">
      <div className="grid min-h-60 place-items-center rounded bg-[#d6cfc0]" role="img" aria-label="A small round-bellied ceramic vessel with a pooled blue glaze">
        <div className="size-32 rounded-[45%_45%_40%_40%] shadow-xl" style={{ background: 'radial-gradient(circle at 35% 30%, #5b86a8, #1f3c58 70%)' }} />
      </div>
      <div className="space-y-3" style={{ fontSize: big ? '1.18rem' : '0.95rem', transition: 'font-size 0.2s' }}>
        <h3 className="font-display text-[1.6em] italic" style={{ fontFamily: 'var(--font-display, serif)' }}>Vessel with pooled glaze</h3>
        <p><strong>Attributed to Hana Okuda</strong> (born 1931), made 1958</p>
        <p className="text-[0.9em]">Stoneware with cobalt-iron glaze<br />H. 21 cm × Diam. 18 cm</p>
        <p className="font-mono text-[0.8em] opacity-70">Accession 1962.14.1 · Gift of the family</p>
        <p className="border-t border-black/20 pt-3 leading-relaxed">Okuda fired this piece in a kiln she built herself. The glaze gathered at the foot and ran in a single line, a defect she kept.</p>
        <div className="border-t border-black/20 pt-3">
          <label className="flex items-center gap-3 text-[0.9em]" htmlFor="mp-code">Audio guide
            <input id="mp-code" inputMode="numeric" maxLength={2} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="14" className="w-16 rounded border border-black/40 bg-white/60 px-2 py-1.5 text-center font-mono" />
          </label>
          <p className="mt-2 min-h-12 text-[0.9em] italic" aria-live="polite">{play ?? (code.length === 2 ? 'No entry with that number.' : 'Enter a number from the label: 14, 15 or 16.')}</p>
        </div>
        <button onClick={() => setBig((b) => !b)} aria-pressed={big} className="min-h-11 rounded border border-black/40 px-4 text-[0.85em] hover:bg-black/5">Large print</button>
      </div>
    </div>
  )
}
