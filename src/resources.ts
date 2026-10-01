/*
 * Curated external resources: inspiration galleries, award-level studios,
 * open-source demo repos, component libraries, awesome lists and tools.
 * Plain data (no React) so the build can emit /resources.md for AI agents.
 * Star counts are approximate, from the GitHub API on 2026-09-30.
 */

export const RESOURCE_KINDS = [
  'Inspiration galleries',
  'Award-level studios',
  'Open-source demo repos',
  'Component libraries',
  'Motion & 3D libraries',
  'Awesome lists',
  'Shaders & WebGL',
  'Agent design skills',
  'Tools',
] as const

export type ResourceKind = (typeof RESOURCE_KINDS)[number]
export type Resource = { name: string; url: string; kind: ResourceKind; note: string; tags?: string[] }

export const RESOURCES: Resource[] = [
  // Inspiration galleries
  { name: 'Awwwards: 3D websites', url: 'https://www.awwwards.com/websites/3d/', kind: 'Inspiration galleries', note: 'Award-winning 3D/WebGL sites, filterable.', tags: ['3d', 'webgl'] },
  { name: 'Awwwards: Animation', url: 'https://www.awwwards.com/websites/animation/', kind: 'Inspiration galleries', note: 'Motion-heavy site of the day winners.', tags: ['motion'] },
  { name: 'Awwwards: Immersive', url: 'https://www.awwwards.com/inspiration_search/immersive/', kind: 'Inspiration galleries', note: 'Immersive nominees stream.', tags: ['immersive'] },
  { name: 'Godly', url: 'https://godly.website/', kind: 'Inspiration galleries', note: 'Video previews of boundary-pushing interaction and animation.', tags: ['motion', 'landing'] },
  { name: 'Codrops Creative Hub', url: 'https://tympanus.net/codrops/hub/', kind: 'Inspiration galleries', note: 'Open-source web demos and experiments, each with a tutorial.', tags: ['demos', 'open source'] },
  { name: 'Mobbin', url: 'https://mobbin.com/', kind: 'Inspiration galleries', note: 'Real app screens and flows, searchable by pattern.', tags: ['app ui', 'mobile'] },
  { name: 'Refero Styles', url: 'https://styles.refero.design/', kind: 'Inspiration galleries', note: 'Design styles and references by component.', tags: ['app ui'] },
  { name: 'SiteInspire', url: 'https://www.siteinspire.com/', kind: 'Inspiration galleries', note: 'Curated web design, filter by style/type.', tags: ['web'] },
  { name: 'Httpster', url: 'https://httpster.net/', kind: 'Inspiration galleries', note: 'Clean, modern web design showcase.', tags: ['web'] },
  { name: 'Lapa Ninja', url: 'https://www.lapa.ninja/', kind: 'Inspiration galleries', note: 'Landing page gallery by category.', tags: ['landing'] },
  { name: 'Minimal Gallery', url: 'https://minimal.gallery/', kind: 'Inspiration galleries', note: 'Minimalist websites.', tags: ['minimal'] },
  { name: 'Land-book', url: 'https://land-book.com/', kind: 'Inspiration galleries', note: 'Landing pages, portfolios and blogs.', tags: ['landing'] },
  { name: 'One Page Love', url: 'https://onepagelove.com/', kind: 'Inspiration galleries', note: 'Single-page sites and templates.', tags: ['landing'] },
  { name: 'Scrolltide', url: 'https://www.scrolltide.co/', kind: 'Inspiration galleries', note: 'Cinematic scroll templates, components, shaders (paid). Teardown in RESOURCES.md.', tags: ['scroll', 'shaders', 'paid'] },
  { name: 'Dark Mode Design', url: 'https://www.darkmodedesign.com/', kind: 'Inspiration galleries', note: 'Dark-themed websites only.', tags: ['dark'] },

  // Studios
  { name: 'Lusion', url: 'https://lusion.co/', kind: 'Award-level studios', note: 'WebGL/3D studio; realtime scenes, physics, fluid cursors.', tags: ['webgl', '3d'] },
  { name: 'Locomotive', url: 'https://locomotive.ca/', kind: 'Award-level studios', note: 'Makers of Locomotive Scroll; editorial motion.', tags: ['scroll', 'smooth scroll'] },
  { name: 'Immersive Garden', url: 'https://immersive-g.com/', kind: 'Award-level studios', note: 'Luxury immersive 3D (Cartier etc.).', tags: ['3d', 'luxury'] },
  { name: 'makemepulse', url: 'https://makemepulse.com/', kind: 'Award-level studios', note: 'Playful WebGL campaigns.', tags: ['webgl'] },
  { name: 'Active Theory', url: 'https://activetheory.net/', kind: 'Award-level studios', note: 'Realtime 3D experiences and events.', tags: ['webgl', '3d'] },
  { name: 'Cuberto', url: 'https://cuberto.com/', kind: 'Award-level studios', note: 'Cursor effects, magnetic UI, open-sourced scroll demos.', tags: ['cursor', 'motion'] },
  { name: 'Alche', url: 'https://alche.studio/', kind: 'Award-level studios', note: 'Blueprint intros, text scramble, sound opt-in. Teardown in RESOURCES.md.', tags: ['intro', 'webgl'] },
  { name: 'Bruno Simon', url: 'https://bruno-simon.com/', kind: 'Award-level studios', note: 'Drivable 3D portfolio; Three.js Journey author.', tags: ['three.js', 'portfolio'] },
  { name: 'Resn', url: 'https://resn.co.nz/', kind: 'Award-level studios', note: 'Experimental interactive campaigns.', tags: ['experimental'] },
  { name: 'Studio Freight', url: 'https://www.studiofreight.com/', kind: 'Award-level studios', note: 'Makers of Lenis smooth scroll.', tags: ['smooth scroll'] },

  // Open-source demo repos
  { name: 'codrops (GitHub org)', url: 'https://github.com/codrops', kind: 'Open-source demo repos', note: '344 repos of effects, each with a tutorial.', tags: ['demos'] },
  { name: 'codrops/PageTransitions', url: 'https://github.com/codrops/PageTransitions', kind: 'Open-source demo repos', note: '~2.3k★ page transition collection (CSS).', tags: ['page transition'] },
  { name: 'codrops/HoverEffectIdeas', url: 'https://github.com/codrops/HoverEffectIdeas', kind: 'Open-source demo repos', note: '~1.6k★ subtle image hover effects.', tags: ['hover'] },
  { name: 'codrops/RainEffect', url: 'https://github.com/codrops/RainEffect', kind: 'Open-source demo repos', note: '~1.8k★ WebGL rain on glass.', tags: ['webgl'] },
  { name: 'codrops/TextInputEffects', url: 'https://github.com/codrops/TextInputEffects', kind: 'Open-source demo repos', note: 'Input focus/label effects.', tags: ['forms'] },
  { name: 'codrops/ParticleEffectsButtons', url: 'https://github.com/codrops/ParticleEffectsButtons', kind: 'Open-source demo repos', note: 'Particle burst buttons library.', tags: ['buttons', 'particles'] },
  { name: 'codrops/CSSGlitchEffect', url: 'https://github.com/codrops/CSSGlitchEffect', kind: 'Open-source demo repos', note: 'clip-path glitch.', tags: ['glitch'] },
  { name: 'codrops/OnScrollTypographyAnimations', url: 'https://github.com/codrops/OnScrollTypographyAnimations', kind: 'Open-source demo repos', note: 'GSAP scroll typography ideas.', tags: ['scroll', 'typography'] },
  { name: 'codrops/ScrollBlurTypography', url: 'https://github.com/codrops/ScrollBlurTypography', kind: 'Open-source demo repos', note: 'Blurry text reveal on scroll.', tags: ['scroll', 'typography'] },
  { name: 'codrops/Scroll3DGrid', url: 'https://github.com/codrops/Scroll3DGrid', kind: 'Open-source demo repos', note: 'Perspective image grids on scroll.', tags: ['3d', 'scroll'] },
  { name: 'codrops/PixelTransition', url: 'https://github.com/codrops/PixelTransition', kind: 'Open-source demo repos', note: 'Pixel page transitions.', tags: ['page transition'] },
  { name: 'codrops/LiquidDistortion', url: 'https://github.com/codrops/LiquidDistortion', kind: 'Open-source demo repos', note: 'PixiJS liquid slideshow.', tags: ['webgl', 'slideshow'] },
  { name: 'codrops/ElasticGridScroll', url: 'https://github.com/codrops/ElasticGridScroll', kind: 'Open-source demo repos', note: 'Columns with different scroll lag.', tags: ['scroll', 'grid'] },
  { name: 'codrops/3DCarousel', url: 'https://github.com/codrops/3DCarousel', kind: 'Open-source demo repos', note: 'On-scroll 3D carousel (2025).', tags: ['3d', 'carousel'] },
  { name: 'codrops/ScrollSpiral', url: 'https://github.com/codrops/ScrollSpiral', kind: 'Open-source demo repos', note: 'WebGL scroll spiral backgrounds (regl).', tags: ['webgl', 'spiral'] },
  { name: 'Cuberto/scroll-sequence-demo', url: 'https://github.com/Cuberto/scroll-sequence-demo', kind: 'Open-source demo repos', note: 'Image-sequence scroll scrubbing.', tags: ['scroll', 'sequence'] },

  // Component libraries
  { name: 'shadcn/ui', url: 'https://ui.shadcn.com/', kind: 'Component libraries', note: 'Copy-paste accessible primitives; base layer for most below.', tags: ['react', 'tailwind'] },
  { name: 'React Bits', url: 'https://reactbits.dev/', kind: 'Component libraries', note: '~48k★ animated/interactive components.', tags: ['react', 'animation'] },
  { name: 'Magic UI', url: 'https://magicui.design/', kind: 'Component libraries', note: '~22k★ landing-page effects.', tags: ['react', 'landing'] },
  { name: 'Aceternity UI', url: 'https://ui.aceternity.com/', kind: 'Component libraries', note: 'Flashy hero and card effects.', tags: ['react', 'landing'] },
  { name: 'Motion Primitives', url: 'https://motion-primitives.com/', kind: 'Component libraries', note: 'Motion-first copy-paste components.', tags: ['react', 'motion'] },
  { name: 'Cult UI', url: 'https://www.cult-ui.com/', kind: 'Component libraries', note: 'shadcn-compatible extras.', tags: ['react'] },
  { name: 'Uiverse', url: 'https://uiverse.io/', kind: 'Component libraries', note: 'Thousands of single elements in plain CSS.', tags: ['css'] },
  { name: '21st.dev', url: 'https://21st.dev/', kind: 'Component libraries', note: 'Community component registry.', tags: ['react'] },
  { name: 'HyperUI', url: 'https://hyperui.dev/', kind: 'Component libraries', note: 'Plain Tailwind blocks.', tags: ['tailwind'] },
  { name: 'Radix Primitives', url: 'https://www.radix-ui.com/primitives', kind: 'Component libraries', note: 'Unstyled accessible primitives.', tags: ['a11y', 'react'] },
  { name: 'React Aria', url: 'https://react-spectrum.adobe.com/react-aria/', kind: 'Component libraries', note: 'Adobe accessibility hooks/components.', tags: ['a11y', 'react'] },

  // Motion & 3D libraries
  { name: 'GSAP', url: 'https://gsap.com/', kind: 'Motion & 3D libraries', note: 'Timelines, ScrollTrigger, Flip, SplitText (all free now).', tags: ['animation', 'scroll'] },
  { name: 'Motion', url: 'https://motion.dev/', kind: 'Motion & 3D libraries', note: 'React/JS animation (ex-Framer Motion).', tags: ['react', 'animation'] },
  { name: 'Lenis', url: 'https://lenis.darkroom.engineering/', kind: 'Motion & 3D libraries', note: 'Smooth scroll used by most award sites.', tags: ['smooth scroll'] },
  { name: 'Three.js', url: 'https://threejs.org/', kind: 'Motion & 3D libraries', note: 'The WebGL 3D library.', tags: ['3d', 'webgl'] },
  { name: 'React Three Fiber', url: 'https://r3f.docs.pmnd.rs/', kind: 'Motion & 3D libraries', note: 'Three.js as React components (+ drei helpers).', tags: ['3d', 'react'] },
  { name: 'OGL', url: 'https://github.com/oframe/ogl', kind: 'Motion & 3D libraries', note: 'Minimal WebGL library, shader-first.', tags: ['webgl'] },
  { name: 'Theatre.js', url: 'https://www.theatrejs.com/', kind: 'Motion & 3D libraries', note: 'Visual timeline editor for web animation/3D.', tags: ['animation', '3d'] },
  { name: 'Spline', url: 'https://spline.design/', kind: 'Motion & 3D libraries', note: 'Design 3D scenes, embed in web.', tags: ['3d', 'no-code'] },
  { name: 'Rive', url: 'https://rive.app/', kind: 'Motion & 3D libraries', note: 'Interactive vector animations with state machines.', tags: ['animation', 'interactive'] },
  { name: 'Lottie', url: 'https://airbnb.io/lottie/', kind: 'Motion & 3D libraries', note: 'After Effects animations as JSON.', tags: ['animation'] },

  { name: 'three.js examples: glTF models', url: 'https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf', kind: 'Motion & 3D libraries', note: 'Includes RobotExpressive (CC0, 14 animations) used by our robot mascot. Check each model\'s licence.', tags: ['models', 'gltf', 'characters'] },
  { name: 'Khronos glTF Sample Assets', url: 'https://github.com/KhronosGroup/glTF-Sample-Assets', kind: 'Motion & 3D libraries', note: 'Reference models incl. the animated Fox (CC0 model, CC-BY 4.0 rig).', tags: ['models', 'gltf'] },
  { name: 'Gobkit freebies', url: 'https://gobkit.com/freebies', kind: 'Motion & 3D libraries', note: '79 CC0 GLB models, 38 rigged + animated characters, no attribution.', tags: ['models', 'cc0', 'characters'] },
  { name: 'Poly Pizza', url: 'https://poly.pizza/', kind: 'Motion & 3D libraries', note: 'Thousands of low-poly models (CC0 / CC-BY), GLB download.', tags: ['models', 'low poly'] },
  { name: 'Quaternius', url: 'https://quaternius.com/', kind: 'Motion & 3D libraries', note: 'CC0 animated character and prop packs.', tags: ['models', 'cc0', 'characters'] },
  { name: 'Kenney', url: 'https://kenney.nl/assets', kind: 'Motion & 3D libraries', note: 'Huge CC0 game-asset library incl. 3D kits.', tags: ['models', 'cc0'] },
  { name: 'Mixamo', url: 'https://www.mixamo.com/', kind: 'Motion & 3D libraries', note: 'Auto-rig a character and add animations (free Adobe account).', tags: ['rigging', 'animation'] },
  { name: 'gltfjsx', url: 'https://github.com/pmndrs/gltfjsx', kind: 'Motion & 3D libraries', note: 'Turns a GLB into a typed R3F component; compresses models.', tags: ['r3f', 'gltf', 'tooling'] },
  { name: 'sbcode: R3F look at mouse', url: 'https://sbcode.net/react-three-fiber/look-at-mouse/', kind: 'Shaders & WebGL', note: 'Tutorial for objects that look at the cursor.', tags: ['r3f', 'cursor', 'learning'] },
  { name: 'Codrops: interactive instancing mouse effect', url: 'https://tympanus.net/codrops/2023/12/13/creating-an-interactive-mouse-effect-with-instancing-in-three-js/', kind: 'Shaders & WebGL', note: 'InstancedMesh cursor effects, the basis of grid ripples.', tags: ['instancing', 'cursor', 'three.js'] },

  { name: 'Codrops: square lens effect (2026)', url: 'https://tympanus.net/codrops/2026/08/25/building-a-mouse-following-square-lens-effect-with-three-js-and-glsl/', kind: 'Shaders & WebGL', note: 'Mouse-following lens with RGB shift, basis of our square lens.', tags: ['shader', 'cursor', 'lens'] },
  { name: 'Codrops: wave propagation cube grid (2026)', url: 'https://tympanus.net/codrops/2026/07/09/building-an-interactive-wave-propagation-cube-grid-with-three-js/', kind: 'Shaders & WebGL', note: 'Instanced cube grid with wave envelopes.', tags: ['instancing', 'grid', 'wave'] },
  { name: 'Codrops hub: React Three Fiber demos', url: 'https://tympanus.net/codrops/hub/tag/react-three-fiber/', kind: 'Open-source demo repos', note: 'Open-source R3F experiments with tutorials.', tags: ['r3f', 'demos'] },
  { name: 'R3F examples', url: 'https://r3f.docs.pmnd.rs/getting-started/examples', kind: 'Motion & 3D libraries', note: 'Official showcase: portals, configurators, physics, scroll scenes.', tags: ['r3f', 'examples'] },
  { name: 'Best three.js websites 2026 (Utsubo)', url: 'https://www.utsubo.com/blog/best-threejs-websites-2026', kind: 'Inspiration galleries', note: 'Breakdown of standout 3D sites and their techniques.', tags: ['three.js', 'inspiration'] },

  // Awesome lists
  { name: 'terkelg/awesome-creative-coding', url: 'https://github.com/terkelg/awesome-creative-coding', kind: 'Awesome lists', note: 'Generative art, shaders, creative coding resources.', tags: ['creative coding'] },
  { name: 'AxiomeCG/awesome-threejs', url: 'https://github.com/AxiomeCG/awesome-threejs', kind: 'Awesome lists', note: 'Three.js resources.', tags: ['three.js'] },
  { name: 'owenob1/awesome-web-shaders', url: 'https://github.com/owenob1/awesome-web-shaders', kind: 'Awesome lists', note: 'GLSL/WGSL, WebGL/WebGPU libraries and tools.', tags: ['shaders'] },
  { name: 'sjfricke/awesome-webgl', url: 'https://github.com/sjfricke/awesome-webgl', kind: 'Awesome lists', note: 'WebGL libraries and resources.', tags: ['webgl'] },
  { name: 'alexpate/awesome-design-systems', url: 'https://github.com/alexpate/awesome-design-systems', kind: 'Awesome lists', note: '~26k★ public design systems.', tags: ['design systems'] },
  { name: 'aniftyco/awesome-tailwindcss', url: 'https://github.com/aniftyco/awesome-tailwindcss', kind: 'Awesome lists', note: '~15k★ Tailwind ecosystem.', tags: ['tailwind'] },
  { name: 'fliptheweb/motion-ui-design', url: 'https://github.com/fliptheweb/motion-ui-design', kind: 'Awesome lists', note: 'Motion UI inspiration and tools.', tags: ['motion'] },

  // Shaders & WebGL
  { name: 'Shadertoy', url: 'https://www.shadertoy.com/', kind: 'Shaders & WebGL', note: 'The fragment-shader community; endless reference.', tags: ['glsl'] },
  { name: 'The Book of Shaders', url: 'https://thebookofshaders.com/', kind: 'Shaders & WebGL', note: 'Best intro to GLSL, with live editor.', tags: ['glsl', 'learning'] },
  { name: 'ShaderGradient', url: 'https://www.shadergradient.co/', kind: 'Shaders & WebGL', note: 'Animated 3D gradient generator.', tags: ['gradient'] },
  { name: 'Three.js Journey', url: 'https://threejs-journey.com/', kind: 'Shaders & WebGL', note: 'Course by Bruno Simon.', tags: ['learning', 'three.js'] },

  // Agent design skills
  { name: 'Leonxlnx/taste-skill', url: 'https://github.com/Leonxlnx/taste-skill', kind: 'Agent design skills', note: '~91k★ anti-slop frontend skill for AI agents.', tags: ['ai', 'skill'] },
  { name: 'VoltAgent/awesome-design-md', url: 'https://github.com/VoltAgent/awesome-design-md', kind: 'Agent design skills', note: '~118k★ DESIGN.md files from brand design systems.', tags: ['ai', 'design systems'] },
  { name: 'vercel-labs/agent-skills', url: 'https://github.com/vercel-labs/agent-skills', kind: 'Agent design skills', note: 'Includes web-design-guidelines skill.', tags: ['ai', 'guidelines'] },
  { name: 'microsoft/playwright-cli', url: 'https://github.com/microsoft/playwright-cli', kind: 'Agent design skills', note: 'Lets agents screenshot and check the UI they built.', tags: ['ai', 'testing'] },

  // Tools
  { name: 'Haikei', url: 'https://haikei.app/', kind: 'Tools', note: 'SVG blobs, waves, layered shapes.', tags: ['svg', 'background'] },
  { name: 'Realtime Colors', url: 'https://www.realtimecolors.com/', kind: 'Tools', note: 'Preview a palette on a real page.', tags: ['color'] },
  { name: 'fffuel', url: 'https://www.fffuel.co/', kind: 'Tools', note: 'SVG generators (noise, gradients, patterns).', tags: ['svg'] },
  { name: 'cubic-bezier.com', url: 'https://cubic-bezier.com/', kind: 'Tools', note: 'Design easing curves.', tags: ['easing'] },
  { name: 'Easing Wizard', url: 'https://easingwizard.com/', kind: 'Tools', note: 'Spring / bounce / linear() easing generator.', tags: ['easing', 'css'] },
  { name: 'Fontshare', url: 'https://www.fontshare.com/', kind: 'Tools', note: 'Free quality display fonts.', tags: ['fonts'] },
]
