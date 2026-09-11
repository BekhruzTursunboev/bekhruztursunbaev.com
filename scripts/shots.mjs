// Captures a screenshot of each live project and writes responsive AVIF/WebP.
// Real product shots, not mockups -- run `npm run shots` to refresh them.
import { chromium } from "playwright-core";
import sharp from "sharp";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { projects } from "../src/site.mjs";

const OUT = "public/shots";
const WIDTHS = [520, 900, 1300];
const VIEWPORT = { width: 1440, height: 900 };

await mkdir(OUT, { recursive: true });

const targets = projects.filter((p) => p.live);
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  colorScheme: "dark",
});

const results = [];

for (const project of targets) {
  const page = await context.newPage();
  try {
    await page.goto(project.live, { waitUntil: "networkidle", timeout: 45000 });
    // Let entrance animations and webfonts settle before capturing.
    await page.waitForTimeout(2500);
    const raw = `${OUT}/.${project.slug}.png`;
    await page.screenshot({ path: raw, clip: { x: 0, y: 0, ...VIEWPORT } });

    for (const w of WIDTHS) {
      for (const [format, opts] of [
        ["avif", { quality: 52, effort: 6 }],
        ["webp", { quality: 74, effort: 6 }],
      ]) {
        await sharp(raw).resize({ width: w }).toFormat(format, opts).toFile(`${OUT}/${project.slug}-${w}.${format}`);
      }
    }
    await unlink(raw);
    results.push(`  ok    ${project.slug}`);
  } catch (error) {
    results.push(`  FAIL  ${project.slug} — ${error.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(results.join("\n"));
