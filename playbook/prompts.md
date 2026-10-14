# Prompts: what to say to your AI assistant

You do not need to know design vocabulary to get a good result. You need to say who the site is for, what it is about and what it should make people do, and then point the assistant at UI Lab so it follows the procedure instead of improvising. Copy a prompt, replace the brackets, and send it.

## The short version

> Use UI Lab (https://ui-lab-weld.vercel.app/for-claude.md). Build [what] for [who]. The one thing it must do well is [moment]. Here is the real content: [paste or attach]. Check it at desktop and phone size before you tell me it is done.

## Common requests

**A site for a business or person**
> Use UI Lab. Build a one-page site for [business] in [place]. Visitors are [who] on [phone or laptop] and I want them to [call, book, buy, read]. Pick the design world that fits the brief from the router, tell me which one and why, then build it with my real text and photos: [paste]. No stock photos, no placeholder text.

**A portfolio**
> Use UI Lab. I am a [role]. Build my portfolio. The most important thing is that people can see [three projects] quickly. Use the portfolio-style worlds from the router, make it keyboard-friendly, and include a plain version of the content for anyone who does not want the effects.

**A product page**
> Use UI Lab. We sell [product]. Build a page where the product is the hero and one interaction explains why it is good: [interaction]. Use a Persuade-mode world, then check that it works with the keyboard and with reduced motion switched on.

**A tool or dashboard**
> Use UI Lab. Build a screen where [who] can [task]. This is an Operate-mode page: scanability and clear states matter more than decoration. Show empty, loading and error states, and say in a sentence whether each result is good or bad (do not rely on colour alone).

**Fix what I have**
> Use UI Lab. Here is my site: [URL or folder]. Do a critique first (what is generic, what is inaccessible, what breaks at 375px), show me the list, then fix the top five. Do not change my text. Verify by rendering, not by reading the code.

## Ask for these, always

- "Tell me which world you chose and why, and what you refused to do."
- "Verify it: fresh load, console clean, desktop and 375px, keyboard, reduced motion. Tell me what you could not test."
- "Do not copy anything from the reference sites; rebuild techniques in your own code."
- "Plain commit messages, and do not push until I say so."

## If the result feels generic

Say so plainly and add one fact: "It looks like every other landing page. The one thing that is different about us is [x]. Make the page about that." Specific facts beat adjectives.
