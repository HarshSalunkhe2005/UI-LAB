/*
 * Signature move (Rauno Freiberg): type at architectural scale. A single word is set so large that the
 * viewport clips it; small, calm text sits against it for contrast. The size is a function of the container
 * width (cqw units), so it scales with the layout, not the screen, and the word is real, selectable text.
 * No JavaScript. Reduced motion: nothing animates.
 */

export default function MonumentType() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-fg text-bg" style={{ containerType: 'inline-size' }}>
      <section className="relative h-[22rem]">
        <h2 className="absolute -bottom-[0.18em] -left-[0.04em] font-sans leading-none font-bold tracking-tighter select-text" style={{ fontSize: '62cqw' }}>
          Craft
        </h2>
        <div className="absolute top-6 right-6 left-6 flex justify-between text-sm">
          <p className="max-w-[16rem] opacity-80">Details that make a thing feel finished, one interaction at a time.</p>
          <p className="font-mono text-xs opacity-70">01 / 04</p>
        </div>
      </section>
    </div>
  )
}
