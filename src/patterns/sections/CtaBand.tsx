/*
 * A closing call to action: one sentence, one button, one line of reassurance. The band is a region with its own heading,
 * the button is a real link (it goes somewhere) with a name that says where, and the reassurance sits next to the button
 * so a hesitating reader finds it. High contrast is built into the colours, so it holds in light and dark.
 */

export default function CtaBand() {
  return (
    <section aria-labelledby="cta-h" className="rounded-2xl bg-fg px-6 py-10 text-bg sm:px-12 sm:py-14">
      <div className="mx-auto max-w-xl text-center">
        <h3 id="cta-h" className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to see your site, finished?</h3>
        <p className="mt-3 text-base opacity-90">Book a thirty-minute call. We will tell you what we would build, what it would cost and how long it would take, whether or not we work together.</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#cta" onClick={(e) => e.preventDefault()} className="grid min-h-12 place-items-center rounded-md bg-bg px-6 text-sm font-semibold text-fg underline-offset-4 hover:underline">Book a call</a>
          <p className="text-sm opacity-90">Free. No obligation. Reply within one working day.</p>
        </div>
      </div>
    </section>
  )
}
