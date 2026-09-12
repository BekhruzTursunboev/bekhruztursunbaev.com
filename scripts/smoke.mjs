// Post-deploy smoke test. Loads the real site in a real browser and asserts the
// properties that actually matter here -- above all that the page contacts no
// host but its own, since a blocked third-party asset is the failure mode this
// site exists to avoid.
//
//   node scripts/smoke.mjs [url]
import { chromium } from "playwright-core";

const target = process.argv[2] ?? "https://bekhruztursunbaev.com/";
const origin = new URL(target).host;

// Some networks (including the author's) have broken IPv6, and Chromium prefers
// AAAA. Pass an IPv4 address as the third argument to pin resolution to it.
const pinnedIp = process.argv[3];
const args = [];
if (pinnedIp) {
  // Bypass any system proxy as well -- a local proxy that mishandles the domain
  // produces the same ERR_CONNECTION_CLOSED as a genuinely broken site.
  args.push(`--host-resolver-rules=MAP ${origin} ${pinnedIp}`, "--no-proxy-server");
}
const browser = await chromium.launch({ args });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

const foreign = new Set();
const failures = [];
page.on("request", (req) => {
  const { host } = new URL(req.url());
  if (host !== origin) foreign.add(host);
});
page.on("requestfailed", (req) => failures.push(`${req.url()} :: ${req.failure()?.errorText}`));

const response = await page.goto(target, { waitUntil: "networkidle", timeout: 60000 });

// Walk the page so lazy images load and every scroll reveal fires.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6;
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 200));
  }
});
await page.waitForTimeout(600);

const result = await page.evaluate(() => ({
  title: document.title,
  fonts: document.fonts.status,
  hidden: [...document.querySelectorAll(".reveal,.wipe,.line-mask")].filter(
    (el) => !el.classList.contains("in")
  ).length,
  brokenImages: [...document.images]
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map((img) => img.currentSrc || img.src),
}));

await browser.close();

const problems = [];
if (response.status() !== 200) problems.push(`status ${response.status()}`);
if (foreign.size) problems.push(`third-party hosts: ${[...foreign].join(", ")}`);
if (failures.length) problems.push(`failed requests:\n    ${failures.join("\n    ")}`);
if (result.brokenImages.length) problems.push(`broken images: ${result.brokenImages.join(", ")}`);
if (result.fonts !== "loaded") problems.push(`fonts: ${result.fonts}`);
if (result.hidden) problems.push(`${result.hidden} elements never revealed`);

console.log(`${target}\n  status ${response.status()}  fonts ${result.fonts}  own-origin only: ${!foreign.size}`);
if (problems.length) {
  console.error("\nFAILED:\n  - " + problems.join("\n  - "));
  process.exit(1);
}
console.log("  all checks passed");
