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

/* 2 ─ render once to a temp file purely so Tailwind can scan the class names */
const scanFile = join(DIST, ".scan.html");
await writeFile(
  scanFile,
  renderPage({ cssHref: "/x.css", jsHref: "/x.js" }),
  "utf8"
);

/* 3 ─ compile CSS (Tailwind emits only the utilities present in the markup) */
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

/* 4 ─ the client runtime, hashed the same way */
const js = await readFile(join("src", "motion.js"));
const jsName = `assets/motion.${hash(js)}.js`;
await writeFile(join(DIST, jsName), js);

/* 5 ─ one complete page per language: English at /, the rest at /<lang>/ */
await rm(scanFile);
const pages = [];
for (const lang of LANGS) {
  const markup = renderPage({ cssHref: `/${cssName}`, jsHref: `/${jsName}`, lang });
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

/* 5b ─ Content-Security-Policy script hashes
   The only executable inline script is the theme bootstrap, which has to run
   before first paint. Its hash is computed from the markup that was actually
   written, not from a copy of the source, so the policy cannot drift from the
   page. Structured data (type="application/ld+json") is not executed and needs
   no hash. */
const inlineHashes = new Set();
for (const file of LANGS.flatMap((lang) => {
  const dir = lang === DEFAULT_LANG ? DIST : join(DIST, lang);
  return [join(dir, "index.html"), join(dir, "404.html")];
})) {
  const markup = await readFile(file, "utf8");
  for (const [, body] of markup.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    inlineHashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
}
const headersPath = join(DIST, "_headers");
const headers = await readFile(headersPath, "utf8");
if (!headers.includes("__CSP_SCRIPT_HASHES__")) {
  throw new Error("public/_headers has no __CSP_SCRIPT_HASHES__ placeholder for the CSP");
}
await writeFile(headersPath, headers.replace("__CSP_SCRIPT_HASHES__", [...inlineHashes].join(" ")), "utf8");

/* 6 ─ sitemap: every language, each declaring the others as alternates */
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

/* 7 ─ guard the things that quietly rot, on every language */
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
  // Search Console reports a ProfilePage without mainEntity as a critical
  // structured-data error, and it is easy to drop when editing the graph.
  if (html.includes('"ProfilePage"') && !html.includes('"mainEntity"')) {
    checks.push(`${tag} ProfilePage schema is missing mainEntity`);
  }
  // The accent word in a display heading is a separate span, so the space
  // around it has to live in the copy. When it does not, the heading renders as
  // one mashed word -- "Tashkent toKunshan." shipped that way.
  const LETTER = "A-Za-z\u00c0-\u024f\u2019";
  for (const [, word, after] of html.matchAll(
    new RegExp(`<span class="accent-word">([^<]*)</span>([${LETTER}])`, "g")
  )) {
    checks.push(`${tag} accent word runs into the next word: "${word}${after}…"`);
  }
  for (const [, before, word] of html.matchAll(
    new RegExp(`([${LETTER}])<span class="accent-word">([^<]*)</span>`, "g")
  )) {
    checks.push(`${tag} accent word runs into the previous word: "…${before}${word}"`);
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

/* 8 ─ report */
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
