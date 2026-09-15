// Builds the social share cards -- the preview Telegram, LinkedIn and X show
// when the link is pasted. public/og.png for English, public/og-<lang>.png for
// every other language.
//
//   npm run og
//
// Rendered in a real browser with the site's own self-hosted fonts. The previous
// card drew its text with sharp's SVG renderer, which can only use fonts
// installed on the build machine, so it fell back to Segoe UI and Georgia and
// did not look like the site it previews. It also hard-coded its copy, which is
// how a phrase deleted from the page survived on the card. The copy now comes
// from src/i18n.mjs, the same place the page reads it from.
import { chromium } from "playwright-core";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { ui, LANGS, DEFAULT_LANG } from "../src/i18n.mjs";
import { person } from "../src/site.mjs";

const W = 1200;
const H = 630;

const dataUri = async (path, mime) =>
  `data:${mime};base64,${(await readFile(path)).toString("base64")}`;

// Inlined as data URIs so the page needs no origin at all: fonts loaded from
// file:// into an about:blank document are blocked in Chromium.
const fonts = {
  display: await dataUri("public/fonts/CabinetGrotesk-var.woff2", "font/woff2"),
  serif: await dataUri("public/fonts/InstrumentSerif-italic.woff2", "font/woff2"),
  sans: await dataUri("public/fonts/Satoshi-var.woff2", "font/woff2"),
  mono: await dataUri("public/fonts/JetBrainsMono-var.woff2", "font/woff2"),
};
const portrait = await dataUri("public/img/portrait-880.webp", "image/webp");

const esc = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const card = (t) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: D; src: url(${fonts.display}) format("woff2"); font-weight: 100 900; }
@font-face { font-family: S; src: url(${fonts.serif}) format("woff2"); font-style: italic; }
@font-face { font-family: B; src: url(${fonts.sans}) format("woff2"); font-weight: 300 900; }
@font-face { font-family: M; src: url(${fonts.mono}) format("woff2"); font-weight: 400 600; }
* { margin: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: hsl(30 7% 7%); }
.card { display: grid; grid-template-columns: 1fr 470px; width: 100%; height: 100%; }
.text { display: flex; flex-direction: column; padding: 62px 56px 56px 68px; min-width: 0; }
.eyebrow {
  display: flex; align-items: center; gap: 14px;
  font: 500 17px/1 M; letter-spacing: 0.16em; text-transform: uppercase;
  color: hsl(26 95% 64%);
}
.eyebrow::before { content: ""; width: 34px; height: 2px; background: hsl(24 92% 58%); }
h1 {
  margin-top: auto;
  font: 800 104px/0.9 D; letter-spacing: -0.04em; color: hsl(36 14% 96%);
}
.serif {
  display: block;
  font: italic 400 108px/0.95 S; letter-spacing: -0.02em; color: hsl(33 10% 80%);
}
.rule { width: 58px; height: 3px; margin: 30px 0 24px; background: hsl(24 92% 58%); }
.role { font: 600 31px/1.2 B; letter-spacing: -0.01em; color: hsl(36 14% 96%); }
.tag { margin-top: 10px; font: 500 22px/1.35 B; color: hsl(33 10% 70%); }
.domain {
  margin-top: auto; padding-top: 24px;
  font: 500 19px/1 M; letter-spacing: 0.02em; color: hsl(26 95% 64%);
}
.photo { border-left: 1px solid hsl(30 6% 21%); }
.photo img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; }
</style></head>
<body><div class="card">
  <div class="text" id="text">
    <div class="eyebrow">${esc(t.ogPlace)}</div>
    <h1>Bekhruz<span class="serif">Tursunboev</span></h1>
    <div class="rule"></div>
    <div class="role">${esc(t.ogRole)}</div>
    <div class="tag">${esc(t.ogTagline)}</div>
    <div class="domain">${esc(person.domain)}</div>
  </div>
  <div class="photo"><img src="${portrait}" alt=""></div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

for (const lang of LANGS) {
  const t = ui[lang];
  for (const key of ["ogPlace", "ogRole", "ogTagline"]) {
    if (!t[key]) throw new Error(`ui.${lang}.${key} is missing from src/i18n.mjs`);
  }

  await page.setContent(card(t), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  // Refuse to write a card that fell back to system fonts -- that is the exact
  // failure this script replaced -- or one whose text spills out of its column.
  const state = await page.evaluate(() => {
    const faces = [...document.fonts];
    const text = document.getElementById("text");
    return {
      faces: faces.length,
      unloaded: faces.filter((f) => f.status !== "loaded").map((f) => f.family),
      overflow:
        text.scrollHeight > text.clientHeight + 1 || text.scrollWidth > text.clientWidth + 1,
    };
  });
  if (state.faces !== 4 || state.unloaded.length) {
    throw new Error(`${lang}: fonts did not load (${state.unloaded.join(", ") || state.faces + " faces"})`);
  }
  if (state.overflow) throw new Error(`${lang}: card text overflows its column`);

  const raw = await page.screenshot({ type: "png" });
  const out = lang === DEFAULT_LANG ? "public/og.png" : `public/og-${lang}.png`;
  const { size } = await sharp(raw).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(out);
  console.log(`  ${out.padEnd(20)} ${W}x${H}  ${Math.round(size / 1024)} KB  fonts ok`);
}

await browser.close();
