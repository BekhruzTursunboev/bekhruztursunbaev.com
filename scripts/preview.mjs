import { chromium } from "playwright-core";
const OUT = process.argv[2];
const browser = await chromium.launch();
for (const [name, viewport, theme] of [
  ["desktop-dark", { width: 1440, height: 1000 }, "dark"],
  ["desktop-light", { width: 1440, height: 1000 }, "light"],
  ["mobile-dark", { width: 390, height: 844 }, "dark"],
]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4321/", { waitUntil: "networkidle" });
  await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
  // walk the page so every scroll reveal fires and every lazy image loads
  await page.evaluate(async () => {
    const step = innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 600));
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  const stuck = await page.evaluate(() =>
    [...document.querySelectorAll(".reveal,.wipe,.line-mask")].filter((e) => !e.classList.contains("in")).length
  );
  console.log(`${name}: captured, ${stuck} unrevealed elements`);
  await ctx.close();
}
await browser.close();
