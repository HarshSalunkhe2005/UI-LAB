/*
 * Reference sites: 30 world-class websites and 20 vibe-coded UIs, each torn down with the method in
 * playbook/inspiration.md. Plain data (no React) so the build can emit /references.md and /references.json.
 *
 * Measured on 2026-10-14 from a 1440x900 browser: computed fonts, colours and CSS-technique counts from the
 * first screen, plus the library scan from tools/site-stack.mjs (a signature scan, so it can false-positive).
 * `evidence` says how much we really saw:
 *   inspected  : rendered in a browser and measured (screenshot and/or computed styles)
 *   partial    : rendered, but the experience is a canvas or needs WebGL2, so only the shell was measured
 *   listing    : read from the vendor's public listing page; the live preview was not opened
 * Techniques are re-implemented in our own code (src/patterns/moves); nothing is copied.
 */

export type RefGroup = 'World-class' | 'Vibe-coded' | 'Recent winners'
export type RefMode = 'Persuade' | 'Operate' | 'Read' | 'Experience'
export type RefEvidence = 'inspected' | 'partial' | 'listing'

export type Ref = {
  id: string
  name: string
  url: string
  group: RefGroup
  mode: RefMode
  /** The one memorable moment, one sentence. */
  idea: string
  /** How it is built, as far as we could tell. */
  technique: string
  /** Measured type and colour. */
  look: string
  /** What we adapt (and which pattern implements it). */
  take: string
  /** What we deliberately leave. */
  leave: string
  evidence: RefEvidence
  tags: string[]
  /** Slugs of the UI Lab patterns that re-implement the technique. */
  moves?: string[]
  /** Vibe-coded only: tool, author and the two popularity counts v0 shows (larger is most likely forks). */
  tool?: string
  author?: string
  counts?: [string, string]
}

export const WORLD: Ref[] = [
  {
    id: 'bruno-simon', name: 'Bruno Simon', url: 'https://bruno-simon.com', group: 'World-class', mode: 'Experience',
    idea: 'A portfolio you drive: a toy car in a 3D world, where every area is a section of the site.',
    technique: 'One full-screen WebGL canvas and no DOM text at load (measured: 1 canvas, empty body). The stack scan found three.js, GSAP and vehicle/respawn .glb models in the bundle.',
    look: 'Not readable from the DOM; the shell uses Inter. The world itself carries the art direction.',
    take: 'Navigation as play: physical controls instead of a menu (move-drive-world, 2D, keyboard).',
    leave: 'A whole site inside a canvas: heavy, inaccessible to screen readers, poor for ordinary content.',
    evidence: 'partial', tags: ['webgl', 'game', 'portfolio', 'physics', 'keyboard'], moves: ['move-drive-world'],
  },
  {
    id: 'active-theory', name: 'Active Theory', url: 'https://activetheory.net', group: 'World-class', mode: 'Experience',
    idea: 'A studio site that behaves like one of its own pieces: an immersive, cursor-reactive WebGL space.',
    technique: 'Custom WebGL. The scan found no public libraries (one bundled script); in our pane the DOM stayed empty (canvas created late), so only the loader was seen.',
    look: 'Custom grotesque (nbarchitekt), black ground.',
    take: 'Particle fields that lean toward the cursor, with depth (move-particle-attractor).',
    leave: 'A custom engine; load times that only a showcase can afford.',
    evidence: 'partial', tags: ['webgl', 'particles', 'cursor', 'immersive'], moves: ['move-particle-attractor'],
  },
  {
    id: 'lusion', name: 'Lusion', url: 'https://lusion.co', group: 'World-class', mode: 'Experience',
    idea: '3D visual storytelling for a studio: a full-screen scene with a menu that stays out of the way.',
    technique: 'three.js on Astro; 3 canvases. Menu items appear twice in the DOM, a common technique for text-slide hovers.',
    look: 'Aeonik 36-38px, black ground, an electric blue (rgb 0,22,236) and white; one mix-blend element.',
    take: 'Playful objects that react to the cursor and to each other (move-physics-balls).',
    leave: 'Brand-specific 3D assets.',
    evidence: 'inspected', tags: ['three.js', 'webgl', 'physics', 'agency'], moves: ['move-physics-balls'],
  },
  {
    id: 'igloo', name: 'Igloo Inc.', url: 'https://igloo.inc', group: 'World-class', mode: 'Experience',
    idea: 'A scroll-driven journey through a 3D ice world; the page is the camera path.',
    technique: 'Pure WebGL2 (our pane showed its own "WebGL2 is not supported" notice, so we could not see the scene). Scan found nothing recognisable: custom or bundled.',
    look: 'IBM Plex Mono for the shell; grey-blue ground (rgb 160,165,177) behind the fallback message.',
    take: 'Scroll as camera: move through depth rather than past sections (move-scroll-tunnel, CSS 3D).',
    leave: 'WebGL2 as a hard requirement with no fallback beyond an apology.',
    evidence: 'partial', tags: ['webgl2', 'scroll', 'camera', 'immersive'], moves: ['move-scroll-tunnel'],
  },
  {
    id: 'immersive-garden', name: 'Immersive Garden', url: 'https://immersive-g.com', group: 'World-class', mode: 'Experience',
    idea: 'Luxury-brand digital experiences: quiet editorial type over restrained WebGL.',
    technique: 'GSAP + ScrollTrigger + SplitText, three.js, Lottie and Lenis; 12 canvases on the home page; .glb relief models fetched from a CDN.',
    look: 'Serif display (PSTimes) at 73 text nodes, light grey ground rgb(232,232,232) with near-black ink.',
    take: 'Image distortion on hover, done with an SVG displacement filter instead of WebGL (move-liquid-hover).',
    leave: 'Twelve canvases; the cost only a flagship can justify.',
    evidence: 'inspected', tags: ['gsap', 'three.js', 'lenis', 'serif', 'luxury'], moves: ['move-liquid-hover'],
  },
  {
    id: 'resn', name: 'Resn', url: 'https://resn.co.nz', group: 'World-class', mode: 'Experience',
    idea: 'A playful studio: the site is a toy before it is a portfolio.',
    technique: 'Raw WebGL (scan), 2 canvases, 130 DOM nodes; the only DOM text on load is "VIEW ALL PROJECTS".',
    look: 'Black ground; almost everything is drawn in the canvas.',
    take: 'Cursor that leaves things behind, in this case glyphs (move-glyph-trail).',
    leave: 'Content inside a canvas.',
    evidence: 'partial', tags: ['webgl', 'cursor', 'playful'], moves: ['move-glyph-trail'],
  },
  {
    id: 'apple-airpods', name: 'Apple: AirPods Pro', url: 'https://www.apple.com/airpods-pro/', group: 'World-class', mode: 'Persuade',
    idea: 'A product page told as a long scroll: each feature is a pinned scene that plays as you scroll.',
    technique: '16 <video> elements, 11 sticky containers, 6 scroll-snap points, 14 backdrop-filters and 73 clip-paths; page is 42,337px tall. Scroll position scrubs media rather than time playing it.',
    look: 'SF Pro Display 600 at 64px for headlines, SF Pro Text for body; white and black sections that swap with the product story.',
    take: 'Scroll-scrubbed frame sequence on a pinned canvas (move-frame-scrub, procedural frames so no assets).',
    leave: 'Hundreds of megabytes of encoded video.',
    evidence: 'inspected', tags: ['scroll', 'pinned', 'video', 'frame sequence', 'product'], moves: ['move-frame-scrub'],
  },
  {
    id: 'stripe', name: 'Stripe', url: 'https://stripe.com', group: 'World-class', mode: 'Persuade',
    idea: 'Financial infrastructure that looks like craft: a living gradient and a live number ("Global GDP running on Stripe: 1.73%").',
    technique: 'Next.js; 2 canvases (the gradient), 73 clip-paths, 2 scroll-snap points and one use of animation-timeline (CSS scroll-driven animation). The headline counter is real text, so it works without JS animation.',
    look: 'sohne-var at weight 300 and 48px (light, large), white ground, one violet (rgb 83,58,253).',
    take: 'An animated mesh gradient behind a light headline (move-mesh-gradient).',
    leave: 'Their proprietary typeface.',
    evidence: 'inspected', tags: ['gradient', 'canvas', 'type', 'fintech'], moves: ['move-mesh-gradient'],
  },
  {
    id: 'linear', name: 'Linear', url: 'https://linear.app', group: 'World-class', mode: 'Persuade',
    idea: 'A dark product page that feels like the product: precise, dense, with isometric line drawings instead of screenshots.',
    technique: 'Next.js with zero canvases or video; 228 inline SVGs and CSS only. The hero text arrives after load (our first frame was blank for several seconds).',
    look: 'Inter Variable at weight 510, page rgb(8,9,10) with ink rgb(247,248,248); a 7,169px page.',
    take: 'Cards whose border glow follows the pointer across the whole grid (move-spotlight-grid).',
    leave: 'The blank-first-frame entrance.',
    evidence: 'inspected', tags: ['dark', 'svg', 'saas', 'precision'], moves: ['move-spotlight-grid'],
  },
  {
    id: 'vercel', name: 'Vercel', url: 'https://vercel.com', group: 'World-class', mode: 'Persuade',
    idea: 'A black page with one glowing prism: nothing else competes with the headline.',
    technique: 'One canvas (most likely the prism and its dithered halo), 2 sticky regions, 9 clip-paths and 4 blend-mode elements.',
    look: 'Geist Sans at weight 400, 64px headline, ground rgb(10,10,10), pill buttons (one filled white, one outlined).',
    take: 'A grid with light beams travelling along its lines (move-grid-beams).',
    leave: 'The prism metaphor, which is theirs.',
    evidence: 'inspected', tags: ['dark', 'canvas', 'grid', 'geist'], moves: ['move-grid-beams'],
  },
  {
    id: 'raycast', name: 'Raycast', url: 'https://raycast.com', group: 'World-class', mode: 'Persuade',
    idea: 'The product is a keyboard launcher, so the page demonstrates keystrokes.',
    technique: 'Next.js with GSAP; 16 backdrop-filters, 14 masks, 24 running animations and a floating pill nav; 15,978px page.',
    look: 'Inter 600 at 64px, near-black rgb(7,8,10) ground with a light rgb(230,230,230) section; GeistMono for key hints.',
    take: 'A command palette that types itself and answers to the arrow keys (move-command-demo).',
    leave: 'Platform-specific copy.',
    evidence: 'inspected', tags: ['keyboard', 'command palette', 'dark', 'gsap'], moves: ['move-command-demo'],
  },
  {
    id: 'framer', name: 'Framer', url: 'https://www.framer.com', group: 'World-class', mode: 'Persuade',
    idea: 'The site is built in the tool it sells, so every section is a flex of the product.',
    technique: 'Framer-hosted; 41 masks, 5 backdrop-filters, 4 videos; headline in GT Walsheim Medium 54px over Inter Variable UI text.',
    look: 'Black and white with translucent white (rgba 255,255,255,0.1) surfaces.',
    take: 'Rows of tilted cards that drift past on a marquee (move-tilt-marquee).',
    leave: 'Template galleries as the whole story.',
    evidence: 'inspected', tags: ['marquee', 'tilt', 'site builder'], moves: ['move-tilt-marquee'],
  },
  {
    id: 'arc', name: 'Arc', url: 'https://arc.net', group: 'World-class', mode: 'Persuade',
    idea: 'A browser for people who like tools: warm, rounded, and unafraid of colour.',
    technique: 'Next.js; 1 video, 9 clip-paths, 6 blend-mode elements; 6,130px page.',
    look: 'Marlin Soft SQ 700 at 45px for the pull quote, Exposure VAR 36px, ABC Oracle for CTAs; ground cream rgb(255,252,236) with a strong blue rgb(49,57,251).',
    take: 'A tab strip whose pill indicator morphs between tabs and picks up each tab\'s colour (move-morph-tabs).',
    leave: 'The product screenshots.',
    evidence: 'inspected', tags: ['colour', 'tabs', 'rounded', 'warm'], moves: ['move-morph-tabs'],
  },
  {
    id: 'teenage-engineering', name: 'teenage engineering', url: 'https://teenage.engineering', group: 'World-class', mode: 'Persuade',
    idea: 'A shop that looks like a spec sheet: black and white photography, tiny lowercase labels and a row of glyph icons as navigation.',
    technique: 'No libraries to speak of; a 2,285px page; every text node uses their own typeface (te-20).',
    look: 'Monochrome. A custom lowercase face; photography does the heavy lifting.',
    take: 'Tactile hardware controls on the web: a rotary knob with detents (move-rotary-knob).',
    leave: 'The dense micro-labelling at sizes below 12px.',
    evidence: 'inspected', tags: ['monochrome', 'hardware', 'brutalist', 'knob'], moves: ['move-rotary-knob'],
  },
  {
    id: 'nothing', name: 'Nothing', url: 'https://nothing.tech', group: 'World-class', mode: 'Persuade',
    idea: 'A brand voice carried entirely by dot-matrix type.',
    technique: 'Custom faces Ndot-Regular, NType82-Regular and LatteraMonoLL; 14 backdrop-filters and 2 scroll-snap points; an 8,734px page.',
    look: 'White and light grey (rgb 238) with black dot-matrix headlines.',
    take: 'Text rendered as a grid of dots that ripple under the pointer (move-dot-matrix).',
    leave: 'Their typefaces.',
    evidence: 'inspected', tags: ['dot matrix', 'type', 'canvas', 'monochrome'], moves: ['move-dot-matrix'],
  },
  {
    id: 'mercury', name: 'Mercury', url: 'https://mercury.com', group: 'World-class', mode: 'Persuade',
    idea: 'Banking made calm: a deep navy page where the numbers are the decoration.',
    technique: 'Next.js with GSAP; 1 canvas, 1 video, 31 clip-paths, 4 sticky regions; 13,001px page.',
    look: 'arcadiaDisplay at weight 480 and 49px, arcadia 360 body, navy rgb(23,23,33) and one periwinkle rgb(82,102,235).',
    take: 'Odometer numbers that roll digit by digit (move-odometer).',
    leave: 'The stock financial imagery.',
    evidence: 'inspected', tags: ['numbers', 'fintech', 'calm', 'navy'], moves: ['move-odometer'],
  },
  {
    id: 'resend', name: 'Resend', url: 'https://resend.com', group: 'World-class', mode: 'Persuade',
    idea: 'A developer product with an editorial voice: a 96px serif headline over code.',
    technique: 'Next.js with GSAP and OGL (WebGL helper); 5 videos, 1 canvas; 12,319px page.',
    look: 'domaine (a serif) at 96px, Inter body, pure black rgb(0,0,0) with a deep blue-black rgb(11,14,20).',
    take: 'A code window that turns into the thing it produces (move-code-to-preview).',
    leave: 'The serif-on-black pairing, which is now becoming a trope.',
    evidence: 'inspected', tags: ['serif', 'code', 'dark', 'developer'], moves: ['move-code-to-preview'],
  },
  {
    id: 'superhuman', name: 'Superhuman', url: 'https://superhuman.com', group: 'World-class', mode: 'Persuade',
    idea: 'Speed is the brand, so the page is built around keyboard shortcuts.',
    technique: 'Next.js (the scan also flagged Framer); 5 videos, 21 running animations, 3 sticky regions; 6,435px page.',
    look: 'A custom variable family, Super Sans VF, at weight 540 and 64px; Super Serif and Super Sans Mono for accents.',
    take: 'An inbox you operate entirely by keyboard (j, k, e) (move-shortcut-inbox).',
    leave: 'Their typefaces.',
    evidence: 'inspected', tags: ['keyboard', 'inbox', 'speed', 'shortcuts'], moves: ['move-shortcut-inbox'],
  },
  {
    id: 'posthog', name: 'PostHog', url: 'https://posthog.com', group: 'World-class', mode: 'Persuade',
    idea: 'The homepage is a desktop: icons down both edges, a draggable window, a wallpaper.',
    technique: 'Plain DOM (0 canvases, 0 video); 115 masks, 37 clip-paths, 26 backdrop-filters, 14 animations.',
    look: 'RoundHog (a custom rounded grotesque) at 36px weight 800; cream-green ground rgb(238,239,233) over a grass wallpaper; a purple tab.',
    take: 'A page that is an OS: windows you can drag, icons that open them (move-desktop-home).',
    leave: 'Nothing: the commitment to one metaphor is the lesson.',
    evidence: 'inspected', tags: ['metaphor', 'desktop', 'playful', 'drag'], moves: ['move-desktop-home'],
  },
  {
    id: 'rive', name: 'Rive', url: 'https://rive.app', group: 'World-class', mode: 'Persuade',
    idea: 'A tool for interactive graphics, shown as a reel of finished interactive UIs down the left edge.',
    technique: '2 canvases (the Rive runtime) and 10 videos; a 5,330px page; the hero is a live install command.',
    look: 'Orbitron 900 at 40px for the headline, Tomorrow for labels, PragmataPro for code; black ground.',
    take: 'Interaction as state machine: a button with idle, hover, press and success states (move-state-button).',
    leave: 'The sci-fi type.',
    evidence: 'inspected', tags: ['state machine', 'interactive', 'dark', 'reel'], moves: ['move-state-button'],
  },
  {
    id: 'rauno', name: 'Rauno Freiberg', url: 'https://rauno.me', group: 'World-class', mode: 'Experience',
    idea: 'A personal site of small, exact interactions, with type at a scale you rarely see (720px headings).',
    technique: 'Next.js; 7 running animations, no canvas. The measured display size is 720px for words like "Craft" and "Projects".',
    look: 'Custom family at 720px; page rgb(237,237,237), pure black ink, one yellow (rgb 255,255,2).',
    take: 'Monumental type clipped by the viewport, used as structure (move-monument-type).',
    leave: 'The need for a designer\'s own typeface.',
    evidence: 'inspected', tags: ['type', 'monumental', 'portfolio', 'craft'], moves: ['move-monument-type'],
  },
  {
    id: 'emil-kowalski', name: 'Emil Kowalski', url: 'https://emilkowal.ski', group: 'World-class', mode: 'Read',
    idea: 'Restraint as craft: one 16px size, near-white paper, and motion kept for where it earns attention.',
    technique: 'Next.js; 0 animations, 0 canvases, a 2,480px page. The depth is in the open-source Sonner toasts and Vaul drawer he ships.',
    look: 'One face (Sans) at 16px, weight 500; paper rgb(253,253,252), black ink.',
    take: 'Spring-physics toast stacks that collapse and expand (move-toast-stack).',
    leave: 'Nothing; this is the reference for "do less".',
    evidence: 'inspected', tags: ['restraint', 'toast', 'spring', 'minimal'], moves: ['move-toast-stack'],
  },
  {
    id: 'josh-comeau', name: 'Josh W. Comeau', url: 'https://www.joshwcomeau.com', group: 'World-class', mode: 'Read',
    idea: 'A blog that teaches with toys: live, draggable demos inside the article, a generative-art header, and a sound toggle.',
    technique: 'Next.js; 1 canvas (the header art), 29 running animations, 13 masks; "Disable sounds" and a light/dark switch are first-class.',
    look: 'Wotfard at 32px 700, dark ground with ink rgb(227,230,232).',
    take: 'An explainer where sliders change a live element and its CSS (move-live-css).',
    leave: 'Sound by default.',
    evidence: 'inspected', tags: ['explorable', 'education', 'canvas', 'sliders'], moves: ['move-live-css'],
  },
  {
    id: 'lenis', name: 'Lenis (Darkroom)', url: 'https://lenis.darkroom.engineering', group: 'World-class', mode: 'Persuade',
    idea: 'The smooth-scroll library\'s own site is a long, buttery showcase of sites that use it.',
    technique: 'Lenis (confirmed: the html element carries the lenis class), GSAP + ScrollTrigger + SplitText; 16 videos; 31,882px page.',
    look: 'Panchang 700 at 52px, Anton and Roboto; black ground, ink rgb(239,239,239).',
    take: 'Eased (lerped) scrolling with a progress rail and live velocity readout (move-scroll-rail).',
    leave: 'Sixteen autoplaying videos.',
    evidence: 'inspected', tags: ['smooth scroll', 'lenis', 'velocity', 'showcase'], moves: ['move-scroll-rail'],
  },
  {
    id: 'basement', name: 'basement.studio', url: 'https://basement.studio', group: 'World-class', mode: 'Persuade',
    idea: 'A studio site that is half machine: a HUMAN/MACHINE switch, a "Press [/] to chat" hint, 3D rooms.',
    technique: 'Next.js with GSAP, three.js, React Three Fiber, WebGL; 3 canvases; .glb office and outdoor scenes; 4 sticky regions.',
    look: 'Geist and Geist Mono at 12-13px, black ground, one signal orange rgb(255,77,0).',
    take: 'Outlined and solid marquee type that swap on hover (move-outline-marquee).',
    leave: 'The three 3D rooms.',
    evidence: 'inspected', tags: ['orange', 'marquee', 'keyboard', 'r3f', 'studio'], moves: ['move-outline-marquee'],
  },
  {
    id: 'cuberto', name: 'Cuberto', url: 'https://cuberto.com', group: 'World-class', mode: 'Persuade',
    idea: 'An agency site built around the cursor: it grows, labels and morphs as you cross things.',
    technique: 'Lenis confirmed, GSAP + ScrollTrigger on Astro/Webflow; 12 videos, 10 blend-mode elements; 13,012px page.',
    look: 'Suisse Intl 500 at 80px, white ground with black type.',
    take: 'A cursor that becomes a labelled pill over cards (move-label-cursor).',
    leave: 'Twelve video loops.',
    evidence: 'inspected', tags: ['cursor', 'lenis', 'agency', 'blend'], moves: ['move-label-cursor'],
  },
  {
    id: 'the-pudding', name: 'The Pudding', url: 'https://pudding.cool', group: 'World-class', mode: 'Read',
    idea: 'Visual essays: the chart is the article, and it changes as you read.',
    technique: 'No framework signature (custom/bundled); 1 sticky region, 0 canvases. The scroll steps drive a sticky graphic.',
    look: 'Atlas Typewriter and Atlas Grotesk for text, Gooper SemiCondensed 700 at 32px for story titles; light grey rgb(239,239,239) with a near-black rgb(25,25,25) section.',
    take: 'Scrollytelling: text steps that update a sticky chart (move-scrollytelling).',
    leave: 'Nothing.',
    evidence: 'inspected', tags: ['scrollytelling', 'data viz', 'editorial'], moves: ['move-scrollytelling'],
  },
  {
    id: 'stripe-press', name: 'Stripe Press', url: 'https://press.stripe.com', group: 'World-class', mode: 'Experience',
    idea: 'The catalogue is a vertical stack of book covers on a dark ground; the stack is the navigation.',
    technique: '2 canvases and 1 video, 27 blend-mode elements, 12 clip-paths; an 8,078px page.',
    look: 'Ivar Headline (a serif) at 16-18px; warm near-black rgb(32,24,25); the covers supply all colour.',
    take: 'A book stack where hovering lifts a cover out of the pile (move-book-stack).',
    leave: 'Book art, which is theirs.',
    evidence: 'inspected', tags: ['books', 'stack', 'serif', 'hover'], moves: ['move-book-stack'],
  },
  {
    id: 'are-na', name: 'Are.na', url: 'https://www.are.na', group: 'World-class', mode: 'Read',
    idea: 'A calm, one-size interface for collecting things: every text is the same size.',
    technique: 'Next.js; 13 canvases (blocks), 12 blend-mode elements.',
    look: 'One font (areal) at one measured size, 19.2px; ground rgb(26,26,26) with lilac rgb(226,223,233) accents.',
    take: 'A block grid you can drag to reorder, with one type size throughout (move-block-grid).',
    leave: 'Thirteen canvases.',
    evidence: 'inspected', tags: ['grid', 'drag', 'one size', 'curation'], moves: ['move-block-grid'],
  },
  {
    id: 'tailwind', name: 'Tailwind CSS', url: 'https://tailwindcss.com', group: 'World-class', mode: 'Read',
    idea: 'A docs site that shows the classes it is styled with: the hero literally reads "text-8xl text-white tracking-tighter".',
    technique: 'Next.js; 3 sticky regions, 10 backdrop-filters; a 10,354px page; ⌘K / Ctrl K search; v4.3 badge in the nav.',
    look: 'Inter at 96px for the headline, IBM Plex Mono (plexMono) for code; colours in oklab/lab, near-black.',
    take: 'A table of contents that follows your scroll position (move-scrollspy).',
    leave: 'Nothing; the live-class hero is a model of "the product is the content".',
    evidence: 'inspected', tags: ['docs', 'scrollspy', 'code', 'search'], moves: ['move-scrollspy'],
  },
]

export const VIBE: Ref[] = [
  {
    id: 'v0-pointer', name: 'Pointer AI landing page', url: 'https://v0.app/templates/XQxxv76lK5w', group: 'Vibe-coded', mode: 'Persuade',
    idea: 'The archetypal v0 landing page: a mint-lit rounded hero panel, a floating nav and a code-editor mock.',
    technique: 'Measured in the live preview: system sans (ui-sans-serif) at 60px/600, 23 backdrop-filters, a 7,802px page, floating pixel squares in the hero. Sections: hero, features, pricing, testimonials, CTA, footer.',
    look: 'Dark page rgb(16,18,20) with a pale mint panel rgb(235,240,238) and a green glow.',
    take: 'The structure is a safe default; the lesson is to push past it (swap test).', leave: 'The default system sans and the generic six-section order.',
    evidence: 'inspected', tags: ['landing', 'saas', 'glass', 'mint'], tool: 'v0', author: 'yadwinder', counts: ['20.7K', '1.9K'],
  },
  {
    id: 'v0-brillance', name: 'Brillance SaaS Landing Page', url: 'https://v0.app/templates/zdiN8dHwaaT', group: 'Vibe-coded', mode: 'Persuade',
    idea: 'A clean SaaS page that flows hero, features, pricing and FAQ, designed to read as trustworthy.',
    technique: 'Per the template description: bold headline with sub-text and a single clear call to action, then feature, pricing and FAQ blocks.',
    look: 'Not measured (the preview needed a v0 sign-in in our session).',
    take: 'A trust-first order for a product with no brand yet.', leave: 'Interchangeable sections.',
    evidence: 'listing', tags: ['landing', 'saas', 'pricing', 'faq'], tool: 'v0', counts: ['14.7K', '2.1K'],
  },
  {
    id: 'v0-marketing', name: 'Marketing Website', url: 'https://v0.app/templates/sV0OtrkXM6x', group: 'Vibe-coded', mode: 'Persuade',
    idea: 'A fully customisable marketing site whose copy comes from a headless CMS (BaseHub), so editors change it without code.',
    technique: 'Content powered by BaseHub; Next.js. The lesson is the CMS seam, not the look.',
    look: 'Not measured.', take: 'Keep content in a CMS and keep the layout dumb.', leave: 'Nothing; a good architecture pattern.',
    evidence: 'listing', tags: ['cms', 'basehub', 'marketing'], tool: 'v0', author: 'basehub-v0', counts: ['11.2K', '537'],
  },
  {
    id: 'v0-monky', name: 'Dashboard – M.O.N.K.Y', url: 'https://v0.app/templates/b7GDYVxuoGC', group: 'Vibe-coded', mode: 'Operate',
    idea: 'An internal-tool dashboard with attitude: integrated chat, multi-view layout and a collapsible sidebar and top bar, dark by default.',
    technique: 'Per the listing: a custom design system, collapsible sidebar and top bar, multi-view layout, integrated chat.',
    look: 'Not measured.', take: 'A collapsible app shell (move-v0-dashboard-shell).', leave: 'Decoration that gets in the way of density.',
    evidence: 'listing', tags: ['dashboard', 'sidebar', 'dark', 'chat'], moves: ['move-v0-dashboard-shell'], tool: 'v0', author: 'joyco', counts: ['11.1K', '1.2K'],
  },
  {
    id: 'v0-dynamicframe', name: 'DynamicFrameLayout', url: 'https://v0.app/templates/v1tIli3svjV', group: 'Vibe-coded', mode: 'Experience',
    idea: 'A grid of frames that resize against each other as you point at them (listing description: "update control").',
    technique: 'Not documented on the page; the behaviour is a flexible-basis grid where the hovered frame takes more space.',
    look: 'Not measured.', take: 'Frames that trade space on hover (move-v0-frame-grid).', leave: 'Layout shift for readers who cannot hover.',
    evidence: 'listing', tags: ['layout', 'grid', 'hover', 'flex'], moves: ['move-v0-frame-grid'], tool: 'v0', author: 'oeneco', counts: ['7.6K', '151'],
  },
  {
    id: 'v0-imagegen', name: 'Image Generation Playground', url: 'https://v0.app/templates/hkRpZoLOrJC', group: 'Vibe-coded', mode: 'Operate',
    idea: 'An app for combining uploaded images with prompts: drag-and-drop uploads, generation history, error handling and keyboard shortcuts.',
    technique: 'Built on AI Gateway with an API key in the environment; the interface features are the lesson.',
    look: 'Not measured.', take: 'History plus keyboard shortcuts as the baseline for any generative tool.', leave: 'Nothing.',
    evidence: 'listing', tags: ['ai', 'upload', 'history', 'shortcuts'], tool: 'v0', author: 'estebansuarez', counts: ['6.7K', '745'],
  },
  {
    id: 'v0-waitlist', name: 'Waitlist', url: 'https://v0.app/templates/VGs1Sc5BbGi', group: 'Vibe-coded', mode: 'Persuade',
    idea: 'A waitlist page that collects early-adopter emails and sends newsletters through BaseHub.',
    technique: 'Next.js, BaseHub and Tailwind; customisable form; one-click Vercel deploy.',
    look: 'Not measured.', take: 'A form with honest validation and success states (move-v0-email-capture).', leave: 'Nothing.',
    evidence: 'listing', tags: ['waitlist', 'form', 'email'], moves: ['move-v0-email-capture'], tool: 'v0', author: 'basehub-v0', counts: ['5.8K', '286'],
  },
  {
    id: 'v0-katachi', name: 'KATACHI', url: 'https://v0.app/templates/6rnQUvOhgnB', group: 'Vibe-coded', mode: 'Persuade',
    idea: 'A handcrafted-furniture landing page that leans on parallax, gradient blur and big typography.',
    technique: 'Tags on the listing: parallax, gradient blur, typography.',
    look: 'Not measured.', take: 'A progressive-blur edge over scrolling content (move-v0-blur-edge).', leave: 'Parallax for its own sake.',
    evidence: 'listing', tags: ['parallax', 'gradient blur', 'furniture', 'type'], moves: ['move-v0-blur-edge'], tool: 'v0', author: 'kerroudj', counts: ['3.7K', '840'],
  },
  {
    id: 'v0-unusual-hero', name: 'An unusual hero', url: 'https://v0.app/templates/VZ9EEGUUq9M', group: 'Vibe-coded', mode: 'Experience',
    idea: 'A hero that uses SVG masking to blend motion and media ("SVG Mask Hero, Modern UI Concept").',
    technique: 'SVG mask; the preview loaded black in our pane, so we rely on the author\'s description.',
    look: 'Not measured.', take: 'Type as a window onto moving colour (move-v0-mask-hero).', leave: 'Low-contrast text over motion.',
    evidence: 'listing', tags: ['svg mask', 'hero', 'type', 'motion'], moves: ['move-v0-mask-hero'], tool: 'v0', author: 'webrenew', counts: ['3.2K', '465'],
  },
  {
    id: 'v0-newsletter', name: 'Newsletter Template', url: 'https://v0.app/templates/xU39T0XywpR', group: 'Vibe-coded', mode: 'Persuade',
    idea: 'A production-ready email capture with validation, polished error states and smooth animation, stored in Upstash Redis.',
    technique: 'Upstash Redis for storage; validation and error states are the quality bar.',
    look: 'Not measured.', take: 'The same form pattern as the waitlist: every state designed.', leave: 'Nothing.',
    evidence: 'listing', tags: ['newsletter', 'form', 'redis'], moves: ['move-v0-email-capture'], tool: 'v0', author: 'joyco', counts: ['3.1K', '771'],
  },
  {
    id: 'v0-shopify', name: 'Shopify Ecommerce Template', url: 'https://v0.app/templates/XmzC9oi7g4m', group: 'Vibe-coded', mode: 'Persuade',
    idea: 'A minimal, fast storefront on Shopify with live product data, a cart and checkout.',
    technique: 'Shopify storefront data; tags: ecommerce, minimal, furniture.',
    look: 'Not measured.', take: 'Speed and restraint as the commerce aesthetic.', leave: 'Nothing.',
    evidence: 'listing', tags: ['ecommerce', 'shopify', 'minimal'], tool: 'v0', author: 'joyco', counts: ['2.8K', '529'],
  },
  {
    id: 'v0-habbo', name: 'Habbo Hotel like Multiplayer Chatroom', url: 'https://v0.app/templates/EYN85i0FdYV', group: 'Vibe-coded', mode: 'Experience',
    idea: 'A multiplayer social room in the style of Habbo Hotel: avatars walk isometric rooms, chat, dance and wave.',
    technique: 'HTML5 canvas isometric rendering, pathfinding on a grid, React and TypeScript hooks (per the description).',
    look: 'Not measured.', take: 'Click-to-walk on an isometric grid with pathfinding (move-v0-isometric-room).', leave: 'The multiplayer back end.',
    evidence: 'listing', tags: ['isometric', 'canvas', 'pathfinding', 'game'], moves: ['move-v0-isometric-room'], tool: 'v0', author: 'ingokoepp', counts: ['2.6K', '428'],
  },
  {
    id: 'v0-globe-map', name: 'Globe To Map Transform', url: 'https://v0.app/templates/99MAOQptgL3', group: 'Vibe-coded', mode: 'Experience',
    idea: 'A wireframe globe that unrolls into a flat map.',
    technique: 'Tags: globe, map, 3d, 2d, wireframe, transform, d3js, dataviz (no description on the page).',
    look: 'Not measured.', take: 'Interpolating between two map projections on a canvas (move-v0-globe-to-map, no D3).', leave: 'Nothing.',
    evidence: 'listing', tags: ['globe', 'map', 'projection', 'dataviz'], moves: ['move-v0-globe-to-map'], tool: 'v0', author: 'jshguo', counts: ['2.4K', '689'],
  },
  {
    id: 'v0-auralink', name: 'Auralink SaaS Landing Page', url: 'https://v0.app/templates/zoQPxUaTqvE', group: 'Vibe-coded', mode: 'Persuade',
    idea: '"A modern SaaS landing page for an AI communication platform, clean, minimal and human-focused."',
    technique: 'Not documented; tags: saas, ai, landing-page, modern.',
    look: 'Not measured.', take: 'Nothing beyond the default order.', leave: 'The default.',
    evidence: 'listing', tags: ['landing', 'saas', 'ai'], tool: 'v0', author: 'mikeyi2a', counts: ['2.4K', '491'],
  },
  {
    id: 'v0-mindspace', name: 'MindSpace SaaS Landing Page', url: 'https://v0.app/templates/8QhCJAwn16K', group: 'Vibe-coded', mode: 'Persuade',
    idea: 'A responsive SaaS page built with shadcn/ui: hero, carousel, footer, an orange accent.',
    technique: 'shadcn/ui components, carousel and hero section (from tags).',
    look: 'Not measured; tagged orange.', take: 'shadcn/ui as a quick, accessible base.', leave: 'The stock carousel.',
    evidence: 'listing', tags: ['shadcn', 'landing', 'carousel', 'orange'], tool: 'v0', author: 'matsu', counts: ['2.1K', '325'],
  },
  {
    id: 'v0-paperfolio', name: 'Paperfolio', url: 'https://v0.app/templates/dDPFIVqPGXR', group: 'Vibe-coded', mode: 'Experience',
    idea: 'A minimal but bold portfolio: large typography, simple layouts, strong hierarchy.',
    technique: 'Described as large type and simple layouts; no libraries named.',
    look: 'Not measured.', take: 'Type scale as the whole design.', leave: 'Nothing.',
    evidence: 'listing', tags: ['portfolio', 'type', 'minimal'], tool: 'v0', author: 'nikhilsbuilds', counts: ['2.1K', '552'],
  },
  {
    id: 'v0-portfolio', name: 'Portfolio Template', url: 'https://v0.app/templates/mA8N4h1POSv', group: 'Vibe-coded', mode: 'Experience',
    idea: 'A bold portfolio that puts the work first and aims to feel intentional, fast and clean.',
    technique: 'No libraries or techniques named; tags: portfolio, creative, showcase.',
    look: 'Not measured.', take: 'Work-first layouts.', leave: 'Nothing.',
    evidence: 'listing', tags: ['portfolio', 'showcase'], tool: 'v0', author: 'joyco', counts: ['1.8K', '372'],
  },
  {
    id: 'v0-finbro', name: 'FINBRO Dashboard', url: 'https://v0.app/templates/shuOX59VNOv', group: 'Vibe-coded', mode: 'Operate',
    idea: 'A dark trading dashboard for finance and crypto.',
    technique: 'Tags: dashboard, darkmode, fintech, finance, crypto.',
    look: 'Not measured.', take: 'Dense numeric layouts on dark.', leave: 'Neon for neon\'s sake.',
    evidence: 'listing', tags: ['dashboard', 'fintech', 'dark'], tool: 'v0', author: 'webrenew', counts: ['1.1K', '262'],
  },
  {
    id: 'v0-icon', name: 'v0 icon (particles)', url: 'https://v0.app/templates/qK8iWfx4VMX', group: 'Vibe-coded', mode: 'Experience',
    idea: 'An interactive particle animation of the v0 icon.',
    technique: 'Tags: glsl, v0, three, particles.',
    look: 'Not measured.', take: 'Particles that form a shape and scatter from the pointer (move-v0-particle-logo, 2D canvas).', leave: 'GLSL for something a canvas can do.',
    evidence: 'listing', tags: ['particles', 'glsl', 'logo'], moves: ['move-v0-particle-logo'], tool: 'v0', author: 'yoheinishitsuji', counts: ['1.1K', '226'],
  },
  {
    id: 'v0-parallax-footer', name: 'Simple Parallax Sticky Footer Landing', url: 'https://v0.app/templates/wWvJxkk3ra7', group: 'Vibe-coded', mode: 'Persuade',
    idea: 'A landing page whose footer is revealed from underneath as the content slides away.',
    technique: 'Title only on the listing; the technique is a sticky footer with the content layered above it.',
    look: 'Not measured.', take: 'A footer revealed under the page (move-v0-sticky-footer).', leave: 'Nothing.',
    evidence: 'listing', tags: ['parallax', 'sticky', 'footer'], moves: ['move-v0-sticky-footer'], tool: 'v0', counts: ['1.1K', '261'],
  },
]

/** Recent Awwwards Sites of the Day, inspected live on 2026-10-14. Evidence is what a screenshot and the DOM showed. */
export const RECENT: Ref[] = [
  {
    id: 'neutomni', name: 'Neutomni', url: 'https://neutomni.com', group: 'Recent winners', mode: 'Persuade',
    idea: 'A Webflow studio whose poster-sized wordmark is a sheet you cut open: a dashed "cut along line" runs through the hero and scrolling slits it.',
    technique: 'Measured: 1 canvas, 1 video, 7 sticky elements, Lenis smooth scroll, 13 clip-path elements, a 18.8k px page. The halves and the band that opens read as clipped layers moved on scroll.',
    look: 'One flat red (rgb 207 24 48), white, near-black blocks. Custom geometric wordmark; body in a local serif; mono labels (Fira Code).',
    take: 'Tear the cover, not the content: two clipped halves of one hero move apart (move-perforated-reveal).',
    leave: 'A cookie wall that covers the first screen; the red hero is a single idea held to the limit, so it needs equal courage elsewhere.',
    evidence: 'inspected', tags: ['hero', 'clip-path', 'scroll', 'webflow', 'wordmark'], moves: ['move-perforated-reveal'],
  },
  {
    id: 'heron-ai', name: 'Heron AI', url: 'https://heronaiapp.com', group: 'Recent winners', mode: 'Persuade',
    idea: 'An AI tool for architects presented as a drafting sheet: a pencil elevation, hairline red rules and tiny registration marks.',
    technique: 'Screenshots only (no DOM probe): thin horizontal rules that shift between scroll positions, a raster pencil illustration centred on paper, a monospaced red "CONTACT US" top right.',
    look: 'Warm off-white paper, graphite, one vermilion for rules and markers. Monospace labels.',
    take: 'The page as an instrument: construction lines that close in while a drawing completes (move-drafting-rules, drawn in SVG rather than raster).',
    leave: 'A raster illustration as the whole hero; text was almost absent on first view.',
    evidence: 'partial', tags: ['drafting', 'blueprint', 'paper', 'rules', 'illustration'], moves: ['move-drafting-rules'],
  },
  {
    id: 'twks', name: 'twks', url: 'https://twks.ch/en', group: 'Recent winners', mode: 'Persuade',
    idea: 'A Geneva agency whose header text stays legible over everything by inverting against what is behind it.',
    technique: 'A fixed header whose type visibly inverts over the hero video and then over white sections (a blend-mode difference effect, seen in screenshots). Editorial sections use a hairline rule, a small label and a two-column paragraph beside link rows with arrows.',
    look: 'Large grotesque headlines (tight leading), black and white with the hero video supplying colour.',
    take: 'A header that is always readable with no per-section logic (move-difference-nav) and the rule-label-paragraph row.',
    leave: 'Over mid-grey backgrounds an inverted header loses contrast; the demo says so.',
    evidence: 'partial', tags: ['header', 'blend-mode', 'editorial', 'agency'], moves: ['move-difference-nav'],
  },
  {
    id: 'butter-video', name: 'Butter', url: 'https://www.butter.video', group: 'Recent winners', mode: 'Persuade',
    idea: 'A video-editor landing page whose opening statement comes into focus word by word while app-icon stickers drift across it.',
    technique: 'The statement is blurred and faded at first and sharpens as you scroll; rounded icon chips travel over it. Seen in two screenshots; implementation not inspected.',
    look: 'Light grey to white gradient, near-black UI chips, vivid tile colours, a script wordmark.',
    take: 'Focus-pull on a sentence, driven by one progress number (move-focus-words).',
    leave: 'The hero was a blank gradient for several seconds on first load.',
    evidence: 'partial', tags: ['text', 'blur', 'scroll', 'saas', 'stickers'], moves: ['move-focus-words'],
  },
  {
    id: 'pensatori-irrazionali', name: 'Pensatori Irrazionali', url: 'https://pensatori-irrazionali.com', group: 'Recent winners', mode: 'Experience',
    idea: 'A studio presented as system documentation: numbered modules with IDs on the left, a column of ACTIVE status lights on the right, a turning globe between.',
    technique: 'Seen in two screenshots: dense monospace labels, module rows that dim and brighten as you scroll, status lines whose lights turn on in sequence, a monochrome globe centred. DOM not probed.',
    look: 'Near-black ground, off-white and grey monospace, a single green status colour.',
    take: 'Navigation as an instrument panel: the active module and its lights are one piece of state (move-status-modules).',
    leave: 'Very small grey type on black; legibility is the price of the look.',
    evidence: 'partial', tags: ['monospace', 'status', 'documentation', 'globe', 'studio'], moves: ['move-status-modules'],
  },
  {
    id: 'gil-huybrecht', name: 'Gil Huybrecht', url: 'https://gilhuybrecht.com', group: 'Recent winners', mode: 'Experience',
    idea: 'A designer portfolio whose project thumbnails lie scattered on a black table; a toggle at the bottom switches the layout.',
    technique: 'Seen in screenshots: a loading percentage, then project tiles with index numbers placed freely, a Grid/Gallery switch and a Normal/perspective switch bottom corners; awards listed as plain text top centre.',
    look: 'Pure black, white small text, project imagery supplying all colour.',
    take: 'Two layouts for one list, switched by transforms only (move-scatter-grid).',
    leave: 'Tiny text and no visible hierarchy on first view; keep the list real in the DOM.',
    evidence: 'partial', tags: ['portfolio', 'gallery', 'layout toggle', 'grid'], moves: ['move-scatter-grid'],
  },
  {
    id: 'edolus', name: 'EDOLUS', url: 'https://edolus.com', group: 'Recent winners', mode: 'Experience',
    idea: 'The preloader is the first brand moment: a tiny counter in the dark, then a wide-set wordmark with the percentage beneath it.',
    technique: 'Seen in two screenshots (the counter at 7% in the dark, the wordmark with 81% beneath it). Implementation not inspected.',
    look: 'Black, white, a wide-tracked geometric wordmark with a custom O.',
    take: 'A counter that hands over to the wordmark, letters rising in order (move-counter-wordmark).',
    leave: 'Making visitors wait to see the brand; the demo can be replayed and is instant under reduced motion.',
    evidence: 'partial', tags: ['preloader', 'wordmark', 'counter', 'brand'], moves: ['move-counter-wordmark'],
  },
  {
    id: 'noho', name: 'Noho', url: 'https://noho.ink', group: 'Recent winners', mode: 'Persuade',
    idea: 'A New Zealand furniture maker states its material story in one sentence with small picture chips set inside it.',
    technique: 'Seen in screenshots: a split first screen (headline left, a loose grid of colour-blocked product photographs right), then a centred statement whose lines rise through masks and carry inline image chips between the words.',
    look: 'Warm off-white, a clean grotesque at tight leading, flat colour-blocked photography (lilac, mustard, olive, terracotta).',
    take: 'Pictures that live inside the sentence at the size of a letter, revealed word by word (move-inline-chips).',
    leave: 'Chips are decorative, so the sentence must make sense without them.',
    evidence: 'partial', tags: ['typography', 'inline images', 'reveal', 'furniture', 'text'], moves: ['move-inline-chips'],
  },
  {
    id: 'lxl-creative', name: 'LxL Creative', url: 'https://www.lxlcreative.co.uk', group: 'Recent winners', mode: 'Persuade',
    idea: 'A production studio whose headline mixes a heavy grotesque with one word in orange handwriting.',
    technique: 'Seen in screenshots: dark brown ground, a tall portrait on the left, a looping script mark and a very large lowercase wordmark overlapping the photograph, a headline set in bold caps with one script word tilted between the lines.',
    look: 'Chocolate-brown ground, cream type, one orange for the script and the logo.',
    take: 'One accent word per headline, in script, tilted and overlapping (move-script-accent).',
    leave: 'Two accents in one headline would undo it. Keep the script word short.',
    evidence: 'partial', tags: ['typography', 'script', 'accent', 'headline', 'production'], moves: ['move-script-accent'],
  },
  {
    id: 'aspen-search', name: 'Aspen Search', url: 'https://www.aspensearch.com', group: 'Recent winners', mode: 'Persuade',
    idea: 'An executive-search firm for quantitative finance presented as a poster: halftone imagery and huge type in flat panels.',
    technique: 'Seen in screenshots: a preloader with a faint mark, then a 2x2 split screen of black and grey panels, halftone-dotted leaf shapes, "Placing winners." and "Search" in very large tight grotesque; a sticky top bar with a light/dark switch.',
    look: 'Black, two greys, white; dotted halftone as the only imagery; a neutral grotesque.',
    take: 'Halftone made in CSS from a tone gradient and a dot grid, reacting to the pointer (move-halftone-split).',
    leave: 'Strong contrast filters can band on some screens; the demo is decorative and the words carry the message.',
    evidence: 'partial', tags: ['halftone', 'split screen', 'poster', 'finance', 'css'], moves: ['move-halftone-split'],
  },
  {
    id: 'boc-studio', name: 'Boc.Studio', url: 'https://boc.studio', group: 'Recent winners', mode: 'Experience',
    idea: 'A Barcelona brand studio: one flat orange band across a glassy 3D shape carries the logo and a line of facts on repeat.',
    technique: 'Seen in screenshots: a rendered green-glass form behind a full-width orange strip; the strip repeats the wordmark, "Creative brand studio" and coordinates and moved between screenshots as the page scrolled. A cookie notice sits bottom right.',
    look: 'Soft grey-blue ground, pale green glass, one hot orange (#ff4a1c range), white type in a clean grotesque.',
    take: 'A single band whose speed and direction follow scroll velocity (move-band-ticker).',
    leave: 'The facts live only in a moving strip, so keep a static copy for readers.',
    evidence: 'partial', tags: ['marquee', 'band', 'scroll velocity', '3d', 'brand studio'], moves: ['move-band-ticker'],
  },
  {
    id: 'leo-parpeix', name: 'Leo Parpeix', url: 'https://www.leoparpeix.com', group: 'Recent winners', mode: 'Experience',
    idea: 'A portfolio with a toy in it: a bee that flies around the page and eats what you click.',
    technique: 'Seen in screenshots: a white-washed 3D room as an intro, then a centred bio, a very large "FRENCH" word cut by the next section, a small bee with the caption "Click to feed the bee".',
    look: 'White, deep green display type, a yellow accent from the bee, small centred body copy.',
    take: 'A creature that follows the pointer with lag and can be fed, as a harmless extra (move-feed-the-bee).',
    leave: 'Anything decorative must never block the work; the demo has a button and a reduced-motion mode.',
    evidence: 'partial', tags: ['playful', 'cursor', 'creature', 'portfolio', 'easter egg'], moves: ['move-feed-the-bee'],
  },
]

export const REFERENCES: Ref[] = [...WORLD, ...VIBE, ...RECENT]
export const REF_NOTES = {
  measuredOn: '2026-10-14',
  excluded: [
    { name: 'Locomotive', url: 'https://locomotive.ca', why: 'Behind a bot-verification page; we do not bypass those, so it could not be inspected.' },
    { name: 'Aesop', url: 'https://www.aesop.com', why: 'Same: a security challenge blocked inspection.' },
  ],
  vibeMethod:
    'There is no neutral ranking of "best vibe-coded sites". We took v0\'s own featured templates (its curated gallery), ranked by the larger of the two counts each card shows (most likely forks, with likes second), and kept the top 20. Provenance is certain (every one was made in v0), and the ranking is a popularity signal, not a design award. Other galleries to browse: Lovable Launched, madewithlovable.com, vibecodingshowcase.com.',
}
