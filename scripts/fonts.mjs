// Fetches the webfonts into public/fonts and verifies they can render the site.
//
//   npm run fonts
//
// Exists because the font files were previously committed with no record of
// where they came from, and because the glyph check below is not optional: the
// Uzbek half of this site needs modifier letters that most Latin subsets omit.
import { mkdir, writeFile } from "node:fs/promises";
import { create } from "fontkit";

const OUT = "public/fonts";
const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36" };

await mkdir(OUT, { recursive: true });

const get = async (url) => {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  return r;
};

/** Fontshare: pick the roman face whose font-weight is a range (the variable one). */
async function fontshareVariable(family) {
  const css = await (await get(`https://api.fontshare.com/v2/css?f%5B%5D=${encodeURIComponent(family)}@variable`)).text();
  const face = [...css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)]
    .map((m) => m[1])
    .filter((b) => /font-weight:\s*\d+\s+\d+/.test(b) && !/italic/i.test(b))[0];
  if (!face) throw new Error(`${family}: no roman variable face`);
  const range = /font-weight:\s*(\d+\s+\d+)/.exec(face)[1];
  const url = "https:" + /url\('(\/\/[^']+\.woff2)'\)/.exec(face)[1];
  return { buf: Buffer.from(await (await get(url)).arrayBuffer()), range };
}

/** Google Fonts: the woff2 for the basic-latin subset of a given family/axis. */
async function google(query, wantItalic = false) {
  const css = await (await get(`https://fonts.googleapis.com/css2?family=${query}&display=swap`)).text();
  for (const block of [...css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)].map((m) => m[1])) {
    const isItalic = /font-style:\s*italic/.test(block);
    if (isItalic !== wantItalic) continue;
    const range = /unicode-range:\s*([^;]+);/.exec(block);
    if (!range || !range[1].includes("U+0000-00FF")) continue;
    const url = /url\((https:\/\/[^)]+\.woff2)\)/.exec(block)[1];
    return { buf: Buffer.from(await (await get(url)).arrayBuffer()) };
  }
  throw new Error(`${query}: no matching face`);
}

const written = [];
for (const [name, load] of [
  ["CabinetGrotesk-var", () => fontshareVariable("cabinet-grotesk")],
  ["Satoshi-var", () => fontshareVariable("satoshi")],
  ["InstrumentSerif-italic", () => google("Instrument+Serif:ital@1", true)],
  ["JetBrainsMono-var", () => google("JetBrains+Mono:wght@400..600")],
]) {
  const { buf, range } = await load();
  await writeFile(`${OUT}/${name}.woff2`, buf);
  const font = create(buf);
  written.push({ name, kb: +(buf.length / 1024).toFixed(1), glyphs: font.numGlyphs, range: range ?? "—", font });
}

console.log();
for (const f of written) {
  console.log(`  ${f.name.padEnd(24)} ${String(f.kb).padStart(6)} KB  ${String(f.glyphs).padStart(4)} glyphs  wght ${f.range}`);
}
console.log(`\n  total ${written.reduce((s, f) => s + f.kb, 0).toFixed(1)} KB`);

// The characters the page cannot do without. U+02BB/U+02BC are the correct
// Uzbek marks but no family here carries them, so the copy uses U+2019 and this
// check enforces that the substitute is actually present.
const required = [
  ["U+2019 right single quote (used for oʻ, gʻ)", 0x2019],
  ["U+2014 em dash", 0x2014],
  ["U+00B7 middle dot", 0x00b7],
];
let bad = 0;
for (const f of written) {
  for (const [label, cp] of required) {
    if (!f.font.hasGlyphForCodePoint(cp)) {
      console.error(`  MISSING in ${f.name}: ${label}`);
      bad++;
    }
  }
}
console.log(bad ? "\n  glyph check FAILED\n" : "\n  glyph check passed — every family can render the required marks\n");
if (bad) process.exitCode = 1;
