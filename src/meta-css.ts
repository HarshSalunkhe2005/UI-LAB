import type { PatternMeta } from './meta'

/* Modern CSS: platform features that replace JavaScript, each with a safe fallback. */
export const MODERN_CSS: PatternMeta[] = [
  {
    slug: "css-scroll-reveal",
    title: "Scroll-driven reveal, no JavaScript",
    category: 'Modern CSS',
    summary: "Cards animate as they enter the scroll box using animation-timeline: view(), wrapped in @supports so unsupported browsers just show the cards.",
    when: ["Scroll-in effects with zero JS", "Replacing IntersectionObserver reveal code"],
    file: "css/ScrollRevealCss.tsx",
    tags: ["modern css", "scroll-driven", "view timeline", "animation", "no javascript"],
    a11y: "Nothing is hidden if the feature is unsupported; the animation is removed under reduced motion; the scroll box is focusable and labelled.",
    deps: [],
  },
  {
    slug: "css-popover-starting",
    title: "Native popover menu with entry animation",
    category: 'Modern CSS',
    summary: "A menu using the Popover API and @starting-style: the browser handles open, close, light dismiss, top layer and focus return; CSS animates it.",
    when: ["Menus, tooltips and small dialogs without a positioning library", "Animating display none to visible"],
    file: "css/PopoverStarting.tsx",
    tags: ["modern css", "popover", "starting-style", "menu", "top layer"],
    a11y: "Popover gives Esc to close, light dismiss and focus return natively; the trigger is a real button; animation is removed under reduced motion.",
    deps: [],
  },
  {
    slug: "css-anchor-tooltip",
    title: "Anchor-positioned tooltip",
    category: 'Modern CSS',
    summary: "A tooltip tied to its trigger with anchor positioning; the browser flips it to the other side when there is no room.",
    when: ["Tooltips and popovers that must stay on screen", "Dropping measure-and-place JavaScript"],
    file: "css/AnchorTooltip.tsx",
    tags: ["modern css", "anchor positioning", "tooltip", "position-area"],
    a11y: "The tooltip is linked with aria-describedby, appears on hover and keyboard focus, and falls back to a plain visible note without support.",
    deps: [],
  },
  {
    slug: "css-type-niceties",
    title: "Balanced text, growing textarea, :has()",
    category: 'Modern CSS',
    summary: "text-wrap balance and pretty, a textarea that grows with field-sizing: content, and a field group styled from its input by :has().",
    when: ["Headlines with even lines", "Auto-growing inputs without a script"],
    file: "css/TypographyNiceties.tsx",
    tags: ["modern css", "text-wrap", "field-sizing", "has selector", "typography"],
    a11y: "Pure presentation changes; labels stay real labels; all of it degrades to normal browser behaviour.",
    deps: [],
  },
]
