/*
 * One testimonial, set large. A real <figure> with a <blockquote> and a <figcaption> naming who said it and why they are
 * credible, rather than a carousel of five small ones. Specific beats glowing: the quote says what changed. Attribution is
 * in text, and the decorative quotation mark is hidden from assistive technology.
 */

export default function PullQuote() {
  return (
    <figure className="mx-auto max-w-2xl px-2 text-center">
      <span aria-hidden className="block font-display text-7xl leading-none text-accent">&ldquo;</span>
      <blockquote className="-mt-4 text-2xl leading-snug font-medium tracking-tight text-balance sm:text-3xl">
        <p>We cut our support emails in half in the first month. Nobody had to be taught how to use it.</p>
      </blockquote>
      <figcaption className="mt-5 text-sm text-fg-muted">
        <span className="font-semibold text-fg">Ruth Adeyemi</span>, head of operations at Longshore Freight, customer since 2024
      </figcaption>
    </figure>
  )
}
