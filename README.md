# bekhruztursunbaev.com

Personal site of Bekhruz Tursunboev. Static, hand-written, no framework.

## Why it is built this way

Fonts are **self-hosted from this origin** and the page makes **zero
third-party requests**. `fonts.googleapis.com` does not resolve from mainland
China, and a large share of readers are there. That constraint also ruled out a
client-side framework: reveal animations are armed by JavaScript only after it
confirms it can undo them, so the page is fully readable before any script runs.

| | |
|---|---|
| JavaScript shipped | ~5 KB, one file, no dependencies |
| Fonts | 207 KB woff2, same-origin |
| Runtime dependencies | none |
| Build dependencies | `@tailwindcss/cli`, `sharp`, `playwright-core` |

## Commands

```bash
npm install
npm run build     # -> dist/
npm run serve     # preview dist/ on :4321
npm run images    # regenerate the portrait from personal_shoot.JPG
npm run shots     # re-screenshot every live project
npm run og        # render the share cards, one per language, in the site's own fonts
npm run fonts     # re-fetch the webfonts and check they carry the required glyphs
npm run logos     # re-fetch the institution logos
npm run vitals    # LCP, CLS and WCAG contrast on the deployed site, both themes
npm run audit     # touch targets, focus order, reduced motion (needs npm run serve)
```

## Editing content

Every fact lives in [`src/site.mjs`](src/site.mjs) and every interface string in
[`src/i18n.mjs`](src/i18n.mjs) — nothing is duplicated in markup, so a number,
date, link or label is changed in exactly one place. `src/render.mjs` turns them
into HTML, `src/styles.css` holds the design tokens, `src/motion.js` is the whole
client runtime.

The site is built in English at `/` and Uzbek at `/uz/`, each a complete page
with its own 404 and share card. A field that reads the same in both languages
is a plain string; one that differs is `{ en, uz }`. The Uzbek copy uses U+2019
for the oʻ and gʻ marks, because none of the webfonts carry U+02BB.

## Deploying

Hosted on **Cloudflare Workers Static Assets** (Cloudflare folded Pages into
Workers), configured in `wrangler.jsonc`. Chosen over Vercel's free tier, whose
[Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
restrict Hobby to non-commercial use and name "advertising the sale of a product
or service" — this site advertises freelance availability.

```bash
npm run deploy   # build + wrangler deploy
npm run smoke    # load the live site and assert it contacts no other host
```

`public/_headers` is honoured: immutable caching for fonts, images and hashed
assets, plus `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and
`Permissions-Policy`. Unknown paths serve `404.html`.

Pushes to `main` build in GitHub Actions and upload from there once
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` exist as repository secrets;
until then the run still builds and verifies, and skips the upload. CI fails the
build if `dist/index.html` ever gains a third-party asset reference.

### Custom domain

The domain is on Namecheap nameservers and carries Namecheap **email
forwarding** (`MX -> eforward*.registrar-servers.com` plus an SPF `TXT`). A
Workers custom domain requires the zone to be active in Cloudflare, so moving
the nameservers is the prerequisite — and those mail records must come across
first or forwarding to the address on this site breaks.
