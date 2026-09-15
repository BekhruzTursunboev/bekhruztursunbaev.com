/**
 * Build: render HTML, compile the CSS Tailwind actually needs, copy assets.
 *
 * Output filenames carry a content hash so they can be cached forever, which is
 * why the CSS is compiled before the HTML that links to it.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";
import { renderPage, render404 } from "../src/render.mjs";
import { LANGS, DEFAULT_LANG, langPath } from "../src/i18n.mjs";

const DIST = "dist";
const hash = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 8);

await rm(DIST, { recursive: true, force: true });
await mkdir(join(DIST, "assets"), { recursive: true });

/* 1 ─ assets that the markup references, so Tailwind can scan the markup after */
await cp("public", DIST, { recursive: true });

/* 2 ─ measure what the page will actually serve, so the colophon cannot drift */
const fontFiles = await readdir(join(DIST, "fonts"));
let fontBytes = 0;
for (const file of fontFiles) fontBytes += (await stat(join(DIST, "fonts", file))).size;
const jsBytes = (await stat(join("src", "motion.js"))).size;
const fontKB = Math.round(fontBytes / 1024);
const jsKB = Math.round((jsBytes / 1024) * 10) / 10;

/* 3 ─ render once to a temp file purely so Tailwind can scan the class names */
const scanFile = join(DIST, ".scan.html");
await writeFile(
  scanFile,
  renderPage({ cssHref: "/x.css", jsHref: "/x.js", fontKB, jsKB }),
  "utf8"
);

/* 4 ─ compile CSS (Tailwind emits only the utilities present in the markup) */
execFileSync(
  process.execPath,
  [
    join("node_modules", "@tailwindcss", "cli", "dist", "index.mjs"),
    "--input",
    join("src", "styles.css"),
    "--output",
    join(DIST, "assets", "tmp.css"),
    "--minify",
  ],
  { stdio: ["ignore", "ignore", "inherit"] }
);

const css = await readFile(join(DIST, "assets", "tmp.css"));
const cssName = `assets/site.${hash(css)}.css`;
await writeFile(join(DIST, cssName), css);
await rm(join(DIST, "assets", "tmp.css"));

/* 5 ─ the client runtime, hashed the same way */
const js = await readFile(join("src", "motion.js"));
const jsName = `assets/motion.${hash(js)}.js`;
await writeFile(join(DIST, jsName), js);

/* 6 ─ one complete page per language: English at /, the rest at /<lang>/ */
await rm(scanFile);
const pages = [];
for (const lang of LANGS) {
  const markup = renderPage({ cssHref: `/${cssName}`, jsHref: `/${jsName}`, fontKB, jsKB, lang });
  const dir = lang === DEFAULT_LANG ? DIST : join(DIST, lang);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), markup, "utf8");
  pages.push({ lang, path: `${langPath(lang)}index.html`, markup });
}
// One 404 per language. Workers serves the nearest 404.html walking up the
// path, so a dead link under /uz/ gets the Uzbek page and anything else gets
// English, with no routing code.
for (const lang of LANGS) {
  const dir = lang === DEFAULT_LANG ? DIST : join(DIST, lang);
  await writeFile(join(dir, "404.html"), render404({ cssHref: `/${cssName}`, lang }), "utf8");
}

/* 7 ─ sitemap: every language, each declaring the others as alternates */
const today = new Date().toISOString().slice(0, 10);
const ORIGIN = "https://bekhruztursunbaev.com";
const entries = LANGS.map((lang) => {
  const alternates = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}${langPath(l)}"/>`
  ).join("\n");
  return `  <url>
    <loc>${ORIGIN}${langPath(lang)}</loc>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${langPath(DEFAULT_LANG)}"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${lang === DEFAULT_LANG ? "1.0" : "0.8"}</priority>
  </url>`;
}).join("\n");
await writeFile(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`,
  "utf8"
);

/* 8 ─ guard the things that quietly rot, on every language */
const checks = [];
for (const page of pages) {
  const html = page.markup;
  const tag = `[${page.lang}]`;
  const titleText = (html.match(/<title>(.*?)<\/title>/s) ?? [])[1] ?? "";
  const descText = (html.match(/<meta name="description" content="(.*?)"/s) ?? [])[1] ?? "";
  if (titleText.length > 60) checks.push(`${tag} title is ${titleText.length} chars (>60)`);
  if (descText.length > 160) checks.push(`${tag} meta description is ${descText.length} chars (>160)`);
  if (!html.includes('rel="canonical"')) checks.push(`${tag} no canonical link`);
  if (!html.includes('name="robots"')) checks.push(`${tag} no robots meta`);
  if (!html.includes('hreflang="x-default"')) checks.push(`${tag} no x-default hreflang`);
  const emptyAlts = (html.match(/<img[^>]*alt=""[^>]*>/g) ?? []).length;
  if (emptyAlts) checks.push(`${tag} ${emptyAlts} image(s) with empty alt`);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) checks.push(`${tag} ${h1s} h1 elements (want exactly 1)`);
  if (/\bundefined\b/.test(html)) {
    checks.push(`${tag} the word "undefined" reached the markup`);
  }
  // A { en, uz } field rendered without a language lookup stringifies to this.
  if (html.includes("[object Object]")) {
    checks.push(`${tag} a translatable field was rendered without c(): "[object Object]"`);
  }
  // Uzbek here is written in Latin script. A stray Cyrillic homoglyph -- an
  // a, e or o that looks identical but is not -- renders from a fallback
  // font and visibly breaks the word. One had already slipped into the copy.
  const cyrillic = html.match(/[Ѐ-ӿ]/g);
  if (cyrillic) {
    const seen = [...new Set(cyrillic)]
      .map((ch) => `U+${ch.codePointAt(0).toString(16).toUpperCase()}`)
      .join(", ");
    checks.push(`${tag} Cyrillic characters in Latin copy: ${seen}`);
  }

// Every same-origin asset the page names must actually be on disk. Renaming a
// generated file without updating the markup is silent otherwise -- the page
// still builds and only the image is missing.
  const referenced = new Set(
    [...html.matchAll(/(?:src|href)="(\/[^"?#]+\.[a-z0-9]{2,5})"/gi)].map((m) => m[1])
  );
  for (const ref of [...referenced].sort()) {
    if (!existsSync(join(DIST, ref))) checks.push(`${tag} missing asset: ${ref}`);
  }
  // The share card is referenced by absolute URL, so the loop above cannot see
  // it. A missing one would make every link preview in that language blank.
  const card = page.lang === DEFAULT_LANG ? "og.png" : `og-${page.lang}.png`;
  if (!existsSync(join(DIST, card))) checks.push(`${tag} missing share card: /${card}`);
}
if (checks.length) {
  console.error(`\n  SEO problems:\n   - ${checks.join("\n   - ")}\n`);
  process.exitCode = 1;
} else {
  console.log(
    `\n  seo ok — ${pages.map((x) => x.lang).join(" + ")}, canonical + hreflang, 1 h1 each, every image has alt`
  );
}

/* 9 ─ report */
const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push({ path, size: (await stat(path)).size });
  }
  return out;
};

const files = await walk(DIST);
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const group = (exts) =>
  files.filter((f) => exts.includes(extname(f.path))).reduce((sum, f) => sum + f.size, 0);

console.log(`\n  ${files.length} files, ${kb(files.reduce((s, f) => s + f.size, 0))} total\n`);
console.log(`  html   ${kb(group([".html"]))}`);
console.log(`  css    ${kb(group([".css"]))}`);
console.log(`  js     ${kb(group([".js"]))}`);
console.log(`  fonts  ${kb(group([".woff2"]))}`);
console.log(`  images ${kb(group([".avif", ".webp", ".png", ".svg", ".ico"]))}\n`);
