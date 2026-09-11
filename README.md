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
npm run og        # regenerate the social share card
```

## Editing content

Every fact on the page lives in [`src/site.mjs`](src/site.mjs) — nothing is
duplicated in markup, so a number, date or link is changed in exactly one place.
`src/render.mjs` turns that into HTML, `src/styles.css` holds the design tokens,
`src/motion.js` is the whole client runtime.

## Deploying

Build output is a plain directory, so any static host works.

**Cloudflare Pages** is the recommended target: unlimited bandwidth on the free
tier and, unlike Vercel's Hobby plan, no clause restricting commercial use —
which matters because this site advertises freelance availability.

- Build command: `npm run build`
- Output directory: `dist`
- Point both the apex and `www` at it; check both resolve.

`public/_headers` already sets immutable caching for fonts, images and hashed
assets, plus `X-Content-Type-Options`, `Referrer-Policy` and `X-Frame-Options`.
