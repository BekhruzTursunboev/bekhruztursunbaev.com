/**
 * Build: render HTML, compile the CSS Tailwind actually needs, copy assets.
 *
 * Output filenames carry a content hash so they can be cached forever, which is
 * why the CSS is compiled before the HTML that links to it.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { renderPage, render404 } from "../src/render.mjs";

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

/* 6 ─ the real page */
await rm(scanFile);
const html = renderPage({ cssHref: `/${cssName}`, jsHref: `/${jsName}`, fontKB, jsKB });
await writeFile(join(DIST, "index.html"), html, "utf8");
await writeFile(join(DIST, "404.html"), render404({ cssHref: `/${cssName}` }), "utf8");

/* 7 ─ report */
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
