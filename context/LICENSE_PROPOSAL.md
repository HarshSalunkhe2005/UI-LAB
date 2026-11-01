# License proposal (for Harsh to choose; nothing has been applied)

Today the repo has no `LICENSE` file and `plugin.json` says `UNLICENSED`, so by default all rights are reserved and nobody else may legally copy or reuse it. The README says that in one line. This note lays out the options so you can pick.

## What needs a licence

- **Code:** the app and patterns in `src/`, the tools in `tools/`, the skill's scripts.
- **Written content:** the playbook, the skill's worlds, anti-slop catalogue, references and templates, the eval results.
- **Third-party parts:** fonts come through `@fontsource` packages (SIL Open Font License, which allows this use); npm dependencies keep their own licences. Techniques from studied sites are re-implemented in our own code, so nothing copied needs attribution.

## The thing to decide first

`npm run skill` now writes the full Pro skill into `skills/ui-lab/`, and that folder is what the plugin installs. If the repo is public under a permissive licence, **anyone can install and reuse the Pro skill for free**, which undercuts a paid Pro listing. The Phase 7 plan was "free Lite listing plus Pro at about $12 to 15". So the licence question is really: *is the public repo the free product, or is it the source of a paid one?*

## Options

| Option | What it allows | Fits | Cost |
|---|---|---|---|
| **A. MIT for everything** | Anyone may use, change, sell, and keep the code private | Maximum reach and trust; a portfolio piece; a free skill that gets copied into other tools | A paid Pro has no moat: the full skill is in the repo. You could still sell convenience (support, updates, a hosted listing), not exclusivity |
| **B. MIT for code, CC BY 4.0 for written content** | Reuse with credit; commercial use allowed | Same as A, with a credit requirement on the guidance text | Same moat problem; two licences to explain |
| **C. PolyForm Noncommercial 1.0.0 (source-available)** | Free for personal, research, educational and nonprofit use; commercial use needs your permission | Keeps the repo public and usable while keeping a paid commercial track | Not an open-source licence, so some tools and communities will not list it; "noncommercial" is a grey area for freelancers |
| **D. Keep all rights reserved, and keep the Pro files out of the public repo** | Nothing reusable by others; the repo is a showcase | A clean paid Pro; lowest risk | Nobody can contribute or reuse; plugin install would need a private or trimmed repo |

## Recommendation

If you go ahead with the free Lite plus paid Pro plan: **C for the repo, or D with Pro removed from the public plugin**, and publish the Lite skill under **MIT** so it can spread freely. If the goal is reputation and adoption over revenue: **A (MIT)**, and sell nothing exclusive.

Either way, decide before the Agensi listing, because marketplace reviewers read the licence, and the listing text should match it. Whichever you choose, tell me and I will add the `LICENSE` file, the `license` field in `plugin.json` and `package.json`, and the README line; I have not touched any of them.
